# Backend Setup Guide

## Prerequisites

Before running the backend, ensure the following software is installed:

* Node.js (v20 or later)
* PostgreSQL
* Docker (optional)
* npm

---

# Installation

Clone the repository.

```bash
git clone <repository-url>
```

Navigate to the backend directory.

```bash
cd backend
```

Install dependencies.

```bash
npm install
```

---

# Environment Variables

Copy the example environment file.

```bash
cp .env.example .env
```

Update the following values:

```env
DATABASE_URL=
JWT_SECRET=
JWT_REFRESH_SECRET=
ACCESS_TOKEN_EXPIRES_IN=
REFRESH_TOKEN_EXPIRES_IN=
PORT=
```

---

# Database

Generate the Prisma client.

```bash
npm run prisma:generate
```

Run database migrations.

```bash
npm run prisma:migrate
```

Seed the database.

```bash
npm run seed
```

---

# Running the Server

Development mode:

```bash
npm run start:dev
```

Production build:

```bash
npm run build
npm run start
```

---

# Swagger Documentation

Once the server is running, open:

```text
http://localhost:3000/api/docs
```

Swagger provides interactive documentation for all API endpoints.

---

# Testing

Run unit tests.

```bash
npm run test
```

---

# Useful Commands

Generate Prisma Client

```bash
npm run prisma:generate
```

Run Migrations

```bash
npm run prisma:migrate
```

Reset Database

```bash
npm run prisma:reset
```

Open Prisma Studio

```bash
npm run prisma:studio
```

Seed Database

```bash
npm run seed
```

Format Source Code

```bash
npm run format
```

Run ESLint

```bash
npm run lint
```

---

# Default Seed User

If the seed script has been executed, the following administrator account is available:

Email

```text
admin@teamsync.com
```

Password

```text
password123
```
