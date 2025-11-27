# Frontend Dockerfile Reference

## Multi-stage Build Explanation

This Dockerfile uses a multi-stage build process for the React application:

### Stage 1: Build Stage
- Uses `node:18-alpine` base image (lightweight)
- Installs dependencies
- Builds the production-ready React application
- Generates static files in the `build` directory

### Stage 2: Production Stage
- Uses `node:18-alpine` with `serve` package
- Copies only the built files from Stage 1
- Reduces final image size significantly
- Exposes port 3000
- Serves the static files

## Building the Image

```bash
docker build -t portfolio-frontend:latest -f frontend/Dockerfile frontend/
```

## Running the Container

```bash
docker run -d \
  -p 3000:3000 \
  -e REACT_APP_API_URL=http://localhost:8080/api \
  --name portfolio-frontend \
  portfolio-frontend:latest
```

## Environment Variables

- `REACT_APP_API_URL`: Backend API URL (default: http://localhost:8080/api)

---

# Backend Dockerfile Reference

## Multi-stage Build Explanation

This Dockerfile uses a multi-stage build process for the Spring Boot application:

### Stage 1: Build Stage
- Uses `maven:3.9-eclipse-temurin-17` for Java 17 compatibility
- Caches dependencies layer
- Builds the JAR file using Maven
- Skips tests for faster builds

### Stage 2: Production Stage
- Uses lightweight `eclipse-temurin:17-jre-alpine`
- Copies only the built JAR from Stage 1
- Reduces image size (from ~1.5GB to ~300MB)
- Exposes port 8080
- Uses alpine Linux for minimal footprint

## Building the Image

```bash
docker build -t portfolio-backend:latest -f backend/Dockerfile backend/
```

## Running the Container

```bash
docker run -d \
  -p 8080:8080 \
  -e SPRING_DATASOURCE_URL=jdbc:mysql://mysql:3306/portfolio_db \
  -e SPRING_DATASOURCE_USERNAME=root \
  -e SPRING_DATASOURCE_PASSWORD=root \
  --name portfolio-backend \
  portfolio-backend:latest
```

## Environment Variables

- `SPRING_DATASOURCE_URL`: MySQL connection URL
- `SPRING_DATASOURCE_USERNAME`: Database username
- `SPRING_DATASOURCE_PASSWORD`: Database password
- `JWT_SECRET`: JWT signing secret
- `JWT_EXPIRATION`: Token expiration time in milliseconds

## Image Size Comparison

- Frontend: ~150MB (before multi-stage: ~350MB)
- Backend: ~350MB (before multi-stage: ~1.5GB)
- **Total savings: ~1.5GB**
