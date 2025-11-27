# Personal Portfolio — Projects, Blog & Contact

A professional portfolio platform that helps you showcase your skills, projects, and achievements online. Built with a responsive React frontend and Spring Boot backend, this platform includes project galleries, contact forms, and SEO optimization to boost visibility for hiring managers and clients.

**Key Features:** Project showcase, contact management, secure admin panel, JWT authentication, role-based access control, Docker containerization, Kubernetes deployment, and GitHub Actions CI/CD automation.

**Perfect for:** Job-seekers, freelancers, developers, and consultants wanting to present their work professionally and get discovered by the right audience.

## Project Structure

```
fullstack-portfolio/
├── frontend/                 # React application
│   ├── public/
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── pages/           # Page components
│   │   ├── App.js
│   │   └── index.js
│   ├── Dockerfile           # Frontend Docker image
│   └── package.json
├── backend/                 # Spring Boot application
│   ├── src/main/java/com/portfolio/
│   │   ├── controller/      # REST API endpoints
│   │   ├── service/         # Business logic
│   │   ├── model/           # JPA entities
│   │   ├── repository/      # Data access layer
│   │   ├── dto/             # Data transfer objects
│   │   ├── security/        # JWT & Auth
│   │   └── config/          # Configuration classes
│   ├── pom.xml              # Maven dependencies
│   ├── Dockerfile           # Backend Docker image
│   └── application.properties
├── database/
│   └── schema.sql           # MySQL database schema
├── kubernetes/              # Kubernetes manifests
│   ├── config.yaml
│   ├── mysql-deployment.yaml
│   ├── backend-deployment.yaml
│   ├── frontend-deployment.yaml
│   ├── hpa.yaml             # Horizontal Pod Autoscaler
│   └── mysql-init-job.yaml
├── ansible/                 # Ansible playbooks
│   ├── setup-local-env.yaml     # Local development setup
│   ├── deploy-k8s.yaml          # Kubernetes deployment
│   └── inventory.ini            # Ansible inventory
├── .github/workflows/
│   └── build-push-deploy.yaml   # GitHub Actions CI/CD
└── docker-compose.yml       # Docker Compose for local development
```

## Features

### Frontend (React)
- **Authentication**: JWT-based login system
- **Protected Routes**: Role-based route protection
- **Dashboard**: View and manage projects (admin can create/delete)
- **Portfolio**: Public-facing portfolio showcase
- **Responsive Design**: Modern gradient UI with CSS
- **REST Integration**: Axios-based API communication

### Backend (Spring Boot 3.x)
- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: ADMIN and USER roles
- **CRUD Operations**: Complete project management
- **Database Integration**: MySQL with JPA/Hibernate
- **Security**: BCrypt password encoding, CORS configuration
- **RESTful API**: Clean endpoint design
- **Error Handling**: Global exception handling

### Database (MySQL)
- **Users Table**: User profiles with roles
- **Projects Table**: Project information with foreign key relationships
- **Indexes**: Performance optimization with database indexes
- **Full-Text Search**: Search capabilities on project titles and descriptions

### DevOps
- **Docker**: Multi-stage builds for optimized images
- **Docker Compose**: Local development environment
- **Kubernetes**: Production-grade deployment manifests
- **GitHub Actions**: Automated CI/CD pipeline
- **Ansible**: Infrastructure automation for local and Kubernetes deployments
- **Auto-scaling**: HPA configured for backend and frontend

## Prerequisites

- **For Local Development**:
  - Docker and Docker Compose
  - Node.js 18+
  - Java 17+
  - Maven 3.6+
  - MySQL 8.0+ (or use Docker)

- **For Kubernetes Deployment**:
  - Kubernetes cluster (1.20+)
  - kubectl configured
  - Ansible 2.10+

- **For GitHub Actions**:
  - Docker Hub account
  - GitHub repository

## Local Development Setup

### Option 1: Docker Compose (Recommended)

```bash
# Clone the repository
git clone https://github.com/yourusername/fullstack-portfolio.git
cd fullstack-portfolio

# Build and start all services
docker-compose up -d

# Application URLs:
# Frontend: http://localhost:3000
# Backend API: http://localhost:8080/api
# MySQL: localhost:3306

# Demo Credentials:
# Admin: username=admin, password=admin123
# User: username=user, password=user123
```

