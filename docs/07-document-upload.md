# Document Upload

Use Multer for file uploads.

## Supported Files

```text
PDF
JPG
JPEG
PNG
```

Maximum:

```text
10 MB per file
```

## Document Types

```text
EDUCATION_CERTIFICATE
CRIMINAL_RECORD
BUSINESS_REGISTRATION
```

## Upload Flow

```text
multipart/form-data
        ↓
      Multer
        ↓
File validation
        ↓
Generate unique filename
        ↓
Store file
        ↓
Store metadata in PostgreSQL
```

## Database

PostgreSQL stores:

```text
original_name
stored_name
file_path
mime_type
file_size
document_type
application_id
```

The actual file should not be stored directly in PostgreSQL.

## File Name

Do not use the original filename as the stored filename.

Example:

```text
Original:
criminal-record.pdf

Stored:
550e8400-document.pdf
```

## Validation

Validate:

```text
Extension
MIME type
File size
Filename
```

Reject:

```text
.exe
.sh
.php
.js
```

Allow:

```text
.pdf
.jpg
.jpeg
.png
```

## APIs

```http
POST   /api/v1/applications/:id/documents
GET    /api/v1/applications/:id/documents
GET    /api/v1/documents/:id
DELETE /api/v1/documents/:id
```

## Security

Uploaded files must not be executable by the web server.

Do not expose the physical upload directory directly without proper access control.

Documents should be accessed through backend endpoints.

Every document upload/delete should create an audit log.
