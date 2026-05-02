# HostDeals - Hosting Platform using GitHub Pages

## 📌 Project Overview

**HostDeals** is a full-stack hosting platform project designed to showcase modern web development and DevOps practices.
The application consists of a frontend interface, backend services, containerized deployment, Kubernetes orchestration, and CI/CD automation.

This project demonstrates how real-world applications are built, deployed, and managed using industry-standard tools.

---

## 🎯 Objectives

* Build a responsive hosting platform web application
* Develop frontend and backend modules separately
* Containerize services using Docker
* Deploy services using Kubernetes
* Automate workflows using GitHub Actions
* Demonstrate DevOps pipeline concepts

---

## 🛠️ Tech Stack

### Frontend

* React.js
* JavaScript
* CSS

### Backend

* Backend APIs / Server-side services

### DevOps & Deployment

* Docker
* Docker Compose
* Kubernetes
* Ingress
* GitHub Actions

### Version Control

* Git
* GitHub

---

## 📂 Project Structure

```text id="a001"
HostDeals/
│── .github/workflows/        # CI/CD workflows
│── hostdeals-frontend/       # React frontend
│── hostdeals-backend/        # Backend services
│── docker-compose.yml        # Multi-container setup
│── frontend-deployment.yaml
│── frontend-service.yaml
│── backend-deployment.yaml
│── backend-service.yaml
│── ingress.yaml
│── README.md
```

---

## 🧠 Features

* Modern responsive frontend UI
* Separate backend architecture
* Containerized application deployment
* Multi-service communication
* Kubernetes deployment setup
* Ingress routing support
* CI/CD automation with GitHub Actions

---

## 🐳 Docker Support

This project uses Docker for containerization.

### Run Locally with Docker Compose

```bash id="a002"
docker-compose up --build
```

This starts:

* Frontend container
* Backend container

---

## ☸️ Kubernetes Deployment

Kubernetes manifests are included for deploying frontend and backend services.

### Apply Deployment Files

```bash id="a003"
kubectl apply -f frontend-deployment.yaml
kubectl apply -f frontend-service.yaml
kubectl apply -f backend-deployment.yaml
kubectl apply -f backend-service.yaml
kubectl apply -f ingress.yaml
```

---

## 🔁 CI/CD Pipeline

GitHub Actions workflows are used to automate:

* Build process
* Testing
* Deployment pipeline

Workflow files are located in:

```text id="a004"
.github/workflows/
```

---

## 🌐 Architecture

```text id="a005"
User
 ↓
Frontend (React)
 ↓
Backend API
 ↓
Containers (Docker)
 ↓
Kubernetes Cluster
 ↓
CI/CD via GitHub Actions
```

---

## ▶️ How to Run Locally

### Frontend

```bash id="a006"
cd hostdeals-frontend
npm install
npm start
```

### Backend

```bash id="a007"
cd hostdeals-backend
# Run backend service
```

---

## 📈 Future Enhancements

* Authentication system
* Payment gateway integration
* Admin dashboard
* Domain purchase module
* Monitoring with Prometheus & Grafana
* Cloud deployment (AWS / Azure / GCP)

---

## 🎓 Learning Outcomes

This project demonstrates:

* Full-stack development
* Microservice separation
* Containerization
* Kubernetes orchestration
* CI/CD automation
* Real-world DevOps workflow

---

## 👨‍💻 Author

**Shreyas V**

GitHub: Shreyas-ven

---

## ⭐ Support

If you found this project useful, consider starring the repository.
