from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.requests import Request
from starlette.datastructures import UploadFile as StarletteUploadFile
from starlette.status import HTTP_400_BAD_REQUEST, HTTP_500_INTERNAL_SERVER_ERROR
from pathlib import Path
import tempfile
import os

try:
    import pytesseract
    from PIL import Image
    import fitz  # PyMuPDF
except Exception as e:
    pytesseract = None
    Image = None
    fitz = None

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "tif", "tiff", "bmp", "pdf"}

# On Windows, attempt to auto-configure Tesseract path if available
if pytesseract is not None:
    try:
        import platform
        import shutil
        if platform.system().lower().startswith('win'):
            # If tesseract not found on PATH, set common install path
            if shutil.which('tesseract') is None:
                possible_paths = [
                    r"C:\\Program Files\\Tesseract-OCR\\tesseract.exe",
                    r"C:\\Program Files (x86)\\Tesseract-OCR\\tesseract.exe"
                ]
                for p in possible_paths:
                    if os.path.exists(p):
                        pytesseract.pytesseract.tesseract_cmd = p  # type: ignore
                        break
    except Exception:
        pass


def allowed_file(filename: str) -> bool:
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@app.get("/health")
async def health() -> JSONResponse:
    return JSONResponse({"status": "ok"})


@app.post("/ocr")
async def ocr(file: UploadFile = File(...)) -> JSONResponse:
    try:
        filename = file.filename or ""
        if filename == "":
            raise HTTPException(status_code=HTTP_400_BAD_REQUEST, detail="No selected file")
        if not allowed_file(filename):
            raise HTTPException(status_code=HTTP_400_BAD_REQUEST, detail="Unsupported file type")

        if pytesseract is None or Image is None:
            raise HTTPException(status_code=HTTP_500_INTERNAL_SERVER_ERROR, detail="OCR Python dependencies not installed on server")

        safe_name = Path(filename).name
        with tempfile.TemporaryDirectory() as tmpdir:
            path = os.path.join(tmpdir, safe_name)
            # Save uploaded file to disk
            with open(path, "wb") as out:
                content = await file.read()
                out.write(content)

            ext = safe_name.rsplit('.', 1)[1].lower()
            text_chunks = []

            if ext == 'pdf':
                if fitz is None:
                    raise HTTPException(status_code=HTTP_500_INTERNAL_SERVER_ERROR, detail="PDF processing dependency missing (PyMuPDF)")
                doc = fitz.open(path)
                for page_index in range(len(doc)):
                    page = doc.load_page(page_index)
                    pix = page.get_pixmap(dpi=200)
                    img_bytes = pix.tobytes("png")
                    with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as imgtmp:
                        imgtmp.write(img_bytes)
                        imgtmp.flush()
                        try:
                            text_chunks.append(pytesseract.image_to_string(Image.open(imgtmp.name)))
                        finally:
                            os.unlink(imgtmp.name)
            else:
                text_chunks.append(pytesseract.image_to_string(Image.open(path)))

            text = "\n".join(chunk.strip() for chunk in text_chunks if chunk)
            return JSONResponse({"text": text})
    except HTTPException:
        raise
    except Exception as e:
        message = str(e)
        if 'tesseract is not installed' in message.lower() or 'tesseractnotfound' in message.lower():
            message += " | Please install Tesseract OCR and ensure it's on PATH. Windows: https://github.com/UB-Mannheim/tesseract/wiki"
        return JSONResponse({"error": message}, status_code=HTTP_500_INTERNAL_SERVER_ERROR)


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", "8000"))
    uvicorn.run("app:app", host="0.0.0.0", port=port, reload=True)


