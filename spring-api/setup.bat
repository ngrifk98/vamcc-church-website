@echo off
REM ============================================================
REM VAMCC Church Spring Boot API - Quick Start Script (Windows)
REM ============================================================

echo.
echo 🚀 VAMCC Church Spring Boot API Setup
echo ========================================
echo.

REM Check Java
echo ✓ Checking Java installation...
java -version >nul 2>&1
if errorlevel 1 (
    echo ❌ Java is not installed. Please install Java 17 or higher.
    echo    Download from: https://www.oracle.com/java/technologies/downloads/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('java -version 2^>^&1') do (
    echo ✓ Found: %%i
    goto :java_ok
)

:java_ok

REM Check Maven
echo ✓ Checking Maven installation...
mvn -version >nul 2>&1
if errorlevel 1 (
    echo ❌ Maven is not installed. Please install Maven 3.8 or higher.
    echo    Download from: https://maven.apache.org/download.cgi
    pause
    exit /b 1
)

echo ✓ Maven found

REM Build
echo.
echo 📦 Building the project...
call mvn clean install
if errorlevel 1 (
    echo ❌ Build failed
    pause
    exit /b 1
)

REM Success message
echo.
echo ✅ Build completed successfully!
echo.
echo 🎯 Ready to run! Choose one of the following:
echo.
echo   Option 1 (Maven):
echo     mvn spring-boot:run
echo.
echo   Option 2 (JAR):
echo     java -jar target\church-spring-api-1.0.0.jar
echo.
echo 📡 API will be available at: http://localhost:8080/api
echo.
echo 📝 Edit src\main\resources\application.properties to change settings
echo.
pause
