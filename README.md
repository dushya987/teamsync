# TeamSync

A full-stack team collaboration and project management platform built with NestJS, Next.js, React Native, PostgreSQL, and Prisma.

---

## Overview

TeamSync enables teams to manage projects, assign tasks, collaborate through comments, and track work across web and mobile applications.

The project demonstrates a modern full-stack architecture using a shared REST API, role-based authentication, responsive web UI, and a mobile client.

---

## Features

### Authentication

- JWT Authentication
- Refresh Token Authentication
- Role-Based Access Control (RBAC)
- Protected API Endpoints

### Projects

- Create Projects
- View Assigned Projects
- Project Membership

### Tasks

- Create Tasks
- Update Tasks
- Assign Users
- Due Dates
- Priority Levels
- Task Status
- Filtering
- Pagination
- Sorting

### Comments

- Add Comments
- View Task Discussions

### Web Application

- Responsive Dashboard
- Project Management
- Task Management
- Authentication
- Automatic Token Refresh
- Swagger API Integration

### Mobile Application

- Login
- Task List
- Secure Authentication
- Pull-to-Refresh

---

## Tech Stack

### Backend

- NestJS
- Prisma ORM
- PostgreSQL
- JWT
- Swagger
- Jest

### Web

- Next.js
- React
- TypeScript
- Tailwind CSS
- TanStack Query
- Axios

### Mobile

- React Native
- Expo
- TypeScript
- TanStack Query
- Axios

---

## Project Structure

```text
teamsync/
│
├── backend/
│
├── web/
│
├── mobile/
│
├── docker-compose.yml
│
└── README.md
```

---

## Running the Project

### Backend

```bash
cd backend
npm install
npm run prisma:migrate
npm run seed
npm run start:dev
```

---

### Web

```bash
cd web
npm install
npm run dev
```

---

### Mobile

```bash
cd mobile
npm install
npx expo start
```

---

## API Documentation

Swagger documentation is available at:

```text
http://localhost:3000/api/docs
```

---

## Testing

Run backend tests:

```bash
npm run test
```

Build the backend:

```bash
npm run build
```

---

## Environment Variables

Copy:

```text
.env.example
```

to

```text
.env
```

and update the database connection and JWT secrets.

---

## JWT Storage Strategy

For this local assessment build, the web app stores the access token and refresh token in browser localStorage to keep the setup simple and easy to run locally without additional cookie/domain configuration.

In a production deployment, I would use secure httpOnly cookies for refresh tokens to reduce XSS exposure, with short-lived access tokens and server-side refresh token rotation. The mobile app uses platform-aware secure storage through Expo SecureStore on native platforms.

---

## ERD

```mermaid
erDiagram
  User ||--o{ Project : owns
  User ||--o{ ProjectMember : belongs_to
  Project ||--o{ ProjectMember : has_members
  Project ||--o{ Task : has_tasks
  User ||--o{ Task : assigned_tasks
  Task ||--o{ Comment : has_comments
  User ||--o{ Comment : writes

  User {
    string id
    string email
    string passwordHash
    string name
    string role
    datetime createdAt
  }

  Project {
    string id
    string name
    string description
    string ownerId
    datetime createdAt
  }

  ProjectMember {
    string projectId
    string userId
    string role
  }

  Task {
    string id
    string projectId
    string title
    string description
    string status
    string priority
    string assigneeId
    datetime dueDate
    datetime createdAt
    datetime updatedAt
  }

  Comment {
    string id
    string taskId
    string authorId
    string body
    datetime createdAt
  }
```

---

## Indexing Note

If the `Task` table grows beyond 1M rows, the most important query path is retrieving tasks by `projectId` with optional filtering by `status` and `assigneeId`, then sorting by `dueDate`. To support this efficiently, I added composite indexes around the most common access patterns instead of only indexing individual columns.

The main index is:

```prisma
@@index([projectId, status, assigneeId])
```

This helps the API endpoint `GET /projects/:id/tasks` when users filter tasks inside a project by status and assignee. Since `projectId` is always known from the route, it is the leading column. `status` and `assigneeId` follow because they are common filters.

For due date sorting, I also added:

```prisma
@@index([projectId, dueDate])
```

This improves project-level task queries sorted by due date. I also included supporting indexes such as `@@index([projectId])` and `@@index([projectId, status])` for simpler filter combinations. These indexes reduce full-table scans and keep task listing responsive as the task table grows.

---

## Author

Developed as a Full-Stack Software Engineering assessment project using modern web and mobile technologies.
