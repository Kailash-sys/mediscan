# MediScan AI — Frontend

A professional React frontend for the Medical Interaction FastAPI backend at the repository root.
Users photograph medicine packaging; the backend performs OCR, medicine extraction, and
FDA-label-grounded interaction analysis; this frontend presents the results.

## Tech Stack

- **React 19** + **TypeScript** + **Vite 7**
- **Tailwind CSS 4** (design tokens in `src/index.css`)
- **React Router 7** — SPA navigation
- **Axios** — API layer with normalized error handling
- **lucide-react** — icons

## Quick Start

### 1. Start the backend (repository root)

```bash
# from the repository root
pip install -r requirements.txt   # if not already installed
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
# (the API is also importable via `from app.main import app`)
# NOTE: the first startup loads the OCR model and may take ~1 minute;
```

> If you start uvicorn yourself with a different port/host, update `VITE_API_BASE_URL`
> accordingly. The frontend also expects the backend's CORS list to include
> `http://localhost:5173` (already configured in `app/main.py`).

### 2. Configure and run the frontend

```bash
cd frontend
cp .env.example .env    # then edit .env if your backend runs elsewhere
npm install
npm run dev             # http://localhost:5173
```

`.env`:

```env
VITE_API_BASE_URL=http://localhost:8000
```

### 3. Other scripts

```bash
npm run typecheck   # strict TypeScript check
npm run build       # typecheck + production build to dist/
npm run preview     # serve the production build locally
```

## Backend Integration

The API layer lives in `src/api/` and targets the real FastAPI routes:

| Frontend call                          | Backend endpoint                 | Notes |
| -------------------------------------- | -------------------------------- | ----- |
| `analyzeImages(files)`                 | `POST /analysis/analyze-images`  | multipart/form-data, repeated `files` parts; jpeg/png/jpg; client validates type/size before upload |
| `checkBackendHealth()`                 | `GET /health/`                   | used for connectivity status |
| `getAllPosts()` / `getPostBySlug()`... | —                                | blog content is mock data in `src/data/posts.ts` (no blog API exists yet; swap `src/api/blogApi.ts` when one is added) |

Analysis **history** is stored in the browser's `localStorage` (`mediscan_history_v1`) because the
backend has no history API — nothing was invented on the backend side. There is also no
authentication in the backend, so no login/profile UI exists.

Response types in `src/types/analysis.ts` mirror the backend's response dict exactly, including
severity labels `Major / Moderate / Minor / None / Unknown`.

## Project Structure

```text
frontend/src/
├── api/            # client.ts (axios + error normalization), medicineApi.ts, blogApi.ts
├── components/
│   ├── layout/     # Navbar, Footer
│   ├── medicine/   # ImageUploader, CameraScanner, AnalysisProgress, MedicineCard, InteractionCard
│   ├── blog/       # BlogCard
│   ├── history/    # HistoryDetailModal
│   └── ui/         # Button, Card, Badge, Spinner, Skeleton, EmptyState, ErrorMessage, SectionHeading
├── context/        # ToastContext, AnalysisContext
├── data/           # posts.ts (mock blog content)
├── hooks/          # useDocumentTitle
├── pages/          # Home, Analyze, Results, History, Blogs, BlogDetails, About
├── types/          # analysis.ts
└── utils/          # client-side history, severity mapping, formatting
```

## Key Flows

1. **Upload flow** — Home → Analyze → drag & drop / browse multiple images → previews with remove
   buttons → Analyze → staged progress → Results (interactions, medicines, extracted text) →
   saved to on-device history.
2. **Camera flow** — Analyze → "Scan Medicine" → rear-camera capture → review / retake → photo
   joins the same queue → analyze as above.
3. **History flow** — History page lists past analyses (severity badge, thumbnails) → View opens a
   full detail modal with the complete backend response, including raw OCR text.

## Notes

- The only backend change was adding standard `CORSMiddleware` in `app/main.py` so the browser can
  call the API from `http://localhost:5173` — routes and business logic are untouched.
- Client-side file validation mirrors the backend's rules (JPG/PNG, ≤10 MB) for instant feedback;
  the backend remains the source of truth.
- The staged progress display is paced by the frontend for reassurance; the backend does not expose
  progress, and the UI does not claim otherwise.
