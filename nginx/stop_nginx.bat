@echo off
echo Stopping AuraSync services...

REM Stop and remove containers
docker-compose down

echo.
echo Services stopped successfully!
echo.
pause 