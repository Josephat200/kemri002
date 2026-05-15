# Languages Used

This document summarizes the programming and markup languages used in this repository.

## Core Application Languages

- TypeScript
  - Backend API source code in `backend/src/`.
  - Frontend React/Vite source code in `frontend/src/`.

- JavaScript
  - Browser-side scripts for the static frontend flow (for example in `frontend/js/`).
  - Runtime ecosystem tooling via Node.js.

- HTML
  - Frontend page structure and templates in `frontend/index.html`.

- CSS
  - Frontend styling in `frontend/css/` and related build styling config.

- SQL
  - Database schema and table definitions in `database/schema.sql` and `backend/database/schema.sql`.

## Deployment and Infrastructure Languages

- Dockerfile syntax
  - Container build definitions in `Dockerfile`, `backend/Dockerfile`, and `frontend/Dockerfile`.

- YAML
  - Service orchestration and deployment definitions in `docker-compose.yml`, `render.yaml`, and `render/*.md` deployment references.

## Project and Build Metadata Formats

- JSON
  - Package and TypeScript configuration files such as `package.json`, `tsconfig.json`, and related tool configs.

- Markdown
  - Documentation files such as `README.md`, `API_DOCUMENTATION.md`, and deployment guides.

## Runtime Platforms

- Node.js
  - Executes backend services and frontend build pipeline.

- MySQL
  - Primary production relational database used by the backend.
