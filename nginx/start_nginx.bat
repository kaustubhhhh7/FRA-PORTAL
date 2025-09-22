@echo off
echo Starting AuraSync with Nginx...

REM Check if Docker is running
docker --version >nul 2>&1
if errorlevel 1 (
    echo Error: Docker is not installed or not running
    pause
    exit /b 1
)

REM Create necessary directories
if not exist "logs" mkdir logs
if not exist "static" mkdir static
if not exist "uploads" mkdir uploads

REM Build and start services
echo Building and starting services...
docker-compose up --build -d

echo.
echo Services started successfully!
echo.
echo Access your application at:
echo - Frontend: http://localhost
echo - API Documentation: http://localhost/docs
echo - Health Check: http://localhost/health
echo.
echo To view logs: docker-compose logs -f
echo To stop services: docker-compose down
echo.
pause 