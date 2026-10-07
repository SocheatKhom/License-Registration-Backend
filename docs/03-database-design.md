# Database Design

## Database

Use:

```text
PostgreSQL
```

Use:

```text
Sequelize ORM
```

Use UUIDs for internal primary keys.

Human-readable identifiers must be separate.

Example:

```text
id:
550e8400-e29b-41d4-a716-446655440000

application_number:
APP-2026-000001
```

## Main Tables

```text
users
media_outlets
applications
licensees
application_documents
licenses
reviews
application_status_histories
audit_logs
notifications
```

## Relationships

```text
users
  │
  ├──────< applications
  │
  ├──────< reviews
  │
  ├──────< audit_logs
  │
  └──────< notifications

media_outlets
  │
  └──────< applications

applications
  │
  ├────── licensee
  ├──────< application_documents
  ├──────< reviews
  ├──────< application_status_histories
  └────── license
```

## users

```text
id
name
email
password_hash
role
status
created_at
updated_at
deleted_at
```

Roles:

```text
SUPER_ADMIN
ADMIN
```

Status:

```text
ACTIVE
INACTIVE
```

Constraints:

```text
email UNIQUE
```

## media_outlets

```text
id
name
media_type
address
phone
email
created_at
updated_at
deleted_at
```

Media types:

```text
ONLINE
TELEVISION
RADIO
PRINT
```

## applications

```text
id
application_number
user_id
media_outlet_id
status
submitted_at
created_at
updated_at
deleted_at
```

Application number example:

```text
APP-2026-000001
```

Constraints:

```text
application_number UNIQUE
```

## licensees

```text
id
application_id
full_name
national_id
nationality
position
created_at
updated_at
```

Relationship:

```text
application
    │
    └── 1 licensee
```

## application_documents

```text
id
application_id
document_type
original_name
stored_name
file_path
mime_type
file_size
uploaded_at
created_at
updated_at
```

Document types:

```text
EDUCATION_CERTIFICATE
CRIMINAL_RECORD
BUSINESS_REGISTRATION
```

## licenses

```text
id
license_number
application_id
status
issued_at
expires_at
verification_token
created_at
updated_at
```

Constraints:

```text
license_number UNIQUE
application_id UNIQUE
verification_token UNIQUE
```

## reviews

```text
id
application_id
reviewer_id
action
notes
created_at
```

Actions:

```text
APPROVE
REJECT
REQUEST_INFORMATION
```

## application_status_histories

```text
id
application_id
from_status
to_status
changed_by
reason
created_at
```

Every status change must create a history record.

## audit_logs

```text
id
user_id
action
entity_type
entity_id
old_values
new_values
ip_address
user_agent
created_at
```

`old_values` and `new_values` should use PostgreSQL `JSONB`.

## notifications

```text
id
user_id
type
title
message
is_read
created_at
read_at
```

## Important Indexes

```text
users.email
users.role
users.status

applications.application_number
applications.status
applications.user_id
applications.media_outlet_id

licenses.license_number
licenses.application_id
licenses.verification_token

reviews.application_id
reviews.reviewer_id

audit_logs.user_id
audit_logs.entity_type
audit_logs.entity_id
```

## Migrations

Use Sequelize migrations.

Do not use:

```javascript
sequelize.sync({ alter: true })
```

as the production database migration strategy.

Use migrations for all schema changes.
