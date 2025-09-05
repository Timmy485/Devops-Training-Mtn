# AWS EKS Cluster Setup

## Basic EKS Cluster Creation

### Option 1: Minimum Viable Cluster (t3.micro - Recommended)
```bash
eksctl create cluster \
  --name devop-training-cluster \
  --region eu-central-1 \
  --node-type t3.micro \
  --nodes 2 \
  --zones eu-central-1a,eu-central-1b
```

### Option 2: Small Production-Ready Cluster (t3.small)
```bash
eksctl create cluster \
  --name devop-training-cluster \
  --region eu-central-1 \
  --node-type t3.small \
  --nodes 2 \
  --zones eu-central-1a,eu-central-1b
```

### Option 3: Original Configuration (t2.medium)
```bash
eksctl create cluster \
  --name devop-training-cluster \
  --region eu-central-1 \
  --node-type t2.medium \
  --zones eu-central-1a,eu-central-1b
```

## Instance Type Comparison

| Instance Type | vCPUs | Memory | Network | Cost (approx.) | EKS Suitability |
|---------------|-------|--------|---------|----------------|-----------------|
| t2.micro      | 1     | 1 GB   | Low     | $0.0104/hour   | ❌ Not recommended |
| t3.micro      | 2     | 1 GB   | Up to 5 Gbps | $0.0104/hour | ✅ Minimum viable |
| t2.small      | 1     | 2 GB   | Low     | $0.0208/hour   | ⚠️ Limited |
| t3.small      | 2     | 2 GB   | Up to 5 Gbps | $0.0208/hour | ✅ Recommended |
| t2.medium     | 2     | 4 GB   | Low to Moderate | $0.0416/hour | ✅ Good for dev |

## Important Notes

### Why t2.micro is NOT recommended:
- **CPU Credits**: t2.micro uses burstable performance, which can throttle under sustained workloads
- **Memory Limitation**: Only 1 GB RAM is insufficient for Kubernetes system pods
- **Pod Density**: Very limited number of pods due to IP address constraints
- **Performance Issues**: May cause cluster instability and slow response times

### Why t3.micro is better than t2.micro:
- **Better CPU Performance**: More consistent performance without throttling
- **Same Cost**: Similar pricing to t2.micro
- **Better Networking**: Up to 5 Gbps network performance
- **More Reliable**: Designed to avoid application degradation

### Cost Optimization Tips:
1. Use **t3.micro** for development/testing environments
2. Use **t3.small** for small production workloads
3. Consider **Spot Instances** for non-critical workloads
4. Use **Fargate** for serverless container workloads
5. Implement **Cluster Autoscaler** for dynamic scaling

## Cleanup Commands
```bash
# Delete the cluster when done
eksctl delete cluster --name devop-training-cluster --region eu-central-1

# Verify cluster deletion
eksctl get cluster --region eu-central-1
```
