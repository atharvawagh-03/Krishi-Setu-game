# 🌾 KrishiSetu-FarmX

> An AI-powered browser-based farming simulation game built with React, Node.js, MongoDB, and Python Flask.

![KrishiSetu-FarmX](https://img.shields.io/badge/Stack-React%20%7C%20Node.js%20%7C%20MongoDB%20%7C%20Python-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)

## 🎮 Features

- **3×3 Farm Grid** – Plant, grow, and harvest 4 different crops
- **AI Crop Advisor** – ML-powered recommendations via Python Flask microservice
- **Dynamic Weather** – Weather system that affects crop growth
- **Water Management** – Strategic resource allocation
- **Analytics Dashboard** – Recharts-powered harvest history and stats
- **Responsive Design** – Mobile-first layout with touch support
- **Smooth Animations** – Framer Motion for all interactions

## 🏗️ Architecture

```
krishi-setu-game/
├── frontend/        # React 18 + Vite + Tailwind CSS + Framer Motion
├── backend/         # Node.js + Express + MongoDB (Mongoose)
└── ai-service/      # Python Flask + scikit-learn RandomForest
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+
- MongoDB Atlas account (or local MongoDB)

---

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Fill in your MONGODB_URI in .env
npm run dev
```
API runs on `http://localhost:5000`

---

### 2. AI Service Setup

```bash
cd ai-service
pip install -r requirements.txt
python train.py        # Train the model first
python app.py          # Start the Flask server
```
AI service runs on `http://localhost:5001`

---

### 3. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Adjust API URLs if needed
npm run dev
```
Frontend runs on `http://localhost:5173`

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/farm` | Fetch farm state |
| POST | `/api/plant` | Plant a crop |
| POST | `/api/water` | Refill water |
| POST | `/api/harvest` | Harvest a crop |
| GET | `/api/stats` | Analytics data |
| GET | `/api/advisor` | AI advice messages |

## 🤖 AI Service

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/predict` | Get crop recommendation |

**Input:**
```json
{ "temperature": 25, "rainfall": 50, "water_level": 80, "coins": 200 }
```

**Output:**
```json
{ "recommended_crop": "Tomato", "expected_profit": 45, "confidence": 0.87 }
```

## 🌐 Deployment

| Service | Platform |
|---------|----------|
| Frontend | Vercel |
| Backend | Render |
| AI Service | Render (separate service) |
| Database | MongoDB Atlas |

## 🛠️ Tech Stack

**Frontend:** React 18, Vite, Tailwind CSS, Framer Motion, Axios, Recharts, Zustand, React Router DOM, React Hot Toast

**Backend:** Node.js, Express.js, Mongoose, CORS, dotenv, express-validator

**AI Service:** Python, Flask, scikit-learn, pandas, numpy

## 📁 Resume Description

> Built **KrishiSetu-FarmX**, an AI-powered farming simulation game using React, Tailwind CSS, Framer Motion, Node.js, Express, MongoDB, and Python Flask. Implemented persistent crop timers, weather simulation, analytics dashboards, and machine-learning-based crop recommendations.

## 📄 License

MIT © 2025 KrishiSetu-FarmX
