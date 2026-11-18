# CivicTrack — Smart Civic Issue Reporting Platform

> **Report Today. Better Tomorrow.**

CivicTrack is a full-stack MERN web application that enables citizens to report local civic issues (potholes, broken streetlights, garbage collection problems, etc.) and track their resolution status in real time. It connects citizens, city departments, and administrators on one unified platform.

---

## Project Objective

- Allow citizens to submit geo-tagged civic issues with photo evidence
- Route issues automatically to the relevant city department
- Provide real-time status tracking and notifications
- Give administrators and department heads a management dashboard
- Promote civic transparency and accountability

---

## Technology Stack

| Layer      | Technology                                  |
|------------|---------------------------------------------|
| Frontend   | React.js, Vite, Tailwind CSS, React Router  |
| Backend    | Node.js, Express.js (ES Modules)            |
| Database   | MongoDB, Mongoose                           |
| Auth       | JWT, bcryptjs                               |
| File Upload| Multer                                      |
| Dev Tools  | Nodemon, dotenv, concurrently               |

---

## Folder Structure

```
CivicTrack/
├── client/                  # React + Vite frontend
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/        # Axios API instance
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   └── vite.config.js
│
├── server/                  # Express.js backend
│   ├── config/
│   │   └── db.js            # MongoDB connection
│   ├── controllers/
│   ├── middleware/
│   │   └── errorMiddleware.js
│   ├── models/
│   ├── routes/
│   │   ├── healthRoutes.js
│   │   ├── authRoutes.js
│   │   ├── issueRoutes.js
│   │   ├── userRoutes.js
│   │   ├── departmentRoutes.js
│   │   └── notificationRoutes.js
│   ├── services/
│   ├── utils/
│   ├── uploads/
│   ├── app.js
│   ├── server.js
│   └── .env.example
│
├── .gitignore
├── package.json             # Root — runs both apps via concurrently
└── README.md
```

---

## Prerequisites

Ensure the following are installed on your machine before proceeding:

- **Node.js** v18 or higher — [https://nodejs.org](https://nodejs.org)
- **npm** v9 or higher (comes with Node.js)
- **MongoDB** — [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (cloud) or local MongoDB installation
- **Git** — [https://git-scm.com](https://git-scm.com)

Verify installations in PowerShell:

```powershell
node -v
npm -v
git --version
```

---

## Installation

### 1. Clone the repository

```powershell
git clone https://github.com/your-username/CivicTrack.git
Set-Location CivicTrack
```

### 2. Install all dependencies (root + client + server)

```powershell
# Install root concurrently tool
npm install

# Install client dependencies
npm install --prefix client

# Install server dependencies
npm install --prefix server
```

---

## Environment Variable Configuration

### Backend — `server/.env`

Copy the example file and fill in your values:

```powershell
Copy-Item server\.env.example server\.env
```

Open `server/.env` and configure:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_strong_secret_key
CLIENT_URL=http://localhost:5173
```

### Frontend — `client/.env`

```powershell
Copy-Item client\.env.example client\.env
```

The default value works for local development:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## MongoDB Setup

### Option A — MongoDB Atlas (Recommended)

1. Go to [https://cloud.mongodb.com](https://cloud.mongodb.com) and sign in
2. Create a free cluster
3. Under **Database Access**, create a user with a password
4. Under **Network Access**, add your IP address (or `0.0.0.0/0` for development)
5. Click **Connect** → **Drivers** → copy the connection string
6. Replace `<password>` with your actual password
7. Paste the full URI into `server/.env` as `MONGODB_URI`

Example connection string:
```
MONGODB_URI=mongodb+srv://username:password@cluster0.abc123.mongodb.net/civictrack?retryWrites=true&w=majority
```

### Option B — Local MongoDB

```env
MONGODB_URI=mongodb://localhost:27017/civictrack
```

---

## Running the Project

### Start both frontend and backend simultaneously

```powershell
npm run dev
```

This uses `concurrently` to start both servers at once.

### Start only the backend

```powershell
npm run server
```

Backend runs at: **http://localhost:5000**

### Start only the frontend

```powershell
npm run client
```

Frontend runs at: **http://localhost:5173**

---

## API Health Check

Once the backend is running, verify it in your browser or PowerShell:

**Browser:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

**PowerShell:**
```powershell
Invoke-RestMethod -Uri http://localhost:5000/api/health -Method GET
```

**Expected response (MongoDB connected):**
```json
{
  "success": true,
  "message": "CivicTrack API is running",
  "database": "connected",
  "environment": "development",
  "timestamp": "2026-10-31T12:00:00.000Z"
}
```

**If MongoDB is not yet connected:**
```json
{
  "success": true,
  "message": "CivicTrack API is running",
  "database": "disconnected",
  ...
}
```

---

## Available API Routes (Foundation Phase)

| Method | Endpoint       | Status      | Description              |
|--------|----------------|-------------|--------------------------|
| GET    | /api/health    | ✅ Active   | API & DB health check    |
| POST   | /api/auth/*    | 🔜 Planned  | Auth (register, login)   |
| GET    | /api/issues    | 🔜 Planned  | Issue management         |
| GET    | /api/users     | 🔜 Planned  | User management          |
| GET    | /api/departments | 🔜 Planned | Department management   |
| GET    | /api/notifications | 🔜 Planned | Notifications          |

---

## Git Workflow

```powershell
git init
git add .
git commit -m "chore: initial MERN stack setup for CivicTrack"
git remote add origin https://github.com/your-username/CivicTrack.git
git push -u origin main
```

---

## License

This project is for academic/portfolio purposes.
