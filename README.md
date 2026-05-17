# Mini Service Request Board

Full-stack assessment project for GlobalTNA. Homeowners can create and manage service requests, while tradespeople can browse jobs, request work, and update status after a homeowner confirms them.

## Tech Stack

- Frontend: Next.js App Router, React, TypeScript, Tailwind CSS
- Backend: Node.js, Express
- Database: MongoDB
- ODM: Mongoose
- Authentication: JWT stored in an HttpOnly cookie
- Validation: express-validator
- Tests: Jest, Supertest, mongodb-memory-server

## Features

- Responsive job board with cards
- Category, status, and keyword filters
- Job detail page with status updates
- Homeowner-only job creation, editing, and deletion
- Tradesperson job requests with homeowner approval
- Assigned tradesperson status updates
- Register, login, logout, and current-user session endpoint
- Backend input validation and consistent JSON responses
- Helmet, CORS, dotenv, global error handling, and 404 handling
- Seed script with sample jobs and demo users

## Folder Structure

```txt
root/
  frontend/
    app/
    components/
    hooks/
    lib/
    types/
  backend/
    src/
      config/
      controllers/
      middleware/
      models/
      routes/
      seed/
      utils/
      validators/
  README.md
```

## Submission Setup Instructions

Prerequisites:

- Node.js 18 or newer
- npm
- MongoDB running locally or a MongoDB Atlas connection string

Clone/open the repository, then install dependencies separately for the backend and frontend:

```bash
cd backend
npm install
```

```bash
cd frontend
npm install
```

## Required Environment Variables

Create these files before running the project. Real `.env` files are intentionally ignored by git.

### Backend: `backend/.env`

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/mini-service-board
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=2h
CLIENT_URL=http://localhost:3000
```

You can create it from the example file:

```bash
cd backend
cp .env.example .env
```

On Windows PowerShell:

```powershell
cd backend
copy .env.example .env
```

### Frontend: `frontend/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

You can create it from the example file:

```bash
cd frontend
cp .env.example .env.local
```

On Windows PowerShell:

```powershell
cd frontend
copy .env.example .env.local
```

## Run Instructions

Start the backend in the first terminal:

```bash
cd backend
npm run dev
```

Start the frontend in a second terminal:

```bash
cd frontend
npm run dev
```

Open the app:

```txt
http://localhost:3000
```

Backend API:

```txt
http://localhost:5000
```

Swagger API docs:

```txt
http://localhost:5000/api-docs
```

## Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Update `backend/.env`:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/mini-service-board
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=2h
CLIENT_URL=http://localhost:3000
```

## Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Update `frontend/.env.local` if needed:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## MongoDB Setup

Use either a local MongoDB server or MongoDB Atlas.

Local example:

```bash
mongodb://127.0.0.1:27017/mini-service-board
```

Atlas example:

```bash
mongodb+srv://USER:PASSWORD@cluster.mongodb.net/mini-service-board
```

## Seed Sample Data

After configuring `backend/.env`:

```bash
cd backend
npm run seed
```

Demo credentials created by the seed:

```txt
homeowner@example.com / Password123!
tradesperson@example.com / Password123!
```

## Run Tests

```bash
cd backend
npm test
```

Tests cover:

- `GET /api/jobs`
- `POST /api/jobs` validation

## Run Locally

Start the backend:

```bash
cd backend
npm install
npm run dev
```

Start the frontend in another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open:

```txt
http://localhost:3000
```

## API Endpoints

Base URL:

```txt
http://localhost:5000/api
```

Swagger/OpenAPI documentation:

```txt
http://localhost:5000/api-docs
```

OpenAPI JSON:

```txt
http://localhost:5000/openapi.json
```

### Auth

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/auth/register` | Register a user and set auth cookie |
| POST | `/auth/login` | Login and set auth cookie |
| POST | `/auth/logout` | Clear auth cookie |
| GET | `/auth/me` | Get the logged-in user |

Register body:

```json
{
  "name": "Demo User",
  "email": "demo@example.com",
  "password": "Password123!",
  "role": "homeowner"
}
```

### Jobs

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/jobs` | List all jobs |
| GET | `/jobs?category=Plumbing&status=Open&keyword=tap` | Filter/search jobs |
| GET | `/jobs/:id` | Fetch one job |
| POST | `/jobs` | Create a job, homeowner only |
| PUT | `/jobs/:id` | Edit job details, job creator only |
| PATCH | `/jobs/:id` | Update status, assigned tradesperson only |
| POST | `/jobs/:id/requests` | Request a job, tradesperson only |
| PATCH | `/jobs/:id/requests/:requestId` | Accept or decline a tradesperson request, job creator only |
| DELETE | `/jobs/:id` | Delete a job, job creator only |

Create job body:

```json
{
  "title": "Leaking kitchen tap",
  "description": "Kitchen mixer tap is dripping constantly and needs repair.",
  "category": "Plumbing",
  "location": "Colombo 05",
  "contactName": "Amali Perera",
  "contactEmail": "amali@example.com"
}
```

Update status body:

```json
{
  "status": "In Progress"
}
```

Tradesperson request body:

```json
{
  "message": "I can visit tomorrow morning and have plumbing experience."
}
```

Accept or decline request body:

```json
{
  "decision": "accept"
}
```

## Role Workflow

- Homeowners can create service requests.
- Only the homeowner who created a job can edit or delete it.
- Tradespeople can request open jobs.
- A homeowner can review multiple tradesperson requests and confirm one.
- Once confirmed, the job is assigned and moves to `In Progress`.
- Only the assigned tradesperson can update the job status.

## Deployment Notes

### Frontend on Vercel

- Set root directory to `frontend`
- Add environment variable:
  - `NEXT_PUBLIC_API_URL=https://your-backend-url/api`
- Deploy with the default Next.js settings

### Backend on Render or Railway

- Set root directory to `backend`
- Build command: `npm install`
- Start command: `npm start`
- Add environment variables:
  - `NODE_ENV=production`
  - `PORT`
  - `MONGO_URI`
  - `JWT_SECRET`
  - `JWT_EXPIRES_IN=2h`
  - `CLIENT_URL=https://your-frontend-domain`

### MongoDB Atlas

- Create an Atlas cluster
- Create a database user
- Allow your backend host IP or use the provider's recommended access setup
- Use the Atlas connection string as `MONGO_URI`

## Security Notes

- JWT is stored in an HttpOnly cookie instead of localStorage
- Backend accepts credentials through configured CORS origin only
- Password hashes are never returned by the API
- `.env` and `.env.local` are ignored; only example files are committed
