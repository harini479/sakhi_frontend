# Sakhi by JanmaSethu — Standalone Frontend (Cloud Run Ready)

React + Vite + TypeScript frontend for **Sakhi** (`/sakhi` overview and `/sakhi/try` companion experience), containerized with multi-stage Node + Nginx for deployment to **Google Cloud Run** (`frontend-service`, region `asia-south1`).

## Architecture
- **Frontend**: Static SPA served by unprivileged Nginx on port `8080` with `try_files $uri $uri/ /index.html` fallback.
- **Backend Connectivity**: Direct HTTPS API calls to the separately deployed FastAPI backend (`VITE_API_BASE_URL`). No secrets or AI keys exist in the frontend bundle.

## Local Development
```bash
npm install
cp .env.example .env
# Set VITE_API_BASE_URL=http://localhost:8080 in .env (or leave empty to use Vite's dev proxy)
npm run dev
```

## Build & Type-Check
```bash
npm run lint
npm run build
```

## Container Build & Local Verification (Docker)
Because Vite bakes `VITE_*` variables into the static bundle at build time, pass `VITE_API_BASE_URL` as a Docker build argument. Changing the backend URL requires rebuilding the image.

```bash
docker build \
  --build-arg VITE_API_BASE_URL="https://<your-backend-service-url>" \
  -t sakhi-frontend:local .

docker run --rm -p 8080:8080 sakhi-frontend:local
```

Verify locally:
- `http://localhost:8080/healthz` → `200 ok`
- `http://localhost:8080/sakhi` → loads landing view
- `http://localhost:8080/sakhi/try` → direct load and browser refresh work without `404`

## Cloud Run Deployment Notes (Phase 2)
- Target service: `frontend-service` in `asia-south1`, container port `8080`.
- Ensure the backend service's `ALLOWED_ORIGINS` includes the deployed `frontend-service` HTTPS origin.
