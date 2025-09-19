FRA Backend

OCR Service (Python, Flask/Gunicorn)

Location: backend/ocr_service

Run locally

1) Python 3.11 recommended
2) cd backend/ocr_service
3) pip install -r requirements.txt
4) set PORT=5001 (Windows) or export PORT=5001 (Unix)
5) python app.py (or gunicorn app:app)

Docker

1) cd backend/ocr_service
2) docker build -t fra-ocr .
3) docker run -p 5001:8080 fra-ocr

Frontend integration

Set VITE_OCR_API_URL (default http://localhost:5001/ocr) in frontend/.env
