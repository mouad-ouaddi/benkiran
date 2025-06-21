@echo off
echo Starting Gym Management System...
echo.

echo Starting Laravel Backend Server...
start "Laravel Backend" cmd /k "cd /d c:\Users\DELL\OneDrive\Desktop\gym_project\gym_backend && php artisan serve"

echo Waiting for backend to start...
timeout /t 3 /nobreak >nul

echo Starting React Frontend Server...
start "React Frontend" cmd /k "cd /d c:\Users\DELL\OneDrive\Desktop\gym_project\my-react-app && npm start"

echo.
echo Both servers are starting...
echo Backend: http://127.0.0.1:8000
echo Frontend: http://localhost:3000
echo.
echo Press any key to close this window...
pause >nul
