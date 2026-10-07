# Authentication & Authorization

## Authentication

Authentication is handled using JSON Web Tokens (JWT) and bcrypt password hashing.

### Login

```http
POST /api/v1/auth/login
```

Request:

```json
{
  "email": "admin@example.com",
  "password": "Password123!"
}
```

Response:

```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Super Administrator",
      "email": "admin@example.com",
      "role": "SUPER_ADMIN",
      "status": "ACTIVE"
    }
  }
}
```

### Current User Profile

```http
GET /api/v1/auth/me
```

Requires `Authorization: Bearer <token>`.

### Logout

```http
POST /api/v1/auth/logout
```

Requires `Authorization: Bearer <token>`.

## Inactive Accounts

Users with status `INACTIVE` cannot log in. Attempts will be rejected with `ACCOUNT_INACTIVE`.

## Authorization (RBAC)

The system enforces Role-Based Access Control using two system roles:

```text
SUPER_ADMIN
    │
    ├── Full access to User Management (/users)
    ├── Full access to Audit Logs (/audit-logs)
    ├── Review & approve/reject applications
    ├── View & revoke licenses
    └── Upload & manage documents

ADMIN
    │
    ├── Review & approve/reject applications
    ├── View & revoke licenses
    ├── View application documents
    └── Cannot manage users or audit logs
```

## Security Rules

1. Password hashes (`password_hash`) must never be exposed in API responses.
2. Tokens must be verified on every protected request.
3. Every protected request checks that the user still exists and remains `ACTIVE`.
4. Brute force attempts on `/auth/login` are restricted by dedicated rate limiting.
