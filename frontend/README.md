# E-Government Citizen Services Portal

<div align="center">

A production-ready, full-stack E-Government portal for digitizing citizen services.

![Node](https://img.shields.io/badge/Node-20%2B-339933?logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-7-DC382D?logo=redis&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow)

[Backend Documentation](./backend/README.md) • [Frontend Documentation](./frontend/README.md)

</div>

---

## Overview

The **E-Government Citizen Services Portal** is a modern full-stack platform designed to digitize government services and make them easier for citizens to access and manage online.

The platform supports multiple user roles:

- **Citizens** — Submit and track service requests online
- **Officers** — Process requests within their departments
- **Department Heads** — Oversee operations and view reports
- **Administrators** — Manage the entire system

---

## Highlights

- Multi-role authentication with JWT and refresh token rotation
- Real-time notifications with Socket.io
- File uploads via Cloudinary
- English and Farsi language support with RTL layout
- Dark and light themes
- Full audit logging
- Advanced reports with charts
- CSV data export
- Docker and CI/CD ready
- Comprehensive test suite

---

## Architecture

```text
egov-portal/
├── backend/              # Node.js + TypeScript + Prisma + PostgreSQL + Redis
├── frontend/             # React 19 + TypeScript + Vite + Tailwind CSS
├── docker-compose.yml
└── README.md
```

---

# Quick Start

## Prerequisites

Make sure you have the following installed:

- Node.js 20+
- Docker
- Docker Compose
- npm
- Git

Optional:

- Cloudinary account for file uploads

---

## 1. Start Infrastructure

From the project root:

```bash
docker-compose up -d
```

This starts:

- PostgreSQL
- Redis
- Adminer

---

## 2. Backend Setup

Open a terminal and run:

```bash
cd backend
cp .env.example .env
npm install
```

Configure your `.env` file with the required environment variables, including:

- `DATABASE_URL`
- JWT secrets
- Redis configuration
- Cloudinary credentials
- Other required application secrets

Run Prisma migrations:

```bash
npm run prisma:migrate
```

Seed the database:

```bash
npm run prisma:seed
```

Start the backend:

```bash
npm run dev
```

Backend runs at:

**http://localhost:3012**

---

## 3. Frontend Setup

Open another terminal:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Frontend runs at:

**http://localhost:5173**

---

# Local URLs

| Service           | URL                            |
| ----------------- | ------------------------------ |
| Frontend          | http://localhost:5173          |
| Backend API       | http://localhost:3012          |
| API Documentation | http://localhost:3012/api/docs |
| Adminer           | http://localhost:8080          |

---

# Sample Credentials

| Role            | Email              | Password       |
| --------------- | ------------------ | -------------- |
| Admin           | `admin@egov.com`   | `Password123!` |
| Officer         | `officer@egov.com` | `Password123!` |
| Department Head | `head@egov.com`    | `Password123!` |
| Citizen         | `citizen@egov.com` | `Password123!` |

> These credentials are intended for local development and testing only.

---

# Frontend

The frontend is a modern React + TypeScript application built with Vite and Tailwind CSS.

## Frontend Features

- Modern glassmorphism UI
- Tailwind CSS v4
- Dark / Light theme
- English + Farsi internationalization
- RTL support
- Real-time notifications via Socket.io
- Charts with Recharts
- Full CRUD interfaces
- Role-based dashboards
- Command palette (`Cmd/Ctrl + K`)
- Drag-and-drop file uploads
- React Hook Form + Zod validation
- TanStack Query for server state
- Zustand for client state
- Radix UI accessible components
- Framer Motion animations
- Fully responsive mobile-first design

---

## Frontend Tech Stack

| Category              | Technology                  |
| --------------------- | --------------------------- |
| Framework             | React 19 + TypeScript       |
| Build Tool            | Vite                        |
| Styling               | Tailwind CSS v4 + shadcn/ui |
| Server State          | TanStack Query              |
| Client State          | Zustand                     |
| Forms                 | React Hook Form + Zod       |
| Routing               | React Router v7             |
| Real-time             | Socket.io Client            |
| Charts                | Recharts                    |
| Icons                 | Lucide React                |
| Animations            | Framer Motion               |
| Internationalization  | i18next                     |
| Toasts                | Sonner                      |
| Accessible Components | Radix UI                    |

---

# Frontend Structure

```text
frontend/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui primitives
│   │   ├── shared/          # Shared components
│   │   └── layout/          # App shell, sidebar, header
│   │
│   ├── features/
│   │   ├── auth/            # Authentication pages
│   │   ├── dashboard/       # Role-based dashboards
│   │   ├── requests/        # Request management
│   │   ├── admin/           # Admin CRUD
│   │   ├── reports/         # Analytics and reports
│   │   ├── profile/         # User profile
│   │   └── notifications/   # Notifications
│   │
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utilities
│   ├── services/            # API services
│   ├── stores/              # Zustand stores
│   ├── types/               # TypeScript types
│   ├── i18n/                # Translations
│   ├── pages/               # Standalone pages
│   ├── routes/              # Route guards
│   ├── App.tsx
│   └── main.tsx
│
├── .env.example
├── tailwind.config.ts
├── tsconfig.json
├── vite.config.ts
└── package.json
```

---

# Frontend Installation

```bash
cd frontend
npm install
```

Create your environment file:

```bash
cp .env.example .env
```

Start the development server:

```bash
npm run dev
```

---

# Frontend Scripts

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

### Type Check

```bash
npm run type-check
```

---

# Frontend Environment Variables

Create a `.env` file based on `.env.example`:

```env
VITE_API_URL=http://localhost:3012
VITE_API_PREFIX=/api/v1
VITE_SOCKET_URL=http://localhost:3012
VITE_APP_NAME=E-Gov Portal
```

---

# Backend

The backend is built with Node.js, TypeScript, Express, Prisma, PostgreSQL, and Redis.

## Backend Tech Stack

- Node.js 20+
- TypeScript
- Express.js
- Prisma ORM
- PostgreSQL 16
- Redis 7
- Socket.io
- JWT authentication
- Zod validation
- Winston logging
- Cloudinary
- Nodemailer
- Vitest
- Swagger / OpenAPI

---

# Backend Structure

```text
backend/
└── src/
    ├── config/
    │   ├── env.ts
    │   ├── database.ts
    │   ├── logger.ts
    │   ├── redis.ts
    │   └── swagger.ts
    │
    ├── middleware/
    │   ├── error.middleware.ts
    │   ├── notFound.middleware.ts
    │   ├── validate.middleware.ts
    │   ├── rateLimit.middleware.ts
    │   └── requestLogger.middleware.ts
    │
    ├── utils/
    │   ├── AppError.ts
    │   ├── asyncHandler.ts
    │   ├── ApiResponse.ts
    │   ├── jwt.ts
    │   └── constants.ts
    │
    ├── types/
    │   └── express.d.ts
    │
    ├── modules/
    │   └── health/
    │       ├── health.routes.ts
    │       └── health.controller.ts
    │
    ├── app.ts
    └── server.ts
```

---

# Security

The application includes:

- HTTP-only secure cookies
- Password hashing with bcrypt
- Account lockout after failed attempts
- Rate limiting
- CORS protection
- Helmet security headers
- XSS protection
- SQL injection prevention
- Input validation with Zod
- Audit logging

---

# Real-Time Features

Real-time functionality is provided through Socket.io.

Features include:

- Live notifications
- Unread notification count updates
- Toast notifications
- Automatic reconnection

---

# Multi-Language Support

The application supports:

- English
- Farsi
- RTL layout for Farsi
- Bilingual department names
- Bilingual service names

---

# Accessibility

The frontend is designed with accessibility in mind:

- WCAG AA compliance
- Keyboard navigation
- Screen reader support
- Focus management
- Reduced-motion support

---

# API Documentation

Interactive API documentation is available through Swagger UI:

**http://localhost:3012/api/docs**

The Postman collection is available in:

```text
backend/postman/
```

---

# Testing

## Backend Tests

```bash
cd backend
npm test
```

## Frontend Tests

```bash
cd frontend
npm test
```

> Frontend tests should be added or expanded as the project evolves.

---

# Manual Testing

Start the backend:

```bash
cd backend
npm run dev
```

Open another terminal and start the frontend:

```bash
cd frontend
npm run dev
```

Then log in using the sample Admin account:

```text
Email:    admin@egov.com
Password: Password123!
```

Test the following areas:

- [ ] Dashboard — Admin section cards
- [ ] Users — Create, edit, and delete users
- [ ] Departments — Department cards and counts
- [ ] Services — Manage services, fees, and processing times
- [ ] Reports — Charts, revenue, popular services, and CSV export
- [ ] Profile — Profile information and password change
- [ ] Sessions — View active sessions and revoke sessions

---

# Deployment

## Frontend — Vercel

1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Set the build command:

```bash
npm run build
```

4. Set the output directory:

```text
dist
```

5. Add production environment variables.
6. Deploy.

---

## Frontend — Netlify

Use:

```text
Build command: npm run build
Publish directory: dist
```

For SPA routing, add a `_redirects` file:

```text
/* /index.html 200
```

---

## Backend — Render / Railway / Fly.io

See the backend README for detailed backend deployment instructions.

---

# Docker

The frontend can be built and served using a multi-stage Dockerfile:

```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build


FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

---

# 🛠️ Development

## Clone the Repository

```bash
git clone <your-repository-url>
cd egov-portal
```

## Start Infrastructure

```bash
docker-compose up -d
```

## Start Backend

```bash
cd backend
npm install
npm run dev
```

## Start Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

---

# Contributing

1. Fork the repository.
2. Create a feature branch:

```bash
git checkout -b feature/amazing-feature
```

3. Make your changes.
4. Commit your changes:

```bash
git commit -m "feat: add amazing feature"
```

5. Push the branch:

```bash
git push origin feature/amazing-feature
```

6. Open a Pull Request.

---

# License

This project is licensed under the **MIT License**.

---

# Acknowledgments

Built with modern web technologies to make government services more accessible, efficient, and user-friendly.

**Made for citizens, by developers who care.**
