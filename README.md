# 🏛️ E-Government Citizen Services Portal

<div align="center">

![Build](https://img.shields.io/badge/build-passing-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Node](https://img.shields.io/badge/node-20+-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)

**A modern, full-stack E-Government portal for digitizing citizen services**

[Backend Docs](./backend/README.md) • [Frontend Docs](./frontend/README.md) • [API Docs](http://localhost:3012/api/docs)

</div>

---

## 🎯 Overview

A production-ready platform that digitizes government services, allowing:

- 👥 **Citizens** to apply for services online
- 👨‍💼 **Officers** to process requests digitally
- 👔 **Department Heads** to manage operations
- 🔧 **Admins** to oversee the entire system

---

## 🏗️ Architecture

```text
egov-portal/
├── backend/              # Node.js + TypeScript + Prisma + PostgreSQL
├── frontend/             # React + TypeScript + Vite + Tailwind
├── docker-compose.yml
└── README.md
```

---

## 🚀 Quick Start

### 1. Start Infrastructure

```bash
docker-compose up -d
```

### 2. Start Backend

Open a terminal and run:

```bash
cd backend
npm install
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

### 3. Start Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

---

## 🌐 Local Services

| Service         | URL                            |
| --------------- | ------------------------------ |
| **Frontend**    | http://localhost:5173          |
| **Backend API** | http://localhost:3012          |
| **API Docs**    | http://localhost:3012/api/docs |
| **Adminer**     | http://localhost:8080          |

---

## 📸 Screenshots

> Add screenshots here once the frontend is completed.

---

## 🛠️ Tech Stack

### Backend

Node.js, TypeScript, Express, Prisma, PostgreSQL, Redis, Socket.io

### Frontend

React 19, TypeScript, Vite, Tailwind CSS, TanStack Query, Zustand

### DevOps

Docker, GitHub Actions, Render / Railway

---

## 📚 Documentation

- [**Backend Documentation**](./backend/README.md)
- [**Frontend Documentation**](./frontend/README.md)
- [**API Documentation — Swagger**](http://localhost:3012/api/docs)

---

## 🧪 Testing Setup

### Install Test Dependencies

From the backend directory:

```powershell
cd "C:\Users\OverHaul\Documents\full suck web developer\egov_portal\backend"

npm install -D vitest @vitest/coverage-v8 @vitest/ui supertest @types/supertest
```

---

## 🎯 Setup Instructions

### 1. Create Test Database

Make sure the PostgreSQL Docker container is running:

```powershell
docker exec -it egov_postgres psql -U postgres -c "CREATE DATABASE egov_test_db;"
```

### 2. Verify Everything

#### Check Environment

```powershell
npm run check:env
```

#### Type Check

```powershell
npm run type-check
```

#### Run Tests

```powershell
npm test -- --run
```

#### Build Production

```powershell
npm run build
```

### 3. Test Docker Build

```powershell
npm run docker:build
```

---

## 📦 Production Checklist

Create the following file:

```text
backend/PRODUCTION_CHECKLIST.md
```

Add the following checklist:

```markdown
# 🚀 Production Deployment Checklist

## Before Deploying

- [ ] All environment variables set in production
- [ ] Strong secrets (32+ chars) for JWT & COOKIE
- [ ] `NODE_ENV=production`
- [ ] `DATABASE_URL` points to production DB
- [ ] Cloudinary credentials configured
- [ ] Email SMTP credentials configured
- [ ] `CORS_ORIGIN` set to production frontend URL
- [ ] `FRONTEND_URL` set to production frontend URL

## Database

- [ ] Migrations applied: `npx prisma migrate deploy`
- [ ] Database backups scheduled
- [ ] Read replicas configured (if needed)
- [ ] Connection pool sized appropriately

## Security

- [ ] All secrets rotated from development
- [ ] SSL/TLS enabled
- [ ] Rate limits configured for production traffic
- [ ] Helmet enabled
- [ ] CORS properly configured (no wildcards)
- [ ] Dependencies audited: `npm audit`
- [ ] `.env` files never committed

## Monitoring

- [ ] Health check endpoint monitored
- [ ] Error tracking configured
- [ ] Uptime monitoring
- [ ] Log aggregation configured
- [ ] Performance monitoring (APM)

## Performance

- [ ] Redis cache warmed
- [ ] Database indexes verified
- [ ] Compression enabled
- [ ] CDN for static assets
- [ ] Query optimization completed

## Backup & Recovery

- [ ] Database backups automated
- [ ] Backup restoration tested
- [ ] Disaster recovery plan documented
```

---

## 📄 License

MIT

---

## 🙏 Acknowledgments

Built with ❤️ using modern web technologies.

**Made for citizens, by developers who care. 🇦🇫**
