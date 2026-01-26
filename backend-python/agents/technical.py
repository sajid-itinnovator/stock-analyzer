from typing import Dict, Any, Optional
from core.stock_data import StockDataService
from core.llm import call_llm
from core.prompts import TECHNICAL_PROMPT
import json

class TechnicalAgent:
    async def analyze(self, ticker: str, period: str = '6mo', api_key: Optional[str] = None, provider: Optional[str] = 'none') -> Dict[str, Any]:
        metrics = StockDataService.get_technical_metrics(ticker, period)
        
        if not metrics:
            return {
                "ticker": ticker,
                "type": "Technical",
                "error": "Could not fetch data"
            }
        
        current = metrics.get('current_price', 0)
        sma_20 = metrics.get('sma_20', 0)
        sma_50 = metrics.get('sma_50', 0)
        
        rating = "Hold"
        trend = "sideways"
        if current > sma_20 > sma_50:
            rating = "Strong Buy"
            trend = "strong uptrend"
        elif current > sma_20:
            rating = "Buy"
            trend = "uptrend"
        elif current < sma_20 < sma_50:
            rating = "Sell"
            trend = "downtrend"
        
        summary = f"{ticker} is currently at ${current}, showing {trend}. "
        summary += f"Trading relative to SMA20 (${sma_20}). Volatility: {metrics.get('volatility', 0)}%."

        # LLM Logic
        if api_key and provider != 'none':
            try:
                metrics_str = json.dumps(metrics, indent=2)
                llm_summary = await call_llm(
                    provider=provider,
                    api_key=api_key,
                    model='',
                    system_prompt=TECHNICAL_PROMPT.format(ticker=ticker, metrics=metrics_str, period=period),
                    user_prompt=f"Analyze the technicals for {ticker}."
                )
                if not llm_summary.startswith("AI Analysis failed"):
                    summary = llm_summary
            except Exception as e:
                print(f"Technical Agent LLM Error: {e}")

        return {
            "ticker": ticker,
            "type": "Technical",
            "rating": rating,
            "summary": summary,
            "key_metrics": {
                "Current Price": f"${current}",
                "SMA 20": f"${sma_20}",
                "SMA 50": f"${sma_50}",
                "Volatility": f"{metrics.get('volatility', 0)}%",
                "1W Change": f"{metrics.get('price_change_1w', 0)}%",
                "1M Change": f"{metrics.get('price_change_1m', 0)}%",
            },
            "chart_data": StockDataService.get_price_history(ticker, period)
        }
