# 📈 StockAI Research Assistant

> **Integrated Full-Stack Stock Research Platform**

This repository contains the complete source code for the StockAI Research Assistant, a modular application designed to provide expert-level stock analysis using Artificial Intelligence.

## 🏗️ Project Structure

The project is divided into three distinct services:

### 1. [Frontend](./frontend/README.md)
*   **Path**: `frontend/`
*   **Type**: React SPA
*   **Role**: User Interface for dashboards, charts, and chat.

### 2. [Backend API](./backend-node/README.md)
*   **Path**: `backend-node/`
*   **Type**: Node.js / Express
*   **Role**: API Gateway, User Data, Authentication, and Orchestration.

### 3. [AI Agent Service](./backend-python/README.md)
*   **Path**: `backend-python/`
*   **Type**: Python / FastAPI
*   **Role**: Financial computations, LLM interaction, and Data Analysis.

---

## 🚀 Quick Start (Development)

To start the entire application for development (Windows):

```powershell
./start_app.ps1
```

## 📦 Distribution

To package the application for end-users (Docker-based):

```powershell
./package_docker_dist.ps1
```

This will create a `StockResearch_Docker_Dist` folder containing a code-free installer for the user.

## 📚 Documentation

*   **Developer Notes**: `DEVELOPER_NOTES.md` (Architecture details & changelogs)

## 📄 License

MIT License. See `LICENSE` for details.
