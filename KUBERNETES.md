# Kubernetes Architecture Guide

## Overview
This application is deployed on Kubernetes with a 3-tier architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                    Kubernetes Cluster                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────┐                                       │
│  │   Frontend       │  (LoadBalancer Service)               │
│  │   Deployment     │  Port: 80 → 3000                      │
│  │   (2-4 replicas) │                                       │
│  └──────────────────┘                                       │
│           │                                                  │
│           │ (HTTP)                                          │
│           ▼                                                  │
│  ┌──────────────────┐                                       │
│  │   Backend        │  (LoadBalancer Service)               │
│  │   Deployment     │  Port: 8080                           │
│  │   (2-5 replicas) │  + HPA Auto-scaling                   │
│  └──────────────────┘                                       │
│           │                                                  │
│           │ (JDBC)                                          │
│           ▼                                                  │
│  ┌──────────────────┐                                       │
│  │   MySQL          │  (ClusterIP Service)                  │
│  │   Deployment     │  Port: 3306                           │
│  │   (1 replica)    │  + PersistentVolume                   │
│  └──────────────────┘                                       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Components

### 1. ConfigMaps and Secrets (config.yaml)
- **ConfigMap**: Non-sensitive configuration (JWT_SECRET, JWT_EXPIRATION)
- **Secret**: Sensitive data (database passwords)
- **PersistentVolume & PersistentVolumeClaim**: MySQL data persistence

### 2. MySQL Deployment (mysql-deployment.yaml)
- Single replica (for HA, use managed database service)
- Persistent storage using PVC
- Health checks (liveness & readiness probes)
- Resource limits: 512Mi memory, 500m CPU
- Database initialization with schema

### 3. Backend Deployment (backend-deployment.yaml)
- 2 replicas (can scale up to 5 via HPA)
- Environment variables from ConfigMap and Secrets
- Health checks for pod lifecycle management
- Load balancer service on port 8080
- Resource requests: 256Mi memory, 250m CPU

### 4. Frontend Deployment (frontend-deployment.yaml)
- 2 replicas (can scale up to 4 via HPA)
- Environment variables for API URL configuration
- Health checks
- Load balancer service on port 80 (maps to 3000)
- Resource requests: 128Mi memory, 100m CPU

### 5. Horizontal Pod Autoscaler (hpa.yaml)
- **Backend HPA**: Scales 2-5 replicas based on CPU (70%) and memory (80%)
- **Frontend HPA**: Scales 2-4 replicas based on CPU (70%)
- Automatically adjusts resources based on demand

## Deployment Process

### Prerequisites
```bash
# 1. Verify cluster access
kubectl cluster-info

# 2. Create namespace (optional)
kubectl create namespace portfolio

# 3. Create Docker registry secret
kubectl create secret docker-registry dockerhub-secret \
  --docker-server=docker.io \
  --docker-username=<username> \
  --docker-password=<password> \
  --docker-email=<email> \
  -n portfolio
```

### Deployment Steps
```bash
# 1. Apply ConfigMaps and Secrets
kubectl apply -f kubernetes/config.yaml

# 2. Deploy MySQL
kubectl apply -f kubernetes/mysql-deployment.yaml

# 3. Wait for MySQL to be ready
kubectl wait --for=condition=ready pod -l app=mysql --timeout=300s

# 4. Deploy Backend
kubectl apply -f kubernetes/backend-deployment.yaml

# 5. Deploy Frontend
kubectl apply -f kubernetes/frontend-deployment.yaml

# 6. Apply Auto-scaling
kubectl apply -f kubernetes/hpa.yaml

# 7. Verify all resources
kubectl get all
```

## Verification Commands

```bash
# Check pods
kubectl get pods
kubectl describe pod <pod-name>

# Check services and get endpoints
kubectl get svc
kubectl describe svc backend-service
kubectl describe svc frontend-service

# Check deployments
kubectl get deployments
kubectl describe deployment backend-deployment

# Check HPA status
kubectl get hpa
kubectl describe hpa backend-hpa

# View logs
kubectl logs <pod-name>
kubectl logs -f <pod-name>  # Follow logs

# Check resource usage
kubectl top pods
kubectl top nodes

# Port forward for testing
kubectl port-forward svc/backend-service 8080:8080
kubectl port-forward svc/frontend-service 3000:80
```

