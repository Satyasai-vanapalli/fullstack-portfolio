# Deploy to Railway (Free & Easy)

Your full-stack portfolio is ready to share! Deploy it to Railway for a public URL.

## **Steps:**

### 1. Create Railway Account
- Go to https://railway.app
- Sign up with GitHub (recommended)

### 2. Deploy Your Project
- Click "New Project"
- Select "Deploy from GitHub repo"
- Choose: `Satyasai-vanapalli/fullstack-portfolio`
- Railway will auto-detect and deploy!

### 3. Get Your Public URL
Once deployed, Railway gives you:
```
https://yourproject.up.railway.app
```

Your friend can just click this link! 🚀

---

## **Alternative: Use Docker Hub Images Directly**

Your images are already on Docker Hub:
- Backend: `satyasai31222/portfolio-backend:latest`
- Frontend: `satyasai31222/portfolio-frontend:latest`

Your friend can use any free container hosting:
- **Railway.app** (recommended, easiest)
- **Render.com**
- **Heroku** (limited free tier)
- **fly.io**

---

## **Quickest Method: Share Docker Compose**

Create a file called `docker-compose.prod.yml` and share with your friend:

```yaml
version: '3.8'
services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: portfolio_db
    ports:
      - "3306:3306"
  
  backend:
    image: satyasai31222/portfolio-backend:latest
    ports:
      - "8081:8080"
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/portfolio_db
      SPRING_DATASOURCE_USERNAME: root
      SPRING_DATASOURCE_PASSWORD: root
    depends_on:
      - mysql
  
  frontend:
    image: satyasai31222/portfolio-frontend:latest
    ports:
      - "3000:3000"
    depends_on:
      - backend
```

**Your friend runs:**
```bash
docker-compose -f docker-compose.prod.yml up -d
```

Then opens: `http://localhost:3000`

---

## **Which Option?**

1. **Railway.app** = Easiest, public URL (recommended)
2. **Docker Compose file** = Simple, runs locally on their device
3. **Manual setup** = They follow docker-compose setup steps

**I recommend Railway.app!** Your friend just needs to click a link! ✨
