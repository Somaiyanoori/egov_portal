# E-Government Citizen Services Portal

A full-stack digital government platform designed to simplify access to public services, streamline citizen applications, and help government departments manage service requests through a centralized portal.

<p align="center">
  <a href="https://egov-portal-b151.vercel.app/">
    <img src="https://img.shields.io/badge/Live%20Demo-Vercel-black?logo=vercel" alt="Live Demo">
  </a>
  <a href="https://egov-portal-backend.onrender.com/">
    <img src="https://img.shields.io/badge/Backend-Render-46E3B7?logo=render" alt="Backend">
  </a>
  <a href="https://egov-portal-backend.onrender.com/api/docs">
    <img src="https://img.shields.io/badge/API-Swagger-85EA2D?logo=swagger" alt="API Documentation">
  </a>
  <img src="https://img.shields.io/badge/Node.js-20%2B-339933?logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Frontend%20TypeScript-6.0-3178C6?logo=typescript&logoColor=white" alt="Frontend TypeScript">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="MIT License">
</p>

<p align="center">
  <a href="https://egov-portal-b151.vercel.app/">Live Application</a> •
  <a href="https://egov-portal-backend.onrender.com/api/docs">API Documentation</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#screenshots">Screenshots</a>
</p>

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [User Roles](#user-roles)
- [Live Demo](#live-demo)
- [Demo Accounts](#demo-accounts)
- [Screenshots](#screenshots)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Database Management](#database-management)
- [Deployment](#deployment)
- [Security Considerations](#security-considerations)
- [License](#license)

---

## Overview

The **E-Government Citizen Services Portal** is a full-stack web application built to digitize public service delivery and improve communication between citizens and government departments.

Citizens can explore available services, submit applications, upload supporting documents, and track request progress. Government employees can review applications, manage departmental workflows, and monitor platform activity according to their assigned roles.

The application uses a React frontend and a Node.js backend, supported by PostgreSQL (Supabase), Redis (Upstash), real-time communication (Socket.io), and external cloud services.

---

## Key Features

### Authentication and Authorization

- User registration and login.
- JWT-based authentication with access and refresh token rotation.
- Role-based access control (RBAC) across four permission tiers.
- Protected frontend routes and backend endpoints.
- Password recovery through email verification links.
- Secure password hashing using bcryptjs.

### Citizen Services

- Browse available government services by department.
- Submit service applications with multi-field forms.
- Upload supporting documents (PDF, PNG, JPG).
- Track submitted request lifecycle in real-time.
- View application statistics and history.
- Real-time in-app notifications.

### Department Management

- Create and manage government departments.
- Assign services to specific departments.
- Manage officer workflows and application review pipelines.
- Department head oversight and assignment tools.

### Administration

- Comprehensive user and role management.
- Service catalog configuration (fees, processing times).
- System-wide audit logs and activity monitoring.
- Exportable analytics and reporting.

### Additional Capabilities

- PostgreSQL database with Prisma ORM.
- Redis integration for token blacklisting and rate-limiting.
- Real-time event streaming using Socket.io.
- Cloudinary cloud document storage.
- Interactive Swagger OpenAPI documentation.
- Dual-language support (English and Dari, including RTL layout).

---

## User Roles

| Role | Main Responsibilities | Access Scope |
|---|---|---|
| **Citizen** | Browse services, submit applications, upload documents, track requests | Personal requests and profile |
| **Officer** | Review, process, approve, or reject citizen applications | Assigned department requests |
| **Department Head** | Oversee departmental operations, reassign requests, view reports | Entire department data |
| **Administrator** | Manage users, departments, services, system settings, and audit logs | Full system access |

---

## Live Demo

| Component | Platform | Link |
|---|---|---|
| **Frontend Application** | Vercel | [Open Live App](https://egov-portal-b151.vercel.app/) |
| **Backend API** | Render | [Open Backend](https://egov-portal-backend.onrender.com/) |
| **API Documentation** | Swagger UI | [Explore Swagger Docs](https://egov-portal-backend.onrender.com/api/docs) |

> **Note:** The backend is hosted on a cloud service and may take approximately 30–50 seconds to respond to the initial request if spinning up from an idle state.

---

## Demo Accounts

The live application is pre-seeded with accounts for all four roles:

| Role | Demo Email | Demo Password | Access Level |
|---|---|---|---|
| **Citizen** | `citizen@egov.com` | `Password123!` | Citizen Portal |
| **Officer** | `officer@egov.com` | `Password123!` | Department Officer Portal |
| **Department Head** | `head@egov.com` | `Password123!` | Department Head Portal |
| **Administrator** | `admin@egov.com` | `Password123!` | Full System Admin Portal |

<details>
<summary><strong>How to test with demo accounts</strong></summary>

1. Open the [Live Application](https://egov-portal-b151.vercel.app/).
2. On the login page, enter the email and password for the role you wish to test.
3. Test the role-specific dashboard and actions.
4. Log out and switch to another role (e.g., submit a request as Citizen, then approve it as Officer).

</details>

---

## Screenshots

### Citizen Dashboard

![Citizen Dashboard](docs/screenshots/citizen-dashboard.png)

### Admin Dashboard

![Admin Dashboard](docs/screenshots/admin-dashboard.png)

---

## Architecture

### System Architecture

```mermaid
flowchart TB
    User["Users<br/>Citizen / Officer / Head / Admin"]

    subgraph Frontend["Frontend - Vercel"]
        React["React 19 + TypeScript"]
        Router["React Router"]
        State["Zustand + TanStack Query"]
    end

    subgraph Backend["Backend - Render"]
        API["Express REST API (ESM)"]
        Auth["JWT Authentication<br/>Role-Based Access"]
        Services["Business Logic"]
        Realtime["Socket.io"]
        Prisma["Prisma ORM"]
    end

    subgraph Infrastructure["External Cloud Services"]
        DB[("PostgreSQL<br/>Supabase")]
        Redis[("Redis<br/>Upstash")]
        Cloudinary["Cloudinary (Files)"]
        Email["Resend Email API"]
    end

    User --> React
    React --> Router
    React --> State
    React --> API
    API --> Auth
    Auth --> Services
    Services --> Prisma
    Prisma --> DB
    Services --> Redis
    Services --> Cloudinary
    Services --> Email
    API <--> Realtime
    Realtime <--> React
```

---

## Technology Stack

### Frontend

| Technology | Purpose |
|---|---|
| React 19 | User interface |
| TypeScript 6.0 | Type safety |
| Vite | Build tool and development server |
| Tailwind CSS v4 | Styling and responsive design |
| React Router | Client-side routing |
| TanStack Query v5 | Server state management and caching |
| Zustand | Client-side global state |
| Lucide React | Icon library |
| i18next | Multi-language (EN/Dari) and RTL support |

### Backend

| Technology | Purpose |
|---|---|
| Node.js (20+) | JavaScript runtime (ES Modules) |
| TypeScript | Type-safe backend code |
| Express.js | REST API framework |
| Prisma ORM | Type-safe database client and migrations |
| PostgreSQL | Primary relational database |
| Redis (Upstash) | Rate limiting and token/session management |
| Socket.io | Bi-directional real-time communication |
| JWT (jsonwebtoken) | Access and refresh token authorization |
| bcryptjs | Secure password hashing |
| Zod | Request payload schema validation |
| Swagger UI | OpenAPI documentation |
| Cloudinary | Cloud file attachment storage |
| Resend | Transactional email delivery |

### Infrastructure & DevOps

| Technology | Purpose |
|---|---|
| Docker & Docker Compose | Local containerized development |
| Vercel | Production frontend hosting |
| Render | Production backend hosting |
| Supabase | Cloud PostgreSQL hosting |
| Upstash | Serverless Redis |
| GitHub | Version control and repository hosting |

---

## Project Structure

```text
egov_portal/
│
├── backend/
│   ├── prisma/
│   │   ├── migrations/         # Database migrations
│   │   ├── schema.prisma       # Prisma data models
│   │   └── seed.ts             # Seed script for demo accounts
│   ├── src/
│   │   ├── config/             # Database, Redis, Logger, Swagger config
│   │   ├── middleware/         # Auth, error, logging, rate-limit middleware
│   │   ├── modules/            # Domain modules (auth, users, requests, etc.)
│   │   ├── utils/              # Helper utilities
│   │   ├── app.ts              # Express application setup
│   │   └── server.ts           # Server entry point
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── features/           # Feature pages (auth, dashboard, requests)
│   │   ├── hooks/              # Custom React hooks
│   │   ├── routes/             # Protected and public route definitions
│   │   ├── services/           # Axios API services
│   │   ├── stores/             # Zustand stores
│   │   ├── App.tsx             # Main App root
│   │   └── main.tsx            # React DOM mounting
│   ├── package.json
│   ├── vite.config.ts
│   └── vercel.json
│
├── docs/
│   └── screenshots/            # UI screenshots
│       ├── citizen-dashboard.png
│       └── admin-dashboard.png
│
├── docker-compose.yml          # Local Docker services (Postgres, Redis)
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js:** `20.x` or later
- **npm:** `10.x` or later
- **Docker Desktop** (optional for local database and Redis)
- **Git**

### 1. Clone the Repository

```bash
git clone https://github.com/Somaiyanoori/egov_portal.git
cd egov_portal
```

### 2. Start Local Database & Redis (Docker)

```bash
docker-compose up -d
```

### 3. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
NODE_ENV=development
PORT=3012
API_PREFIX=/api/v1
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/egov_db
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_ACCESS_SECRET=your_jwt_access_secret_min_32_characters_long
JWT_REFRESH_SECRET=your_jwt_refresh_secret_min_32_characters_long
COOKIE_SECRET=your_cookie_secret_min_32_characters_long
CORS_ORIGIN=http://localhost:5173
FRONTEND_URL=http://localhost:5173
```

Configure any additional environment variables required by your backend configuration, including cloud storage, email delivery, and production services.

Run database migrations and seed:

```bash
npx prisma migrate dev
npm run prisma:seed
```

Start backend development server:

```bash
npm run dev
```

Backend will run at:

`http://localhost:3012`

### 4. Frontend Setup

In a new terminal window:

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:3012
VITE_API_PREFIX=/api/v1
VITE_SOCKET_URL=http://localhost:3012
VITE_APP_NAME=E-Gov Portal
```

Start frontend development server:

```bash
npm run dev
```

Frontend will run at:

`http://localhost:5173`

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example / Required |
|---|---|---|
| `NODE_ENV` | Environment mode | `production` or `development` |
| `PORT` | Server listening port | `3012` |
| `API_PREFIX` | Base API route prefix | `/api/v1` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://...` |
| `REDIS_URL` | Redis cloud connection URL (TLS) | `rediss://default:...@...:6379` |
| `REDIS_HOST` | Local Redis hostname | `localhost` |
| `REDIS_PORT` | Local Redis port | `6379` |
| `JWT_ACCESS_SECRET` | Secret key for signing access tokens | Minimum 32 characters |
| `JWT_REFRESH_SECRET` | Secret key for signing refresh tokens | Minimum 32 characters |
| `COOKIE_SECRET` | Secret key for cookie signing | Minimum 32 characters |
| `CORS_ORIGIN` | Allowed client origins (comma-separated) | `https://egov-portal-b151.vercel.app` |
| `FRONTEND_URL` | Main client application URL | `https://egov-portal-b151.vercel.app` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary account cloud name | Required for Cloudinary uploads |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Required for Cloudinary uploads |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Required for Cloudinary uploads |
| `RESEND_API_KEY` | Resend API key for email delivery | Required for Resend email |

> **Security:** Never commit real `.env` files, API keys, database URLs, JWT secrets, or other private credentials to GitHub. Use placeholder values in documentation.

### Frontend (`frontend/.env`)

| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | Base URL of the backend | `https://egov-portal-backend.onrender.com` |
| `VITE_API_PREFIX` | Prefix for API routes | `/api/v1` |
| `VITE_SOCKET_URL` | URL for Socket.io connection | `https://egov-portal-backend.onrender.com` |
| `VITE_APP_NAME` | Portal title display name | `E-Gov Portal` |

---

## API Documentation

Interactive Swagger documentation is available online and locally:

- **Production API Docs:** [https://egov-portal-backend.onrender.com/api/docs](https://egov-portal-backend.onrender.com/api/docs)
- **Local API Docs:** `http://localhost:3012/api/docs`

All endpoints are versioned under `/api/v1`:

- `/api/v1/auth` - Login, registration, token refresh, sessions, password reset
- `/api/v1/users` - Admin user management and profile controls
- `/api/v1/departments` - Department catalog and assignments
- `/api/v1/services` - Service configurations and fees
- `/api/v1/requests` - Citizen application submissions, reviews, and workflows
- `/api/v1/documents` - Document upload and retrieval
- `/api/v1/notifications` - Real-time and persistent user notifications
- `/api/v1/reports` - Administrative analytics and audit logs
- `/api/v1/payments` - Payment-related operations, if enabled in the deployed API

---

## Testing

Run tests and checks from the `backend/` directory:

```bash
# Type check TypeScript
npm run type-check

# Run test suite
npm test

# Generate test coverage report
npm run test:coverage
```

---

## Database Management

Prisma CLI commands for managing schema and migrations:

```bash
# Generate Prisma Client
npx prisma generate

# Apply pending migrations (production)
npx prisma migrate deploy

# Open visual database browser
npx prisma studio

# Seed demo data
npm run prisma:seed
```

> **Warning:** The seed script may delete existing records before inserting demo data. Use it only with a disposable development or demo database. Never run it against a production database containing real user data.

---

## Deployment

### Frontend (Vercel)

- **Platform:** Vercel
- **Root Directory:** `frontend`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- Includes `vercel.json` SPA rewrite rules for React Router.

### Backend (Render)

- **Platform:** Render (Web Service)
- **Root Directory:** `backend`
- **Runtime:** Node.js 20+ (Native ES Modules)
- **Build Command:** `npm install --include=dev && npx prisma generate && npm run build`
- **Start Command:** `npx prisma migrate deploy && node dist/server.js`

### Database & Cache

- **PostgreSQL Database:** Supabase
- **Redis Cache:** Upstash Redis (with TLS `rediss://`)
- **File Storage:** Cloudinary CDN
- **Email Delivery:** Resend API

---

## Security Considerations

- **Authentication:** Short-lived JWT access tokens and refresh-token-based authentication.
- **Cross-Site Protection:** Dynamic CORS origin validation with credential support.
- **Parameter Protection:** HTTP Parameter Pollution (`hpp`) protection and input sanitization.
- **Rate Limiting:** IP and user-based request throttling backed by Redis.
- **Passwords:** Hashed with `bcryptjs` using a configured salt factor.
- **Data Validation:** Runtime request validation with Zod schemas.
- **Environment Secrets:** Sensitive configuration is stored in environment variables and should never be committed to version control.

---

## License

This project is open-source and available under the **MIT License**. See the [LICENSE](LICENSE) file for more information.

---

## Acknowledgments

Built with modern web technologies to make public services transparent, accessible, and efficient for all citizens.
