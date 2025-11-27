# Architecture & Technology Stack

## 🏗️ Architecture Overview

### High-Level Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                        Client Browser                        │
└─────────────────┬───────────────────────────────────────────┘
                  │ HTTPS
                  ▼
┌─────────────────────────────────────────────────────────────┐
│                    React Frontend                            │
│              (Components, Pages, Routing)                    │
│              (JWT Token Management)                          │
│              (REST API Client - Axios)                       │
└─────────────────┬───────────────────────────────────────────┘
                  │ REST API (JSON)
                  ▼
┌─────────────────────────────────────────────────────────────┐
│                  Spring Boot Backend                         │
│         (REST Controllers, Services, Repositories)           │
│         (JWT Authentication & Authorization)                │
│         (Role-Based Access Control)                         │
│         (Error Handling, Validation)                        │
└─────────────────┬───────────────────────────────────────────┘
                  │ JDBC
                  ▼
┌─────────────────────────────────────────────────────────────┐
│                    MySQL Database                            │
│           (Users Table, Projects Table)                      │
│           (Indexes, Full-Text Search)                       │
│           (Foreign Keys, Constraints)                       │
└─────────────────────────────────────────────────────────────┘
```

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18.2.0
- **Routing**: React Router DOM 6.x
- **HTTP Client**: Axios
- **Styling**: CSS3
- **Node.js**: 18 LTS
- **Package Manager**: npm

### Backend
- **Framework**: Spring Boot 3.1.5
- **Java Version**: 17
- **Web**: Spring Web MVC
- **Database**: JPA/Hibernate + Spring Data JPA
- **Authentication**: Spring Security + JWT (JJWT)
- **Validation**: Spring Validation
- **Database Driver**: MySQL Connector/J 8.1.0
- **Build Tool**: Maven 3.9

### Database
- **DBMS**: MySQL 8.0
- **Engine**: InnoDB
- **Storage**: Persistent Volume (Kubernetes)
- **Backup**: Binary logs

### DevOps & Infrastructure
- **Containerization**: Docker
- **Container Orchestration**: Kubernetes
- **CI/CD**: GitHub Actions
- **Infrastructure Automation**: Ansible
- **Container Registry**: Docker Hub

## 🔄 Data Flow

### Authentication Flow
```
1. User submits login form
   ↓
2. React sends POST /api/auth/login
   ↓
3. Backend validates credentials against MySQL
   ↓
4. Backend generates JWT token
   ↓
5. Frontend stores token in localStorage
   ↓
6. Frontend includes token in all subsequent requests
   ↓
7. Backend validates token via JwtAuthenticationFilter
```

### CRUD Operation Flow (Create Project Example)
```
1. Admin clicks "Add New Project"
   ↓
2. React shows form modal
   ↓
3. Admin submits form
   ↓
4. React sends POST /api/projects with JWT token
   ↓
5. Backend receives request
   ↓
6. JwtAuthenticationFilter validates token
   ↓
7. SecurityConfig checks if user is ADMIN
   ↓
8. ProjectController calls ProjectService
   ↓
9. ProjectService retrieves current user and creates Project
   ↓
10. ProjectRepository saves to MySQL database
    ↓
11. Backend returns saved project DTO
    ↓
12. React updates UI with new project
```

## 🔐 Security Implementation

### Authentication
- **Method**: JWT (JSON Web Tokens)
- **Secret Key**: 256-bit random key (configurable)
- **Expiration**: 24 hours (86400000 milliseconds)
- **Format**: Bearer token in Authorization header

### Authorization
- **Type**: Role-Based Access Control (RBAC)
- **Roles**: ADMIN, USER
- **Default Users**:
  - admin: ADMIN role
  - user: USER role

### Password Security
- **Algorithm**: BCrypt
- **Rounds**: Default 10
- **Never Stored**: Plain text passwords

### Validation
- **Input Validation**: Spring Validation
- **SQL Injection Prevention**: JPA Parameterized Queries
- **CORS Configuration**: Allowed origins, methods, headers
- **HTTPS Ready**: Compatible with SSL/TLS

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL (BCrypt),
  email VARCHAR(255) NOT NULL,
  role ENUM('ADMIN', 'USER') DEFAULT 'USER',
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Projects Table
```sql
CREATE TABLE projects (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL (FK → users.id),
  title VARCHAR(255) NOT NULL,
  description LONGTEXT NOT NULL,
  technologies LONGTEXT,
  link VARCHAR(500),
  created_at BIGINT NOT NULL,
  updated_at BIGINT NOT NULL,
  FULLTEXT INDEX ft_search (title, description)
);
```

## 📈 Performance Considerations

### Database Optimization
- **Indexes**: username, email, user_id for fast lookups
- **Full-Text Search**: title and description for search
- **Connection Pooling**: HikariCP (default in Spring Boot)
- **Query Optimization**: Select only needed fields

### Backend Optimization
- **Caching**: Ready for Redis integration
- **Lazy Loading**: JPA fetch strategy optimized
- **Resource Limits**: Configured in Kubernetes
- **Compression**: Gzip enabled by default

### Frontend Optimization
- **Bundle Size**: React and dependencies optimized
- **Code Splitting**: Ready for lazy loading routes
- **Asset Caching**: Service worker ready
- **API Calls**: Batched with axios

### Kubernetes Optimization
- **CPU Throttling**: Prevents runaway processes
- **Memory Limits**: Prevents OOM errors
- **Auto-scaling**: HPA based on metrics
- **Resource Requests**: Ensures proper node allocation

## 🔄 Deployment Workflow

### Development → Docker Compose
```
Code Changes
    ↓
