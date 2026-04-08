@echo off
echo Starting Parking Lot Development Servers...
echo.

REM Iniciar Backend en terminal 1
start cmd /k "cd parking-lot-project-backend && npm run dev"

REM Esperar 2 segundos
timeout /t 2 /nobreak

REM Iniciar Frontend en terminal 2
start cmd /k "cd parking-lot-project-frontend && http-server -p 8080"

echo.
echo ========================================
echo Servidores iniciados:
echo - Backend: http://localhost:3000
echo - Frontend: http://localhost:8080
echo ========================================
