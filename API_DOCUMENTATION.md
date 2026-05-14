# API Documentation

## Base URL
```
http://localhost:3000/api/v1
```

## Authentication
Currently, the API has no authentication. In production, implement:
- JWT tokens
- API keys
- OAuth2

## Response Format

All responses follow this format:

```json
{
  "success": true|false,
  "data": {...},
  "message": "Optional message",
  "error": "Optional error message",
  "timestamp": "ISO-8601 timestamp"
}
```

## Respondent Endpoints

### 1. Create Respondent
**POST** `/respondents`

Create a new respondent record.

**Request Body:**
```json
{
  "serial_no": "RH001",
  "school_name": "Kennedy High School",
  "supervisor_name": "John Doe",
  "collection_date": "2024-01-15",
  "age": 17,
  "stay_with": 1,
  "guardian_occupation": 2,
  "guardian_occupation_other": null,
  "guardian_education": 3,
  "religion": 2,
  "family_size": 5,
  "older_siblings": 1,
  "siblings_have_partners": 0,
  "parents_give_pocket_money": 1,
  "pocket_money_adequate": 1,
  "financial_support_source": 1,
  "guardian_visits": 1,
  "school_visitor": 3,
  "has_rh_info": 1,
  "rh_teacher": 1,
  "rh_parents": 0,
  "rh_health_worker": 1,
  "rh_friends": 0,
  "rh_media": 1,
  "topic_sexuality": 1,
  "topic_abstinence": 1,
  "topic_condoms": 1,
  "topic_sti_hiv": 1,
  "topic_relationships": 0,
  "info_adequate": 1
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "serial_no": "RH001",
    "school_name": "Kennedy High School",
    ...
    "created_at": "2024-01-15T10:30:00.000Z"
  },
  "message": "Respondent created successfully",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Error Response (409 Conflict - Serial number exists):**
```json
{
  "success": false,
  "error": "Serial number RH001 already exists",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

### 2. Get All Respondents
**GET** `/respondents?page=1&limit=20`

Retrieve all respondents with pagination.

**Query Parameters:**
- `page` (number, default: 1) - Page number
- `limit` (number, default: 20) - Items per page

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "respondents": [
      {
        "id": 1,
        "serial_no": "RH001",
        ...
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "pages": 8
    }
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

### 3. Get Respondent by ID
**GET** `/respondents/:id`

Retrieve a specific respondent by ID.

**URL Parameters:**
- `id` (number) - Respondent ID

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "serial_no": "RH001",
    ...
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "error": "Respondent with ID 999 not found",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

### 4. Update Respondent
**PUT** `/respondents/:id`

Update an existing respondent (partial update supported).

**URL Parameters:**
- `id` (number) - Respondent ID

**Request Body (all fields optional):**
```json
{
  "age": 18,
  "info_adequate": 0,
  "has_rh_info": 0
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "serial_no": "RH001",
    "age": 18,
    "info_adequate": 0,
    ...
    "updated_at": "2024-01-15T11:00:00.000Z"
  },
  "message": "Respondent updated successfully",
  "timestamp": "2024-01-15T11:00:00.000Z"
}
```

---

### 5. Delete Respondent
**DELETE** `/respondents/:id`

Delete a respondent record.

**URL Parameters:**
- `id` (number) - Respondent ID

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Respondent deleted successfully",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

### 6. Get Respondents by School
**GET** `/respondents/school/:schoolName`

Retrieve all respondents from a specific school.

**URL Parameters:**
- `schoolName` (string) - School name (URL encoded)

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "serial_no": "RH001",
      "school_name": "Kennedy High School",
      ...
    },
    {
      "id": 2,
      "serial_no": "RH002",
      "school_name": "Kennedy High School",
      ...
    }
  ],
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

### 7. Get Respondents by Date Range
**GET** `/respondents/stats/date-range?startDate=2024-01-01&endDate=2024-01-31`

Retrieve respondents collected within a date range.

**Query Parameters:**
- `startDate` (string, required) - Start date in YYYY-MM-DD format
- `endDate` (string, required) - End date in YYYY-MM-DD format

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "serial_no": "RH001",
      "collection_date": "2024-01-15",
      ...
    }
  ],
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

### 8. Get Statistics Summary
**GET** `/respondents/stats/summary`

Retrieve summary statistics.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "totalRespondents": 150,
    "bySchool": {
      "Kennedy High School": 45,
      "St. Mary's School": 38,
      "Valley High": 67
    },
    "byAge": {
      "15": 20,
      "16": 35,
      "17": 50,
      "18": 30,
      "19": 15
    },
    "rhInfoAdequacy": {
      "adequate": 95,
      "inadequate": 55
    }
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## Error Codes

| Code | Message | Description |
|------|---------|-------------|
| 200 | OK | Successful request |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Validation error or invalid parameters |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource already exists (e.g., duplicate serial number) |
| 500 | Internal Server Error | Server error |

---

## Field Constraints

### Age
- Range: 15-19 years
- Type: Integer
- Required: Yes

### Stay With
- Range: 1-4
- Type: Integer
- Required: Yes
- Values: 1=Both parents, 2=Mother only, 3=Father only, 4=Others

### Guardian Occupation
- Range: 1-5
- Type: Integer
- Required: Yes

### Guardian Education
- Range: 1-4
- Type: Integer
- Required: Yes

### Religion
- Range: 1-5
- Type: Integer
- Required: Yes

### Family Size
- Minimum: 1
- Type: Integer
- Required: Yes

### Boolean Fields (0 or 1)
- older_siblings
- siblings_have_partners
- parents_give_pocket_money
- pocket_money_adequate
- guardian_visits
- has_rh_info
- rh_teacher, rh_parents, rh_health_worker, rh_friends, rh_media
- topic_sexuality, topic_abstinence, topic_condoms, topic_sti_hiv, topic_relationships
- info_adequate

---

## Examples using cURL

### Create Respondent
```bash
curl -X POST http://localhost:3000/api/v1/respondents \
  -H "Content-Type: application/json" \
  -d '{
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
    "info_adequate": 1
  }'
```

### Get All Respondents
```bash
curl http://localhost:3000/api/v1/respondents?page=1&limit=10
```

### Get Respondent by ID
```bash
curl http://localhost:3000/api/v1/respondents/1
```

### Update Respondent
```bash
curl -X PUT http://localhost:3000/api/v1/respondents/1 \
  -H "Content-Type: application/json" \
  -d '{
    "age": 18,
    "info_adequate": 0
  }'
```

### Delete Respondent
```bash
curl -X DELETE http://localhost:3000/api/v1/respondents/1
```

---

## Future Enhancements

- [ ] Authentication & Authorization (JWT/OAuth)
- [ ] Data export (CSV, Excel, PDF)
- [ ] Advanced filtering and search
- [ ] Batch operations
- [ ] Audit logging
- [ ] Rate limiting
- [ ] API versioning strategy
- [ ] GraphQL endpoint
