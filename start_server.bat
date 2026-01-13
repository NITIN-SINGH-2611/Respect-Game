@echo off
echo ========================================
echo Respect Game Server
echo ========================================
echo.

echo Checking Python installation...
py --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8+ from https://www.python.org/
    pause
    exit /b 1
)

echo Checking dependencies...
pip show flask >nul 2>&1
if errorlevel 1 (
    echo Installing dependencies...
    pip install -r requirements.txt
    if errorlevel 1 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
)

echo.
echo ========================================
echo Starting Respect Game Server...
echo ========================================
echo.
echo Open your browser and go to: http://localhost:5001
echo.
echo Press Ctrl+C to stop the server
echo.

py server.py

pause
