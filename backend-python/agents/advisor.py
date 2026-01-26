from typing import Dict, Any, Optional
from core.llm import call_llm
from core.prompts import ADVISOR_PROMPT
from .fundamental import FundamentalAgent
from .technical import TechnicalAgent
from .risk import RiskAgent
from .sentiment import SentimentAgent
from .news import NewsAgent

class AdvisorAgent:
    def __init__(self):
        self.fundamental = FundamentalAgent()
        self.technical = TechnicalAgent()
        self.risk = RiskAgent()
        self.sentiment = SentimentAgent()

    async def analyze(self, ticker: str, api_key: Optional[str] = None, provider: Optional[str] = 'none') -> Dict[str, Any]:
        # Collect insights from all agents
        fund_res = await self.fundamental.analyze(ticker, api_key, provider)
        tech_res = await self.technical.analyze(ticker, period='6mo', api_key=api_key, provider=provider)
        risk_res = await self.risk.analyze(ticker, api_key, provider)
        sent_res = await self.sentiment.analyze(ticker, api_key, provider)
        
        # Aggregate ratings
        ratings = [
            fund_res.get('rating', 'Hold'),
            tech_res.get('rating', 'Hold'),
            sent_res.get('rating', 'Neutral')
        ]
        
        # Simple voting logic
        buy_votes = ratings.count('Strong Buy') + ratings.count('Buy') + ratings.count('Positive')
        sell_votes = ratings.count('Sell') + ratings.count('Strong Sell')
        
        final_verdict = "Hold"
        if buy_votes > sell_votes and buy_votes >= 2:
            final_verdict = "Bullish"
        elif sell_votes > buy_votes and sell_votes >= 2:
            final_verdict = "Bearish"
        
        summary = f"**AI Advisor Verdict: {final_verdict}**\n\n"
        
        # LLM Logic for Synthesis
        if api_key and provider != 'none':
            try:

                # Pre-fill the system prompt with data
                formatted_system_prompt = ADVISOR_PROMPT.format(
                    ticker=ticker,
                    fundamental=fund_res.get('summary', 'N/A'),
                    technical=tech_res.get('summary', 'N/A'),
                    risk=risk_res.get('summary', 'N/A'),
                    sentiment=sent_res.get('summary', 'N/A')
                )

                llm_summary = await call_llm(
                    provider=provider,
                    api_key=api_key,
                    model='',
                    system_prompt=formatted_system_prompt,
                    user_prompt=f"Provide a final investment decision for {ticker}."
                )
                if not llm_summary.startswith("AI Analysis failed"):
                    summary = llm_summary
            except Exception as e:
                print(f"Advisor Agent LLM Error: {e}")
                
        # Fallback summary if LLM fails or not configured
        if summary.startswith("**AI Advisor Verdict"):
            summary += f"• **Fundamental**: {fund_res.get('summary', 'N/A')}\n"
            summary += f"• **Technical**: {tech_res.get('summary', 'N/A')}\n"
            summary += f"• **Risk**: {risk_res.get('summary', 'N/A')}\n"
            summary += f"• **Sentiment**: {sent_res.get('summary', 'N/A')}\n"
        
        return {
            "ticker": ticker,
            "type": "Advisor",
            "rating": final_verdict,
            "summary": summary,
            "key_metrics": {
                "Overall Score": f"{buy_votes}/5",
                "Confidence": "High" if buy_votes > 3 or sell_votes > 3 else "Medium",
                "Primary Driver": "Fundamentals" if fund_res.get('rating') in ['Buy', 'Sell'] else "Technicals"
            }
        }
