# Rancher EKS Integration Setup

This guide walks you through adding your AWS EKS cluster to Rancher for centralized management.

## Prerequisites

- ✅ EKS cluster is running and accessible
- ✅ `kubectl` configured to access your EKS cluster
- ✅ Rancher server installed and accessible
- ✅ AWS CLI configured with appropriate permissions
- ✅ `eksctl` installed

## Step 1: Verify EKS Cluster Status

```bash
# Check if your EKS cluster is running
eksctl get cluster --name devop-training-cluster --region eu-central-1

# Verify kubectl access
kubectl get nodes
kubectl get namespaces
```

Expected output:
```
NAME                    STATUS   ROLES    AGE   VERSION
ip-192-168-1-xxx.ec2.internal   Ready    <none>   5m   v1.28.x
ip-192-168-2-xxx.ec2.internal   Ready    <none>   5m   v1.28.x
```

## Step 2: Prepare EKS Cluster for Rancher

### 2.1 Update kubeconfig
```bash
# Update kubeconfig for your cluster
aws eks update-kubeconfig --region eu-central-1 --name devop-training-cluster

# Verify access
kubectl get nodes
```

### 2.2 Install required tools (if not already installed)
```bash
# Install helm (if not installed)
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

# Verify helm installation
helm version
```

## Step 3: Access Rancher UI

1. **Open Rancher UI** in your browser
   - URL: `https://your-rancher-server.com`
   - Login with your Rancher credentials

2. **Navigate to Cluster Management**
   - Click on "Cluster Management" in the left sidebar
   - Click "Import Existing" or "Add Cluster"

## Step 4: Import EKS Cluster to Rancher

### 4.1 Choose Import Method
Select **"Generic"** import method for EKS clusters.

### 4.2 Generate Cluster Registration Command
1. In Rancher UI, select **"Generic"** as the cluster type
2. Enter cluster name: `devop-training-cluster`
3. Click **"Create"**
4. Rancher will generate a registration command

### 4.3 Apply Registration Command
Copy the generated command from Rancher UI and run it in your terminal:

```bash
# Example command (your actual command will be different)
kubectl apply -f https://your-rancher-server.com/v3/import/abc123def456.yaml
```

**Note**: The actual command will contain your specific Rancher server URL and unique token.

## Step 5: Verify Cluster Registration

### 5.1 Check Registration Status
```bash
# Check if Rancher agent is running
kubectl get pods -n cattle-system

# Expected output should show:
# NAME                                    READY   STATUS    RESTARTS   AGE
# cattle-cluster-agent-xxx                1/1     Running   0          2m
# cattle-node-agent-xxx                   1/1     Running   0          2m
```

### 5.2 Verify in Rancher UI
1. Go back to Rancher UI
2. Navigate to **Cluster Management**
3. You should see your `devop-training-cluster` listed
4. Click on the cluster name to view details

## Step 6: Configure Cluster Settings

### 6.1 Set Cluster Labels (Optional)
```bash
# Add labels to identify the cluster
kubectl label nodes --all environment=development
kubectl label nodes --all cluster-type=eks
```

### 6.2 Configure Resource Quotas (Optional)
In Rancher UI:
1. Go to your cluster
2. Navigate to **Resources** → **Resource Quotas**
3. Set appropriate limits for your development environment

## Step 7: Deploy Sample Application

### 7.1 Create Namespace
```bash
# Create a namespace for your application
kubectl create namespace devop-training

# Label the namespace
kubectl label namespace devop-training environment=development
```

### 7.2 Deploy MoMo API Application
```bash
# Apply your MoMo API deployment
kubectl apply -f k8s/deployment.yaml -n devop-training

# Check deployment status
kubectl get deployments -n devop-training
kubectl get pods -n devop-training
kubectl get services -n devop-training
```

