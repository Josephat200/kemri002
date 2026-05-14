# Complete Setup Guide

Complete setup for KEMRI RH Survey System (Frontend + Backend).

## Prerequisites

- Node.js 20+
- MySQL 8.0+
- npm or yarn
- Git (optional)

## Quick Start (5 minutes)

### Terminal 1: Database Setup

```bash
# Create database and tables
mysql -u root -p < database/schema.sql
```

### Terminal 2: Start Backend

```bash
# Navigate to backend
cd .

# Install dependencies
npm install

# Start development server
npm run dev
```

**Expected output:**
```
Server running on port 3000
API available at http://localhost:3000/api/v1
```

### Terminal 3: Start Frontend

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

**Expected output:**
```
Local:   http://localhost:5173
```

### Open Application

Open your browser and go to: **http://localhost:5173**

## Full Setup Details

### Step 1: Database Setup

#### Option A: Direct MySQL

```bash
mysql -u root -p < database/schema.sql
```

Verify:
```bash
mysql -u root -p
> USE kemri_rh_survey;
> SELECT COUNT(*) FROM respondents;
```

#### Option B: Docker

```bash
docker run --name kemri-mysql \
  -e MYSQL_ROOT_PASSWORD=password \
  -e MYSQL_DATABASE=kemri_rh_survey \
  -p 3306:3306 \
  mysql:8.0

# In another terminal
mysql -h 127.0.0.1 -u root -ppassword < database/schema.sql
```

### Step 2: Backend Setup

```bash
# Install dependencies
npm install

# Create/update .env file
cp .env.example .env

# Edit .env with your database credentials
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=your_password

# Start development server
npm run dev
```

**Verify Backend**:
```bash
curl http://localhost:3000/health
# Response: {"status":"OK","timestamp":"...","uptime":...}
```

### Step 3: Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create/update .env file
cp .env.example .env

# Verify .env has correct API URL
# VITE_API_URL=http://localhost:3000/api/v1

# Start development server
npm run dev
```

**The app opens automatically at http://localhost:5173**

## Verification Steps

### 1. Backend Health Check

```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 2.5
}
```

### 2. Frontend Loads

Open http://localhost:5173 in browser

Expected: Home page with navigation and feature cards

### 3. Create Test Respondent

1. Click "Add New Respondent"
2. Fill form:
   - Serial No: TEST001
   - School Name: Test School
   - Supervisor: John Doe
   - Collection Date: Today
   - Age: 17
   - Stay With: 1
   - Guardian Occupation: 2
   - Guardian Education: 2
   - Religion: 1
   - Family Size: 4
   - Older Siblings: No
   - Parents Give Money: Yes
   - Financial Support: 1
   - Guardian Visits: Yes
   - Has RH Info: Yes
   - Info Adequate: Yes
3. Click "Create Respondent"
4. Should see success alert
5. Redirect to respondents list

### 4. Verify Data Saved

```bash
mysql -u root -p kemri_rh_survey
> SELECT COUNT(*) FROM respondents;
# Should show: 1

> SELECT serial_no, school_name FROM respondents;
# Should show: TEST001, Test School
```

## Useful Commands

### Backend Commands

```bash
# Development with auto-reload
npm run dev

# Build TypeScript
npm run build

# Run tests
npm test

# Lint code
npm run lint

# View logs
tail -f logs/combined.log
tail -f logs/error.log
```

### Frontend Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Lint code
npm run lint
```

### Database Commands

```bash
# Connect to MySQL
mysql -u root -p

# Use database
USE kemri_rh_survey;

# View all respondents
SELECT * FROM respondents;

# Count respondents
SELECT COUNT(*) FROM respondents;

# Drop database (WARNING: Deletes all data)
DROP DATABASE kemri_rh_survey;

# Backup database
mysqldump -u root -p kemri_rh_survey > backup.sql

# Restore from backup
mysql -u root -p kemri_rh_survey < backup.sql
```

## Troubleshooting

### Backend won't start

**Error: Port 3000 already in use**
```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>

# Or change PORT in .env
PORT=3001
```

**Error: Cannot connect to database**
- Check MySQL is running: `mysql -u root -p -e "SELECT 1"`
- Verify credentials in `.env`
- Ensure database created: `mysql -u root -p -e "SHOW DATABASES;"`

### Frontend won't start

**Error: Port 5173 already in use**
```bash
# Kill process
lsof -i :5173 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

### Cannot connect to API

**Error: Network Error at /respondents**
1. Check backend is running: `curl http://localhost:3000/health`
2. Check CORS in backend `.env`:
   ```env
   CORS_ORIGIN=http://localhost:5173
   ```
3. Restart backend after changing .env
4. Check browser console for errors

### Validation errors on form submit

1. Check both validation schemas match:
   - Backend: `src/middleware/validation.ts`
   - Frontend: `frontend/src/lib/validations.ts`
2. Ensure field types match (number vs string)
3. Check min/max values are correct

### Data not saving to database

1. Check MySQL is running
2. Verify database exists: `mysql -u root -p -e "USE kemri_rh_survey;"`
3. Check schema created: `mysql -u root -p kemri_rh_survey -e "SHOW TABLES;"`
4. Check backend logs: `tail -f logs/error.log`

## Environment Files

### Backend (.env)

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=password
DB_NAME=kemri_rh_survey

# Server
PORT=3000
NODE_ENV=development

# API
API_PREFIX=/api/v1

# CORS
CORS_ORIGIN=http://localhost:5173

# Logging
LOG_LEVEL=debug
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:3000/api/v1
```

## Project Structure

```
KEMRI 001/
├── backend/
│   ├── src/
│   ├── database/
│   ├── package.json
│   ├── .env
│   └── README.md
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── .env
│   └── README.md
│
├── database/
│   └── schema.sql
│
└── INTEGRATION_GUIDE.md
```

## API Testing

### Test Create Respondent

```bash
curl -X POST http://localhost:3000/api/v1/respondents \
  -H "Content-Type: application/json" \
  -d '{
    "serial_no": "CURL001",
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

### Test Get All

```bash
curl http://localhost:3000/api/v1/respondents?page=1&limit=10
```

## Development Workflow

1. **Start terminals** in this order:
   - Terminal 1: MySQL (if using Docker)
   - Terminal 2: Backend (`npm run dev`)
   - Terminal 3: Frontend (`npm run dev`)

2. **Edit code**: Changes hot-reload automatically

3. **Test**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000/api/v1

4. **Debug**:
   - Backend: Check `logs/combined.log`
   - Frontend: Check browser console (F12)

5. **Commit**: Once tested

## Next Steps

1. **Read Documentation**
   - Backend: `README.md`
   - Frontend: `frontend/README.md`
   - Integration: `INTEGRATION_GUIDE.md`

2. **Customize**
   - Add more fields to survey
   - Implement authentication
   - Add export functionality
   - Create reports/analytics

3. **Deploy**
   - Configure production `.env`
   - Build both projects
   - Deploy to cloud provider

## Support

### Getting Help

1. Check logs:
   ```bash
   # Backend
   tail -f logs/error.log
   
   # Frontend (browser console)
   F12 → Console tab
   ```

2. Test API directly:
   ```bash
   curl http://localhost:3000/api/v1/respondents
   ```

3. Check documentation:
   - Backend: `../README.md`
   - Frontend: `./README.md`
   - API Docs: `../API_DOCUMENTATION.md`

---

**You're ready to go! 🎉**

Open http://localhost:5173 and start using the KEMRI RH Survey System.