docker-compose up
    ↓
Local Testing
    ↓
All Services Running
```

### GitHub Push → Docker Hub
```
git push origin main
    ↓
GitHub Actions triggered
    ↓
Build Docker images
    ↓
Run tests
    ↓
Push to Docker Hub
    ↓
Images available for deployment
```

### Deployment → Kubernetes
```
kubectl apply -f kubernetes/
    ↓
ConfigMaps & Secrets created
    ↓
MySQL pod started
    ↓
Backend pod started
    ↓
Frontend pod started
    ↓
HPA configured
    ↓
Services exposed
    ↓
Application running
```

## 🧪 Testing Strategy

### Backend Testing
- **Unit Tests**: DAO, Service layer tests
- **Integration Tests**: Controller, Database tests
- **Test Framework**: JUnit 5 + Mockito
- **Coverage**: Aim for 80%+

### Frontend Testing
- **Unit Tests**: Component, utility function tests
- **Integration Tests**: Page and flow tests
- **Test Framework**: Jest + React Testing Library
- **E2E Tests**: Cypress (can be added)

### API Testing
- **Manual**: cURL, Postman
- **Automated**: GitHub Actions (build job)
- **Load Testing**: Can add Locust/Apache JMeter

## 🚀 Scalability Strategy

### Horizontal Scaling
- **Frontend**: Stateless, scales 2-4 replicas
- **Backend**: Stateless (JWT), scales 2-5 replicas
- **Database**: Single instance (use managed for HA)

### Load Balancing
- **Kubernetes Services**: Internal load balancing
- **External LB**: Cloud provider load balancer
- **Session Affinity**: Not needed (stateless)

### Caching Strategy
- **Frontend**: Browser cache, local storage
- **Backend**: Redis for sessions (if needed)
- **Database**: Query result caching (ready)

## 📚 API Endpoint Reference

### Authentication Endpoints
```
POST   /api/auth/login              Login and get JWT token
```

### Project Endpoints
```
GET    /api/projects                Get all projects (public)
GET    /api/projects/my-projects    Get current user's projects
GET    /api/projects/{id}           Get project details
POST   /api/projects                Create new project (ADMIN)
PUT    /api/projects/{id}           Update project
DELETE /api/projects/{id}           Delete project
```

## 🔗 Integration Points

### External Services (Ready for Integration)
- **Email**: SMTP for notifications
- **Storage**: S3 for file uploads
- **Analytics**: Google Analytics
- **Monitoring**: Prometheus, Grafana
- **Logging**: ELK Stack, Splunk
- **CDN**: CloudFront, Cloudflare

### Payment Integration (Future)
- **Stripe**: For subscription management
- **PayPal**: Alternative payment method

## 📋 Compliance & Standards

### Security Standards
- **OWASP Top 10**: Mitigated
- **JWT Standard**: RFC 7519
- **REST API**: RESTful principles
- **HTTP Status Codes**: Standard codes used

### Code Standards
- **Java**: Google Java Style Guide
- **JavaScript**: Airbnb style guide
- **SQL**: Consistent naming conventions

## 🎯 Key Features Summary

✅ JWT-based authentication
✅ Role-based access control
✅ Full CRUD operations
✅ Multi-tier architecture
✅ Database persistence
✅ Docker containerization
✅ Kubernetes orchestration
✅ CI/CD pipeline (GitHub Actions)
✅ Infrastructure as Code (Ansible)
✅ Auto-scaling (HPA)
✅ Load balancing
✅ Health checks
✅ Error handling
✅ Input validation
✅ CORS configuration

---

**This comprehensive stack provides a production-ready full-stack application!**
