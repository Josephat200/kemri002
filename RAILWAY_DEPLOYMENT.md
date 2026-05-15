# Railway Deployment

Use the repository root `Dockerfile` for Railway. It builds the backend and frontend together, then serves the built React app and API from the same container.

## Railway Service Settings

1. Create a new Railway service from this repository.
2. Select the root `Dockerfile` as the build path.
3. Expose port `3000`.

## Required Environment Variables

Set the backend database values in Railway:

```env
DB_HOST=...
DB_PORT=3306
DB_USER=...
DB_PASSWORD=...
DB_NAME=kemri_rh_survey
NODE_ENV=production
PORT=3000
API_PREFIX=/api/v1
CORS_ORIGIN=
```

If your Railway MySQL service provides a `DATABASE_URL`, the backend will use it automatically.

## API URL

The frontend is built with a same-origin API path:

```env
VITE_API_URL=/api/v1
```

That keeps browser requests working when the frontend and API are served from the same Railway domain.

## Health Checks

Railway can use:

- `/health` for liveness
- `/ready` for database readiness
