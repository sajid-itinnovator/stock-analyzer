# StockAI Agent Service (Python + FastAPI)

The intelligence core of the Stock Research App. Uses AI Agents to perform deep technical, fundamental, and sentiment analysis.

## 🚀 Features

*   **Multi-Agent System**:
    *   `FundamentalAgent`: XML/JSON parsing of financial statements.
    *   `TechnicalAgent`: Price action and indicator calculation (RSI, MACD).
    *   `SentimentAgent`: News and social sentiment analysis.
    *   `AdvisorAgent`: Synthesizes all reports into a final investment verdict.
*   **LLM Integration**: Supports OpenAI, Anthropic, and Google Gemini.
*   **Data Fetching**: Real-time market data via `yfinance`.

## 🛠️ Tech Stack

*   **Framework**: FastAPI
*   **Language**: Python 3.10+
*   **Data Science**: Pandas, NumPy
*   **Stock Data**: yfinance
*   **LLM SDKs**: OpenAI, Anthropic, Google Generative AI

## 📦 Installation

```bash
pip install -r requirements.txt
```

## ⚙️ Configuration

(Optional) Create a `.env` file for default keys, or manage them via the Frontend UI.

```env
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
```

## 🏃‍♂️ Running Locally

```bash
python main.py
```
Service running at: `http://localhost:8000`

## 🤖 Agents & Prompts

*   **Agents**: Located in `agents/` folder.
*   **Prompts**: System prompts defined in `core/prompts.py`.
*   **API**: Exposed via `api/agent.py`.
