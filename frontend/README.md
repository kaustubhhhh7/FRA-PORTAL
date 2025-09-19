FRA Frontend (React + Vite)

Getting Started

1) Install dependencies
   npm install

2) Configure env
   Create frontend/.env with any overrides. Example:
   VITE_OCR_API_URL=http://localhost:5001/ocr

3) Run dev server
   npm run dev

4) Build
   npm run build

Notes

- Netlify config lives in frontend/netlify.toml and functions in frontend/netlify.
- Public assets are under frontend/public.
- App entry is frontend/src/main.tsx; routing in frontend/src/App.tsx.
