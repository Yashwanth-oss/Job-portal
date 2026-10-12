@echo off
title JobPortal - Spring Boot Backend
echo ===================================================
echo Starting JobPortal Backend (Spring Boot + MongoDB)
echo ===================================================
cd /d "%~dp0jobportal-backend"
call mvnw.cmd spring-boot:run
pause
