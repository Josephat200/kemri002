# Quick Start Guide

## Prerequisites
- Node.js 20+ or Docker
- MySQL 8.0+
- npm or yarn
- Git (optional)

## Setup (Local Development)

### 1. Install Dependencies
```bash
npm install
```

### 2. Create Database
**Option A: Using MySQL directly**
```bash
mysql -u root -p < database/schema.sql
```

**Option B: Using Docker**
```bash
docker-compose up -d mysql
# Wait for MySQL to be ready (check with: docker-compose logs mysql)
docker exec kemri-mysql mysql -u root -pchemri_root_pass < database/schema.sql
```

### 3. Start Development Server
```bash
npm run dev
```

Server will start on `http://localhost:3000`

API base URL: `http://localhost:3000/api/v1`

## Quick Tests

### Check Server Health
```bash
curl http://localhost:3000/health
```

Response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 2.5
}
```

### Create a Respondent
```bash
curl -X POST http://localhost:3000/api/v1/respondents \
  -H "Content-Type: application/json" \
  -d '{
    "serial_no": "TEST001",
    "school_name": "Test School",
    "supervisor_name": "Jane Doe",
    "collection_date": "2024-01-15",
    "age": 17,
    "stay_with": 1,
    "guardian_occupation": 2,
    "guardian_education": 2,
    "religion": 1,
    "family_size": 4,
    "older_siblings": 0,
    "parents_give_pocket_money": 1,
    "financial_support_source": 1,
    "guardian_visits": 1,
    "has_rh_info": 1,
    "info_adequate": 1
  }'
```

### Get All Respondents
```bash
curl http://localhost:3000/api/v1/respondents
```

### Get Single Respondent
```bash
curl http://localhost:3000/api/v1/respondents/1
```

## Using Docker Compose

### Start Everything
```bash
docker-compose up
```

This starts:
- MySQL database on port 3306
- Express API on port 3000

### Access the API
Same as local: `http://localhost:3000/api/v1/...`

### Stop Services
```bash
docker-compose down
```

### View Logs
```bash
docker-compose logs -f app  # API logs
docker-compose logs -f mysql  # Database logs
```

## Useful Commands

### Build TypeScript
```bash
npm run build
# Output in ./dist directory
```

### Run Tests
```bash
npm test
```

### Lint Code
```bash
npm run lint
```

### View Application Logs
```bash
tail -f logs/combined.log     # All logs
tail -f logs/error.log        # Errors only
```

## Environment Variables

Edit `.env` file:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=password
DB_NAME=kemri_rh_survey
PORT=3000
NODE_ENV=development
LOG_LEVEL=debug
```

## Project Structure Quick Reference

```
src/
  ├── index.ts              ← Main app entry
  ├── config/               ← Database & logging setup
  ├── types/                ← TypeScript interfaces
  ├── models/               ← Database layer (CRUD)
  ├── services/             ← Business logic
  ├── controllers/          ← HTTP handlers
  ├── routes/               ← API endpoints
  ├── middleware/           ← Validation & errors
  └── utils/                ← Helpers & constants

database/
  └── schema.sql            ← Database schema
```

## Common Tasks

### Add New Respondent Field

1. Update `database/schema.sql`
2. Update `src/types/respondent.ts`
3. Update validation in `src/middleware/validation.ts`

### Create New API Endpoint

1. Add controller method in `src/controllers/`
2. Add route in `src/routes/respondents.ts`
3. Update `API_DOCUMENTATION.md`

### Debug Issue

1. Check `logs/error.log` for errors
2. Set `LOG_LEVEL=debug` in `.env`
3. Run with `npm run dev` for real-time output

## Troubleshooting

### Cannot connect to database
- Ensure MySQL is running
- Check credentials in `.env`
- Verify database `kemri_rh_survey` exists

### Port 3000 already in use
```bash
# Change PORT in .env
PORT=3001
```

### Package installation fails
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript errors
```bash
# Rebuild
npm run build
```

## Next Steps

1. **Read Documentation**
   - [README.md](README.md) - Full setup guide
   - [STRUCTURE.md](STRUCTURE.md) - Project architecture
   - [API_DOCUMENTATION.md](API_DOCUMENTATION.md) - API reference

2. **Add Features**
   - Authentication/authorization
   - Data export (CSV, PDF)
   - Advanced filtering
   - Analytics/reports

3. **Deploy**
   - Docker deployment
   - Cloud hosting (AWS, GCP, Azure)
   - CI/CD pipeline

## Getting Help

- Check logs: `logs/combined.log` or `logs/error.log`
- Review API docs: `API_DOCUMENTATION.md`
- Check project structure: `STRUCTURE.md`
- Review code examples in controllers

## API Examples

**All examples use `http://localhost:3000/api/v1` as base URL**

### List Respondents
```
GET /respondents?page=1&limit=20
```

### Create
```
POST /respondents
```

### Update
```
PUT /respondents/1
```

### Delete
```
DELETE /respondents/1
```

### Filter by School
```
GET /respondents/school/Kennedy%20High%20School
```

### Date Range
```
GET /respondents/stats/date-range?startDate=2024-01-01&endDate=2024-01-31
```

---

**Happy Coding! 🚀**
