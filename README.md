**FD Budget Planner Infrastructure Documentation**

Overview
This project demonstrates the deployment of a production-like, multi-container web application using Docker Compose.
It focuses on infrastructure, networking, TLS automation, and operational reliability, rather than application logic.
The stack consists of a frontend, backend API, PostgreSQL database,and a reverse proxy with automated HTTPS and DNS updates.

1. Architecture
Components
•	React frontend (multi-stage Docker build)
•	Node.js backend API (multi-stage Docker build)
•	PostgreSQL database (dedicated container)
•	Reverse proxy (nginx-proxy)
•	Let’s Encrypt companion for automatic TLS
•	DuckDNS for dynamic DNS updates
Key characteristics
•	Host-based routing for frontend and API
•	Automatic certificate issuance and renewal
•	Isolated Docker networks for public and internal traffic
•	Custom naming conventions to avoid resource collisions

What I Built
•	Deployed a multi-container application stack using Docker Compose with explicit network separation.
•	Configured nginx-proxy + Let’s Encrypt companion for zero-touch HTTPS certificates.
•	Implemented host-based routing to cleanly separate frontend and backend traffic.
•	Automated DNS record updates using DuckDNS to support dynamic cloud IP addresses.
•	Used multi-stage Docker builds to reduce runtime image size and isolate build dependencies.
•	Centralized configuration via environment variables (.env) for portability.

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
POSTGRES_PASSWORD=yourpassword
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
&& git clone https://github.com/filip-drakal/DevOps-Cloud-Infrastructure-Project-.git infrastructure \
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
&& git clone https://github.com/filip-drakal/DevOps-Cloud-Infrastructure-Project-.git infrastructure \
&& cd infrastructure \
&& docker compose up -d
What these commands do is install the docker services, enable it, open the ports (22,80,443)
and clone the repo and bring the entire stack up. If you already have done previously these
things only the docker-compose up -d is adequate. 

5. DNS and SSL/TLS Configuration
   • Local: Add to /etc/hosts: 127.0.0.1 fd-budgetplanner.duckdns.org api.fdbudgetplanner.duckdns.org
   • Public Cloud: Use DuckDNS in Docker Compose to automate A-record updates
   • TLS certificates are obtained automatically via Let’s Encrypt companion

6. Testing and Verification
On VM: curl -H "Host: fd-budgetplanner.duckdns.org" http://127.0.0.1 -I
For external machine: curl -I https://<yourdomain>.duckdns.org
Backend API: curl -I https://api.<yourdomain>.duckdns.org/api/transactions

7. Cleanup:
   docker compose down --volumes --remove-orphans
8. Improvements
   •	Add container health checks and restart policies
   •	Introduce centralized logging or metrics
   •	Replace VM-based deployment with managed container services
   •	Infrastructure as Code (Terraform / Bicep)