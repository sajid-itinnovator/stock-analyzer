from typing import Dict, Any, Optional
from core.stock_data import StockDataService
from core.llm import call_llm
from core.prompts import FUNDAMENTAL_PROMPT
import json

class FundamentalAgent:
    async def analyze(self, ticker: str, api_key: Optional[str] = None, provider: Optional[str] = 'none') -> Dict[str, Any]:
        metrics = StockDataService.get_fundamental_metrics(ticker)
        
        if not metrics:
            return {
                "ticker": ticker,
                "type": "Fundamental",
                "error": "Could not fetch data"
            }
        
        # Default Rule-based Logic (Fallback)
        pe_ratio = metrics.get('pe_ratio', 0)
        roe = metrics.get('roe', 0)
        rating = "Hold"
        if pe_ratio > 0 and pe_ratio < 15 and roe > 0.15:
            rating = "Buy"
        elif pe_ratio > 35:
            rating = "Sell"
            
        summary = f"{ticker} has a P/E ratio of {round(pe_ratio, 2)} and ROE of {round(roe*100, 2)}%. "
        summary += "The valuation logic suggests a " + rating + "."

        # LLM Logic (Enhanced)
        if api_key and provider != 'none':
            try:
                metrics_str = json.dumps(metrics, indent=2)
                llm_summary = await call_llm(
                    provider=provider,
                    api_key=api_key,
                    model='',
                    system_prompt=FUNDAMENTAL_PROMPT.format(ticker=ticker, metrics=metrics_str),
                    user_prompt=f"Analyze the fundamentals for {ticker}."
                )
                if not llm_summary.startswith("AI Analysis failed"):
                    summary = llm_summary
                    # Try to extract rating from text if possible, or keep rule-based rating
                    if "Strong Buy" in summary: rating = "Strong Buy"
                    elif "Strong Sell" in summary: rating = "Strong Sell"
            except Exception as e:
                print(f"Fundamental Agent LLM Error: {e}")

        # Format metrics for display
        display_metrics = {
            "P/E Ratio": round(pe_ratio, 2),
            "ROE": f"{round(roe * 100, 2)}%",
            "Debt/Equity": round(metrics.get('debt_to_equity', 0), 2),
            "Profit Margin": f"{round(metrics.get('profit_margin', 0) * 100, 2)}%",
            "Rev Growth": f"{round(metrics.get('revenue_growth', 0) * 100, 2)}%"
        }

        return {
            "ticker": ticker,
            "type": "Fundamental",
            "rating": rating,
            "summary": summary,
            "key_metrics": display_metrics
        }
