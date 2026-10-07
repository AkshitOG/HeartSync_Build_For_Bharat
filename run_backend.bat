@echo off
echo ========================================================
echo  Starting CareerGPS FastAPI Backend (Port 8000)
echo ========================================================

echo Checking and freeing port 8000 if occupied...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8000') do (
    taskkill /f /pid %%a >nul 2>&1
)

cd /d "%~dp0backend"
python -m uvicorn careergps.main:app --app-dir src --host 127.0.0.1 --port 8000 --reload
pause
