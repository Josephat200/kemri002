# Railway Deployment

Use the repository root `Dockerfile` for Railway. It builds the backend and frontend together, then serves the built React app and API from the same container.

## Railway Service Settings

1. Create a new Railway service from this repository.
2. Select the root `Dockerfile` as the build path.
3. Expose port `3000`.

## Required Environment Variables

Set the backend Supabase values in Railway:

```env
SUPABASE_URL=https://qdbkdimgwfyemcgeqicr.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
NODE_ENV=production
PORT=3000
API_PREFIX=/api/v1
CORS_ORIGIN=<your-railway-service-url>
```

## API URL

The frontend is built with a same-origin API path:

```env
VITE_API_URL=/api/v1
```

That keeps browser requests working when the frontend and API are served from the same Railway domain.

## Health Checks

Railway can use:

- `/health` for liveness
- `/ready` for Supabase readiness
