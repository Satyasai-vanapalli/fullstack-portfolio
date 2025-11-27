# Command Reference & Common Operations

## 📖 Table of Contents
- [Local Development](#local-development)
- [Docker Commands](#docker-commands)
- [Kubernetes Commands](#kubernetes-commands)
- [Ansible Commands](#ansible-commands)
- [Git Commands](#git-commands)
- [Database Commands](#database-commands)
- [Testing & Debugging](#testing--debugging)
- [Maintenance & Monitoring](#maintenance--monitoring)

---

## 🔧 Local Development

### Frontend

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Clean build
rm -rf build node_modules && npm install && npm run build
```

### Backend

```bash
# Build project
mvn clean install

# Build without running tests
mvn clean install -DskipTests

# Run application
mvn spring-boot:run

# Run tests
mvn clean test

# Package as JAR
mvn clean package -DskipTests

# Run specific Maven goal
mvn compile
mvn test
mvn integration-test
```

### Database

```bash
# Start MySQL
docker run -d --name portfolio-mysql \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=portfolio_db \
  -p 3306:3306 \
  mysql:8.0

# Connect to MySQL
mysql -h localhost -u root -proot

# Create database
mysql -h localhost -u root -proot < database/schema.sql

# Backup database
mysqldump -h localhost -u root -proot portfolio_db > backup.sql

# Restore database
mysql -h localhost -u root -proot portfolio_db < backup.sql

# Connect to running MySQL container
docker exec -it portfolio-mysql mysql -u root -proot

# Run SQL command
docker exec portfolio-mysql mysql -u root -proot -e "SELECT * FROM users;"
```

---

## 🐳 Docker Commands

### Building Images

```bash
# Build backend image
docker build -t portfolio-backend:latest -f backend/Dockerfile backend/

# Build frontend image
docker build -t portfolio-frontend:latest -f frontend/Dockerfile frontend/

# Build with buildkit (faster)
DOCKER_BUILDKIT=1 docker build -t portfolio-backend:latest -f backend/Dockerfile backend/

# Build with tags
docker build -t yourusername/portfolio-backend:latest \
  -t yourusername/portfolio-backend:v1.0 \
  -f backend/Dockerfile backend/

# Build with build args
docker build \
  --build-arg JAVA_VERSION=17 \
  --build-arg MAVEN_VERSION=3.9 \
  -t portfolio-backend:latest \
  -f backend/Dockerfile backend/
```

### Running Containers

```bash
# Run backend
docker run -d -p 8080:8080 \
  -e SPRING_DATASOURCE_URL=jdbc:mysql://host.docker.internal:3306/portfolio_db \
  --name portfolio-backend \
  portfolio-backend:latest

# Run frontend
docker run -d -p 3000:3000 \
  -e REACT_APP_API_URL=http://localhost:8080/api \
  --name portfolio-frontend \
  portfolio-frontend:latest

# Run with volume mount
docker run -d -p 8080:8080 \
  -v /path/to/backend/src:/app/src \
  --name portfolio-backend \
  portfolio-backend:latest

# Run interactive
docker run -it --rm portfolio-backend:latest /bin/bash

# Run with resource limits
docker run -d \
  -m 512m --cpus=0.5 \
  -p 8080:8080 \
  --name portfolio-backend \
  portfolio-backend:latest
```

### Docker Compose

```bash
# Start all services
docker-compose up -d

# Start with build
docker-compose up -d --build

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend

# Stop services
docker-compose stop

# Stop and remove containers
docker-compose down

# Remove everything including volumes
docker-compose down -v

# Remove images
docker-compose down --rmi all

# Pause services
docker-compose pause

# Resume services
docker-compose unpause

# Restart service
docker-compose restart backend

# View services
docker-compose ps

# Execute command in container
docker-compose exec backend bash

# Scale service
docker-compose up -d --scale backend=3
```

### Image Management

```bash
# List images
docker images

# Remove image
docker rmi portfolio-backend:latest

# Remove unused images
docker image prune

# Remove all unused images
docker image prune -a

# Tag image
docker tag portfolio-backend:latest yourusername/portfolio-backend:v1.0

# Save image to tar
docker save portfolio-backend > portfolio-backend.tar

# Load image from tar
docker load < portfolio-backend.tar

# Push to registry
docker push yourusername/portfolio-backend:latest

# Pull image
docker pull yourusername/portfolio-backend:latest

# Inspect image
docker image inspect portfolio-backend:latest

# Show image history
docker history portfolio-backend:latest
```

### Container Management

```bash
# List running containers
docker ps

# List all containers
docker ps -a

# Stop container
docker stop portfolio-backend

# Start container
docker start portfolio-backend

# Restart container
docker restart portfolio-backend

# Remove container
docker rm portfolio-backend

# Remove all stopped containers
docker container prune

# View logs
docker logs portfolio-backend

# Follow logs
docker logs -f portfolio-backend

# View last 50 lines
docker logs --tail 50 portfolio-backend

# View timestamps
docker logs -t portfolio-backend

# Execute command
docker exec portfolio-backend ls -la

# Connect to container
docker exec -it portfolio-backend bash

# Copy file from container
docker cp portfolio-backend:/app/logs/app.log ./logs/

# Copy file to container
docker cp ./config.properties portfolio-backend:/app/

# Inspect container
docker inspect portfolio-backend

# View resource usage
docker stats

# Top processes in container
docker top portfolio-backend

# Rename container
docker rename portfolio-backend portfolio-api
```

---

## ☸️ Kubernetes Commands

### Cluster Management

```bash
# Check cluster info
kubectl cluster-info

# Get nodes
kubectl get nodes

# Describe node
kubectl describe node <node-name>

# Check node resources
kubectl top nodes

# Get node detailed info
kubectl get nodes -o wide

# Drain node (before maintenance)
kubectl drain <node-name>

# Cordon node (prevent new pods)
kubectl cordon <node-name>

# Uncordon node
kubectl uncordon <node-name>
```

### Namespace Management

```bash
# Get namespaces
kubectl get ns

# Create namespace
kubectl create namespace portfolio

# Set default namespace
kubectl config set-context --current --namespace=portfolio

# Delete namespace
kubectl delete namespace portfolio
```

### Deployment Management

```bash
# Get deployments
kubectl get deployments

# Get deployments with details
kubectl get deployments -o wide

# Get specific deployment
kubectl get deployment backend-deployment

# Describe deployment
kubectl describe deployment backend-deployment

# Watch deployment
kubectl get deployments -w

# Scale deployment
kubectl scale deployment backend-deployment --replicas=5

# Update deployment image
kubectl set image deployment/backend-deployment \
  backend=yourusername/portfolio-backend:v2.0

# Set resource limits
kubectl set resources deployment backend-deployment \
  -c backend --limits=cpu=500m,memory=512Mi

# Edit deployment
kubectl edit deployment backend-deployment
```

### Pod Management

```bash
# Get pods
kubectl get pods

# Get pods in all namespaces
kubectl get pods -A

# Get pods with labels
kubectl get pods --show-labels

# Get pods with more details
kubectl get pods -o wide

# Describe pod
kubectl describe pod <pod-name>

# Watch pods
kubectl get pods -w

# Get pod logs
kubectl logs <pod-name>

# Follow pod logs
kubectl logs -f <pod-name>

# Get logs from specific container
kubectl logs <pod-name> -c container-name

# Get logs from all containers
kubectl logs <pod-name> --all-containers=true

# Execute command in pod
kubectl exec <pod-name> -- ls -la

# Open shell in pod
kubectl exec -it <pod-name> -- /bin/bash

# Copy file from pod
kubectl cp default/<pod-name>:/app/file.txt ./file.txt

# Copy file to pod
kubectl cp ./file.txt default/<pod-name>:/app/file.txt

# Get pod YAML
kubectl get pod <pod-name> -o yaml

# Delete pod (will be recreated)
kubectl delete pod <pod-name>

# Force delete pod
kubectl delete pod <pod-name> --grace-period=0 --force
```

### Service Management

```bash
# Get services
kubectl get services

# Describe service
kubectl describe svc backend-service

# Get service details
kubectl get svc -o wide

# Port forward
kubectl port-forward svc/backend-service 8080:8080

# Port forward local port to pod
kubectl port-forward pod/<pod-name> 8080:8080

# Get service endpoints
kubectl get endpoints backend-service

# Edit service
kubectl edit svc backend-service
```

### ConfigMaps and Secrets

```bash
# Get configmaps
kubectl get configmaps

# Describe configmap
kubectl describe configmap portfolio-config

# Get configmap YAML
kubectl get configmap portfolio-config -o yaml

# Create configmap from file
kubectl create configmap portfolio-config --from-file=config.properties

# Create configmap from literal
kubectl create configmap portfolio-config --from-literal=JWT_SECRET=mysecret

# Edit configmap
kubectl edit configmap portfolio-config

# Delete configmap
kubectl delete configmap portfolio-config

# Get secrets
kubectl get secrets

# Create secret
kubectl create secret generic portfolio-secrets \
  --from-literal=password=mypassword

# Create docker registry secret
kubectl create secret docker-registry dockerhub-secret \
  --docker-server=docker.io \
  --docker-username=<user> \
  --docker-password=<pass> \
  --docker-email=<email>
```

### Persistent Volumes

```bash
# Get persistent volumes
kubectl get pv

# Get persistent volume claims
kubectl get pvc

# Describe PVC
kubectl describe pvc mysql-pvc

# Delete PVC
kubectl delete pvc mysql-pvc

# Delete PV
kubectl delete pv mysql-pv
```

### Scaling and Updates

```bash
# Scale replicas
kubectl scale deployment backend-deployment --replicas=3

# Rollout status
kubectl rollout status deployment/backend-deployment

# Rollout history
kubectl rollout history deployment/backend-deployment

# Rollback to previous version
kubectl rollout undo deployment/backend-deployment

# Rollback to specific revision
kubectl rollout undo deployment/backend-deployment --to-revision=2

# Pause rollout
kubectl rollout pause deployment/backend-deployment

# Resume rollout
kubectl rollout resume deployment/backend-deployment
```

### Monitoring and Debugging

```bash
# Get resource usage
kubectl top pods

# Get node resource usage
kubectl top nodes

# Get events
kubectl get events

# Get HPA status
kubectl get hpa

# Describe HPA
kubectl describe hpa backend-hpa

# Watch HPA
kubectl get hpa -w

# Get pod events
kubectl describe pod <pod-name>

# Check pod conditions
kubectl get pod <pod-name> -o yaml
```

### Deployment

```bash
# Apply configuration
kubectl apply -f kubernetes/

# Apply specific file
kubectl apply -f kubernetes/backend-deployment.yaml

# Dry run
kubectl apply -f kubernetes/ --dry-run=client

# Check diff
kubectl diff -f kubernetes/

# Delete all resources
kubectl delete -f kubernetes/

# Delete specific resource
kubectl delete -f kubernetes/backend-deployment.yaml

# Rollout status
kubectl rollout status deployment/backend-deployment

# Watch deployment
kubectl get deployments -w
```

---

## 🤖 Ansible Commands

### Basic Execution

```bash
# Run playbook
ansible-playbook ansible/setup-local-env.yaml

# Run with inventory
ansible-playbook -i ansible/inventory.ini ansible/deploy-k8s.yaml

# Run specific host group
ansible-playbook -i ansible/inventory.ini ansible/deploy-k8s.yaml -l kubernetes_cluster

# Run specific task
ansible-playbook ansible/setup-local-env.yaml --start-at-task="Start MySQL container"

# Run specific tags
ansible-playbook ansible/deploy-k8s.yaml --tags "deploy-backend"

# Skip tags
ansible-playbook ansible/deploy-k8s.yaml --skip-tags "deploy-mysql"
```

### Debugging

```bash
# Check mode (dry run)
ansible-playbook ansible/setup-local-env.yaml --check

# Check with diff
ansible-playbook ansible/setup-local-env.yaml --check --diff

# Verbose output
ansible-playbook ansible/setup-local-env.yaml -v

# Very verbose
ansible-playbook ansible/setup-local-env.yaml -vv

# Extra verbose
ansible-playbook ansible/setup-local-env.yaml -vvv

# Debug module
ansible-playbook ansible/setup-local-env.yaml -e 'ansible_verbosity=4'
```

### Variables

```bash
# Override variable from command line
ansible-playbook ansible/setup-local-env.yaml \
  -e "mysql_port=3307"

# Load variables from file
ansible-playbook ansible/setup-local-env.yaml \
  -e @vars.yml

# Extra variables
ansible-playbook ansible/setup-local-env.yaml \
  -e "{mysql_port: 3307, backend_port: 8081}"
```

### Inventory

```bash
# List all hosts
ansible-inventory -i ansible/inventory.ini --list

# List host group
ansible-inventory -i ansible/inventory.ini --host <hostname>

# Test connectivity
ansible -i ansible/inventory.ini all -m ping

# Test specific host
ansible -i ansible/inventory.ini k8s_master -m ping
```

---

## 📝 Git Commands

```bash
# Initialize repository
git init

# Clone repository
git clone https://github.com/yourusername/fullstack-portfolio.git

# Check status
git status

# Add changes
git add .

# Commit changes
git commit -m "Commit message"

# Push to remote
git push origin main

# Pull from remote
git pull origin main

# Create branch
git checkout -b feature/new-feature

# Switch branch
git checkout main

# Merge branch
git merge feature/new-feature

# Delete branch
git branch -d feature/new-feature

# View history
git log

# View diffs
git diff

# Stash changes
git stash

# Apply stash
git stash apply

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1
```

---

## 💾 Database Commands

```bash
# Login to MySQL
mysql -h localhost -u root -proot

# Show databases
SHOW DATABASES;

# Use database
USE portfolio_db;

# Show tables
SHOW TABLES;

# Describe table
DESCRIBE users;
DESCRIBE projects;

# View table contents
SELECT * FROM users;
SELECT * FROM projects;

# Count records
SELECT COUNT(*) FROM users;

# Get user info
SELECT * FROM users WHERE username='admin';

# Get projects count
SELECT COUNT(*) FROM projects;

# Backup database
mysqldump -h localhost -u root -proot portfolio_db > backup.sql

# Restore database
mysql -h localhost -u root -proot portfolio_db < backup.sql

# Export as CSV
SELECT * FROM projects 
INTO OUTFILE '/tmp/projects.csv' 
FIELDS TERMINATED BY ',';

# Import from CSV
LOAD DATA INFILE '/tmp/projects.csv' 
INTO TABLE projects 
FIELDS TERMINATED BY ',';
```

---

## 🧪 Testing & Debugging

### API Testing

```bash
# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Get all projects
curl -X GET http://localhost:8080/api/projects \
  -H "Authorization: Bearer <token>"

# Create project
curl -X POST http://localhost:8080/api/projects \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Project","description":"Desc","technologies":"Tech"}'

# Update project
curl -X PUT http://localhost:8080/api/projects/1 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated"}'

# Delete project
curl -X DELETE http://localhost:8080/api/projects/1 \
  -H "Authorization: Bearer <token>"

# Pretty print JSON
curl -X GET http://localhost:8080/api/projects \
  -H "Authorization: Bearer <token>" | jq .
```

### Frontend Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch

# Update snapshots
npm test -- --updateSnapshot

# Run specific test file
npm test LoginPage

# Debug tests
node --inspect-brk node_modules/.bin/jest --runInBand
```

### Backend Testing

```bash
# Run all tests
mvn clean test

# Run specific test class
mvn test -Dtest=ProjectControllerTest

# Run specific test method
mvn test -Dtest=ProjectControllerTest#testCreateProject

# Run with coverage
mvn clean test jacoco:report

# Run integration tests
mvn clean integration-test

# Skip tests during build
mvn clean install -DskipTests

# Show test output
mvn test -X
```

---

## 🛡️ Maintenance & Monitoring

### Container Health

```bash
# Check container health
docker inspect --format='{{.State.Health}}' portfolio-backend

# View container processes
docker top portfolio-backend

# Monitor resource usage
docker stats portfolio-backend

# Check logs for errors
docker logs portfolio-backend | grep ERROR

# View last 100 lines
docker logs portfolio-backend --tail 100
```

### Kubernetes Health

```bash
# Check pod health
kubectl get pod <pod-name> -o yaml | grep -A 10 status

# Check deployment replicas
kubectl get deployment backend-deployment -o yaml | grep -A 5 status

# Monitor HPA scaling
kubectl get hpa -w

# Check resource constraints
kubectl describe node <node-name>

# View cluster events
kubectl get events --sort-by='.lastTimestamp'
```

### Performance Monitoring

```bash
# Docker resource usage
docker stats --no-stream

# Kubernetes pod resource usage
kubectl top pods --containers

# Node resource usage
kubectl top nodes

# Disk usage
docker system df

# Monitor in real-time
watch -n 1 'kubectl top pods'
```

### Cleanup & Maintenance

```bash
# Remove dangling Docker images
docker image prune -f

# Remove dangling volumes
docker volume prune -f

# Remove stopped containers
docker container prune -f

# Clean all unused
docker system prune -a --volumes -f

# Remove old logs
docker exec portfolio-mysql mysql -u root -proot -e "PURGE BINARY LOGS BEFORE DATE_SUB(NOW(), INTERVAL 7 DAY);"

# Remove old files from Kubernetes
kubectl delete pod --field-selector status.phase=Failed

# Archive logs
tar -czf logs-$(date +%Y-%m-%d).tar.gz logs/
```

---

**For more detailed information, refer to the specific documentation files!**
