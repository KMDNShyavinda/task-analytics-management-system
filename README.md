# Task & Analytics Management System (Mini-ERP)

A full-stack web application for managing personal daily tasks with an interactive analytics dashboard. Built as a technical assessment for the Full-Stack Developer Intern position at Zentryx Innovation.

**Repository:** https://github.com/KMDNShyavinda/task-analytics-management-system

**Live Demo:**
- Frontend: https://task-analytics-management-system.vercel.app
- Backend API: https://task-analytics-management-system-production.up.railway.app

---

## Features

- **Authentication** — Secure user registration and login with JWT-based sessions
- **Protected Routes** — Both frontend and backend routes are protected; unauthenticated users cannot access the dashboard or task data
- **Task Management (CRUD)** — Create, read, update, and delete personal tasks with title, description, due date, priority, and status
- **Analytics Dashboard** — Visual summary of tasks including:
  - Pie chart: Task status distribution (To Do / In Progress / Completed)
  - Bar chart: Priority breakdown (Low / Medium / High)
  - KPI cards: Total active tasks, tasks completed today, overdue tasks
- **Responsive UI** — Fully responsive layout across mobile, tablet, and desktop screens

---

## Tech Stack

### Frontend
| Tool | Purpose |
|---|---|
| React (TypeScript) + Vite | Fast, type-safe UI development |
| Tailwind CSS | Utility-first responsive styling |
| React Router DOM | Client-side routing and protected routes |
| Axios | HTTP client for API communication |
| Recharts | Pie chart and bar chart visualizations for the analytics dashboard |

### Backend
| Tool | Purpose |
|---|---|
| Node.js + Express (TypeScript) | REST API server |
| MongoDB + Mongoose | NoSQL database and schema modeling |
| JSON Web Token (jsonwebtoken) | Stateless session/authentication tokens |
| bcryptjs | Password hashing |
| cors | Cross-origin request handling between frontend and backend |
| dotenv | Environment variable management |

**Why MongoDB?** Tasks are naturally document-shaped (flexible fields like priority/status), and MongoDB Atlas provides a free, easy-to-manage cloud database that avoids local database setup, which suited the project's timeline.

**Why JWT over sessions?** JWT keeps the backend stateless — no server-side session storage is needed, which simplifies scaling and keeps the API and frontend cleanly decoupled.

---

## Project Structure

```
task-analytics-management-system/
├── backend/
│   ├── src/
│   │   ├── config/          # Database connection setup
│   │   ├── controllers/     # Route logic (auth, tasks, analytics)
│   │   ├── middleware/      # JWT auth middleware (protects routes)
│   │   ├── models/          # Mongoose schemas (User, Task)
│   │   ├── routes/          # Express route definitions
│   │   └── index.ts         # App entry point
│   ├── .env                 # Environment variables (not committed)
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI (TaskModal, Analytics, PrivateRoute)
│   │   ├── pages/            # Full pages (Login, Register, Dashboard)
│   │   ├── services/         # Axios API call functions
│   │   ├── types/            # Shared TypeScript interfaces
│   │   ├── App.tsx           # Route definitions
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
```

---

## Database Schema

Two collections with a one-to-many relationship: one **User** has many **Tasks**.

### `users` Collection

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | Primary key (auto-generated) |
| `name` | String | Required |
| `email` | String | Required, unique, lowercase |
| `password` | String | Required, stored as a bcrypt hash (never plain text) |
| `createdAt` / `updatedAt` | Date | Auto-managed timestamps |

### `tasks` Collection

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | Primary key (auto-generated) |
| `title` | String | Required |
| `description` | String | Optional |
| `dueDate` | Date | Required |
| `priority` | String (enum) | `Low` \| `Medium` \| `High`, default `Medium` |
| `status` | String (enum) | `To Do` \| `In Progress` \| `Completed`, default `To Do` |
| `userId` | ObjectId | **Foreign key** — references `users._id` (owner of the task) |
| `createdAt` / `updatedAt` | Date | Auto-managed timestamps |

**Relationship diagram:**

```
users (1) ──────< (many) tasks
  _id                userId (FK → users._id)
```

Every task query is scoped to the logged-in user's ID (`Task.find({ userId: req.userId })`), so users can only ever see, edit, or delete their own tasks — this is enforced at the database query level, not just in the UI.

---

## Setup Instructions

### Prerequisites
- Node.js (v18 or later recommended)
- npm
- A MongoDB Atlas account (free tier) — or a local MongoDB instance

### 1. Clone the repository

```bash
git clone https://github.com/KMDNShyavinda/task-analytics-management-system.git
cd task-analytics-management-system
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` folder with the following variables:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_own_random_secret_string
```

Run the backend in development mode:

```bash
npm run dev
```

The API will be available at `http://localhost:5000`.

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

### 4. Using the App

1. Go to `http://localhost:5173/register` and create an account
2. Log in at `http://localhost:5173/login`
3. You'll be redirected to the dashboard, where you can create tasks and view analytics

---

## API Endpoints

| Method | Endpoint | Protected | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Register a new user |
| POST | `/api/auth/login` | No | Log in and receive a JWT token |
| GET | `/api/auth/me` | Yes | Get the logged-in user's profile |
| GET | `/api/tasks` | Yes | Get all tasks for the logged-in user |
| POST | `/api/tasks` | Yes | Create a new task |
| PUT | `/api/tasks/:id` | Yes | Update a task (partial updates supported) |
| DELETE | `/api/tasks/:id` | Yes | Delete a task |
| GET | `/api/analytics/summary` | Yes | Get status/priority breakdown and KPI counts |

Protected endpoints require an `Authorization: Bearer <token>` header.

---

## Environment Variables Reference

| Variable | Location | Description |
|---|---|---|
| `PORT` | `backend/.env` | Port the Express server runs on (default: 5000) |
| `MONGO_URI` | `backend/.env` | MongoDB Atlas connection string |
| `JWT_SECRET` | `backend/.env` | Secret key used to sign and verify JWT tokens |

`.env` is excluded from version control via `.gitignore` and must be created manually by anyone running this project locally.

---

## Deployment

- **Frontend** is deployed on **Vercel**, built from the `frontend` directory with the `VITE_API_URL` environment variable pointing to the live backend.
- **Backend** is deployed on **Railway**, built from the `backend` directory. Environment variables (`MONGO_URI`, `JWT_SECRET`, `PORT`) are configured directly in the Railway dashboard.
- CORS on the backend is restricted to the specific frontend origins (`localhost:5173` for local development and the deployed Vercel URL) rather than left open to all origins.
- MongoDB Atlas network access is configured to allow connections from anywhere (`0.0.0.0/0`), since Railway's outbound IPs are not static on the free tier.

---

## Notes on Design Decisions

- **Analytics calculated server-side:** The `/api/analytics/summary` endpoint aggregates status counts, priority counts, and KPI figures on the backend rather than sending raw task data to the frontend to be processed. This keeps the calculation logic centralized and reduces the amount of data sent over the network.
- **Ownership checks on every task mutation:** Update and delete operations filter by both `_id` and `userId` together, so a user cannot modify or remove another user's task even by guessing a task ID.
- **Password security:** Passwords are hashed with bcrypt (salt rounds: 10) before being stored, and are explicitly excluded from any API response.