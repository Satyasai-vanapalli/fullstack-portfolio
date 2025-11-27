# Backend Deployment Guide for Render.com

## Free Tier Limits
- Auto-spins down after 15 minutes of inactivity
- Limited resources but perfect for demo/portfolio
- Wakes up on first request (5-10 seconds)

## Deployment Steps

1. **Create Render Account**
   - Go to https://render.com
   - Sign up with GitHub

2. **Deploy Backend**
   - New → Web Service
   - Connect GitHub repo: `fullstack-portfolio`
   - Runtime: Java 17
   - Build Command: `mvn clean package -DskipTests`
   - Start Command: `java -jar backend/target/portfolio-backend-1.0.0.jar`
   - Environment Variables:
     ```
     SPRING_DATASOURCE_URL=jdbc:mysql://your-db-host:3306/portfolio_db
     SPRING_DATASOURCE_USERNAME=root
     SPRING_DATASOURCE_PASSWORD=yourpassword
     SPRING_JPA_HIBERNATE_DDL_AUTO=update
     ```

3. **Get Your Backend URL**
   - Format: `https://yourapp.onrender.com`
   - Update frontend `.env.production` with this URL

## Alternative: Use Database from MySQL Host

Create a free MySQL database at:
- https://freedb.tech (5MB free)
- https://www.db4free.net (1GB free)

Then use those connection details in Render environment variables.

## Test Backend
```bash
curl https://yourapp.onrender.com/api/projects
```

Should return: `[]` (empty list)
