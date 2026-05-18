# KEMRI Reproductive Health Survey Backend API

A Node.js + Express REST API backend for the KEMRI Reproductive Health Survey data collection system.

## Project Structure

```
backend/
├── src/
│   ├── config/              # Configuration files
│   │   ├── supabase.ts      # Supabase client
│   │   └── logger.ts        # Winston logger setup
│   ├── types/               # TypeScript interfaces
│   │   └── respondent.ts    # Respondent types and interfaces
│   ├── services/            # Business logic layer
│   │   └── RespondentService.ts # Service methods
│   ├── controllers/         # Route handlers
│   │   └── RespondentController.ts # HTTP request handlers
│   ├── routes/              # API routes
│   │   └── respondents.ts   # Respondent endpoints
│   ├── middleware/          # Express middleware
│   │   ├── errorHandler.ts  # Error handling
│   │   ├── validateRequest.ts # Request validation
│   │   └── validation.ts    # Joi validation schemas
│   └── index.ts             # Application entry point
├── ../supabase/
│   └── setup.sql            # One-shot Supabase SQL setup
├── logs/                    # Application logs
├── dist/                    # Compiled JavaScript
├── package.json
├── tsconfig.json
├── .env
├── .env.example
├── .eslintrc.json
├── jest.config.js
├── Dockerfile
└── README.md
```

## Installation

1. **Navigate to backend folder:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
cp .env.example .env
```

Edit `.env` with your Supabase credentials:
```env
SUPABASE_URL=https://qdbkdimgwfyemcgeqicr.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
PORT=3000
NODE_ENV=development
```

4. **Create database objects in Supabase:**
```bash
# Run supabase/setup.sql in Supabase SQL Editor
```

## Running the Application

### Development
```bash
npm run dev
```

The API will start on `http://localhost:3000`

### Production Build
```bash
npm run build
npm start
```

### Create Logs Directory
```bash
mkdir logs
```

## API Endpoints

### Base URL
```
http://localhost:3000/api/v1
```

### Respondents

#### Create Respondent
```
POST /respondents
Content-Type: application/json

{
  "serial_no": "RH001",
  "school_name": "Kennedy High School",
  "supervisor_name": "John Doe",
  "collection_date": "2024-01-15",
  "age": 17,
  "stay_with": 1,
  "guardian_occupation": 2,
  "guardian_education": 3,
  "religion": 2,
  "family_size": 5,
  "older_siblings": 1,
  "parents_give_pocket_money": 1,
  "financial_support_source": 1,
  "guardian_visits": 1,
  "has_rh_info": 1,
  "rh_teacher": 1,
  "rh_parents": 0,
  "topic_sexuality": 1,
  "info_adequate": 1
}
```

#### Get All Respondents
```
GET /respondents?page=1&limit=20
```

Response:
```json
{
  "success": true,
  "data": {
    "respondents": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "pages": 5
    }
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### Get Respondent by ID
```
GET /respondents/:id
```

#### Update Respondent
```
PUT /respondents/:id
Content-Type: application/json

{
  "age": 18,
  "info_adequate": 0
}
```

#### Delete Respondent
```
DELETE /respondents/:id
```

#### Get Respondents by School
```
GET /respondents/school/:schoolName
```

#### Get Respondents by Date Range
```
GET /respondents/stats/date-range?startDate=2024-01-01&endDate=2024-01-31
```

#### Get Statistics
```
GET /respondents/stats/summary
```

## Architecture

### Layers

1. **Controller Layer** (`RespondentController`)
   - Handles HTTP requests and responses
   - Parameter validation (ID format checks)
   - Delegates to services

2. **Service Layer** (`RespondentService`)
   - Business logic
   - Data validation
   - Error handling
   - Logging

3. **Supabase Data Layer**
  - Database operations (CRUD)
  - Query composition through the Supabase client
  - Data persistence and readiness checks

4. **Middleware**
   - Request validation with Joi
   - Error handling
   - CORS and security headers

## Validation

All request bodies are validated against Joi schemas:
- `respondentValidationSchema` - For POST requests (all fields required as per constraints)
- `respondentUpdateSchema` - For PUT requests (partial updates)

Validation errors return:
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

## Error Handling

All errors are caught and returned in standardized format:
```json
{
  "success": false,
  "error": "Error message",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

Common error codes:
- `400` - Bad Request (validation error)
- `404` - Not Found (respondent doesn't exist)
- `409` - Conflict (serial number already exists)
- `500` - Internal Server Error

## Logging

Logs are stored in the `logs/` directory:
- `error.log` - Errors only
- `combined.log` - All logs

In development, logs are also printed to console with colors.

## Security Features

- **Helmet.js** - Sets security HTTP headers
- **CORS** - Controls cross-origin requests
- **Input Validation** - Joi validation on all inputs
- **SQL Injection Prevention** - Parameterized queries
- **Environment Variables** - Sensitive data in .env

## Database Schema

### respondents table
- 50+ columns with constraints
- Auto-increment primary key
- Unique serial number
- Timestamp tracking (created_at, updated_at)
- Indexes on frequently queried fields

### audit_logs table (optional)
- Track changes to respondent records
- Audit trail for compliance

## Development Tips

### Adding New Endpoints

1. Create controller method in `RespondentController`
2. Define Joi schema in `validation.ts` if needed
3. Add route in `routes/respondents.ts`
4. Update service in `RespondentService` if needed

### Adding Database Fields

1. Update SQL schema in `database/schema.sql`
2. Update `IRespondent` interface in `types/respondent.ts`
3. Update validation schemas in `validation.ts`
4. Update model methods if needed

## Testing

```bash
npm test
```

## Contributing

Follow the established architecture and patterns for consistency.
