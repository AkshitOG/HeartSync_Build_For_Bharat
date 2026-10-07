@echo off
echo ========================================================
echo  Launching CareerGPS Full-Stack SaaS Platform
echo  Backend:  http://127.0.0.1:8000
echo  Frontend: http://localhost:3000
echo ========================================================

echo Freeing port 8000 if previously occupied...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8000') do (
    taskkill /f /pid %%a >nul 2>&1
)

start "CareerGPS Backend" cmd /k "cd /d %~dp0backend && python -m uvicorn careergps.main:app --app-dir src --host 127.0.0.1 --port 8000 --reload"
timeout /t 3 /nobreak >nul
start "CareerGPS Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo CareerGPS processes spawned in separate windows.
echo Open http://localhost:3000 in your browser.
echo.
pause
