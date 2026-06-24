# TeamSync Architecture

## Overview

TeamSync follows a layered full-stack architecture consisting of three independent applications communicating through a RESTful API.

```text
React Native App
        │
        │
Next.js Web App
        │
        ▼
 NestJS REST API
        │
        ▼
 Prisma ORM
        │
        ▼
 PostgreSQL
```

---

# Backend Architecture

The backend follows NestJS's modular architecture.

```text
src/
│
├── auth/
├── users/
├── projects/
├── tasks/
├── comments/
├── prisma/
└── common/
```

Each module contains:

* Controller
* Service
* DTOs
* Guards (where applicable)

Business logic is isolated inside services while controllers remain lightweight.

---

# Authentication

Authentication is implemented using JSON Web Tokens (JWT).

Flow:

1. User logs in.
2. Backend validates credentials.
3. Access Token and Refresh Token are generated.
4. Access Token is attached to every protected request.
5. Refresh Token is used to issue a new Access Token when the previous one expires.

Role-Based Access Control (RBAC) restricts sensitive operations such as project creation and task management.

---

# Database Layer

Prisma ORM is used as the data access layer.

Benefits include:

* Type-safe queries
* Migration management
* Schema-first development
* Generated client

Main entities:

* User
* Project
* ProjectMember
* Task
* Comment

---

# API Layer

REST API endpoints are documented using Swagger.

Main resources:

* Authentication
* Users
* Projects
* Tasks
* Comments

Validation is performed using DTOs with `class-validator`.

---

# Web Application

The web client is built with Next.js.

Responsibilities:

* Authentication
* Dashboard
* Project management
* Task management
* Commenting
* Responsive interface

State management:

* TanStack Query
* Axios

---

# Mobile Application

The mobile application is built using React Native and Expo.

Responsibilities:

* Authentication
* View assigned tasks
* Refresh task list
* Mobile-first interface

---

# Security

The application implements:

* Password hashing using bcrypt
* JWT Authentication
* Refresh Tokens
* Protected Routes
* Role-Based Authorization
* Request Validation
* Global Exception Handling

---

# Testing

Unit tests cover:

* Authorization Guard
* Task filtering, sorting, and pagination

Swagger is provided for API testing and documentation.

---

# Design Principles

The project follows the following principles:

* Separation of Concerns
* Dependency Injection
* Modular Architecture
* DTO Validation
* RESTful API Design
* Type Safety
* Responsive UI
* Reusable Components


## AWS Production Architecture

### Backend API

The NestJS API would be containerized and deployed on AWS ECS Fargate. ECS Fargate is a good fit because the API is a long-running REST service and does not require server management. The container image would be stored in Amazon ECR.

### Database

PostgreSQL would run on Amazon RDS. RDS provides automated backups, monitoring, patching, and easier operational management compared to running PostgreSQL manually on EC2.

### Web App

The Next.js web app would be deployed using AWS Amplify or a CloudFront-backed deployment. Amplify is suitable for fast Next.js hosting with CI/CD support, while CloudFront provides global caching and low-latency delivery.

### Mobile App

The React Native app would be distributed through the Apple App Store and Google Play Store. Expo Application Services can be used to build release binaries.

### Secrets Management

Secrets such as database credentials, JWT secrets, and API keys should be stored in AWS Secrets Manager or Systems Manager Parameter Store. Secrets should never be committed to GitHub or printed in CI/CD logs.

### CI/CD Pipeline

A GitHub Actions pipeline would run on each pull request:

1. Install dependencies
2. Run linting
3. Run unit tests
4. Build backend, web, and mobile projects
5. Build Docker image for the backend
6. Push image to Amazon ECR
7. Deploy updated service to ECS Fargate

### Scaling Concern

The main scaling concern is task listing performance as the Task table grows. To address this, the backend uses indexed query patterns around `projectId`, `status`, `assigneeId`, and `dueDate`. At the infrastructure level, RDS read replicas could be introduced if read traffic grows significantly, and ECS service autoscaling can scale API containers based on CPU, memory, or request count.