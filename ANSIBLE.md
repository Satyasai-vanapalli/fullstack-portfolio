# Ansible Automation Guide

## Overview
Ansible playbooks automate the deployment and setup of the portfolio application for both local development and Kubernetes environments.

## Files

### 1. `setup-local-env.yaml`
Automates local Docker-based development environment setup.

### 2. `deploy-k8s.yaml`
Automates full-stack deployment to Kubernetes cluster.

### 3. `inventory.ini`
Defines hosts and connection parameters for Ansible.

## Prerequisites

### Installation
```bash
# Install Ansible
pip install ansible

# Install Kubernetes Python client (for K8s playbook)
pip install kubernetes

# Install Docker Python client (for local setup)
pip install docker
```

### Verification
```bash
ansible --version
ansible localhost -m setup
```

## Inventory Configuration

### `inventory.ini`
```ini
[localhost]
# For local development setup
localhost ansible_connection=local

[kubernetes_cluster]
# For Kubernetes deployment
k8s_master ansible_host=<your-k8s-master-ip> ansible_user=ubuntu
```

## Local Development Setup

### Run the Playbook
```bash
# Run against localhost
ansible-playbook ansible/setup-local-env.yaml

# Run with custom inventory
ansible-playbook -i ansible/inventory.ini ansible/setup-local-env.yaml

# Run with extra variables
ansible-playbook ansible/setup-local-env.yaml \
  -e "project_dir=/path/to/project" \
  -e "frontend_port=3001"
```

### What It Does
1. Verifies Docker and Docker Compose installation
2. Creates Docker network (`portfolio-network`)
3. Starts MySQL container with initialization script
4. Builds backend Docker image
5. Starts backend container
6. Builds frontend Docker image
7. Starts frontend container
8. Waits for all services to be healthy
9. Displays service URLs and demo credentials

### Tasks Breakdown
```yaml
- Verify Docker is installed
- Verify Docker Compose is installed
- Create Docker network
- Start MySQL container
- Wait for MySQL to be ready (port 3306)
- Build backend Docker image
- Start backend container
- Build frontend Docker image
- Start frontend container
- Wait for backend to be ready (port 8080)
- Wait for frontend to be ready (port 3000)
- Display service URLs
```

### Variables Used
```yaml
docker_username: ""           # Docker Hub username
docker_password: ""           # Docker Hub password
k8s_namespace: "default"      # Kubernetes namespace
mysql_port: 3306
backend_port: 8080
frontend_port: 3000
```

## Kubernetes Deployment

### Prerequisites
- Kubernetes cluster configured
- `kubectl` configured to access cluster
- Docker Hub credentials (optional but recommended)

### Run the Playbook
```bash
# Deploy to Kubernetes
ansible-playbook -i ansible/inventory.ini ansible/deploy-k8s.yaml

# Deploy to specific host
ansible-playbook -i ansible/inventory.ini ansible/deploy-k8s.yaml \
  -l kubernetes_cluster

# Deploy with verbose output
ansible-playbook -i ansible/inventory.ini ansible/deploy-k8s.yaml -vvv

# Run specific task only
ansible-playbook ansible/deploy-k8s.yaml \
  --tags "deploy-backend"
```

### What It Does
1. Verifies kubectl is installed
2. Gets current Kubernetes context
3. Creates Docker registry secret
4. Applies ConfigMaps for configuration
5. Applies Secrets for sensitive data
6. Applies MySQL initialization scripts
7. Deploys MySQL
8. Waits for MySQL to be ready
9. Deploys Backend
10. Deploys Frontend
11. Applies HPA (Horizontal Pod Autoscaler)
12. Gets service URLs
13. Verifies all deployments are healthy

### Variables Used
```yaml
docker_username: ""           # Docker Hub username
docker_password: ""           # Docker Hub password
k8s_namespace: "default"      # Kubernetes namespace
docker_registry: "docker.io"
```

## Advanced Usage

### Run with Tags
```bash
# Only deploy backend
ansible-playbook ansible/deploy-k8s.yaml --tags "deploy-backend"

# Skip MySQL deployment
ansible-playbook ansible/deploy-k8s.yaml --skip-tags "deploy-mysql"
```

