# Security Requirements

## Authentication

* JWT authentication
* bcrypt password hashing
* Strong password requirements
* Inactive users cannot log in

## Authorization

Use role-based authorization.

```text
SUPER_ADMIN
ADMIN
```

## HTTP Security

Use:

* Helmet
* CORS
* Rate limiting
* Secure HTTP headers

## Validation

Validate every request on the backend.

Validate:

```text
Required fields
Email
Password
UUID
Enum values
Pagination
Sorting
Filtering
File uploads
```

## File Security

Validate:

```text
MIME type
Extension
File size
Filename
```

Do not allow uploaded files to execute.

## Sensitive Information

Never return:

```text
password_hash
JWT_SECRET
database password
internal filesystem paths
```

Do not expose sensitive personal information through public license verification.

## Environment Variables

Use:

```env
NODE_ENV=development

PORT=8000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=media_licensing
DB_USER=postgres
DB_PASSWORD=password

JWT_SECRET=change-me
JWT_EXPIRES_IN=1d

UPLOAD_DIR=uploads
MAX_FILE_SIZE=10485760
```

Create:

```text
.env.example
```

Never commit:

```text
.env
```

## Soft Delete

Use:

```text
deleted_at
```

for entities where historical records need to be preserved.

Do not physically delete users when doing so would break audit/history requirements.
