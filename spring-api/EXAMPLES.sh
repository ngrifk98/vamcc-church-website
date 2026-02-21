# API Testing Examples
# Use with cURL or Postman

# ============================================================
# 1. ADD MEMBER (POST)
# ============================================================

curl -X POST http://localhost:8080/api/members \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "secure_password_123",
    "phone": "+1-555-123-4567",
    "address": "123 Faith Street, Dallas TX 75001",
    "role": "Member"
  }'

# ============================================================
# 2. GET ALL MEMBERS (GET)
# ============================================================

curl http://localhost:8080/api/members

# ============================================================
# 3. GET MEMBER BY ID (GET)
# ============================================================

curl http://localhost:8080/api/members/1

# ============================================================
# 4. SEARCH MEMBERS BY EMAIL OR PHONE (GET)
# ============================================================

curl "http://localhost:8080/api/members?search=john@example.com"

curl "http://localhost:8080/api/members?search=555"

# ============================================================
# 5. GET MEMBER BY EMAIL (GET)
# ============================================================

curl "http://localhost:8080/api/members/email/john@example.com"

# ============================================================
# 6. GET MEMBER BY PHONE (GET)
# ============================================================

curl "http://localhost:8080/api/members/phone/%2B1-555-123-4567"

# ============================================================
# 7. UPDATE MEMBER (PUT)
# ============================================================

curl -X PUT http://localhost:8080/api/members/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Updated",
    "email": "john.updated@example.com",
    "phone": "+1-555-999-8888",
    "address": "456 Hope Avenue, Houston TX 77002"
  }'

# ============================================================
# 8. DELETE MEMBER (DELETE)
# ============================================================

curl -X DELETE http://localhost:8080/api/members/1

# ============================================================
# 9. HEALTH CHECK (GET)
# ============================================================

curl http://localhost:8080/api/members/health

# ============================================================
# NOTES
# ============================================================
# - Replace member IDs and emails with actual values
# - Use %2B for + sign in URLs (URL encoding)
# - Status codes:
#   200 OK - Request successful
#   201 Created - Member added
#   404 Not Found - Member not found
#   409 Conflict - Email/phone already exists
#   400 Bad Request - Invalid input
#   500 Internal Server Error - Server error