## Scaling

### Manual Scaling
```bash
# Scale backend to 5 replicas
kubectl scale deployment backend-deployment --replicas=5

# Scale frontend to 3 replicas
kubectl scale deployment frontend-deployment --replicas=3
```

### Automatic Scaling (HPA)
The HPA automatically scales pods based on metrics:
- Backend: 70% CPU utilization or 80% memory utilization
- Frontend: 70% CPU utilization

### View HPA Status
```bash
kubectl get hpa -w  # Watch for scale events
```

## Updates and Rollouts

### Rolling Update
```bash
# Update backend image
kubectl set image deployment/backend-deployment \
  backend=<username>/portfolio-backend:v2.0

# Watch rollout progress
kubectl rollout status deployment/backend-deployment

# Check rollout history
kubectl rollout history deployment/backend-deployment

# Rollback to previous version
kubectl rollout undo deployment/backend-deployment
```

## Persistence

### MySQL Data Persistence
- Uses PersistentVolume (PV) for data storage
- PersistentVolumeClaim (PVC) mounts to `/var/lib/mysql`
- Data persists even if pod is recreated

### Backup
```bash
# Backup MySQL database
kubectl exec -it mysql-deployment-<pod-id> -- \
  mysqldump -u root -proot portfolio_db > backup.sql

# Restore from backup
kubectl exec -i mysql-deployment-<pod-id> -- \
  mysql -u root -proot portfolio_db < backup.sql
```

## Security Considerations

1. **Network Policies**: Implement to restrict traffic between pods
2. **RBAC**: Use Role-Based Access Control for security
3. **Pod Security Policies**: Define security standards
4. **Secrets**: Use Kubernetes Secrets for sensitive data (never in ConfigMaps)
5. **Resource Limits**: Prevent resource exhaustion
6. **Read-only Filesystem**: Consider making container filesystems read-only

### Example Network Policy
```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: backend-network-policy
spec:
  podSelector:
    matchLabels:
      app: backend
  policyTypes:
    - Ingress
  ingress:
    - from:
        - podSelector:
            matchLabels:
              app: frontend
      ports:
        - protocol: TCP
          port: 8080
```

## Monitoring and Logging

### Prometheus Metrics
Configure Prometheus to scrape backend metrics:
```yaml
- job_name: 'portfolio-backend'
  kubernetes_sd_configs:
    - role: pod
  relabel_configs:
    - source_labels: [__meta_kubernetes_pod_label_app]
      action: keep
      regex: backend
```

### Centralized Logging
Consider using:
- **ELK Stack**: Elasticsearch, Logstash, Kibana
- **Splunk**: For log aggregation and analysis
- **Datadog**: For monitoring and logging
- **New Relic**: For observability

## Production Considerations

1. **Use Managed Databases**: AWS RDS, Google Cloud SQL instead of self-hosted MySQL
2. **Enable Ingress Controller**: For better routing and SSL/TLS
3. **Setup Monitoring**: Prometheus + Grafana for metrics
4. **Configure Logging**: Centralized logging for debugging
5. **Implement Health Checks**: Liveness and readiness probes (already configured)
6. **Use Private Container Registry**: Docker Hub alternatives or private registry
7. **Setup Disaster Recovery**: Regular backups and recovery procedures
8. **Multi-region Deployment**: For high availability

## Troubleshooting

### Pod not starting
```bash
kubectl describe pod <pod-name>
kubectl logs <pod-name>
```

### Service not accessible
```bash
kubectl describe svc backend-service
kubectl get endpoints backend-service
```

### Persistent volume issues
```bash
kubectl get pv
kubectl get pvc
kubectl describe pvc mysql-pvc
```

### HPA not scaling
```bash
kubectl describe hpa backend-hpa
kubectl get hpa -w
# Check metrics are available
kubectl top pods
```
