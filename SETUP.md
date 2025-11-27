# Setup Instructions

## Quick Start (Docker Compose)

### Prerequisites
- Docker and Docker Compose installed
- Git installed

### Steps

1. **Clone/Extract the project**
   ```bash
   cd fullstack-portfolio
   ```

2. **Start all services**
   ```bash
   docker-compose up -d
   ```

3. **Wait for services to initialize** (approximately 30-60 seconds)
   ```bash
   docker-compose logs -f
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080/api
   - MySQL: localhost:3306

5. **Login with demo credentials**
   - Admin Account: username=`admin`, password=`admin123`
   - User Account: username=`user`, password=`user123`

6. **Stop all services**
   ```bash
   docker-compose down
   ```

## Local Development Setup (Manual)

### Prerequisites
- Node.js 18+
- Java 17+
- Maven 3.6+
- MySQL 8.0+ (or Docker MySQL)

### Backend Setup

1. **Start MySQL**
   ```bash
   docker run -d \
     --name portfolio-mysql \
     -e MYSQL_ROOT_PASSWORD=root \
     -e MYSQL_DATABASE=portfolio_db \
     -p 3306:3306 \
     mysql:8.0
   ```

2. **Initialize database**
   ```bash
   mysql -h localhost -u root -proot < database/schema.sql
   ```

3. **Navigate to backend**
   ```bash
   cd backend
   ```

4. **Build and run**
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

5. **Backend will start on**: http://localhost:8080

### Frontend Setup

1. **Open new terminal, navigate to frontend**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file**
   ```bash
   cp .env.example .env
   # Edit .env if needed (default is http://localhost:8080/api)
   ```

4. **Start development server**
   ```bash
   npm start
   ```

5. **Frontend will open at**: http://localhost:3000

## Docker Hub Integration

### Prerequisites
- Docker Hub account
- GitHub repository with this code

### Setup Steps

1. **Create Docker Hub access token**
   - Go to https://hub.docker.com/settings/security
   - Create new access token
   - Copy the token

2. **Add GitHub secrets**
   - Go to GitHub repo → Settings → Secrets and variables → Actions
   - Add `DOCKER_USERNAME`: your Docker Hub username
   - Add `DOCKER_PASSWORD`: your Docker Hub access token

3. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

4. **Monitor GitHub Actions**
   - Go to your repo → Actions tab
   - Watch the workflow build and push images
   - Images will be available at:
     - `docker.io/your-username/portfolio-backend:latest`
     - `docker.io/your-username/portfolio-frontend:latest`

## Kubernetes Deployment

### Prerequisites
- Kubernetes cluster (local minikube or cloud)
- kubectl configured
- Ansible 2.10+ (optional but recommended)

### Option 1: Manual kubectl Deployment

1. **Update Kubernetes manifests**
   ```bash
   # Edit kubernetes/backend-deployment.yaml
   # Replace <YOUR_DOCKER_USERNAME> with your Docker Hub username
   # Replace <YOUR_DOCKER_USERNAME> with your Docker Hub username in frontend-deployment.yaml
   ```

2. **Apply configurations**
   ```bash
   kubectl apply -f kubernetes/config.yaml
   kubectl apply -f kubernetes/mysql-deployment.yaml
   kubectl apply -f kubernetes/backend-deployment.yaml
   kubectl apply -f kubernetes/frontend-deployment.yaml
   kubectl apply -f kubernetes/hpa.yaml
   ```

3. **Check deployment status**
   ```bash
   kubectl get pods
   kubectl get svc
   ```

4. **Get service endpoints**
   ```bash
   kubectl get svc backend-service
   kubectl get svc frontend-service
   ```

### Option 2: Ansible Deployment

1. **Install Ansible**
   ```bash
   pip install ansible kubernetes
   ```

2. **Update inventory**
   ```bash
   # Edit ansible/inventory.ini with your Kubernetes master IP
   ```

3. **Run playbook**
   ```bash
   ansible-playbook ansible/deploy-k8s.yaml
   ```

## API Testing

### Using cURL

**Login**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

**Get all projects** (replace TOKEN with actual JWT token)
```bash
curl -X GET http://localhost:8080/api/projects \
  -H "Authorization: Bearer TOKEN"
```

**Create project** (admin only)
```bash
curl -X POST http://localhost:8080/api/projects \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title":"My Project",
    "description":"Project description",
    "technologies":"React,Spring Boot",
    "link":"https://example.com"
  }'
```

### Using Postman

1. **Import API requests** (create a Postman collection)
2. **Set Authorization header** with JWT token
3. **Test all endpoints**

## Environment Configuration

### Backend (application.properties)

```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/portfolio_db
spring.datasource.username=root
spring.datasource.password=root

# JWT
jwt.secret=mySecretKeyForPortfolioApplicationJWTTokenGenerationAndValidation123456789
jwt.expiration=86400000

# CORS
spring.web.cors.allowed-origins=http://localhost:3000
```

### Frontend (.env)

```
REACT_APP_API_URL=http://localhost:8080/api
```

## Troubleshooting

### Issue: Port Already in Use
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :8080
kill -9 <PID>
```

### Issue: MySQL Connection Error
```bash
# Check if MySQL container is running
docker ps | grep mysql

# Check MySQL logs
docker logs portfolio-mysql

# Verify connection
mysql -h localhost -u root -proot -e "SELECT 1"
```

### Issue: Frontend can't reach backend
1. Check backend is running: `curl http://localhost:8080/api/projects`
2. Check CORS configuration in backend
3. Verify `REACT_APP_API_URL` in frontend .env
4. Check network connectivity

### Issue: Kubernetes pods not starting
```bash
# Check pod events
kubectl describe pod <pod-name>

# Check logs
kubectl logs <pod-name>

# Check node resources
kubectl top nodes

# Check persistent volume
kubectl get pvc
kubectl describe pvc mysql-pvc
```

## Next Steps

1. **Customize the application**
   - Add your own portfolio content
   - Modify styling/branding
   - Add more features

2. **Setup CI/CD**
   - Configure GitHub Actions
   - Setup Docker Hub integration
   - Automate testing and deployment

3. **Deploy to Production**
   - Setup Kubernetes cluster (AWS EKS, GKE, AKS)
   - Configure ingress and SSL
   - Setup monitoring and logging

4. **Add More Features**
   - Implement file uploads
   - Add email notifications
   - Setup analytics
   - Add API documentation (Swagger)

---

For more information, see the main README.md file.
