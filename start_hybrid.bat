@echo off
echo 🚀 Starting Hybrid AI Agent Platform...

echo.
echo [1/2] Starting Python AI Engine (Port 5001)...
start "AI Engine (Flask+Agno)" cmd /k "cd backend\ai_engine && python app.py"

echo.
echo [2/2] Starting Node.js Backend (Port 5000)...
start "Node.js Backend" cmd /k "cd backend && npm run dev"

echo.
echo ✅ Services starting...
echo    - AI Engine: http://localhost:5001
echo    - Main API:  http://localhost:5000
echo.
echo Don't forget to set GEMINI_API_KEY in backend\ai_engine\.env !
