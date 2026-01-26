# StockAI Frontend (React + Vite)

The user interface for the StockAI Research Assistant. Built with React 18, TypeScript, and Vite.

## 🚀 Features

*   **Modern UI**: Glassmorphism design with CSS variables and responsive layout.
*   **Dashboards**: Interactive charts (Recharts/Custom SVG) and real-time data display.
*   **Modules**:
    *   **Analysis**: Multi-tab view for Fundamental, Technical, Risk, and Sentiment analysis.
    *   **Advisor**: Chat interface interacting with the Python AI Agent.
    *   **Credentials**: Secure management of API keys (stored locally or in MongoDB).
    *   **Profile**: User settings and risk tolerance configuration.

## 🛠️ Tech Stack

*   **Framework**: React 18
*   **Build Tool**: Vite
*   **Language**: TypeScript
*   **State Management**: React Context API
*   **Routing**: React Router DOM v6
*   **HTTP Client**: Axios
*   **Styling**: Vanilla CSS (PostCSS)

## 📦 Installation

```bash
npm install
```

## 🏃‍♂️ Running Locally

```bash
npm run dev
```
Access the app at: `http://localhost:5173`

## 🏗️ Build for Production

```bash
npm run build
```
This generates static files in the `dist/` directory.
