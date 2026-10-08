# Development Phases

This document outlines the systematic implementation phases of the Media Licensing Management System backend.

```text
Phase 1: Architecture & Authentication
   │
   ▼
Phase 2: User Management & Audit Foundation
   │
   ▼
Phase 3: Application Management & Workflow
   │
   ▼
Phase 4: Document Management & File Storage
   │
   ▼
Phase 5: Review, Approval & License Lifecycle
   │
   ▼
Phase 6: Audit Logs & Notifications Query APIs
   │
   ▼
Phase 7: Security Hardening & Rate Limiting
```

---

## Phase 1: Architecture & Authentication

* Layered architecture: Routes $\to$ Middlewares $\to$ Controllers $\to$ Services $\to$ Repositories $\to$ Models
* PostgreSQL configuration with Sequelize ORM
* Global error handling and standard JSON response envelopes
* User model with UUID primary keys and soft delete (`deleted_at`)
* JWT authentication (`POST /auth/login`, `GET /auth/me`, `POST /auth/logout`)
* Baseline Super Admin seeder (`admin@example.com` / `Password123!`)

---

## Phase 2: User Management & Audit Logging

* `audit_logs` table with JSONB `old_values` / `new_values`
* Audit logging service tracking user lifecycle events
* Super Admin restricted user management (`/api/v1/users`)
* Database-level search, pagination, and sorting
* Safeguards against self-deactivation and demotion of the last Super Admin

---

## Phase 3: Application Management

* `media_outlets`, `applications`, `licensees`, and `application_status_histories` models
* Unique application number generator (`APP-YYYY-XXXXXX`)
* Application draft creation and multi-entity relational transactions
* Multi-criteria listing (status, mediaType, date ranges, search)
* Status transitions (`DRAFT` $\to$ `SUBMITTED`) and immutability guards

---

## Phase 4: Document Upload & Storage

* Secure Multer disk storage in `uploads/documents/`
* Unique UUID-based stored filenames
* Allowed file types: PDF, JPG, JPEG, PNG ($\le$ 10MB)
* Endpoints: `POST & GET /applications/:id/documents`, `GET & DELETE /documents/:id`
* Inline viewing (`?view=true`), attachment download (`?download=true`), and disk cleanup

---

## Phase 5: Review, Approval & License Lifecycle

* Row-level locking on application review decisions
* Review actions: `APPROVE`, `REJECT`, `REQUEST_INFORMATION`
* License generator (`MIC-YYYY-MEDIATYPE-XXXXXX`)
* Atomic license issuance upon approval (+1 year validity, unique verification token)
* Internal license management (`/api/v1/licenses`) and revocation (`POST /licenses/:id/revoke`)
* Safe public verification endpoint (`GET /api/v1/public/licenses/verify/:token`)

---

## Phase 6: Audit Logs & Notifications

* Super Admin audit query APIs (`GET /api/v1/audit-logs`, `GET /api/v1/audit-logs/:id`)
* User notification endpoints (`GET /api/v1/notifications`, `PATCH /notifications/:id/read`, `PATCH /notifications/read-all`)
* Real-time unread counts and read timestamps

---

## Phase 7: Security Hardening & Operational Readiness

* Helmet security headers and CORS protection
* API rate limiting on `/api/v1` routes
* Dedicated brute force rate limiting on `/api/v1/auth/login`
* `.gitignore` safeguards against leaking uploaded media files
