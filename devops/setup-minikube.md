# Documentation: Setup of Docker, Minikube, Kubernetes CLI, and Rancher

This guide documents the steps (with comments) to install and configure **Docker Desktop**, **Minikube**, **kubectl**, and **Rancher** for local Kubernetes experimentation.

---

## 1. System Information

```bash
lsb_release -a
```

👉 Check OS release info (Ubuntu/Debian version).

---

## 2. Install Dependencies for Docker

```bash
sudo apt install apt-transport-https ca-certificates curl gnupg
```

👉 Required packages for handling HTTPS repositories and GPG keys.

---

## 3. Setup Docker Repository

```bash
# Add Docker GPG key
curl -fsSL https://download.docker.com/linux/debian/gpg | \
  sudo gpg --dearmor -o /usr/share/keyrings/docker.gpg

# Add Docker repo to apt sources
echo "deb [arch=$(dpkg --print-architecture) \
signed-by=/usr/share/keyrings/docker.gpg] \
https://download.docker.com/linux/ubuntu noble stable" | \
sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Update package index
sudo apt update
```

---

## 4. Install Docker Desktop

```bash
# Install from downloaded .deb file
sudo apt-get install ./docker-desktop-amd64.deb
```

If permissions fail:

```bash
chmod +x ./docker-desktop-amd64.deb
sudo apt install /home/nana/Downloads/docker-desktop-amd64.deb
```

---

## 5. Verify Virtualization Support

```bash
lscpu | grep Virtualization
egrep -c '(vmx|svm)' /proc/cpuinfo
```

👉 Needed for Minikube’s virtualization.

---

## 6. Add User to Docker Group

```bash
sudo usermod -aG docker $USER && newgrp docker
docker -v
```

👉 Run Docker without `sudo`.

---

## 7. Run Rancher in Docker

```bash
docker run -d --restart=unless-stopped \
  -p 80:80 -p 443:443 \
  --privileged \
  --name rancher \
  rancher/rancher:latest
```

👉 Starts Rancher management server.

---

## 8. Install Minikube

```bash
cd Downloads/
sudo install minikube-linux-amd64 /usr/local/bin/minikube

# Verify
minikube version
```

---

## 9. Start Minikube Cluster

```bash
minikube start --driver=docker --memory=4192
kubectl get nodes
minikube kubectl -- get pods -A
```

---

## 10. Install kubectl (Kubernetes CLI)

```bash
# Add Kubernetes apt key and repo
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.30/deb/Release.key | \
  sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg

echo "deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] \
https://pkgs.k8s.io/core:/stable:/v1.30/deb/ /" | \
sudo tee /etc/apt/sources.list.d/kubernetes.list

sudo apt-get update
sudo apt install -y kubectl
```

---

## 11. Configure Kubeconfig

```bash
# Combine kubeconfig from minikube with default
export KUBECONFIG=$HOME/.kube/config:$HOME/.minikube/profiles/minikube/client.config

kubectl get nodes

# Export config for external use
kubectl config view --flatten --minify > minikube-kubeconfig.yaml
```

---

## 12. Connect Rancher with Minikube

1. Get bootstrap password from Rancher logs:

   ```bash
   docker logs <container_id> 2>&1 | grep "Bootstrap Password:"
   ```

2. Import Minikube into Rancher:

   ```bash
   curl --insecure -sfL https://localhost/v3/import/<import_token>.yaml | kubectl apply -f -
   ```

3. Verify agent:

   ```bash
   kubectl get pods -n cattle-system
   ```

---

## 13. Troubleshooting Rancher Agent

* Set Rancher server URL for agent:

  ```bash
  kubectl -n cattle-system set env deploy/cattle-cluster-agent \
  CATTLE_SERVER=https://192.168.49.1
  ```
* Disable strict TLS verification (lab only):

  ```bash
  kubectl -n cattle-system set env deploy/cattle-cluster-agent STRICT_VERIFY=false
  ```
* Restart agent:

  ```bash
  kubectl -n cattle-system rollout restart deploy cattle-cluster-agent
  ```

---

## 14. Networking Fixes

* Get Minikube IP:

  ```bash
  minikube ip
  ```
* Connect Rancher container to Minikube network:

  ```bash
  docker network connect <network_id> <rancher_container_id>
  ```
* Set agent IP manually if needed:

  ```bash
  kubectl -n cattle-system set env deploy/cattle-cluster-agent CATTLE_AGENT_IP=192.168.49.2
  ```

---

## 15. Restart Rancher Cleanly

```bash
docker stop rancher && docker rm rancher

docker run -d --restart=unless-stopped \
  --privileged \
  -p 80:80 -p 443:443 \
  --name rancher \
  rancher/rancher:latest
```
 