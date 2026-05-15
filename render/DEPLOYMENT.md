# Deploying to Render

Steps to deploy this repository to Render:

1. Connect your GitHub/GitLab repo to Render.

2. Create two new services on Render:
   - Backend: choose "Web Service", environment `Docker`, and point the Dockerfile to `backend/Dockerfile`.
   - Frontend: choose "Web Service", environment `Docker`, and point the Dockerfile to `frontend/Dockerfile`.

Alternatively, you can deploy a single Docker-based service using the repository root `Dockerfile`.
The root `Dockerfile` builds both the backend and the frontend and places the frontend `dist` output in `/frontend`,
which the backend serves. To use this option, add the provided `render.yaml` and configure your Render service to use it.

3. Provision a MySQL database. Render does not provide a managed MySQL in all plans. Options:
   - Use an external managed MySQL (AWS RDS, DigitalOcean, ClearDB, PlanetScale) and copy its connection details.
   - If you must use Postgres on Render, you'll need to migrate the code from MySQL -> Postgres (not covered here).

4. In the Render dashboard, for the `kemri-backend` service, set the environment variables listed in `.env.example`.

5. Configure `VITE_API_BASE_URL` for the frontend service to point at the backend's public URL.

6. If your backend requires database migrations or seed scripts, run them as one-off jobs in Render or add startup scripts in the Dockerfile.

Notes and tips:
- Keep secrets in Render's environment variables (do not commit `.env`).
- If you want Render to build the frontend as a static site, consider switching to a `static` service and use the `dist` folder as the publish path after building inside the Dockerfile.
- Test the deployed services and ensure CORS and environment-specific configuration match production.
