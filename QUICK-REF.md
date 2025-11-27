# Quick Reference Guide

## 🚀 Quick Start (Choose One)

### Option 1: Docker Compose (Fastest - 2 minutes)
```bash
docker-compose up -d
# Frontend: http://localhost:3000
# Backend: http://localhost:8080/api
# Credentials: admin/admin123 or user/user123
```

### Option 2: Ansible (Automated Setup)
```bash
ansible-playbook ansible/setup-local-env.yaml
```

### Option 3: Manual Setup
```bash
# Terminal 1: MySQL
docker run -d --name portfolio-mysql -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=portfolio_db -p 3306:3306 mysql:8.0

# Terminal 2: Backend
cd backend && mvn spring-boot:run

# Terminal 3: Frontend
cd frontend && npm install && npm start
```

## 📋 Project Structure Quick Reference

```
frontend/          → React application (port 3000)
backend/           → Spring Boot API (port 8080)
database/          → MySQL schema and init scripts
kubernetes/        → K8s deployment manifests
ansible/           → Automation playbooks
.github/workflows/ → GitHub Actions CI/CD
docker-compose.yml → Local development setup
```

## 🔐 API Quick Reference

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Get All Projects
```bash
curl -X GET http://localhost:8080/api/projects \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create Project (Admin Only)
```bash
curl -X POST http://localhost:8080/api/projects \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title":"My Project",
    "description":"Description",
    "technologies":"React,Spring Boot",
    "link":"https://example.com"
  }'
```

## 🐳 Docker Commands

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down

# Remove volumes
docker-compose down -v
```

## ☸️ Kubernetes Commands

```bash
# Deploy
kubectl apply -f kubernetes/

# Check status
kubectl get pods
kubectl get svc

# View logs
kubectl logs -f deployment/backend-deployment

# Port forward
kubectl port-forward svc/backend-service 8080:8080
kubectl port-forward svc/frontend-service 3000:80

# Scale
kubectl scale deployment backend-deployment --replicas=5

# Delete
kubectl delete -f kubernetes/
```

## 🤖 Ansible Commands

```bash
# Local setup
ansible-playbook ansible/setup-local-env.yaml

# Kubernetes deployment
ansible-playbook -i ansible/inventory.ini ansible/deploy-k8s.yaml

# Dry run
ansible-playbook -i ansible/inventory.ini ansible/deploy-k8s.yaml --check

# Verbose
ansible-playbook -i ansible/inventory.ini ansible/deploy-k8s.yaml -vvv
```

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `README.md` | Complete project documentation |
| `SETUP.md` | Detailed setup instructions |
| `DOCKER.md` | Docker and containerization guide |
| `KUBERNETES.md` | K8s architecture and deployment |
| `ANSIBLE.md` | Ansible automation guide |
| `GITHUB-ACTIONS.md` | CI/CD pipeline guide |
| `QUICK-REF.md` | This file |

## 🔧 Common Tasks

### Add New Project
1. Login with Admin credentials
2. Click "Add New Project"
3. Fill form with details
4. Click "Save Project"

### View All Projects
1. Navigate to Portfolio page
2. All projects display in grid format
3. Click "Visit Project" to open link

### Setup GitHub Actions
1. Create Docker Hub access token
2. Add secrets to GitHub:
   - `DOCKER_USERNAME`
   - `DOCKER_PASSWORD`
3. Push code to GitHub
4. Monitor Actions tab

### Deploy to Kubernetes
1. Update docker usernames in K8s manifests
2. Run: `kubectl apply -f kubernetes/`
3. Or use Ansible: `ansible-playbook ansible/deploy-k8s.yaml`

### Scale Backend Pods
1. Auto-scaling: Already configured via HPA
2. Manual: `kubectl scale deployment backend-deployment --replicas=5`

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :8080
kill -9 <PID>
```

### MySQL Connection Error
```bash
# Check if MySQL is running
docker ps | grep mysql

# View MySQL logs
docker logs portfolio-mysql
```

### Can't Connect to Backend
```bash
# Test backend
curl http://localhost:8080/api/projects

# Check frontend API URL in .env
cat frontend/.env
```

### Kubernetes Pod Not Starting
```bash
# Check pod events
kubectl describe pod <pod-name>

# Check logs
kubectl logs <pod-name>

# Check node resources
kubectl top nodes
```

## 📊 Environment Variables

### Backend
```properties
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/portfolio_db
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=root
JWT_SECRET=mySecretKeyForPortfolioApplicationJWTTokenGenerationAndValidation123456789
JWT_EXPIRATION=86400000
```

### Frontend
```
REACT_APP_API_URL=http://localhost:8080/api
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
mvn clean test
```

### Frontend Tests
```bash
cd frontend
npm test
```

### API Testing with Postman
1. Import API collection
2. Set Authorization header with JWT token
3. Test each endpoint

## 🚢 Deployment Checklist

- [ ] Update JWT secret in production
- [ ] Change database credentials
- [ ] Configure CORS for production domain
- [ ] Enable HTTPS/SSL
- [ ] Setup backup strategy
- [ ] Configure monitoring and logging
- [ ] Enable auto-scaling policies
- [ ] Setup log aggregation
- [ ] Configure firewalls and security groups
- [ ] Test disaster recovery procedures

## 📱 Login Credentials

| User | Password | Role |
|------|----------|------|
| admin | admin123 | ADMIN |
| user | user123 | USER |

## 🔗 Service Endpoints

| Service | Local | Docker | K8s |
|---------|-------|--------|-----|
| Frontend | http://localhost:3000 | http://localhost:3000 | <LoadBalancer-IP>:80 |
| Backend | http://localhost:8080 | http://backend:8080 | http://backend-service:8080 |
| MySQL | localhost:3306 | mysql:3306 | mysql-service:3306 |

## 💡 Tips

1. Use Docker Compose for fastest local development
2. Use Kubernetes for production-grade deployments
3. Use Ansible to automate both setups
4. Monitor logs for debugging issues
5. Always backup database before deployments
6. Test in staging before production
7. Use JWT tokens carefully (they contain user info)
8. Scale gradually - start with 2 replicas, increase as needed

## 📞 Getting Help

1. Check relevant documentation file
2. Review troubleshooting sections
3. Check application logs
4. Verify environment variables
5. Test individual components
6. Check GitHub Issues if pushing to repository

---

**For detailed information, refer to the appropriate documentation file!**
