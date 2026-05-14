# Frontend-Backend Integration Guide

## Overview

This guide explains how the frontend and backend are integrated and how to ensure they work together seamlessly.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    React Frontend                           │
│         (http://localhost:5173)                             │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Pages                Components              Hooks    │ │
│  │  - HomePage          - RespondentForm     - useQuery  │ │
│  │  - RespondentsList   - RespondentList     - useMutation│ │
│  │  - CreatePage        - AlertContainer                 │ │
│  │  - EditPage          - UI Components                  │ │
│  └────────────────────────────────────────────────────────┘ │
│                          │                                    │
│                          ▼                                    │
│                    API Client (Axios)                        │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                          │
                          │ HTTP Requests
                          ▼
┌─────────────────────────────────────────────────────────────┐
│              Express.js Backend                             │
│         (http://localhost:3000/api/v1)                      │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Routes         Controllers       Services     Models │ │
│  │  - respondents  - CRUD ops       - Validation  - DB  │ │
│  │                 - responses       - Business logic    │ │
│  └────────────────────────────────────────────────────────┘ │
│                          │                                    │
│                          ▼                                    │
│                    MySQL Database                            │
│                  (kemri_rh_survey)                           │
└─────────────────────────────────────────────────────────────┘
```

## API Communication Flow

### Create Respondent Flow

```
User submits form
       │
       ▼
Frontend validates with Zod schema
       │
       ▼ (if valid)
Axios POST /respondents/
       │
       ▼
Backend validates with Joi schema
       │
       ▼ (if valid)
RespondentController creates record
       │
       ▼
RespondentService processes data
       │
       ▼
RespondentModel inserts into database
       │
       ▼ (return success response)
Frontend updates React Query cache
       │
       ▼
User sees success alert
Redirects to respondents list
```

## API Endpoints Integration

### Frontend to Backend Mapping

#### Create Respondent
```typescript
// Frontend
POST http://localhost:3000/api/v1/respondents
Body: RespondentFormData

// Backend Handler
RespondentController.create()
→ RespondentService.createRespondent()
→ RespondentModel.create()
```

#### Get All Respondents
```typescript
// Frontend
GET http://localhost:3000/api/v1/respondents?page=1&limit=20

// Backend Handler
RespondentController.getAll()
→ RespondentService.getAllRespondents()
→ RespondentModel.getAll()
```

#### Update Respondent
```typescript
// Frontend
PUT http://localhost:3000/api/v1/respondents/:id
Body: Partial<RespondentFormData>

// Backend Handler
RespondentController.update()
→ RespondentService.updateRespondent()
→ RespondentModel.update()
```

#### Delete Respondent
```typescript
// Frontend
DELETE http://localhost:3000/api/v1/respondents/:id

// Backend Handler
RespondentController.delete()
→ RespondentService.deleteRespondent()
→ RespondentModel.delete()
```

## Validation Flow

### Frontend Validation
```typescript
// src/lib/validations.ts
respondentSchema = z.object({
  serial_no: z.string().min(1).max(20),
  age: z.number().int().min(15).max(19),
  ...
})

// Validation happens in RespondentForm
const { formState: { errors } } = useForm({
  resolver: zodResolver(respondentSchema)
})
```

### Backend Validation
```typescript
// src/middleware/validation.ts
respondentValidationSchema = Joi.object({
  serial_no: Joi.string().max(20).required(),
  age: Joi.number().integer().min(15).max(19).required(),
  ...
})

// Middleware validates before controller
app.post('/respondents', 
  validateRequest(respondentValidationSchema),
  RespondentController.create()
)
```

### Database Validation
```sql
-- database/schema.sql
CREATE TABLE respondents (
  age INT NOT NULL CHECK (age BETWEEN 15 AND 19),
  stay_with INT NOT NULL CHECK (stay_with BETWEEN 1 AND 4),
  ...
)
```

## Type Safety

### Shared Types

Types are defined consistently across frontend and backend:

**Frontend** (`frontend/src/types/respondent.ts`):
```typescript
export interface IRespondent {
  id: number;
  serial_no: string;
  age: number;
  ...
}
```

**Backend** (`src/types/respondent.ts`):
```typescript
export interface IRespondent {
  id?: number;
  serial_no: string;
  age: number;
  ...
}
```

Both share the same field definitions and constraints.

## Error Handling

### Frontend Error Handling
```typescript
try {
  await respondentAPI.create(data);
  addAlert('Success!', 'success');
} catch (error) {
  const message = error.response?.data?.error || 'Failed';
  addAlert(message, 'error');
}
```

### Backend Error Handling
```typescript
if (!respondent) {
  throw new ApiError(404, 'Respondent not found');
}

// Error middleware catches and responds
{
  success: false,
  error: 'Respondent not found',
  timestamp: '...'
}
```

## Setup Instructions

### Prerequisites
- Node.js 20+
- MySQL 8.0+
- npm/yarn

### 1. Start Backend

```bash
cd backend
npm install
npm run build
npm run dev
```

Backend runs on `http://localhost:3000`

### 2. Start Database

```bash
mysql -u root -p < database/schema.sql
```

Or use Docker:
```bash
docker-compose up mysql
```

### 3. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

### 4. Verify Integration

1. Open http://localhost:5173 in browser
2. Click "Add New Respondent"
3. Fill form and submit
4. Should see success alert
5. Check respondents list

## Proxy Configuration

The frontend has a Vite proxy configured:

```typescript
// vite.config.ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
    },
  },
}
```

This redirects API calls from frontend to backend during development.

## CORS Configuration

Backend allows requests from frontend:

```typescript
// src/index.ts
cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
})
```

Ensure frontend URL is in `CORS_ORIGIN` in `.env`:
```env
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
```

## Environment Variables

### Backend `.env`
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=password
DB_NAME=kemri_rh_survey
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
API_PREFIX=/api/v1
```

### Frontend `.env`
```env
VITE_API_URL=http://localhost:3000/api/v1
```

## API Response Format

All responses follow the same format:

### Success Response
```json
{
  "success": true,
  "data": {
    "id": 1,
    "serial_no": "RH001",
    ...
  },
  "message": "Respondent created successfully",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Validation error",
  "details": [
    {
      "field": "age",
      "message": "age must be between 15 and 19"
    }
  ],
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Debugging Integration Issues

### Issue: API Connection Error

**Symptoms**: Frontend can't reach backend

**Solution**:
1. Verify backend is running: `curl http://localhost:3000/health`
2. Check `VITE_API_URL` in `.env`
3. Check CORS settings in backend `.env`
4. Check browser console for errors

### Issue: Validation Errors

**Symptoms**: Form submits but gets validation error

**Solution**:
1. Compare frontend schema (`src/lib/validations.ts`) with backend schema (`src/middleware/validation.ts`)
2. Ensure field types match
3. Check constraints (min/max values)

### Issue: Database Errors

**Symptoms**: Backend responds with 500 error

**Solution**:
1. Verify database is running: `mysql -u root -p -e "USE kemri_rh_survey; SELECT COUNT(*) FROM respondents;"`
2. Check backend logs
3. Verify schema exists: `database/schema.sql`

### Issue: CORS Error

**Symptoms**: Browser shows CORS error in console

**Solution**:
1. Add frontend URL to `CORS_ORIGIN` in backend `.env`
2. Ensure `changeOrigin: true` in Vite proxy config
3. Restart backend after changing `.env`

## Testing Integration

### Manual Testing Checklist

- [ ] Create respondent with all fields
- [ ] Create respondent with minimal fields
- [ ] Try create with invalid data (should see validation error)
- [ ] View respondents list
- [ ] Edit respondent
- [ ] Delete respondent (confirm dialog)
- [ ] Pagination works
- [ ] Search/filter by school
- [ ] Search by date range
- [ ] Alerts appear/disappear correctly

### Using cURL to Test Backend

```bash
# Create respondent
curl -X POST http://localhost:3000/api/v1/respondents \
  -H "Content-Type: application/json" \
  -d '{"serial_no":"TEST","school_name":"School",...}'

# Get all
curl http://localhost:3000/api/v1/respondents

# Get by ID
curl http://localhost:3000/api/v1/respondents/1

# Update
curl -X PUT http://localhost:3000/api/v1/respondents/1 \
  -H "Content-Type: application/json" \
  -d '{"age":18}'

# Delete
curl -X DELETE http://localhost:3000/api/v1/respondents/1
```

## Performance Considerations

### Frontend
- React Query caches API responses (5 min stale time)
- Pagination defaults to 20 items per page
- Form validation runs on change with debounce

### Backend
- MySQL connection pooling (10 connections)
- Database indexes on frequently queried fields
- Parameterized queries prevent SQL injection

## Security Considerations

### Frontend
- Input validation before sending to API
- HTTPS enforced in production
- CORS limits cross-origin requests

### Backend
- SQL injection prevention with parameterized queries
- Helmet.js sets security headers
- Request validation with Joi
- Environment variables for sensitive data

## Deployment Integration

### Production Setup

```env
# Backend
DB_HOST=prod-db.example.com
CORS_ORIGIN=https://app.example.com
NODE_ENV=production

# Frontend
VITE_API_URL=https://api.example.com/api/v1
```

### Docker Compose (Full Stack)

```bash
docker-compose up
```

Both frontend and backend start together:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- MySQL: localhost:3306

## Troubleshooting Checklist

- [ ] Backend running? Check http://localhost:3000/health
- [ ] Database running? Check `mysql -u root -p`
- [ ] Frontend running? Check http://localhost:5173
- [ ] CORS configured? Check backend `.env`
- [ ] Env vars set? Check `.env` files
- [ ] Schemas match? Compare validation schemas
- [ ] Types aligned? Check `src/types/`
- [ ] API URL correct? Check frontend `.env`

## Next Steps

1. **Authentication**: Add login/logout
2. **Export**: Add CSV/PDF export functionality
3. **Reports**: Add analytics dashboard
4. **Caching**: Implement better caching strategy
5. **Testing**: Add unit and integration tests
6. **CI/CD**: Setup automated testing and deployment

---

For questions or issues, refer to:
- Backend README: `../README.md`
- Frontend README: `./README.md`
- API Documentation: `../API_DOCUMENTATION.md`
