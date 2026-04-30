## Claim Service

A scalable and production-ready **NestJS backend service** for managing claims, built with **TypeScript** and a clean layered architecture.

This project demonstrates best practices in API design, authentication, validation, and database management using modern backend technologies.



##  Overview

The Claim Service provides a robust backend for:

* Managing claims lifecycle
* Handling authentication & authorization
* Enforcing strict validation and business rules
* Providing well-documented APIs via Swagger


## Tech Stack

| Layer      | Technology                              |
| ---------- | --------------------------------------- |
| Framework  | NestJS                                  |
| Language   | TypeScript                              |
| Runtime    | Node.js                                 |
| Database   | PostgreSQL                              |
| ORM        | Prisma                                  |
| API Docs   | Swagger (OpenAPI)                       |
| Testing    | Jest                                    |
| Validation | class-validator + custom enum validator |

---

##  Architecture

The project follows a **layered architecture** to ensure scalability and maintainability:

```
Controller → Service → Repository → Database
```

### Layers Explained

* **Controllers (HTTP / gRPC)**
  Handle incoming requests, validate inputs, and return responses.

* **Services**
  Contain core business logic and orchestrate application flow.

* **Repositories**
  Interact with the database using Prisma ORM.

* **Database**
  PostgreSQL managed via Prisma schema and migrations.

* **Validation Layer**
  Uses `class-validator` and reusable custom validators for consistency.

---

## Features

*  JWT-based authentication
*  Claims management with status transitions
*  Configurable claim settings
*  Swagger API documentation
*  Unit testing with Jest
*  Strong validation rules

---

##  API Modules

| Module         | Description            |
| -------------- | ---------------------- |
| Claims(task 1)   | Manage claim lifecycle |
| Authentication (task 2)| Register & login users |
| Claims Config  (task 3)| Manage claim rules     |

---

##  Prerequisites

Ensure you have the following installed:

* Node.js (>= 18)
* npm
* Docker (recommended) or PostgreSQL

---

## PostgreSQL Setup (Docker)

Run PostgreSQL locally using Docker:

```bash
docker run --name claims-postgres \
  -e POSTGRES_USER=claims \
  -e POSTGRES_PASSWORD=claims \
  -e POSTGRES_DB=claims \
  -p 5432:5432 \
  -d postgres
```

---

##  Prisma Setup

Initialize Prisma:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

---

##  Running the Application

### Option 1: Docker (Recommended)

```bash
docker compose up --build
```

### Option 2: Local Development

```bash
npm install
npm run start:dev
```

Server will start at:

```
http://localhost:3000
```

---

##  API Documentation

Access Swagger UI at:

```
http://localhost:3000/api
```

### How to Use

1. Register a user via `/auth/register`
2. Login via `/auth/login`
3. Copy the returned JWT token
4. Click **Authorize** in Swagger UI
5. Paste the token (**without "Bearer"**)
6. Access protected endpoints(task 2)

---

##  Authentication Flow

```
Register → Login → Receive JWT → Authorize → Access APIs
```

---

##  Validation Rules

### Claim Status Transitions

| From      | To        | Allowed |
| --------- | --------- | ------- |
| Open      | In_Review | yes      |
| In_Review | Closed    | yes       |
| Others    | Any       |  400   |

---

### General Rules

* Status must be one of the allowed enum values
* Invalid values return `400 Bad Request`
* Email must be valid format
* Password must be at least 6 characters
* JWT tokens expire and require re-authentication

---

##  Testing

Run tests with:

```bash
npm run test
```

---

##  Example API Requests

### Register

```http
POST /auth/register
```

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

---

### Login

```http
POST /auth/login
```

---

### Create Claim

```http
POST /claims
Authorization: <JWT_TOKEN>
```

```json
{
  "title": "Broken item",
  "description": "Item arrived damaged"
}
```

---

##  Project Structure

```
src/
├── auth/
├── claims/
├── config/
├── common/
├── prisma/
└── main.ts
```

---

##  Future Improvements
* add test containers for full e2e testing.
* Role-based access control (RBAC)
* Refresh tokens
* Rate limiting
* Logging & monitoring (e.g., Datadog, Prometheus)
* CI/CD pipeline integration








This project is designed with:

* Clean architecture principles
* Scalability in mind
* Developer-friendly tooling
* Strong validation and error handling

---
