# Project Structure Guide

## Directory Overview

```
KEMRI 001/
├── src/
│   ├── config/                 # Configuration & setup
│   │   ├── database.ts        # MySQL connection pool config
│   │   └── logger.ts          # Winston logger setup
│   │
│   ├── types/                  # TypeScript interfaces
│   │   └── respondent.ts      # IRespondent, IApiResponse types
│   │
│   ├── models/                 # Data access layer
│   │   └── RespondentModel.ts # Database operations (CRUD)
│   │
│   ├── services/               # Business logic layer
│   │   └── RespondentService.ts # Service methods & validations
│   │
│   ├── controllers/            # Request handling layer
│   │   └── RespondentController.ts # Route handlers
│   │
│   ├── routes/                 # API route definitions
│   │   └── respondents.ts     # Respondent endpoints
│   │
│   ├── middleware/             # Express middleware
│   │   ├── errorHandler.ts    # Global error handling
│   │   ├── validateRequest.ts # Request validation
│   │   └── validation.ts      # Joi schemas
│   │
│   ├── utils/                  # Utility functions
│   │   ├── constants.ts       # Enums & constants
│   │   ├── dateUtils.ts       # Date helpers
│   │   └── stringUtils.ts     # String helpers
│   │
│   └── index.ts               # Express app setup & server start
│
├── database/
│   └── schema.sql             # MySQL schema definition
│
├── logs/                       # Application logs
│   ├── error.log              # Error logs only
│   └── combined.log           # All logs
│
├── dist/                       # Compiled JavaScript (generated)
│
├── package.json               # Dependencies & scripts
├── tsconfig.json              # TypeScript config
├── .env                       # Environment variables (local)
├── .env.example               # Environment template
├── .gitignore                 # Git ignore rules
├── .eslintrc.json             # ESLint config
├── jest.config.js             # Jest testing config
├── docker-compose.yml         # Docker setup
├── Dockerfile                 # Container image definition
├── README.md                  # Setup & usage guide
├── API_DOCUMENTATION.md       # API endpoints reference
└── STRUCTURE.md               # This file
```

## File Descriptions

### Core Application Files

#### `src/index.ts`
- Express app initialization
- Middleware setup (CORS, helmet, JSON parser)
- Route registration
- Server startup on PORT

#### `src/config/database.ts`
- MySQL connection pool
- Reads DB credentials from environment
- Connection pooling (10 connections)
- Health checks enabled

#### `src/config/logger.ts`
- Winston logger setup
- File logging (error.log, combined.log)
- Console output in development
- Timestamp & formatted output

### Data Layer

#### `src/types/respondent.ts`
- `IRespondent` - Full respondent record
- `IRespondentCreateRequest` - Request payload for creation
- `IApiResponse<T>` - Generic API response wrapper

#### `src/models/RespondentModel.ts`
- Static methods for database operations
- `create()` - Insert new respondent
- `getById()` - Fetch single record
- `getAll()` - Fetch with pagination
- `update()` - Partial update
- `delete()` - Remove record
- `getBySchool()` - Filter by school
- `getByDateRange()` - Filter by date range
- `serialNumberExists()` - Check duplicate

### Business Logic Layer

#### `src/services/RespondentService.ts`
- Delegates to models for data access
- Business rule validation
- Error handling & logging
- Data transformation if needed
- Methods: create, read, update, delete, filter, statistics

### Request Handling Layer

#### `src/controllers/RespondentController.ts`
- Express route handlers
- HTTP status code management
- Request parameter validation (ID format, etc.)
- Response formatting
- Methods: POST, GET, PUT, DELETE

### Routing

#### `src/routes/respondents.ts`
- Defines all respondent endpoints
- Links controllers to HTTP methods
- Applies validation middleware
- Route order: specific routes first, then parameterized routes

### Middleware

#### `src/middleware/errorHandler.ts`
- Catches all errors (sync & async)
- Formats error responses
- Logs errors with stack traces
- Handles 404 routes
- Custom `ApiError` class for typed errors

#### `src/middleware/validateRequest.ts`
- Joi schema validation wrapper
- Extracts field-level error details
- Returns 400 with validation messages
- Strips unknown fields from request

#### `src/middleware/validation.ts`
- `respondentValidationSchema` - Full validation for creation
- `respondentUpdateSchema` - Partial validation for updates
- Field constraints (min/max, allowed values, types)
- Required vs optional fields

### Utilities

