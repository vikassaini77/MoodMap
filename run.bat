@echo off
echo ===================================================
echo 🚀 Starting MoodMap Development Servers...
echo ===================================================

echo.
echo [1/3] Starting Python ML Engine (Port 8000)...
start "MoodMap ML Engine" cmd /k "cd backend_ml && pip install -r requirements.txt && python -m uvicorn main:app --reload --port 8000"

echo [2/3] Starting Node.js Backend API (Port 5000)...
start "MoodMap Node Backend" cmd /k "cd backend && npm install && npm run dev"

echo [3/3] Starting React Frontend (Port 5173)...
start "MoodMap React Frontend" cmd /k "cd frontend && npm install && npm run dev"

echo.
echo ✅ All services are starting up! 
echo 💻 You will see three new command prompt windows open.
echo 🌐 Your app will be available at: http://localhost:5173
echo.
pause
