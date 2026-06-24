# Web App Setup Guide

## Prerequisites

Before running the web app, ensure the following software is installed:

* Node.js (v20 or later)
* npm

The backend API should also be running locally.

---

# Installation

Navigate to the web directory.

cd web
npm install

Create a .env.local file in the web directory.
NEXT_PUBLIC_API_URL=http://localhost:3000

npm run dev

Once the web app is running, open:
http://localhost:3001

Run a production build.
npm run build


If the backend seed script has been executed, the following administrator account is available:
admin@teamsync.com
password123