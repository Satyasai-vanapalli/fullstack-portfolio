# Windows Setup Guide

Since you're on Windows, here's the specific setup instructions for your system.

## 🔧 Prerequisites Installation

### 1. Install Docker Desktop

**Download**: [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop)

**Steps**:
1. Download and run installer
2. Follow installation wizard
3. Restart your computer when prompted
4. Launch Docker Desktop
5. Wait for Docker daemon to start (check system tray)

**Verify Installation**:
```powershell
docker --version
docker run hello-world
```

### 2. Install Git for Windows

**Download**: [Git for Windows](https://git-scm.com/download/win)

**Steps**:
1. Download and run installer
2. Select components (accept defaults)
3. Choose default editor
4. Configure line endings (LF or CRLF - recommend CRLF for Windows)

**Verify Installation**:
```powershell
git --version
```

### 3. Install Java 17

**Download**: [Eclipse Temurin JDK 17](https://adoptium.net/temurin/releases/)

**Steps**:
1. Download Windows MSI installer
2. Run installer
3. Follow setup wizard
4. Set `JAVA_HOME` environment variable

**Set JAVA_HOME**:
1. Press `Win + X` → System
2. Click "Advanced system settings"
3. Click "Environment Variables"
4. Click "New" under System variables
5. Variable name: `JAVA_HOME`
6. Variable value: `C:\Program Files\Eclipse Adoptium\jdk-17.0.X+Y` (actual path)
7. Click OK

**Verify Installation**:
```powershell
java -version
echo %JAVA_HOME%
```

### 4. Install Maven

**Download**: [Apache Maven](https://maven.apache.org/download.cgi)

**Steps**:
1. Download binary zip archive
2. Extract to `C:\Maven` or similar
3. Set `MAVEN_HOME` and update `PATH`

**Set MAVEN_HOME and PATH**:
1. Press `Win + X` → System
2. Click "Advanced system settings"
3. Click "Environment Variables"
4. Create new system variable:
   - Variable name: `MAVEN_HOME`
   - Variable value: `C:\Maven\apache-maven-3.9.X`
5. Edit `PATH` variable, add: `%MAVEN_HOME%\bin`
6. Click OK

**Verify Installation**:
```powershell
mvn --version
```

### 5. Install Node.js

**Download**: [Node.js LTS](https://nodejs.org/)

**Steps**:
1. Download Windows installer
2. Run installer
3. Follow setup wizard (accept defaults)
4. npm is installed automatically

**Verify Installation**:
```powershell
node --version
npm --version
```

### 6. Install Ansible (Optional)

**Install via Python/pip**:
```powershell
# Install Python if not already installed
python --version

# Install Ansible
pip install ansible

# Install Kubernetes client
pip install kubernetes

# Install Docker client
pip install docker
```

**Verify Installation**:
```powershell
ansible --version
```

---

## 🚀 Quick Start on Windows

### Option 1: Docker Compose (Recommended for Windows)

**Step 1**: Open PowerShell as Administrator

```powershell
# Navigate to project
cd "d:\Cloud Devops\workspace\fullstack-portfolio"
```

**Step 2**: Start services
```powershell
docker-compose up -d
```

**Step 3**: Wait for services to initialize (1-2 minutes)
```powershell
docker-compose ps
```

**Step 4**: Access application
- Frontend: http://localhost:3000
- Backend: http://localhost:8080/api
- MySQL: localhost:3306

**Login credentials**:
- Admin: username=`admin`, password=`admin123`
- User: username=`user`, password=`user123`

### Option 2: Manual Setup on Windows

#### Terminal 1: Start MySQL
```powershell
docker run -d `
  --name portfolio-mysql `
  -e MYSQL_ROOT_PASSWORD=root `
  -e MYSQL_DATABASE=portfolio_db `
  -p 3306:3306 `
  mysql:8.0

# Wait for MySQL to be ready
Start-Sleep -Seconds 30
```

#### Terminal 2: Start Backend
```powershell
cd "d:\Cloud Devops\workspace\fullstack-portfolio\backend"

# Build
mvn clean install

# Run
mvn spring-boot:run

# Backend will be available at http://localhost:8080
```

#### Terminal 3: Start Frontend
```powershell
cd "d:\Cloud Devops\workspace\fullstack-portfolio\frontend"

# Install dependencies
npm install

# Create .env file
copy ".env.example" ".env"

# Start development server
npm start

# Frontend will open at http://localhost:3000
```

---

## 🐛 Windows-Specific Troubleshooting

### Issue 1: Docker Desktop Not Running
**Error**: "Cannot connect to Docker daemon"

**Solution**:
1. Open Start Menu
2. Search for "Docker Desktop"
3. Click to start
4. Wait for Docker icon in system tray
5. Verify: `docker ps`

### Issue 2: Port Already in Use
**Error**: "Address already in use"

**Solution - Find Process Using Port**:
```powershell
# Find process using port 8080
netstat -ano | findstr :8080

# Kill the process (replace XXXX with PID)
taskkill /PID XXXX /F
```

### Issue 3: Java Not Found
**Error**: "java: The term 'java' is not recognized"

**Solution**:
1. Verify Java installation: `java -version`
2. Set JAVA_HOME (see Prerequisites section)
3. Restart PowerShell
4. Verify: `echo %JAVA_HOME%`

### Issue 4: Maven Not Found
**Error**: "mvn: The term 'mvn' is not recognized"

**Solution**:
1. Set MAVEN_HOME and PATH (see Prerequisites section)
2. Restart PowerShell
3. Verify: `mvn --version`

### Issue 5: npm install Fails
**Error**: Permission denied or various npm errors

**Solution**:
```powershell
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json

# Try again
npm install
```

### Issue 6: MySQL Connection Failed
**Error**: "Cannot connect to MySQL server"

**Solution**:
```powershell
# Check if container is running
docker ps | findstr mysql

# View MySQL logs
docker logs portfolio-mysql

# Check if MySQL is healthy
docker ps --format "table {{.Names}}\t{{.Status}}"

# Wait a bit longer and try again
# MySQL takes 30-60 seconds to start
```

### Issue 7: Can't Connect to Backend from Frontend
**Error**: "Failed to fetch" or "ERR_CONNECTION_REFUSED"

**Solution**:
```powershell
# Verify backend is running
curl http://localhost:8080/api/projects

# Check frontend .env file
type frontend\.env

# Make sure REACT_APP_API_URL=http://localhost:8080/api

# Restart frontend
# In frontend terminal, press Ctrl+C
# Then: npm start
```

### Issue 8: CORS Errors
**Error**: "Access to XMLHttpRequest... has been blocked by CORS policy"

**Solution**:
1. Backend CORS configuration is already set
2. Try clearing browser cache: `Ctrl + Shift + Delete`
3. Try private/incognito window
4. Verify backend is running and accessible

### Issue 9: Docker Desktop Out of Memory
**Error**: "Out of memory" or containers crashing

**Solution**:
1. Open Docker Desktop Settings
2. Go to Resources → Memory
3. Increase memory (recommend 4GB minimum)
4. Click Apply & Restart
5. Wait for Docker to restart

### Issue 10: PowerShell Execution Policy
**Error**: "cannot be loaded because running scripts is disabled"

**Solution**:
```powershell
# Run PowerShell as Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Confirm with 'Y'
```

---

## 📊 Docker Commands for Windows

### Useful PowerShell Commands

```powershell
# Check running containers
docker ps

# Check all containers
docker ps -a

# View logs
docker logs portfolio-backend

# Stop container
docker stop portfolio-backend

# Start container
docker start portfolio-backend

# Remove container
docker rm portfolio-backend

# View images
docker images

# Remove image
docker rmi portfolio-backend

# Execute command in container
docker exec -it portfolio-mysql mysql -u root -proot

# Copy file from container
docker cp portfolio-backend:/app/logs/app.log ./logs/

# Check container stats
docker stats
```

### Docker Compose Commands for Windows

```powershell
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose stop

# Stop and remove containers
docker-compose down

# Restart service
docker-compose restart backend

# View running services
docker-compose ps
```

---

## ☸️ Kubernetes on Windows

### Option 1: Docker Desktop with Kubernetes

1. Open Docker Desktop
2. Go to Settings → Kubernetes
3. Check "Enable Kubernetes"
4. Wait for Kubernetes to start (3-5 minutes)
5. Verify: `kubectl version`

### Option 2: Minikube for Windows

**Install Minikube**:
```powershell
# Using Chocolatey
choco install minikube

# Or download from https://minikube.sigs.k8s.io/docs/start/

# Start Minikube
minikube start --cpus 4 --memory 4096

# Verify
kubectl cluster-info
```

**Deploy to Minikube**:
```powershell
# Apply configurations
kubectl apply -f kubernetes/

# Monitor
kubectl get pods -w

# Access services
minikube service backend-service
minikube service frontend-service
```

---

## 🔄 Git Operations on Windows

### Basic Git Commands in PowerShell

```powershell
# Initialize repository
git init

# Clone repository
git clone https://github.com/yourusername/fullstack-portfolio

# Check status
git status

# Add changes
git add .

# Commit
git commit -m "My commit message"

# Push
git push origin main

# Create branch
git checkout -b feature/my-feature

# Switch branch
git checkout main

# Merge branch
git merge feature/my-feature
```

### Configure Git (One time)

```powershell
# Set user name
git config --global user.name "Your Name"

# Set email
git config --global user.email "your.email@example.com"

# Set default editor
git config --global core.editor "code"
```

---

## 🧪 Testing on Windows

### Frontend Tests
```powershell
cd frontend

# Install dependencies
npm install

# Run tests
npm test

# Run with coverage
npm test -- --coverage

# Coverage report opens in browser
```

### Backend Tests
```powershell
cd backend

# Run all tests
mvn clean test

# Run specific test
mvn test -Dtest=ProjectControllerTest

# Run with coverage
mvn clean test jacoco:report

# View coverage report
# Open target\site\jacoco\index.html in browser
```

---

## 🔐 Environment Variables on Windows

### Set Environment Variables in PowerShell (Temporary)

```powershell
# For current session only
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-17.0.X"
$env:MAVEN_HOME = "C:\Maven\apache-maven-3.9.X"

# Verify
echo $env:JAVA_HOME
echo $env:MAVEN_HOME
```

### Set Permanently (System)

1. Press `Win + X` → System
2. Click "Advanced system settings"
3. Click "Environment Variables"
4. Add new system variables as needed
5. Click OK
6. Restart PowerShell

---

## 📝 Useful Windows PowerShell Tips

```powershell
# Clear screen
Clear-Host

# List files
Get-ChildItem

# Navigate directory
Set-Location "path\to\directory"

# Create directory
New-Item -ItemType Directory -Name "folder"

# Delete file/folder
Remove-Item -Path "file.txt"
Remove-Item -Recurse -Force "folder"

# Find text in files
Select-String -Path "*.log" -Pattern "ERROR"

# Wait
Start-Sleep -Seconds 10

# Pipe output to file
Get-Process | Out-File processes.txt

# See running processes
Get-Process

# Kill process
Stop-Process -Name "java" -Force
Stop-Process -Id XXXX -Force
```

---

## 🎯 Complete Windows Setup Checklist

- [ ] Install Docker Desktop and verify running
- [ ] Install Git for Windows
- [ ] Install Java 17 and set JAVA_HOME
- [ ] Install Maven and set MAVEN_HOME
- [ ] Install Node.js and npm
- [ ] Clone/extract project to `d:\Cloud Devops\workspace\fullstack-portfolio`
- [ ] Navigate to project directory
- [ ] Run `docker-compose up -d`
- [ ] Wait 1-2 minutes for services to start
- [ ] Verify all services: `docker-compose ps`
- [ ] Open browser and visit `http://localhost:3000`
- [ ] Login with `admin/admin123`
- [ ] Verify application is working

---

## 🆘 Quick Troubleshooting for Windows

| Issue | Command | Solution |
|-------|---------|----------|
| Port in use | `netstat -ano \| findstr :8080` | Kill process: `taskkill /PID XXXX /F` |
| MySQL not running | `docker ps \| findstr mysql` | Start Docker Desktop |
| Java not found | `java -version` | Set JAVA_HOME |
| Maven not found | `mvn -v` | Set MAVEN_HOME and PATH |
| npm not found | `npm --version` | Restart PowerShell after installation |
| Docker daemon error | `docker ps` | Start Docker Desktop |

---

**You're all set to run the full-stack application on Windows! 🎉**

Start with Docker Compose - it's the easiest way:
```powershell
cd "d:\Cloud Devops\workspace\fullstack-portfolio"
docker-compose up -d
```

Then visit http://localhost:3000 and enjoy!
