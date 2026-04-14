# Claim Service

A NestJS backend service for managing claims built with TypeScript, using a layered architecture (Controller → Service → Repository), Prisma ORM with PostgreSQL, and Swagger for API documentation.

## Tech Stack
- NestJS
- TypeScript
- Node.js
- PostgreSQL
- Prisma ORM
- Swagger (OpenAPI)
- Jest (testing)
- class-validator + custom generic enum validator



## 🧠 Architecture
- Controllers: (http,grpc) -handle requests, validate input, call services
- Services: contain business logic and orchestration
- Repositories: interact with DB using Prisma
- Database: PostgreSQL managed via Prisma schema & migrations
- Validation: class-validator + reusable enum validator

Prerequisites
Node.js >= 18
npm or yarn
PostgreSQL or Docker

PostgreSQL Setup
Docker
docker run --name claims-postgres -e POSTGRES_USER=claims -e POSTGRES_PASSWORD=claims -e POSTGRES_DB=claims -p 5432:5432 -d postgres

Prisma Migrations
npx prisma generate
npx prisma migrate dev --name init

How  to start:
npm install
npm run start:dev
