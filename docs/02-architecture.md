# Backend Architecture

## Architecture Style

Use a layered architecture.

```text
Request
   │
   ▼
Route
   │
   ▼
Middleware
   │
   ├── Authentication
   ├── Authorization
   ├── Validation
   └── File Upload
   │
   ▼
Controller
   │
   ▼
Service
   │
   ▼
Repository
   │
   ▼
Sequelize
   │
   ▼
PostgreSQL
```

## Layer Responsibilities

### Routes

Define API endpoints.

Routes should not contain business logic.

### Middleware

Handle:

* Authentication
* Authorization
* Validation
* File upload
* Error handling

### Controllers

Handle:

* HTTP request
* HTTP response
* Calling services

Controllers should remain thin.

### Services

Contain business logic.

Examples:

```text
Create User
Change User Role
Submit Application
Approve Application
Reject Application
Issue License
```

### Repositories

Handle database operations using Sequelize.

Examples:

```text
findUserById()
findApplicationById()
createApplication()
updateApplication()
createLicense()
```

### Models

Define Sequelize models and relationships.

### Database

PostgreSQL stores application data.

### File Storage

Multer handles incoming files.

The actual files should be stored outside PostgreSQL.

```text
Multer
   │
   ▼
File Storage

PostgreSQL
   │
   └── File metadata
```

## Project Structure

```text
src/
├── config/
├── constants/
├── controllers/
├── middlewares/
├── models/
├── repositories/
├── services/
├── routes/
├── validators/
├── utils/
├── migrations/
├── seeders/
└── app.js

server.js
.env
.env.example
package.json
```

## Constants

Do not hardcode system values.

```text
constants/
├── roles.js
├── application-status.js
├── media-types.js
├── document-types.js
├── license-status.js
└── review-actions.js
```

## Main Flow

```text
Route
  ↓
Middleware
  ↓
Controller
  ↓
Service
  ↓
Repository
  ↓
Sequelize
  ↓
PostgreSQL
```

Business logic must stay inside the service layer.

Database logic must stay inside repositories.
