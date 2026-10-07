# API Specification

Base URL:

```text
/api/v1
```

## Authentication

```http
POST /auth/login
GET  /auth/me
POST /auth/logout
```

## Users

```http
POST  /users
GET   /users
GET   /users/:id
PATCH /users/:id
PATCH /users/:id/role
PATCH /users/:id/status
```

## Applications

```http
POST  /applications
GET   /applications
GET   /applications/:id
PATCH /applications/:id
POST  /applications/:id/submit
POST  /applications/:id/review
```

## Documents

```http
POST   /applications/:id/documents
GET    /applications/:id/documents
GET    /documents/:id
DELETE /documents/:id
```

## Licenses

```http
GET  /licenses
GET  /licenses/:id
POST /licenses/:id/revoke
```

## Public License Verification

```http
GET /public/licenses/verify/:token
```

## Standard Success Response

```json
{
  "success": true,
  "message": "Application retrieved successfully.",
  "data": {}
}
```

## Standard Error Response

```json
{
  "success": false,
  "message": "Application not found.",
  "error": {
    "code": "APPLICATION_NOT_FOUND"
  }
}
```

## Validation Error

```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email address."
    }
  ]
}
```

## Pagination

Example:

```http
GET /applications?page=1&limit=20
```

Response:

```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "totalItems": 100,
    "totalPages": 5
  }
}
```

Search, filtering, sorting, and pagination must be performed at the database level.
