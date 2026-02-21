#!/usr/bin/env pwsh
# VAMCC Church Spring Boot API - Quick Start (PowerShell)

Write-Host "🚀 VAMCC Church Spring Boot API Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Set Java path
$JAVA_HOME = "C:\Program Files\Java\jdk-25.0.2"
$env:JAVA_HOME = $JAVA_HOME

Write-Host "✓ Java Home: $JAVA_HOME" -ForegroundColor Green
Write-Host "✓ Java Version:" -ForegroundColor Green
& "$JAVA_HOME\bin\java.exe" --version
Write-Host ""

# Get the Maven wrapper script location
$MAVEN_WRAPPER = Join-Path $PSScriptRoot "mvnw.cmd"

if (Test-Path $MAVEN_WRAPPER) {
    Write-Host "📦 Building the project with Maven Wrapper..." -ForegroundColor Cyan
    Write-Host ""
    
    # Run the build
    & $MAVEN_WRAPPER clean install
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Build completed successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "🎯 To run the API, execute:" -ForegroundColor Cyan
        Write-Host "   $MAVEN_WRAPPER spring-boot:run" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "📡 API will be available at: http://localhost:8080/api" -ForegroundColor Yellow
    } else {
        Write-Host "❌ Build failed" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "❌ Maven wrapper not found" -ForegroundColor Red
    exit 1
}
