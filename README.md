# E-Government Citizen Services Portal

**A full-stack E-Government platform designed to digitize public services and simplify interactions between citizens and government departments.**

[![Node.js](https://img.shields.io/badge/Node.js-20%2B-green)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB)](https://react.dev/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**Live Application:** https://egov-portal-b151.vercel.app/

**Backend API:** https://egov-portal-backend.onrender.com/

**API Documentation:** https://egov-portal-backend.onrender.com/api/docs

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Application URLs](#application-urls)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Database Management](#database-management)
- [Production Deployment](#production-deployment)
- [Production Checklist](#production-checklist)
- [Screenshots](#screenshots)
- [Project Status](#project-status)
- [License](#license)
- [Acknowledgments](#acknowledgments)

---

## Overview

The E-Government Citizen Services Portal is a web-based platform that enables citizens to access government services online while allowing government employees to manage applications and departmental operations digitally.

The platform supports four main user roles:

- **Citizens:** Browse government services and submit applications online.
- **Officers:** Review and process citizen requests.
- **Department Heads:** Manage departmental operations and oversee requests.
- **Administrators:** Manage users, departments, services, and the overall platform.

The system aims to improve accessibility, transparency, and efficiency in public service delivery.

## Architecture

### Project Structure

```text
egov-portal/
│
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── src/
│   ├── scripts/
│   └── package.json
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── docker-compose.yml
└── README.md
```

### System Architecture

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite |
| Styling | Tailwind CSS |
| State Management | Zustand, TanStack Query |
| Backend | Node.js, Express, TypeScript |
| ORM | Prisma |
| Database | PostgreSQL |
| Caching | Redis |
| Real-time Communication | Socket.io |
| Authentication | JWT, Refresh Tokens, bcryptjs |
| File Storage | Cloudinary |
| API Documentation | Swagger |
| Containerization | Docker |
| Frontend Deployment | Vercel |
| Backend Deployment | Render |
| Database Hosting | Supabase |

## Features

### Authentication and Authorization

- User authentication and logout.
- JWT-based authentication.
- Refresh token management.
- Role-based access control.
- Protected routes and API endpoints.

### Citizen Services

- Browse available government services.
- Submit service applications.
- Upload supporting documents.
- Track submitted requests.
- View application statistics.
- Receive notifications.

### Department Management

- Manage government departments.
- Assign services to departments.
- Support departmental workflows.
- Manage officer and department-head roles.

### Administration

- Manage users and roles.
- Manage departments and services.
- Monitor system activity.
- Access administrative functionality.

### Additional Capabilities

- PostgreSQL database management through Prisma.
- Redis integration.
- Real-time communication with Socket.io.
- File uploads through Cloudinary.
- API documentation with Swagger.
- Input validation and error handling.
- Audit logging.

## Technology Stack

### Backend

- Node.js 20+
- TypeScript 5.6
- Express.js
- Prisma ORM
- PostgreSQL
- Redis
- Socket.io
- JWT
- bcryptjs
- Cloudinary
- Zod
- Swagger

### Frontend

- React 19
- TypeScript
- Vite
- Tailwind CSS
- TanStack Query
- Zustand

### DevOps and Deployment

- Docker
- GitHub Actions
- Render
- Vercel
- Supabase
- Cloudinary

## Getting Started

### Prerequisites

Make sure you have installed:

- Node.js 20 or later
- npm
- Docker Desktop
- PostgreSQL (if not using Docker)
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/Somaiyanoori/egov_portal.git

cd egov_portal
```

### 2. Start Infrastructure

If your Docker Compose configuration includes PostgreSQL, Redis, and Adminer, start the services:

```bash
docker-compose up -d
```

Verify that the containers are running:

```bash
docker ps
```

### 3. Configure Backend Environment

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file and configure the required environment variables:

```env
NODE_ENV=development
PORT=3012

DATABASE_URL=your_postgresql_connection_string
REDIS_URL=your_redis_connection_string

JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

CORS_ORIGIN=http://localhost:5173
FRONTEND_URL=http://localhost:5173
```

Use the exact variable names required by your backend configuration. Never commit real credentials or `.env` files to GitHub.

### 4. Generate Prisma Client

```bash
npm run prisma:generate
```

### 5. Apply Database Migrations

For local development:

```bash
npm run prisma:migrate
```

For an existing production database:

```bash
npm run prisma:migrate:deploy
```

### 6. Seed the Database

```bash
npm run prisma:seed
```

**Important:** The current `prisma/seed.ts` script deletes existing records from several tables before creating sample departments, services, and users.

Only run this script against a fresh development or test database. Do not run it against a production database containing real user data.

### 7. Start the Backend

```bash
npm run dev
```

Backend development server:

```text
http://localhost:3012
```

### 8. Start the Frontend

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Frontend development server:

```text
http://localhost:5173
```

## Application URLs

### Local Development

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:3012 |
| Swagger API Docs | http://localhost:3012/api/docs |
| Health Check | http://localhost:3012/api/v1/health |
| Adminer | http://localhost:8080 |

Adminer is available only if it is configured in Docker Compose.

### Production Deployment

| Service | Platform | URL |
|---|---|---|
| Frontend | Vercel | https://egov-portal-b151.vercel.app/ |
| Backend API | Render | https://egov-portal-backend.onrender.com/ |
| API Documentation | Render | https://egov-portal-backend.onrender.com/api/docs |
| Database | Supabase | PostgreSQL |
| File Storage | Cloudinary | Cloudinary Media Library |
| Redis | Upstash | Managed Redis |

## Environment Variables

The backend requires environment variables for database connectivity, authentication, caching, file storage, and application configuration.

| Variable | Description |
|---|---|
| `NODE_ENV` | Application environment |
| `PORT` | Backend server port |
| `DATABASE_URL` | PostgreSQL connection string |
| `REDIS_URL` | Redis connection URL |
| `JWT_SECRET` | Access token signing secret |
| `JWT_REFRESH_SECRET` | Refresh token signing secret |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `CORS_ORIGIN` | Allowed frontend origin |
| `FRONTEND_URL` | Frontend application URL |

Additional variables may be required depending on the backend configuration, including email and cookie settings.

**Security:** Keep all secrets in environment variables. Never expose database passwords, JWT secrets, or Cloudinary API secrets in frontend code or public repositories.

## API Documentation

The backend uses Swagger for API documentation.

**Local:**

http://localhost:3012/api/docs

**Production:**

https://egov-portal-backend.onrender.com/api/docs

The API is organized under:

```text
/api/v1
```

Main API modules include:

- Authentication
- Users
- Departments
- Services
- Requests
- Documents
- Notifications
- Payments

## Testing

The backend includes a testing setup using Vitest and Supertest.

Run the following commands from the backend directory.

### Check Environment

```bash
npm run check:env
```

### Type Check

```bash
npm run type-check
```

### Run Tests

```bash
npm test -- --run
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Generate Test Coverage

```bash
npm run test:coverage
```

### Build Backend

```bash
npm run build
```

### Build Docker Image

```bash
npm run docker:build
```

## Database Management

The project uses Prisma ORM with PostgreSQL.

Useful commands:

```bash
# Generate Prisma Client
npm run prisma:generate

# Create and apply a development migration
npm run prisma:migrate

# Apply existing migrations in production
npm run prisma:migrate:deploy

# Open Prisma Studio
npm run prisma:studio

# Seed development data
npm run prisma:seed
```

**Warning:** `prisma:reset` resets the database and can delete existing data. Use it only for development and testing.

## Production Deployment

### Backend Deployment

The backend is deployed on Render.

**Build Command:**

```bash
npm install --include=dev && npx prisma generate && npm run build
```

**Start Command:**

```bash
npx prisma migrate deploy && node dist/server.js
```

Configure the required environment variables in the Render dashboard.

### Frontend Deployment

The frontend is deployed on Vercel.

Configure the production API URL using the environment variable expected by the frontend configuration.

For example:

```env
VITE_API_URL=https://egov-portal-backend.onrender.com
```

Use the exact variable name referenced in the frontend source code.

### Database Deployment

The production database is hosted on Supabase.

The database schema is managed through Prisma migrations.

Before deploying schema changes:

1. Review the migration.
2. Test it against a development database.
3. Back up production data.
4. Apply migrations using `prisma migrate deploy`.

### File Storage

Cloudinary is used to store uploaded application documents.

The backend must use an API Key and API Secret with the required Upload API permissions.

Do not expose Cloudinary credentials in the frontend.

## Production Checklist

### Application Configuration

- [ ] Production environment variables configured.
- [ ] `NODE_ENV=production`.
- [ ] Strong JWT secrets configured.
- [ ] Production database connection verified.
- [ ] Redis connection verified.
- [ ] Cloudinary upload permissions verified.
- [ ] SMTP configuration verified if email is enabled.
- [ ] Production CORS origin configured.
- [ ] Frontend URL configured.

### Database

- [ ] Production migrations applied.
- [ ] Database backups scheduled.
- [ ] Database connection pooling configured.
- [ ] Database indexes reviewed.
- [ ] Seed scripts excluded from normal production deployment.

### Security

- [ ] Development credentials replaced.
- [ ] Secrets stored securely.
- [ ] `.env` files excluded from Git.
- [ ] HTTPS enabled.
- [ ] CORS configured correctly.
- [ ] Rate limiting enabled.
- [ ] Authentication and authorization tested.
- [ ] Dependencies audited.

### File Uploads

- [ ] Cloudinary credentials verified.
- [ ] Upload API permissions verified.
- [ ] Image uploads tested.
- [ ] PDF uploads tested.
- [ ] File size limits verified.
- [ ] Upload error handling tested.

### Monitoring and Reliability

- [ ] Health endpoint monitored.
- [ ] Backend logs reviewed.
- [ ] Error handling verified.
- [ ] Database backup restoration tested.
- [ ] Frontend and backend connectivity verified.

## Screenshots

Add application screenshots here to demonstrate the main user interfaces.

Suggested screenshots:

- Login page
- Citizen dashboard
- Available services
- Service application form
- Request tracking
- Officer dashboard
- Admin dashboard

## Project Status

The application has been deployed with the backend running on Render, the frontend on Vercel, and PostgreSQL hosted on Supabase.

Core infrastructure services have been connected and the database has been initialized.

Some production workflows, including Cloudinary document uploads, still require verification and testing.

## License

This project is licensed under the MIT License.

See the [LICENSE](LICENSE) file for details.

## Acknowledgments

Built using modern web technologies with the goal of making public services more accessible, organized, and efficient.

**Made for citizens, by developers who care.**