### Option 2: Ansible Automation

```bash
# Install Ansible
pip install ansible

# Setup local environment
ansible-playbook ansible/setup-local-env.yaml

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8080/api
```

### Option 3: Manual Setup

#### 1. Setup MySQL
```bash
# Start MySQL container
docker run -d \
  --name portfolio-mysql \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=portfolio_db \
  -p 3306:3306 \
  mysql:8.0

# Initialize schema
mysql -h localhost -u root -proot < database/schema.sql
```

#### 2. Start Backend
```bash
cd backend

# Build the application
mvn clean package

# Run the application
java -jar target/portfolio-backend-1.0.0.jar

# Backend runs on http://localhost:8080
```

#### 3. Start Frontend
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start

# Frontend runs on http://localhost:3000
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
  ```json
  {
    "username": "admin",
    "password": "admin123"
  }
  ```
  Response:
  ```json
  {
    "token": "eyJhbGciOiJIUzUxMiJ9...",
    "role": "ADMIN",
    "username": "admin",
    "userId": 1
  }
  ```

### Projects (All endpoints require JWT token in Authorization header)
- `GET /api/projects` - Get all projects
- `GET /api/projects/my-projects` - Get current user's projects
- `GET /api/projects/{id}` - Get project by ID
- `POST /api/projects` - Create new project (ADMIN only)
  ```json
  {
    "title": "My Project",
    "description": "Project description",
    "technologies": "React, Node.js, MongoDB",
    "link": "https://example.com"
  }
  ```
- `PUT /api/projects/{id}` - Update project
- `DELETE /api/projects/{id}` - Delete project

## Kubernetes Deployment

### Prerequisites
```bash
# 1. Prepare Kubernetes cluster
kubectl cluster-info

# 2. Create namespace (optional)
kubectl create namespace portfolio

# 3. Configure Docker credentials
kubectl create secret docker-registry dockerhub-secret \
  --docker-server=docker.io \
  --docker-username=<username> \
  --docker-password=<password> \
  --docker-email=<email>
```

### Deployment Steps

#### Option 1: Using kubectl
```bash
# Update docker username in Kubernetes manifests
sed -i 's/<YOUR_DOCKER_USERNAME>/your-username/g' kubernetes/*.yaml

# Apply configurations
kubectl apply -f kubernetes/config.yaml
kubectl apply -f kubernetes/mysql-deployment.yaml
kubectl apply -f kubernetes/backend-deployment.yaml
kubectl apply -f kubernetes/frontend-deployment.yaml
kubectl apply -f kubernetes/hpa.yaml

# Verify deployments
kubectl get deployments
kubectl get pods
kubectl get services

# Get service URLs
kubectl get svc backend-service
kubectl get svc frontend-service
```

#### Option 2: Using Ansible
```bash
# Update inventory
nano ansible/inventory.ini

# Run deployment playbook
ansible-playbook ansible/deploy-k8s.yaml
```

### Verify Kubernetes Deployment
```bash
# Check pod status
kubectl get pods -w

# Check service status
kubectl get svc

# View logs
kubectl logs -f deployment/backend-deployment
kubectl logs -f deployment/frontend-deployment

# Port forward for local access
kubectl port-forward svc/backend-service 8080:8080
kubectl port-forward svc/frontend-service 3000:80
```

## Docker Hub Integration & GitHub Actions

### Setup GitHub Secrets
1. Go to your GitHub repository
2. Settings → Secrets and variables → Actions
3. Add the following secrets:
   - `DOCKER_USERNAME`: Your Docker Hub username
   - `DOCKER_PASSWORD`: Your Docker Hub access token

### CI/CD Pipeline
The GitHub Actions workflow (`build-push-deploy.yaml`) automatically:
1. Builds Docker images for frontend and backend
2. Pushes images to Docker Hub
3. Runs backend tests (Maven)
4. Runs frontend tests (npm)
5. Tags images with commit SHA and latest

### Manual Docker Build & Push
```bash
# Login to Docker Hub
docker login

# Build backend image
docker build -t your-username/portfolio-backend:latest ./backend
docker push your-username/portfolio-backend:latest

# Build frontend image
docker build -t your-username/portfolio-frontend:latest ./frontend
docker push your-username/portfolio-frontend:latest
```

