@echo off
echo Starting AuraSync without Docker...

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed
    echo Please install Python 3.11+ from https://python.org
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo Error: Node.js is not installed
    echo Please install Node.js 18+ from https://nodejs.org
    pause
    exit /b 1
)

REM Check if Nginx is installed
nginx -v >nul 2>&1
if errorlevel 1 (
    echo Error: Nginx is not installed
    echo Please install Nginx from https://nginx.org
    pause
    exit /b 1
)

echo All prerequisites are installed!
echo.
echo To start services manually:
echo.
echo 1. Start FastAPI Backend:
echo    cd ../backend
echo    pip install -r requirements.txt
echo    python main.py
echo.
echo 2. Start Next.js Frontend (in new terminal):
echo    cd ../aurasync/aurasync-13
echo    npm install
echo    npm run dev
echo.
echo 3. Start Nginx (in new terminal):
echo    nginx -c %cd%/nginx.conf
echo.
pause 