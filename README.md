# 🍷 Flask Wine Visualizer

An interactive data visualization web app built using **Flask**, **JavaScript (D3.js)**, and **Kubernetes** for deployment. This project showcases visual insights into wine-related data using multiple charts like bubble, scatter, treemap, etc.

---
## 🚀 Deployed on Render

This app is live and hosted using Render — a free cloud platform for deploying web services.

🔗 Live URL https://flask-wine-visualizer.onrender.com

## 📊 Features

- 📈 Bubble Chart, Scatterplot, Treemap for wine datasets
- 🎨 Custom HTML/CSS/JS with Flask backend
- 🐳 Dockerized for containerized deployment
- ☸️ Deployed via Kubernetes (Minikube compatible)

---

## 🗂️ Project Structure
```
.
├── app.py
├── Dockerfile
├── flask-deployment.yaml
├── flask-service.yaml
├── requirements.txt
├── static
│   ├── bubble_chart.js
│   ├── index.css
│   ├── new_dataset.json
│   ├── scatterplot.js
│   ├── Tableau_dataset.csv
│   └── treemap.js
└── templates
    └── index.html
```
##  🎥  Output

[![Watch Demo](https://user-images.githubusercontent.com/placeholder/demo-thumb.png)](https://github.com/user-attachments/assets/435e6f6e-ea78-4529-8866-cb9372f65439)

---

## 🚀 Getting Started

### ▶️ Run Locally with Flask
1. **Clone the repo:**
   ```bash
   git clone https://github.com/sumanthnangineedi97/flask-wine-visualizer.git
   cd flask-wine-visualizer
   ```
2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
3. **Run the Flask app**
   ```bash
   python app.py
   ```
4. **Access locally**
   Open your browser and go to http://127.0.0.1:5000/
   
### 🐳 Run with Docker
1. **Build the Docker image:**
   ```bash
   docker build -t flask-wine-app .
   ```
2. **Run the Docker container:**
   ```bash
   docker run -p 5000:5000 flask-wine-app
   ```
3. **Visit the app:**
   Open your browser and go to http://localhost:5000/

### ☸️ Deploy on Kubernetes (Minikube)
1. Start Minikube:
   ```bash
   minikube start
   ```
2. Build Docker image inside Minikube:
   ```bash
   eval $(minikube docker-env)
   docker build -t nsaisumanth97/flask-vis-app:latest .
   ```
   
3. Apply Kubernetes manifests:
   ```bash
   kubectl apply -f flask-deployment.yaml
   kubectl apply -f flask-service.yaml
   ```
4. Access the service:
   ```bash
   minikube service flask-service
   ```


   
