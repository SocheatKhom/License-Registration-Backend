# User Management

User management is available only to `SUPER_ADMIN`.

## Create User

```http
POST /api/v1/users
```

Request:

```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "Password123!",
  "role": "ADMIN"
}
```

Allowed roles:

```text
ADMIN
SUPER_ADMIN
```

## List Users

```http
GET /api/v1/users
```

Query parameters:

```text
?page=1
&limit=20
&search=admin
&role=ADMIN
&status=ACTIVE
&sortBy=createdAt
&sortOrder=DESC
```

## Get User

```http
GET /api/v1/users/:id
```

## Update User

```http
PATCH /api/v1/users/:id
```

Example:

```json
{
  "name": "Updated Admin"
}
```

## Change Role

```http
PATCH /api/v1/users/:id/role
```

Request:

```json
{
  "role": "SUPER_ADMIN"
}
```

Only Super Admin can perform this action.

## Change Status

```http
PATCH /api/v1/users/:id/status
```

Request:

```json
{
  "status": "INACTIVE"
}
```

## User Management Rules

```text
SUPER_ADMIN
     │
     ├── Create ADMIN
     ├── Create SUPER_ADMIN
     ├── Change ADMIN → SUPER_ADMIN
     ├── Change SUPER_ADMIN → ADMIN
     ├── Activate user
     └── Deactivate user
```

Admin:

```text
ADMIN
     │
     └── Cannot manage users
```

All important user-management actions must create an audit log.
