@REM ==================================================
@REM  Maven Wrapper Batch Script, v3.2.0
@REM ==================================================

@setlocal

set DIRNAME=%~dp0
if "%DIRNAME%"=="" set DIRNAME=.
@setlocal enabledelayedexpansion

set WRAPPERDIR=%DIRNAME%.mvn\wrapper

if not exist "%WRAPPERDIR%\maven-wrapper.jar" (
    echo Downloading maven wrapper...
    if not exist "%WRAPPERDIR%" mkdir "%WRAPPERDIR%"
    powershell -Command "& {(New-Object Net.WebClient).DownloadFile('https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.2.0/maven-wrapper-3.2.0.jar', '%WRAPPERDIR%\maven-wrapper.jar')}"
)

set MAVEN_HOME=%WRAPPERDIR%\apache-maven-3.9.6
if not exist "%MAVEN_HOME%\bin\mvn.cmd" (
    echo Downloading Maven 3.9.6...
    if not exist "%WRAPPERDIR%\dist" mkdir "%WRAPPERDIR%\dist"
    powershell -Command "& {(New-Object Net.WebClient).DownloadFile('https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/3.9.6/apache-maven-3.9.6-bin.zip', '%WRAPPERDIR%\dist\maven.zip'); Add-Type -Assembly System.IO.Compression.FileSystem; [System.IO.Compression.ZipFile]::ExtractToDirectory('%WRAPPERDIR%\dist\maven.zip', '%WRAPPERDIR%'); move '%WRAPPERDIR%\apache-maven-3.9.6' '%MAVEN_HOME%' -Force; Remove-Item '%WRAPPERDIR%\dist' -Recurse}"
)

set JAVA_HOME=C:\Program Files\Java\jdk-25.0.2
set MAVEN_CMD=%MAVEN_HOME%\bin\mvn.cmd

if not exist "%JAVA_HOME%\bin\java.exe" (
    echo Java not found at %JAVA_HOME%
    echo Please install Java 17+ or update JAVA_HOME in this script
    exit /b 1
)

"%MAVEN_CMD%" %*
