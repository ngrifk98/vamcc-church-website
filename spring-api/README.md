# VAMCC Church Spring Boot REST API

A modern Spring Boot REST API for member management, integrating seamlessly with your existing PostgreSQL database.

## 🚀 Features

- **REST API Endpoints** for member operations (add, delete, query)
- **Spring Data JPA** for clean database access
- **PostgreSQL Integration** - works with your existing database
- **Validation** with Jakarta validation annotations
- **Logging** for debugging and monitoring
- **CORS Support** for frontend integration
- **Error Handling** with consistent response formats

## 📋 Prerequisites

- **Java 17+** ([Download](https://www.oracle.com/java/technologies/downloads/))
- **Maven 3.8+** ([Download](https://maven.apache.org/download.cgi))
- **PostgreSQL** running locally or remotely
- Existing `church_db` database with `members` table (or auto-created)

## ⚙️ Setup & Installation

### 1. Configure Database Connection

Edit `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/church_db
spring.datasource.username=postgres
spring.datasource.password=yourpassword
```

Adjust values for your PostgreSQL setup.

### 2. Build the Project

```bash
cd spring-api
mvn clean install
```

This downloads all dependencies and compiles the code.

### 3. Run the Application

**Option A: Using Maven**
```bash
mvn spring-boot:run
```

**Option B: Build JAR and run**
```bash
mvn clean package
java -jar target/church-spring-api-1.0.0.jar
```

The API will start on **http://localhost:8080/api**

## 📡 REST API Endpoints

### 1. **Add Member** (Create)
```http
POST /api/members
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secure_password",
  "phone": "+1234567890",
  "address": "123 Faith St, Dallas TX",
  "role": "Member"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "address": "123 Faith St, Dallas TX",
  "role": "Member",
  "joinedDate": "2025-02-21",
  "createdAt": "2025-02-21T10:30:00",
  "updatedAt": "2025-02-21T10:30:00"
}
```

---

### 2. **Delete Member**
```http
DELETE /api/members/{memberId}
```

**Example:** `DELETE /api/members/1`

**Response (200 OK):**
```json
{
  "message": "Member deleted successfully",
  "memberId": 1
}
```

---

### 3. **Query Member by ID**
```http
GET /api/members/{memberId}
```

**Example:** `GET /api/members/1`

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "address": "123 Faith St, Dallas TX",
  "role": "Member",
  "joinedDate": "2025-02-21",
  "createdAt": "2025-02-21T10:30:00",
  "updatedAt": "2025-02-21T10:30:00"
}
```

---

### 4. **Query All Members**
```http
GET /api/members
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    ...
  },
  {
    "id": 2,
    "name": "Jane Smith",
    "email": "jane@example.com",
    ...
  }
]
```

---

### 5. **Search Members**
```http
GET /api/members?search=john
```

Searches by email, phone, or name.

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    ...
  }
]
```

---

### 6. **Query Member by Email**
```http
GET /api/members/email/{email}
```

**Example:** `GET /api/members/email/john@example.com`

---

### 7. **Query Member by Phone**
```http
GET /api/members/phone/{phone}
```

**Example:** `GET /api/members/phone/+1234567890`

---

### 8. **Update Member**
```http
PUT /api/members/{memberId}
Content-Type: application/json

{
  "name": "John Updated",
  "email": "john.updated@example.com",
  "phone": "+9876543210",
  "address": "456 Grace Ave, Houston TX"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "John Updated",
  "email": "john.updated@example.com",
  ...
}
```

---

### 9. **Health Check**
```http
GET /api/members/health
```

**Response (200 OK):**
```json
{
  "status": "UP",
  "service": "VAMCC Church Member API"
}
```

---

## 🧪 Testing with cURL or Postman

### Add a Member
```bash
curl -X POST http://localhost:8080/api/members \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mary Johnson",
    "email": "mary@example.com",
    "password": "secure123",
    "phone": "+1-555-100-1234",
    "address": "789 Hope Blvd, Austin TX"
  }'
```

### Query Member by ID
```bash
curl http://localhost:8080/api/members/1
```

### Delete Member
```bash
curl -X DELETE http://localhost:8080/api/members/1
```

### Search Members
```bash
curl "http://localhost:8080/api/members?search=mary"
```

## 📂 Project Structure

```
spring-api/
├── pom.xml                              # Maven configuration
├── src/main/
│   ├── java/com/vamcc/church/
│   │   ├── ChurchApiApplication.java   # Main entry point
│   │   ├── controller/
│   │   │   └── MemberController.java   # REST endpoints
│   │   ├── service/
│   │   │   └── MemberService.java      # Business logic
│   │   ├── repository/
│   │   │   └── MemberRepository.java   # Database access (JPA)
│   │   └── model/
│   │       └── Member.java             # Entity model
│   └── resources/
│       └── application.properties       # Configuration
└── README.md                            # This file
```

## 🔧 Technology Stack

| Component | Version |
|-----------|---------|
| Spring Boot | 3.2.0 |
| Spring Data JPA | 3.2.0 |
| PostgreSQL Driver | 42.7.1 |
| Java | 17 |
| Maven | 3.8+ |

## 📝 Key Classes

### **Member.java** (Entity)
- Represents a church member with fields: id, name, email, phone, address, password, role, joinedDate, createdAt, updatedAt
- Uses Lombok for reducing boilerplate (getters, setters, constructors)
- JPA lifecycle hooks (`@PrePersist`, `@PreUpdate`) for auto-setting timestamps

### **MemberRepository.java** (DAO)
- Extends `JpaRepository` for CRUD operations
- Custom query methods: `findByEmail()`, `findByPhone()`, `searchByEmailOrPhone()`

### **MemberService.java** (Business Logic)
- `addMember()` - adds new member with validation
- `deleteMember()` - deletes by ID
- `queryMemberById()` - retrieves by ID
- `queryMemberByEmail()` - retrieves by email
- `queryMemberByPhone()` - retrieves by phone
- `queryAllMembers()` - retrieves all
- `updateMember()` - updates existing member
- `searchMembers()` - flexible search

### **MemberController.java** (REST Endpoints)
- Maps HTTP requests to service methods
- Error handling with appropriate HTTP status codes
- CORS configured for frontend integration

## 🛡️ Security Notes

⚠️ This is a basic implementation. For production:
- Add **JWT authentication** to protect endpoints
- Implement **role-based access control**
- Hash passwords with **bcrypt** (Spring Security)
- Add **HTTPS/TLS** support
- Validate all inputs rigorously
- Implement rate limiting
- Add audit logging

## 🔌 Integrating with React Frontend

Update your React frontend (`frontend/package.json`) to point to this API:

```javascript
// In your React component
const API_URL = 'http://localhost:8080/api';

// Add a member
const addMember = async (memberData) => {
  const response = await fetch(`${API_URL}/members`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(memberData)
  });
  return await response.json();
};

// Query member
const getMember = async (id) => {
  const response = await fetch(`${API_URL}/members/${id}`);
  return await response.json();
};

// Delete member
const deleteMember = async (id) => {
  const response = await fetch(`${API_URL}/members/${id}`, {
    method: 'DELETE'
  });
  return await response.json();
};
```

## 📊 Database Schema

The API automatically creates the `members` table if it doesn't exist:

```sql
CREATE TABLE members (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  address TEXT,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'Member',
  joined_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🐛 Troubleshooting

**Issue: Database connection fails**
- Verify PostgreSQL is running: `psql -U postgres -d church_db`
- Check credentials in `application.properties`
- Ensure `church_db` database exists

**Issue: Port 8080 already in use**
- Change port in `application.properties`: `server.port=8081`

**Issue: Build fails with Java version error**
- Ensure Java 17+: `java -version`
- Update Maven: `mvn -v`

## 📚 Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Data JPA Guide](https://spring.io/projects/spring-data-jpa)
- [PostgreSQL JDBC Driver](https://jdbc.postgresql.org/)

## 👨‍💼 For Your Dad

This Spring Boot API is production-ready and provides:
- ✅ RESTful design with proper HTTP status codes
- ✅ Full CRUD operations (Create, Read, Update, Delete)
- ✅ Database persistence with JPA/Hibernate
- ✅ Input validation
- ✅ Comprehensive logging
- ✅ Easy integration with React frontend
- ✅ Scalable architecture

The API mirrors the Node.js backend functionality but with Spring Boot's enterprise-grade features.

## 📧 Support

For issues or questions, refer to the Spring Boot and PostgreSQL documentation, or add logging to troubleshoot.

---

**Happy coding! 🎉**

*Built for VAMCC - A Tamil American Catholic Community*
