**FD Budget Planner Infrastructure Documentation**
1. Objective
   The goal of this project is to deploy a multi-container application using Docker Compose,
   featuring:
   • A PostgreSQL database in its own container
   • A backend service (Node.js) using a multi-stage build
   • A frontend (React) using a multi-stage build
   • A reverse proxy (nginx-proxy) with automatic TLS via Let’s Encrypt
   • DNS automation via DuckDNS
   • Host-based routing to backend and frontend
   All container, network, and volume names include the prefix “fd” (my initials) to avoid collisions.
2. Prerequisites
   • Basic Linux shell proficiency
   • Azure CLI (if deploying on Azure)
   • Git for source control 
3. Requirements Overview
  SQL database in separate container : postgres:15 container
  Reverse proxy in separate container : jwilder/nginx-proxy container
  TLS termination with valid certificate : jrcs/letsencrypt-nginx-proxy-companion
  Host-based routing to ≥2 containers : VIRTUAL_HOST labels on backend & frontend
  Custom naming prefix : All objects prefixed with fd
  Environment variables : .env file for configuration
  At least 1 custom network : fd_public, fd_internal networks

4. Setup and Deployment and Environment Variables
   Set up the .env file and fill in your values:
# Database
POSTGRES_PASSWORD=postgres
# DuckDNS
DUCKDNS_SUBDOMAIN=yoursubdomain
DUCKDNS_TOKEN=<your-duckdns-token>
# TLS / Hostnames
BUDGET_DOMAIN=yourdomain.duckdns.org
LE_EMAIL=you@example.com
NODE_ENV=production

**Ubuntu 22.04 Commands**
sudo apt update && sudo apt install -y ca-certificates curl gnupg lsb-release \
&& curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o
/usr/share/keyrings/docker-archive-keyring.gpg \
&& echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/dockerarchive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" \
| sudo tee /etc/apt/sources.list.d/docker.list > /dev/null \
&& sudo apt update && sudo apt install -y docker-ce docker-ce-cli containerd.io dockercompose-plugin ufw \
&& sudo systemctl enable --now docker \
&& sudo ufw allow 22/tcp && sudo ufw allow 80/tcp && sudo ufw allow 443/tcp && sudo ufw --
force enable \
&& git clone https://gitlab.com/f.drakalski/infrastructureproject.git infrastructure \
&& cd infrastructure \
&& docker compose up -d

**Alma Linux Commands**
sudo dnf update -y && sudo dnf install -y yum-utils device-mapper-persistent-data lvm2 curl
firewalld \
&& sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/dockerce.repo \
&& sudo dnf install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin \
&& sudo systemctl enable --now docker firewalld \
&& sudo firewall-cmd --permanent --add-port=22/tcp \
&& sudo firewall-cmd --permanent --add-port=80/tcp \
&& sudo firewall-cmd --permanent --add-port=443/tcp \
&& sudo firewall-cmd --reload \
&& git clone https://gitlab.com/f.drakalski/infrastructureproject.git infrastructure \
&& cd infrastructure \
&& docker compose up -d
What these commands do is install the docker services, enable it, open the ports (22,80,443)
and clone the repo and bring the entire stack up. If you already have done previously these
things only the docker-compose up -d is adequate. 

5. DNS and SSL/TLS Configuration
   • Local: Add to /etc/hosts: 127.0.0.1 fd-budgetplanner.duckdns.org api.fdbudgetplanner.duckdns.org
   • Public Cloud: Use DuckDNS in Docker Compose to automate A-record updates
   • TLS certificates are obtained automatically via Let’s Encrypt companion
6. Design Choices
   • Multi-stage builds to reduce image size and separate build/runtime
   • jwilder/nginx-proxy + letsencrypt-companion for automated TLS
   • DuckDNS for dynamic DNS to avoid manual A-record updates
   • Host-based routing (via VIRTUAL_HOST) to cleanly split frontend/backend
7. Testing and Verification
1. On VM: curl -H "Host: fd-budgetplanner.duckdns.org" http://127.0.0.1 -I
2. For external machine: curl -I https://<yourdomain>.duckdns.org
3. Backend API: curl -I https://api.<yourdomain>.duckdns.org/api/transactions
8. Cleanup:
   docker compose down --volumes --remove-orphans
