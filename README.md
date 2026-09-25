# 🧠 BrainArena — Full-Stack Quiz Platform

A full-stack interactive quiz application with 90+ questions across 9 categories, user authentication, server-side scoring, leaderboard, and admin question management.

## Architecture

```
Frontend (React + Vite)  ──── REST API ────  Backend (Express)  ────  PostgreSQL
     Vercel                                      Render
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, Framer Motion, Lucide React |
| Backend | Node.js, Express 5, JWT, bcryptjs |
| Database | PostgreSQL |
| Security | Helmet, CORS, Rate Limiting |

## Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL 14+

### 1. Clone & Install

```bash
git clone https://github.com/joshuantim/-BrainArena.git
cd BrainArena
npm install
cd frontend && npm install && cd ..
cd backend && npm install && cd ..
```

### 2. Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE brainarena;
```

### 3. Configure Environment

Copy `.env.example` files and configure:

```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env with your DATABASE_URL and JWT_SECRET

# Frontend
cp frontend/.env.example frontend/.env
```

Backend `.env`:
```
PORT=5000
DATABASE_URL=postgresql://postgres:password@localhost:5432/brainarena
JWT_SECRET=your-super-secret-key-change-this
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### 4. Run Database Migrations & Seed

```bash
npm run db:migrate   # Creates tables
npm run db:seed      # Seeds 90+ questions + admin user
```

Default admin account: `admin@brainarena.com` / `admin123`

### 5. Start Development

```bash
npm run dev
```

This starts both:
- **Frontend** → http://localhost:5173
- **Backend** → http://localhost:5000

## Database Commands

| Command | Description |
|---------|-------------|
| `npm run db:migrate` | Create/update database tables |
| `npm run db:seed` | Seed categories, questions & admin user |
| `npm run db:reset` | Drop all tables (destructive!) |

## API Endpoints

### Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login (returns JWT) |
| GET | `/api/auth/me` | Yes | Get current user |

### Quiz (Public)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/categories` | No | List all categories |
| GET | `/api/questions?category=&difficulty=` | No | Get questions (no answers) |
| GET | `/api/questions/count` | No | Get question counts |
| GET | `/api/leaderboard` | No | Get top scores |

### Quiz (Authenticated)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/quiz/start` | Yes | Start a quiz attempt |
| POST | `/api/quiz/:attemptId/answer` | Yes | Submit an answer |
| POST | `/api/quiz/:attemptId/complete` | Yes | Complete quiz & get results |
| GET | `/api/quiz/history` | Yes | Get quiz history |

### Admin (Admin only)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/admin/questions` | Admin | List all questions |
| POST | `/api/admin/questions` | Admin | Create question |
| PUT | `/api/admin/questions/:id` | Admin | Update question |
| DELETE | `/api/admin/questions/:id` | Admin | Delete question |

## Project Structure

```
BrainArena/
├── frontend/
│   ├── src/
│   │   ├── components/    # Navbar, Toast
│   │   ├── hooks/         # useAuth (AuthContext)
│   │   ├── pages/         # Home, Quiz, Result, Login, Register, Admin
│   │   ├── services/      # api.js (centralized API client)
│   │   ├── utils/         # sound.js (Web Audio API)
│   │   ├── data/          # questions.js (legacy, for reference)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── config/        # db.js (PostgreSQL pool)
│   │   ├── controllers/   # auth, quiz, attempt, admin
│   │   ├── middleware/     # auth (JWT verify, admin check)
│   │   ├── routes/        # auth, quiz, admin
│   │   ├── db/            # migrate, seed, reset scripts
│   │   └── server.js
│   ├── .env.example
│   └── package.json
│
├── database/
│   ├── schema.sql         # Table definitions
│   └── seed.sql           # 9 categories + 90 questions
│
├── package.json           # Root (concurrently)
└── .gitignore
```

## Deployment

### Frontend → Vercel

1. Connect your GitHub repo to Vercel
2. Set Root Directory to `frontend`
3. Add environment variable: `VITE_API_URL=https://your-backend.onrender.com/api`

### Backend → Render

1. Create a new Web Service on Render
2. Set Root Directory to `backend`
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Add environment variables:
   - `DATABASE_URL` — your PostgreSQL connection string
   - `JWT_SECRET` — a strong random secret
   - `CLIENT_URL` — your Vercel frontend URL
   - `NODE_ENV` — `production`

### Database → Supabase / Render / Neon

Use any managed PostgreSQL provider. Configure `DATABASE_URL` in your backend.

## Security

- ✅ Password hashing (bcrypt)
- ✅ JWT authentication
- ✅ Role-based access control (user/admin)
- ✅ CORS configuration
- ✅ Helmet security headers
- ✅ Rate limiting on auth endpoints
- ✅ Parameterized SQL queries
- ✅ No credentials in frontend code
- ✅ Server-side answer validation

## License

MIT
