from typing import Dict, Any, Optional
from core.stock_data import StockDataService
from core.llm import call_llm
from core.prompts import RISK_PROMPT
import json

class RiskAgent:
    async def analyze(self, ticker: str, api_key: Optional[str] = None, provider: Optional[str] = 'none') -> Dict[str, Any]:
        metrics = StockDataService.get_risk_metrics(ticker)
        
        if not metrics:
            return {
                "ticker": ticker,
                "type": "Risk",
                "error": "Could not fetch data"
            }
        
        beta = metrics.get('beta', 1.0)
        sharpe = metrics.get('sharpe_ratio', 0)
        max_dd = metrics.get('max_drawdown', 0)
        
        rating = "Moderate"
        if beta > 1.5 or max_dd < -30:
            rating = "High Risk"
        elif beta < 0.8 and max_dd > -15:
            rating = "Low Risk"
            
        summary = f"{ticker} has a Beta of {beta}, indicating it is {('more' if beta > 1 else 'less')} volatile than the market. "
        summary += f"Max drawdown is {max_dd}%. Sharpe Ratio: {sharpe}."

        # LLM Logic
        if api_key and provider != 'none':
            try:
                metrics_str = json.dumps(metrics, indent=2)
                llm_summary = await call_llm(
                    provider=provider,
                    api_key=api_key,
                    model='',
                    system_prompt=RISK_PROMPT.format(ticker=ticker, metrics=metrics_str),
                    user_prompt=f"Analyze the risk profile for {ticker}."
                )
                if not llm_summary.startswith("AI Analysis failed"):
                    summary = llm_summary
            except Exception as e:
                print(f"Risk Agent LLM Error: {e}")

        return {
            "ticker": ticker,
            "type": "Risk",
            "rating": rating,
            "summary": summary,
            "key_metrics": {
                "Beta": beta,
                "Max Drawdown": f"{max_dd}%",
                "Sharpe Ratio": sharpe,
                "Volatility": f"{metrics.get('volatility', 0)}%"
            }
        }
