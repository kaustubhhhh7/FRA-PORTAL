@echo off
echo Testing Nginx configuration...

REM Test if Docker is running
docker --version >nul 2>&1
if errorlevel 1 (
    echo Error: Docker is not running
    pause
    exit /b 1
)

REM Test Nginx configuration
echo Testing Nginx configuration syntax...
docker run --rm -v %cd%/nginx.conf:/etc/nginx/nginx.conf:ro nginx:alpine nginx -t

if errorlevel 1 (
    echo Error: Nginx configuration is invalid
    pause
    exit /b 1
)

echo Nginx configuration is valid!
echo.
echo You can now start the services with: start_nginx.bat
echo.
pause 