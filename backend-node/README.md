# StockAI Backend (Node.js + Express)

The orchestration layer for the Stock Research App. Handles user data, proxies AI requests, and manages application state.

## 🚀 Features

*   **API Gateway**: Routes requests between Frontend and Python AI services.
*   **User Management**: strict profile management and preferences.
*   **Data Persistence**: Connects to MongoDB for saving user profiles and analysis history.
*   **Security**: Implements Helmet, CORS, and secure credential handling.

## 🛠️ Tech Stack

*   **Runtime**: Node.js (v18+)
*   **Framework**: Express.js
*   **Language**: TypeScript
*   **Database**: MongoDB (Mongoose ODM)
*   **Logging**: Morgan

## 📦 Installation

```bash
npm install
```

## ⚙️ Configuration

Create a `.env` file in this directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/stockai
NODE_ENV=development
PYTHON_AGENT_URL=http://localhost:8000
```

## 🏃‍♂️ Running Locally

```bash
npm run dev
```
Server running at: `http://localhost:5000`

## 📡 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/profile` | Get user profile |
| `POST` | `/api/chat` | Proxy chat to Python Agent |
| `POST` | `/api/analyze` | Trigger stock analysis |
| `GET` | `/health` | Health check |
