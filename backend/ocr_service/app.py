from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
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

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

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


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


@app.route("/ocr", methods=["POST"])
def ocr():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file part"}), 400
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400
        if not allowed_file(file.filename):
            return jsonify({"error": "Unsupported file type"}), 400

        if pytesseract is None or Image is None:
            return jsonify({"error": "OCR Python dependencies not installed on server"}), 500

        filename = secure_filename(file.filename)
        with tempfile.TemporaryDirectory() as tmpdir:
            path = os.path.join(tmpdir, filename)
            file.save(path)

            ext = filename.rsplit('.', 1)[1].lower()
            text_chunks = []

            if ext == 'pdf':
                if fitz is None:
                    return jsonify({"error": "PDF processing dependency missing (PyMuPDF)"}), 500
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
            return jsonify({"text": text})
    except Exception as e:
        # Provide a helpful message if Tesseract binary is missing
        message = str(e)
        if 'tesseract is not installed' in message.lower() or 'tesseractnotfound' in message.lower():
            message += " | Please install Tesseract OCR and ensure it's on PATH. Windows: https://github.com/UB-Mannheim/tesseract/wiki"
        return jsonify({"error": message}), 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", "5001"))
    app.run(host="0.0.0.0", port=port)


