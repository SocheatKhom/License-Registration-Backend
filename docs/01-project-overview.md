# Media Licensing Management System

## Purpose

The Media Licensing Management System is a backend system for managing media licensing applications, document submissions, application reviews, license issuance, and license verification.

The first development phase focuses only on:

* Backend API
* Database
* Authentication
* Authorization
* File upload
* Business logic
* Application workflow

Frontend development is out of scope for this phase.

## Technology Stack

### Backend

* Node.js
* Express.js
* JavaScript
* Sequelize ORM
* PostgreSQL
* Multer
* JWT
* bcrypt

### Development

* npm
* dotenv
* nodemon
* ESLint
* Prettier

## API Style

Use RESTful APIs with versioning.

```text
/api/v1
```

Example:

```http
GET    /api/v1/applications
GET    /api/v1/applications/:id
POST   /api/v1/applications
PATCH  /api/v1/applications/:id
```

## Main Modules

```text
Authentication
     │
     ├── User Management
     │
     ├── Application Management
     │
     ├── Document Management
     │
     ├── Review Management
     │
     ├── License Management
     │
     ├── Audit Logs
     │
     └── Notifications
```