### 7.3 Verify in Rancher UI
1. In Rancher, go to your cluster
2. Navigate to **Workloads** → **Deployments**
3. You should see your MoMo API deployment
4. Click on it to view details, logs, and manage the application

## Step 8: Configure Monitoring and Logging

### 8.1 Enable Monitoring (Optional)
In Rancher UI:
1. Go to your cluster
2. Navigate to **Apps & Marketplace**
3. Install **Monitoring** (Prometheus/Grafana)
4. Follow the installation wizard

### 8.2 Configure Logging (Optional)
1. In Rancher UI, go to **Apps & Marketplace**
2. Install **Logging** (Fluentd/Elasticsearch)
3. Configure log collection for your applications

## Step 9: Set Up CI/CD Integration

### 9.1 Configure Git Integration
1. In Rancher, go to your cluster
2. Navigate to **Apps & Marketplace**
3. Install **ArgoCD** or **Flux** for GitOps
4. Configure your repository connection

### 9.2 Set Up Webhooks
```bash
# Get the webhook URL from Rancher
# This will be used in your GitHub Actions or GitLab CI
echo "Webhook URL: https://your-rancher-server.com/v3/projects/your-project-id/pipelines/your-pipeline-id"
```

## Step 10: Security Configuration

### 10.1 Configure RBAC
```bash
# Create service account for CI/CD
kubectl create serviceaccount cicd-service-account -n devop-training

# Create role binding
kubectl create rolebinding cicd-role-binding \
  --clusterrole=edit \
  --serviceaccount=devop-training:cicd-service-account \
  --namespace=devop-training
```

### 10.2 Set Up Network Policies
```yaml
# Create network policy for MoMo API
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: momo-api-network-policy
  namespace: devop-training
spec:
  podSelector:
    matchLabels:
      app: momo-api
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: ingress-nginx
    ports:
    - protocol: TCP
      port: 3001
```

## Troubleshooting

### Common Issues and Solutions

#### Issue 1: Cluster Registration Fails
```bash
# Check Rancher agent logs
kubectl logs -n cattle-system deployment/cattle-cluster-agent

# Verify network connectivity
kubectl run test-pod --image=busybox --rm -it -- nslookup your-rancher-server.com
```

#### Issue 2: Pods Not Starting
```bash
# Check pod status
kubectl describe pods -n devop-training

# Check events
kubectl get events -n devop-training --sort-by='.lastTimestamp'
```

#### Issue 3: Service Not Accessible
```bash
# Check service endpoints
kubectl get endpoints -n devop-training

# Test service connectivity
kubectl run test-pod --image=busybox --rm -it -- wget -qO- http://momo-api-service:3001/health
```

## Cleanup Commands

### Remove Cluster from Rancher
1. In Rancher UI, go to your cluster
2. Click **"Delete"** and confirm
3. Run the cleanup command provided by Rancher

### Delete EKS Cluster
```bash
# Delete the entire EKS cluster
eksctl delete cluster --name devop-training-cluster --region eu-central-1

# Verify deletion
eksctl get cluster --region eu-central-1
```

## Next Steps

1. **Set up monitoring** for your applications
2. **Configure CI/CD pipelines** for automated deployments
3. **Implement security policies** and network policies
4. **Set up backup and disaster recovery**
5. **Configure auto-scaling** for your workloads

## Useful Commands Reference

```bash
# Cluster management
kubectl get nodes
kubectl get namespaces
kubectl get pods --all-namespaces

# Application management
kubectl get deployments -n devop-training
kubectl get services -n devop-training
kubectl logs -f deployment/momo-api -n devop-training

# Rancher specific
kubectl get pods -n cattle-system
kubectl logs -n cattle-system deployment/cattle-cluster-agent
```

## Support and Resources

- [Rancher Documentation](https://rancher.com/docs/)
- [EKS Documentation](https://docs.aws.amazon.com/eks/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Project Repository](https://github.com/your-org/Devops-Training-Mtn)
