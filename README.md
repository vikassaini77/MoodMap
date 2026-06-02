# MoodMap 🧠✨

MoodMap is an intelligent, AI-powered mental wellness and journaling platform designed to help students track their emotional health, receive personalized insights, and get empathetic support. 

By combining a modern React frontend, a Node.js API, and a robust Machine Learning engine (Python/FastAPI), MoodMap offers proactive wellness check-ins, journal sentiment analysis, burnout risk detection, and dynamic emotional forecasting.

---

## 🏗️ Architecture & Tech Stack

The application is divided into three main microservices:

1. **Frontend (`/frontend`)**
   - **Framework:** React 18, Vite, TypeScript
   - **Styling:** Tailwind CSS, Lucide Icons
   - **Features:** Interactive journaling, Mood Arcade, AI Companion Chat, Sanctuary space.

2. **Backend API (`/backend`)**
   - **Framework:** Node.js, Express.js
   - **Database:** PostgreSQL (using `pg`)
   - **AI Integration:** Google Gemini API (`@google/generative-ai`) for generative companion responses and council debates.
   - **Features:** JWT Authentication, cron jobs for proactive notifications, database management.

3. **Machine Learning Engine (`/backend_ml`)**
   - **Framework:** Python, FastAPI, Uvicorn
   - **Libraries:** Scikit-Learn, Pandas, NumPy
   - **Features:** Random Forest burnout classification, KMeans clustering for emotional "seasons", sentiment analysis, and anomaly detection.

---

## 📁 Project Structure

```text
MoodMap/
├── backend/                  # Node.js Express API
│   ├── src/                  # Source code (server.js, db.js, ai.js, mlClient.js)
│   ├── Dockerfile            # Container configuration
│   └── package.json          
├── backend_ml/               # Python FastAPI ML Engine
│   ├── main.py               # ML pipelines and API endpoints
│   ├── requirements.txt      # Python dependencies
│   └── Dockerfile            # Container configuration
├── frontend/                 # React UI
│   ├── src/                  # React components, contexts, and API clients
│   ├── nginx.conf            # Production Nginx reverse proxy configuration
│   ├── vite.config.ts        # Vite configuration (with local API proxy)
│   ├── Dockerfile            # Container configuration
│   └── package.json          
└── docker-compose.yml        # Orchestrates the entire application stack
```

---

## 🚀 Getting Started (Production / Docker)

The easiest way to run the entire MoodMap suite is via Docker Compose. This will automatically spin up the frontend, backend, ML engine, and a PostgreSQL database.

### 1. Prerequisites
- [Docker](https://www.docker.com/get-started) and Docker Compose installed.

### 2. Environment Variables
Create a `.env` file in the `backend/` directory (or export them in your terminal) with the following required keys:

```env
# backend/.env
PORT=5000
JWT_SECRET=your_super_secure_jwt_secret_here
GEMINI_API_KEY=your_google_gemini_api_key_here
```

### 3. Build and Run
From the root directory of the project, run:

```bash
docker compose up --build -d
```

### 4. Access the App
- **Frontend App:** `http://localhost` (Served via Nginx)
- **Node.js API:** `http://localhost:5000/api/health`
- **ML Engine Docs:** `http://localhost:8000/docs` (Swagger UI for FastAPI)

> **Note:** Nginx automatically proxies any requests sent to `http://localhost/api/*` to the Node.js backend.

---

## 💻 Local Development

If you wish to run the services individually for development without Docker, follow these steps:

### 1. Setup PostgreSQL
Ensure you have a local PostgreSQL instance running. Create a database named `moodmap` and note the connection URL.

### 2. Start the Machine Learning Engine
```bash
cd backend_ml
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 3. Start the Node.js Backend
```bash
cd backend
npm install
```
Create a `.env` file in the `backend/` folder:
```env
PORT=5000
DATABASE_URL=postgres://your_user:your_password@localhost:5432/moodmap
ML_SERVER_URL=http://127.0.0.1:8000
GEMINI_API_KEY=your_google_gemini_api_key_here
JWT_SECRET=development_secret
```
Then run:
```bash
npm run dev
```

### 4. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```
The Vite development server runs on `http://localhost:5173`. It is configured to automatically proxy `/api` requests to your local Node.js server.

---

## 🧪 Features & ML Capabilities

- **Burnout Risk Detection:** Analyzes sleep, energy, and sentiment to classify burnout risk (Low, Medium, High).
- **Proactive Check-ins:** A cron job regularly checks user activity and dispatches gentle reminders to take breaks.
- **Companion Council:** Users can ask for advice and receive a synthesized action plan debated by 3 distinct AI companion personalities (Fox, Panda, Otter) powered by Gemini.
- **Emotional DNA:** Uses KMeans clustering to determine a user's sensitivity to sleep, academic stress, and social energy.

---

## 🛡️ License

This project is proprietary and intended for personal/educational demonstration. All rights reserved.
