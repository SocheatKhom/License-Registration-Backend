# Audit Logs & Notifications

## Audit Logs

Table:

```text
audit_logs
```

Fields:

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

Use PostgreSQL `JSONB` for:

```text
old_values
new_values
```

## Important Audit Actions

```text
USER_CREATED
USER_UPDATED
USER_ROLE_CHANGED
USER_ACTIVATED
USER_DEACTIVATED

APPLICATION_CREATED
APPLICATION_SUBMITTED
APPLICATION_APPROVED
APPLICATION_REJECTED
APPLICATION_INFORMATION_REQUESTED

DOCUMENT_UPLOADED
DOCUMENT_DELETED

LICENSE_ISSUED
LICENSE_REVOKED
```

Audit logs should be append-only.

Normal users must not be able to modify audit logs.

## Notifications

Table:

```text
notifications
```

Fields:

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

Notification types:

```text
APPLICATION_SUBMITTED
APPLICATION_UNDER_REVIEW
APPLICATION_NEEDS_INFORMATION
APPLICATION_APPROVED
APPLICATION_REJECTED
LICENSE_ISSUED
```

Example:

```text
Application APP-2026-000001 has been approved.
Your license has been issued.
```

## Notification Flow

```text
Business Event
     ↓
Service
     ↓
Create Notification
     ↓
Store in PostgreSQL
```
