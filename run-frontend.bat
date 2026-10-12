@echo off
title JobPortal - React Frontend
echo ===================================================
echo Starting JobPortal Frontend (Vite + React)
echo ===================================================
cd /d "%~dp0jobportal-frontend"
call npm run dev
pause
