#!/bin/bash

# ============================================================
# VAMCC Church Spring Boot API - Quick Start Script
# ============================================================

set -e

echo "🚀 VAMCC Church Spring Boot API Setup"
echo "========================================"

# Check Java version
echo "✓ Checking Java installation..."
if ! command -v java &> /dev/null; then
    echo "❌ Java is not installed. Please install Java 17 or higher."
    echo "   Download from: https://www.oracle.com/java/technologies/downloads/"
    exit 1
fi

JAVA_VERSION=$(java -version 2>&1 | head -1)
echo "✓ Found: $JAVA_VERSION"

# Check Maven
echo "✓ Checking Maven installation..."
if ! command -v mvn &> /dev/null; then
    echo "❌ Maven is not installed. Please install Maven 3.8 or higher."
    echo "   Download from: https://maven.apache.org/download.cgi"
    exit 1
fi

MVN_VERSION=$(mvn -v | head -1)
echo "✓ Found: $MVN_VERSION"

# Check PostgreSQL connection
echo "✓ Checking PostgreSQL connection..."
DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-5432}
DB_NAME=${DB_NAME:-church_db}
DB_USER=${DB_USER:-postgres}

if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL client not found, skipping connection check"
else
    if psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -c "\dt" > /dev/null 2>&1; then
        echo "✓ PostgreSQL connection successful"
    else
        echo "⚠️  Could not connect to PostgreSQL"
        echo "   Make sure PostgreSQL is running at $DB_HOST:$DB_PORT"
    fi
fi

# Build the project
echo ""
echo "📦 Building the project..."
mvn clean install

# Show success message
echo ""
echo "✅ Build completed successfully!"
echo ""
echo "🎯 Ready to run! Choose one of the following:"
echo ""
echo "  Option 1 (Maven):"
echo "    mvn spring-boot:run"
echo ""
echo "  Option 2 (JAR):"
echo "    java -jar target/church-spring-api-1.0.0.jar"
echo ""
echo "📡 API will be available at: http://localhost:8080/api"
echo ""
echo "📝 Configuration:"
echo "   - Database: $DB_HOST:$DB_PORT/$DB_NAME"
echo "   - User: $DB_USER"
echo ""
echo "💡 Edit src/main/resources/application.properties to change settings"
echo ""
