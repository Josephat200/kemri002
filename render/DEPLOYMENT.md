# Deploying to Render

Use the repository root `Dockerfile` as a single production service. It builds the backend and frontend together, then serves the frontend and API from the same container.

## Render Setup

1. Connect this GitHub repo to Render.
2. Create a new Web Service from the repository root.
3. Use the root `Dockerfile`.
4. Set these environment variables:

```env
NODE_ENV=production
PORT=3000
API_PREFIX=/api/v1
SUPABASE_URL=https://qdbkdimgwfyemcgeqicr.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
CORS_ORIGIN=<your-render-service-url>
```

## Frontend API Base

The frontend is built for same-origin API access in production:

```env
VITE_API_URL=/api/v1
```

## Notes

- Keep `SUPABASE_SERVICE_ROLE_KEY` private and backend-only.
- Run the Supabase SQL setup before the first deploy.
- After the Render service is created, set `CORS_ORIGIN` to the deployed service URL if needed.
