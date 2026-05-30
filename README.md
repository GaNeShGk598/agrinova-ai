# 🌱 AgriNova AI – Smart Agriculture Assistant

AgriNova AI is an AI-powered smart farming platform designed to help farmers make data-driven decisions and improve agricultural productivity. The platform combines Artificial Intelligence, Machine Learning, weather analytics, crop recommendations, disease detection, fertilizer suggestions, and market insights into a single intelligent system. By leveraging modern technologies and predictive analytics, AgriNova AI empowers farmers to optimize resources, reduce crop losses, and maximize agricultural yield.

---

## 🚀 Features

* 🌾 **Crop Recommendation System** – Suggests the most suitable crops based on soil and environmental conditions.
* 🦠 **Crop Disease Detection** – Identifies crop diseases using AI-powered image analysis.
* 🌤️ **Weather Monitoring & Forecasting** – Provides weather insights to support farming decisions.
* 🧪 **Fertilizer Recommendation** – Recommends fertilizers based on crop and soil requirements.
* 💹 **Market Price Analysis** – Displays agricultural market trends and crop prices.
* 📈 **Yield Prediction** – Estimates crop production using machine learning algorithms.
* 🔔 **Smart Notifications & Alerts** – Sends important farming alerts and recommendations.
* 📊 **Interactive Dashboard** – Visualizes agricultural data and analytics.
* 👤 **User Authentication** – Secure login, registration, and profile management.
* 🤖 **AI-Driven Decision Support** – Assists farmers with intelligent recommendations.

---

## 🎯 Project Objective

The primary objective of AgriNova AI is to modernize agriculture through Artificial Intelligence and Data Science. The system helps farmers make informed decisions regarding crop selection, disease management, fertilizer usage, and market planning, ultimately improving productivity and sustainability.

---

## 🛠️ Technology Stack

### Frontend

* React.js
* TypeScript
* Tailwind CSS
* Vite

### Backend

* Python
* Flask / FastAPI
* REST APIs

### Database

* MySQL

### AI & Machine Learning

* Scikit-Learn
* TensorFlow / Keras
* OpenCV
* Pandas
* NumPy

### Deployment

* Render
* Docker
* GitHub

---

## 📂 Project Structure

```text
AgriNova-AI/
│
├── frontend/                         # React + TypeScript Frontend
│   ├── public/                       # Static assets
│   ├── src/
│   │   ├── components/               # Reusable UI components
│   │   ├── hooks/                    # Custom React hooks
│   │   ├── lib/                      # Utility functions and API calls
│   │   ├── pages/                    # Application pages
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   │
│   ├── package.json
│   ├── vite.config.ts
│   └── vercel.json
│
├── deploy/
│   ├── backend/                      # Python Backend Services
│   │   ├── db_mysql.py
│   │   ├── requirements.txt
│   │   ├── Dockerfile
│   │   └── .env.example
│   │
│   ├── database/
│   │   └── schema.sql
│   │
│   └── DEPLOYMENT.md
│
├── replit.md                         # Project Documentation
├── README.md                         # Project Overview
└── LICENSE
```

---

## 🏗️ System Architecture

```text
┌──────────────────┐
│      Farmer      │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│   React Frontend │
│ (Vite + TS + UI) │
└────────┬─────────┘
         │ REST API
         ▼
┌──────────────────┐
│  Python Backend  │
│ Flask / FastAPI  │
└────────┬─────────┘
         │
         ├─────────────► AI/ML Models
         │                 │
         │                 ├─ Crop Prediction
         │                 ├─ Disease Detection
         │                 ├─ Yield Prediction
         │                 └─ Fertilizer Recommendation
         │
         ▼
┌──────────────────┐
│  MySQL Database  │
└──────────────────┘
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/GaNeShGk598/agrinova-ai.git
cd agrinova-ai
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Backend Setup

```bash
cd deploy/backend
pip install -r requirements.txt
python db_mysql.py
```

### Environment Variables

Create a `.env` file:

```env
DATABASE_URL=your_mysql_connection_string
SECRET_KEY=your_secret_key
```

---

## 📈 Future Enhancements

* IoT Sensor Integration
* Satellite-Based Crop Monitoring
* Mobile Application (Android & iOS)
* Multi-Language Support
* Voice-Based AI Assistant
* Advanced Predictive Analytics
* Real-Time Government Scheme Updates

---

## 👨‍💻 Developed By

**Ganesh G K**
Artificial Intelligence & Data Science Engineer

---

## 📜 License

This project is developed for educational and research purposes. Feel free to fork, modify, and enhance the project.

---

### 🌱 AgriNova AI – Empowering Farmers with Artificial Intelligence and Smart Agriculture Solutions 🚜🤖🌾
