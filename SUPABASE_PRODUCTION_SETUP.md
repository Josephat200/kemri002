# Supabase Production Setup (KEMRI RH Survey)

This project has been refactored to use Supabase as the only database backend.

## 0. Optional Supabase CLI setup

If you want the repository linked to your Supabase project from CLI:

```bash
supabase login
supabase init
supabase link --project-ref qdbkdimgwfyemcgeqicr
```

Notes:
- `supabase login` requires your personal access token from Supabase.
- `supabase init` has already been prepared in this repository (`supabase/config.toml`).
- The linked project ref for this repo is `qdbkdimgwfyemcgeqicr`.

## 1. Create the database objects in one paste

In Supabase:
1. Open your project.
2. Go to SQL Editor.
3. Paste and run the full script in `supabase/setup.sql`.

That script creates:
- `respondents` table
- `audit_logs` table
- indexes
- `updated_at` trigger
- RLS baseline for backend-only access

## 2. Configure backend environment variables

Set these on your production backend service:

- `SUPABASE_URL=https://<your-project-ref>.supabase.co`
- `SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>`
- `PORT=3000`
- `NODE_ENV=production`
- `API_PREFIX=/api/v1`
- `CORS_ORIGIN=<your-frontend-domain>`

Important:
- Use the service role key on the backend only.
- Never expose service role key in frontend code.

## 3. Frontend environment

Set:

- `VITE_API_URL=/api/v1`

Use same-origin routing in production when frontend and backend are served under one domain.

## 4. Runtime behavior now

Refactored backend now uses Supabase for:
- Create respondent
- Get respondent by ID
- Get paginated respondents
- Update respondent
- Delete respondent
- Filter by school
- Filter by date range
- Statistics summary
- Excel export

## 5. Health checks

- Liveness: `/health`
- Readiness: `/ready` (checks Supabase connection)

## 6. Recommended production checklist

1. Run `supabase/setup.sql` in SQL Editor.
2. Set all backend env vars above.
3. Redeploy backend.
4. Verify:
   - `GET /health` returns 200
   - `GET /ready` returns 200
   - `GET /api/v1/respondents?page=1&limit=20` returns success
5. Test create/update/delete from frontend.

## 7. Optional hardening

- Add database backups in Supabase project settings.
- Restrict CORS to exact frontend origins.
- Rotate service role key if shared accidentally.
