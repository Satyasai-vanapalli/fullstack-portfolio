# GitHub Actions CI/CD Pipeline

## Overview
The CI/CD pipeline automatically builds Docker images, runs tests, and pushes to Docker Hub on every push or pull request.

## File Location
`.github/workflows/build-push-deploy.yaml`

## Setup

### Prerequisites
1. GitHub repository with this code
2. Docker Hub account
3. Docker Hub access token

### GitHub Secrets Configuration

1. Go to your repository on GitHub
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Create the following secrets:

| Secret Name | Value |
|---|---|
| `DOCKER_USERNAME` | Your Docker Hub username |
| `DOCKER_PASSWORD` | Docker Hub Personal Access Token (NOT your password!) |

### Creating Docker Hub Access Token

1. Log in to [Docker Hub](https://hub.docker.com)
2. Go to **Account Settings** → **Security**
3. Click **New Access Token**
4. Name it (e.g., `github-actions`)
5. Select permissions: **Read, Write, Delete**
6. Create and copy the token
7. Paste in GitHub Secrets as `DOCKER_PASSWORD`

## Workflow Triggers

The pipeline runs on:
- **Push to main or develop branch**
- **Pull requests to main branch**

### Customize Triggers
Edit `.github/workflows/build-push-deploy.yaml`:

```yaml
on:
  push:
    branches:
      - main
      - develop
      - feature/*        # Add this for feature branches
  pull_request:
    branches:
      - main
```

## Jobs

### 1. Build Backend (`build-backend`)
- **Runs on**: Ubuntu latest
- **Steps**:
  1. Checkout code
  2. Setup Docker Buildx
  3. Login to Docker Hub
  4. Build and push backend image
  5. Tag with `latest` and commit SHA
  6. Cache for faster builds

### 2. Build Frontend (`build-frontend`)
- **Runs on**: Ubuntu latest
- **Steps**:
  1. Checkout code
  2. Setup Docker Buildx
  3. Login to Docker Hub
  4. Build and push frontend image
  5. Tag with `latest` and commit SHA
  6. Cache for faster builds

### 3. Test Backend (`test-backend`)
- **Runs after**: `build-backend` completes
- **Steps**:
  1. Checkout code
  2. Setup Java 17
  3. Run Maven tests: `mvn clean test`

### 4. Test Frontend (`test-frontend`)
- **Runs after**: `build-frontend` completes
- **Steps**:
  1. Checkout code
  2. Setup Node.js 18
  3. Install dependencies
  4. Run tests: `npm test`

## Docker Image Tags

Images are tagged with:
- `latest` - Latest build from main/develop
- `<commit-sha>` - Specific commit SHA for rollback capability

Example:
- `myusername/portfolio-backend:latest`
- `myusername/portfolio-backend:abc123def456`
- `myusername/portfolio-frontend:latest`
- `myusername/portfolio-frontend:abc123def456`

## Viewing Workflow Results

1. Go to your GitHub repository
2. Click **Actions** tab
3. Select workflow run
4. View logs for each job
5. Check push to Docker Hub

### Monitoring Builds

```bash
# In terminal, watch for images
docker pull myusername/portfolio-backend:latest
docker images | grep portfolio
```

## Customization

### Add Slack Notifications
```yaml
- name: Notify Slack
  if: always()
  uses: slackapi/slack-github-action@v1
  with:
    payload: |
      {
        "text": "Build: ${{ job.status }}"
      }
```

### Add CodeQL Analysis
```yaml
- name: Initialize CodeQL
  uses: github/codeql-action/init@v2
  with:
    languages: 'java,javascript'

- name: Perform CodeQL Analysis
  uses: github/codeql-action/analyze@v2
```

### Add SonarQube Analysis
```yaml
- name: SonarQube Scan
  uses: SonarSource/sonarcloud-github-action@master
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
```

### Deploy to Kubernetes
```yaml
- name: Deploy to Kubernetes
  uses: actions-hub/kubectl@master
  env:
    KUBE_CONFIG: ${{ secrets.KUBE_CONFIG }}
  with:
    args: apply -f kubernetes/
```

## Environment Variables in Workflow

The workflow uses these environment variables:

```yaml
env:
  REGISTRY: docker.io
  DOCKER_USERNAME: ${{ secrets.DOCKER_USERNAME }}
```

These are passed to Docker login and used in build context.

## Performance Optimization

### Layer Caching
The workflow uses layer caching to speed up builds:

```yaml
cache-from: type=registry,ref=${{ secrets.DOCKER_USERNAME }}/portfolio-backend:buildcache
cache-to: type=registry,ref=${{ secrets.DOCKER_USERNAME }}/portfolio-backend:buildcache,mode=max
```

### Parallel Jobs
Building frontend and backend happens in parallel:
- Both `build-*` jobs start immediately
- `test-*` jobs depend on respective builds
- Tests run in parallel

## Troubleshooting

### Build Fails
1. Check GitHub Actions logs
2. Look for error messages
3. Common issues:
   - Docker login failed → Check secrets
   - Test failed → Check code
   - Out of disk → GitHub runners have limited space

### Images Not Pushed
1. Verify Docker credentials in GitHub Secrets
2. Check Docker Hub is accessible
3. Review image naming conventions

### Tests Failing
1. Check if tests pass locally: `mvn clean test` or `npm test`
2. Verify test dependencies are installed
3. Check environment variables in workflow

## Security Best Practices

1. **Use Personal Access Token**: Not your Docker Hub password
2. **Limit Token Scope**: Only grant necessary permissions
3. **Rotate Tokens**: Regularly update access tokens
4. **Protect Secrets**: Don't commit secrets to repository
5. **Use YAML Validation**: Validate workflow syntax before committing

### Validate Workflow
```bash
# Install actionlint
# Then validate
actionlint .github/workflows/build-push-deploy.yaml
```

## Monitoring and Alerts

### Track Workflow Runs
```bash
# List recent workflow runs
gh run list --workflow build-push-deploy.yaml --limit 10

# Watch latest run
gh run watch <run-id>

# View logs
gh run view <run-id> --log
```

## Cost Optimization

- Free tier includes 2,000 minutes/month for private repos
- Each job runs on shared runners
- Optimize build time to save minutes
- Consider using self-hosted runners for frequent builds

## Advanced Scenarios

### Matrix Builds
```yaml
strategy:
  matrix:
    java-version: [17, 21]
    node-version: [18, 20]
```

### Conditional Steps
```yaml
- name: Deploy to production
  if: github.ref == 'refs/heads/main' && github.event_name == 'push'
  run: echo "Deploying to production"
```

### Manual Trigger
```yaml
on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to deploy'
        required: true
        default: 'staging'
```

## References

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Build Action](https://github.com/docker/build-push-action)
- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions)
- [Workflow Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