## Authentication & Authorization

### JWT Implementation
- Token includes username and role claims
- Tokens expire after 24 hours (86400000 ms)
- All project endpoints require valid JWT token

### Role-Based Access Control
- **ADMIN**: Can create, read, update, and delete all projects
- **USER**: Can read all projects, but cannot create/modify projects

### Default Users
| Username | Password | Role |
|----------|----------|------|
| admin | admin123 | ADMIN |
| user | user123 | USER |

## Environment Variables

### Backend (.env or application.properties)
```properties
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/portfolio_db
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=root
JWT_SECRET=mySecretKeyForPortfolioApplicationJWTTokenGenerationAndValidation123456789
JWT_EXPIRATION=86400000
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:8080/api
```

## Monitoring & Troubleshooting

### Docker Compose
```bash
# View logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql

# Stop services
docker-compose down

# Remove all containers and volumes
docker-compose down -v
```

### Kubernetes
```bash
# Describe pod for debugging
kubectl describe pod <pod-name>

# View pod logs
kubectl logs <pod-name>

# Check deployment status
kubectl describe deployment backend-deployment

# Check HPA status
kubectl get hpa
kubectl describe hpa backend-hpa
```

## Performance Optimization

- **Database Indexes**: Implemented on username, email, and user_id
- **Full-Text Search**: MySQL FULLTEXT index on project titles and descriptions
- **Caching**: Consider adding Redis for session caching
- **Load Balancing**: Kubernetes services handle load distribution
- **Auto-scaling**: HPA scales pods based on CPU and memory usage
- **Resource Limits**: Configured resource requests and limits for all containers

## Security Considerations

1. **JWT Secret**: Change `jwt.secret` in production
2. **Database Passwords**: Update default MySQL credentials
3. **CORS**: Configure allowed origins for production
4. **HTTPS**: Enable SSL/TLS in production
5. **Environment Variables**: Use secrets management tools (Vault, AWS Secrets Manager)
6. **API Rate Limiting**: Consider implementing rate limiting
7. **Input Validation**: All endpoints validate input data

## Scaling Strategy

### Horizontal Scaling
- Kubernetes HPA automatically scales based on CPU/memory metrics
- Backend: 2-5 replicas
- Frontend: 2-4 replicas
- MySQL: Single replica (use external managed database for HA)

### Vertical Scaling
- Increase pod resource requests/limits
- Use more powerful node instances

### Database Scaling
- Implement read replicas for MySQL
- Consider switching to managed databases (AWS RDS, Google Cloud SQL, Azure Database)

## Backup & Disaster Recovery

```bash
# Backup MySQL database
docker exec portfolio-mysql mysqldump -u root -proot portfolio_db > backup.sql

# Restore from backup
docker exec -i portfolio-mysql mysql -u root -proot portfolio_db < backup.sql

# Kubernetes persistent volume backups
kubectl get pvc
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - see LICENSE file for details

## Support & Documentation

- **Backend API Documentation**: http://localhost:8080/api (add Swagger/SpringDoc)
- **Frontend Documentation**: See component comments in source code
- **Kubernetes Docs**: https://kubernetes.io/docs/
- **Spring Boot Docs**: https://spring.io/projects/spring-boot
- **React Docs**: https://react.dev

## Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Find process using port
lsof -i :8080
# Kill process
kill -9 <PID>
```

#### Database Connection Error
```bash
# Check MySQL is running
docker ps | grep mysql
# Check logs
docker logs portfolio-mysql
```

#### Frontend can't connect to Backend
```bash
# Check CORS configuration
# Verify API URL in frontend .env
# Check backend is running
curl http://localhost:8080/api/projects
```

#### Kubernetes Pod Pending
```bash
# Check node resources
kubectl top nodes
# Check pod events
kubectl describe pod <pod-name>
```

## Next Steps

1. Setup GitHub repository and configure secrets
2. Customize the application with your portfolio data
3. Deploy locally using Docker Compose
4. Test all features
5. Setup Kubernetes cluster
6. Deploy to Kubernetes using Ansible
7. Configure CI/CD pipeline
8. Monitor and scale as needed

---

**Happy coding! 🚀**