#### `src/utils/constants.ts`
- RESPONDENT_CONSTANTS - Field option values
- PAGINATION - Defaults for pagination
- Enums for guardian occupation, religion, etc.

#### `src/utils/dateUtils.ts`
- `formatDate()` - Convert to YYYY-MM-DD
- `isValidDate()` - Validate date string
- `addDays()` - Date arithmetic
- `getDateRange()` - Parse date range

#### `src/utils/stringUtils.ts`
- `sanitizeInput()` - Remove unsafe characters
- `generateSerialNumber()` - Create serial numbers
- `slugify()` - URL-safe strings
- `capitalizeFirst()` - String case operations
- `truncate()` - Limit string length

### Database

#### `database/schema.sql`
- `respondents` table definition
- 50+ columns with constraints
- Data validation at DB level
- `audit_logs` table (optional)
- Indexes on frequently queried fields

### Configuration Files

#### `package.json`
- Node.js version: 20+
- Dependencies & dev dependencies
- Scripts: dev, build, start, test, lint
- Project metadata

#### `tsconfig.json`
- Target: ES2020
- Module: commonjs
- Strict mode enabled
- Source maps for debugging
- Output directory: ./dist

#### `.env` / `.env.example`
- DB connection parameters
- Port & environment
- API prefix & logging level
- CORS origins

#### `.eslintrc.json`
- ESLint with TypeScript support
- Recommended rules
- Unused variable warnings

#### `jest.config.js`
- TypeScript support via ts-jest
- Test discovery patterns
- Coverage collection

#### `docker-compose.yml`
- MySQL service with init script
- App service with auto-rebuild
- Volume mounting for development
- Health checks

#### `Dockerfile`
- Alpine Linux (small image)
- Node 20
- Multi-stage build
- Logs directory creation

## Dataflow

1. **Request** → Express middleware (validation, CORS, helmet)
2. **Validation** → Joi schema checks in middleware
3. **Route** → Route handler matches path & method
4. **Controller** → HTTP handler extracts parameters
5. **Service** → Business logic & error handling
6. **Model** → Database query execution
7. **Response** → Formatted JSON with status code
8. **Error Handling** → Global error middleware

## Common Tasks

### Adding a New Field to Respondent

1. Update database schema in `database/schema.sql`
2. Add to `IRespondent` interface in `src/types/respondent.ts`
3. Add validation rule to schemas in `src/middleware/validation.ts`
4. Update model methods if needed in `src/models/RespondentModel.ts`
5. Add constant in `src/utils/constants.ts` if applicable

### Adding a New Endpoint

1. Create method in `RespondentController`
2. Define schema in `src/middleware/validation.ts` if needed
3. Add route in `src/routes/respondents.ts`
4. Add service method if needed in `src/services/RespondentService.ts`
5. Update API documentation

### Debugging

- Check logs in `logs/` directory
- Use `LOG_LEVEL=debug` in `.env`
- Run with `npm run dev` for hot reload
- Use `console.log()` for quick debugging (redirects to logger)

## API Response Format

```json
{
  "success": true,
  "data": { /* payload */ },
  "message": "Optional success message",
  "error": "Optional error message",
  "timestamp": "ISO-8601 timestamp"
}
```

## Error Response Format

```json
{
  "success": false,
  "error": "Error message",
  "timestamp": "ISO-8601 timestamp"
}
```

## Testing

Place test files in `src/__tests__/` with `.test.ts` extension:

```bash
npm test              # Run all tests
npm test -- --watch  # Watch mode
npm test -- --coverage # Coverage report
```

## Performance Considerations

- **Connection Pooling**: 10 MySQL connections for concurrent requests
- **Pagination**: Default limit 20, max 100 to prevent large fetches
- **Indexing**: Indexes on frequently queried fields (serial_no, school_name, dates)
- **Logging**: File-based logging doesn't block requests

## Security Notes

- **Input Validation**: Joi schemas validate all inputs
- **SQL Injection**: Parameterized queries prevent SQL injection
- **CORS**: Configured to allow specific origins
- **Helmet**: Security headers set automatically
- **Environment Variables**: Sensitive data not committed to git

## Deployment

### Docker Deployment

```bash
docker-compose up -d
```

### Manual Deployment

```bash
npm install
npm run build
npm start
```

### Environment Variables for Production

Update `.env` with:
- Actual database credentials
- `NODE_ENV=production`
- Appropriate `CORS_ORIGIN`
- `LOG_LEVEL=info`
