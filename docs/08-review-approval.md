# Review & Approval

## Review Roles

The following roles can review applications:

```text
ADMIN
SUPER_ADMIN
```

## Review Actions

```text
APPROVE
REJECT
REQUEST_INFORMATION
```

## Review API

```http
POST /api/v1/applications/:id/review
```

Request:

```json
{
  "action": "APPROVE",
  "notes": "All required documents are valid."
}
```

## Reject

```json
{
  "action": "REJECT",
  "notes": "Business registration document is invalid."
}
```

## Request Information

```json
{
  "action": "REQUEST_INFORMATION",
  "notes": "Please upload an updated criminal record clearance."
}
```

## Approval Transaction

Approval must use a Sequelize database transaction.

```text
BEGIN
  ↓
Lock application
  ↓
Check status
  ↓
Update application
  ↓
Create review
  ↓
Create status history
  ↓
Create license
  ↓
Create audit log
  ↓
Create notification
  ↓
COMMIT
```

If any operation fails:

```text
ROLLBACK
```

## Duplicate Approval

The backend must prevent multiple administrators from approving the same application simultaneously.

The service must verify the current application status.

The database must also enforce:

```text
licenses.application_id UNIQUE
```

## Review History

Never overwrite previous reviews.

Example:

```text
Review 1
REQUEST_INFORMATION

Review 2
UNDER_REVIEW

Review 3
APPROVE
```

All records must remain available.