### Dry Run (Check Mode)
```bash
# Simulate without making changes
ansible-playbook ansible/setup-local-env.yaml --check

# Dry run with diff
ansible-playbook ansible/setup-local-env.yaml --check --diff
```

### Debugging
```bash
# Verbose output
ansible-playbook -vvv ansible/setup-local-env.yaml

# Extra verbose (module debugging)
ansible-playbook -vvvv ansible/setup-local-env.yaml

# Start at specific task
ansible-playbook ansible/setup-local-env.yaml \
  --start-at-task "Start MySQL container"
```

### Custom Variables
```bash
# Override variables from command line
ansible-playbook ansible/setup-local-env.yaml \
  -e "mysql_port=3307" \
  -e "backend_port=8081" \
  -e "frontend_port=3001"

# From file
ansible-playbook ansible/setup-local-env.yaml \
  -e @variables.yml
```

## Cleanup

### Local Docker Setup
```yaml
# Create cleanup playbook
---
- name: Cleanup local environment
  hosts: localhost
  tasks:
    - name: Stop containers
      docker_container:
        name: "{{ item }}"
        state: stopped
      loop:
        - portfolio-frontend
        - portfolio-backend
        - portfolio-mysql

    - name: Remove containers
      docker_container:
        name: "{{ item }}"
        state: absent
      loop:
        - portfolio-frontend
        - portfolio-backend
        - portfolio-mysql

    - name: Remove network
      docker_network:
        name: portfolio-network
        state: absent
```

### Kubernetes Cleanup
```bash
# Delete all resources
kubectl delete -f kubernetes/

# Delete namespace
kubectl delete namespace portfolio

# Delete specific resource
kubectl delete deployment backend-deployment
```

## Troubleshooting

### Common Errors

#### Connection Refused
```bash
# Check if Docker daemon is running
sudo systemctl status docker

# Check Kubernetes cluster access
kubectl cluster-info
```

#### Permission Denied
```bash
# Add user to docker group (Linux)
sudo usermod -aG docker $USER
newgrp docker

# Run with sudo if needed
sudo ansible-playbook ansible/setup-local-env.yaml
```

#### Variable Not Defined
```bash
# Use Ansible vault for sensitive variables
ansible-vault create vars/secrets.yml

# Use in playbook
ansible-playbook ansible/setup-local-env.yaml -e @vars/secrets.yml
```

### Debugging Playbook
```bash
# Add debug tasks
- name: Debug variables
  debug:
    var: project_dir

# Print message
- name: Print message
  debug:
    msg: "Service starting on port {{ frontend_port }}"
```

## Best Practices

1. **Use Inventory Groups**: Organize hosts logically
2. **Variable Management**: Use separate variable files for different environments
3. **Error Handling**: Use `block` and `rescue` for error handling
4. **Idempotency**: Ensure playbooks can run multiple times safely
5. **Documentation**: Add comments explaining complex tasks
6. **Testing**: Test with `--check` mode first
7. **Secrets Management**: Use Ansible Vault for sensitive data

### Ansible Vault for Secrets
```bash
# Create encrypted file
ansible-vault create vars/secrets.yml

# Edit encrypted file
ansible-vault edit vars/secrets.yml

# Run playbook with vault
ansible-playbook playbook.yml \
  --ask-vault-pass
```

## Integration with CI/CD

### GitHub Actions
```yaml
- name: Deploy with Ansible
  uses: dawidd6/action-ansible-playbook@v2
  with:
    playbook: ansible/deploy-k8s.yaml
    inventory: ansible/inventory.ini
    vault_password: ${{ secrets.VAULT_PASSWORD }}
```

### Jenkins
```groovy
stage('Deploy') {
  steps {
    sh '''
      ansible-playbook \
        -i ansible/inventory.ini \
        ansible/deploy-k8s.yaml \
        --vault-password-file .vault_password
    '''
  }
}
```

## References

- [Ansible Documentation](https://docs.ansible.com/)
- [Ansible Best Practices](https://docs.ansible.com/ansible/latest/tips_tricks/index.html)
- [Kubernetes Ansible Module](https://docs.ansible.com/ansible/latest/collections/kubernetes/core/k8s_module.html)
- [Docker Ansible Module](https://docs.ansible.com/ansible/latest/collections/community/docker/docker_container_module.html)
