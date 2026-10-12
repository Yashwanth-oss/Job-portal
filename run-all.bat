@echo off
title JobPortal - Unified Launcher
echo =========================================================
echo       Starting JobPortal Full-Stack Application
echo =========================================================
echo 1. Launching Spring Boot Backend (Port 8080)...
start "JobPortal Backend" cmd /k "cd /d "%~dp0jobportal-backend" && mvnw.cmd spring-boot:run"
echo 2. Launching Vite React Frontend (Port 5173)...
start "JobPortal Frontend" cmd /k "cd /d "%~dp0jobportal-frontend" && npm run dev"
echo.
echo Both servers are launching in separate windows!
echo Backend API:  http://localhost:8080/api/jobs
echo Frontend UI:   http://localhost:5173/
echo.
pause
