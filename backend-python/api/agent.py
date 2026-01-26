from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any
import sys
import os

# Add parent directory to path to import core modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.stock_data import StockDataService
from agents.fundamental import FundamentalAgent
from agents.technical import TechnicalAgent
from agents.risk import RiskAgent
from agents.sentiment import SentimentAgent
from agents.news import NewsAgent
from agents.advisor import AdvisorAgent

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    ticker: Optional[str] = None
    apiKey: Optional[str] = None
    provider: Optional[str] = 'none'
    model: Optional[str] = ''

class AnalysisRequest(BaseModel):
    ticker: str
    type: str  # Fundamental, Technical, Sentiment, Risk, News, Advisor
    apiKey: Optional[str] = None
    provider: Optional[str] = 'none'
    period: Optional[str] = '6mo'

# Helper function to call LLM APIs (Keep as is for Chat)
async def call_llm(provider: str, api_key: str, model: str, message: str, context: str) -> str:
    """Call the appropriate LLM API based on provider"""
    
    system_prompt = """You are a senior hedge fund analyst and expert stock trader.
    Your goal is to provide specific, data-driven, and actionable investment advice.
    
    When answering questions:
    1. Be direct and concise. Avoid generic disclaimers unless necessary.
    2. If asked about "entry points" or "buy levels", analyze the provided stock data (price actions, moving averages, etc.) to suggest specific price ranges.
    3. Suggest potential Support (entry) and Resistance (target) levels if data allows.
    4. Mention risks clearly but briefly.
    5. If the data is insufficient to give a specific price, explain what to look for (e.g., "wait for a pullback to the 20-day SMA").
    6. Use professional financial terminology (e.g., consolidation, breakout, RSI divergence) but explain them simply.
    
    Context Data:
    """
    user_prompt = f"{context}\n\nUser Question: {message}"
    
    if provider == 'openai':
        from openai import OpenAI
        client = OpenAI(api_key=api_key)
        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ]
        )
        return response.choices[0].message.content
    
    elif provider == 'anthropic':
        import anthropic
        client = anthropic.Anthropic(api_key=api_key)
        message = client.messages.create(
            model=model or "claude-3-5-sonnet-20241022",
            max_tokens=1024,
            messages=[
                {"role": "user", "content": f"{system_prompt}\n\n{user_prompt}"}
            ]
        )
        return message.content[0].text
    
    elif provider == 'google':
        import google.generativeai as genai
        genai.configure(api_key=api_key)
        model_instance = genai.GenerativeModel(model or 'gemini-pro')
        response = model_instance.generate_content(f"{system_prompt}\n\n{user_prompt}")
        return response.text
    
    else:
        raise ValueError(f"Unsupported provider: {provider}")

@router.post("/chat")
async def chat_with_agent(request: ChatRequest):
    try:
        ticker = request.ticker or "the market"
        message = request.message.lower()
        
        # Check if API key is provided for LLM call
        if request.apiKey and request.provider != 'none':
            try:
                # Get stock context
                stock_context = ""
                if request.ticker:
                    stock_info = StockDataService.get_stock_info(request.ticker)
                    if stock_info:
                        stock_context = f"Stock: {request.ticker}, Price: ${stock_info.get('price', 'N/A')}, Change: {stock_info.get('change', 0):.2f}%, Sector: {stock_info.get('sector', 'N/A')}"
                
                # Make LLM call based on provider
                llm_response = await call_llm(
                    provider=request.provider,
                    api_key=request.apiKey,
                    model=request.model or 'gpt-4',
                    message=request.message,
                    context=stock_context
                )
                
                return {
                    "sender": "AI Advisor",
                    "text": llm_response,
                    "timestamp": "2026-01-24T00:20:00Z"
                }
            except Exception as e:
                print(f"LLM call failed: {e}")
                # Fall through to default response
        
        # Default response with stock data (no LLM)
        if request.ticker:
            stock_info = StockDataService.get_stock_info(request.ticker)
            if stock_info:
                price = stock_info.get('price', 'N/A')
                change = stock_info.get('change', 0)
                direction = "up" if change > 0 else "down"
                
                response_text = f"I'm analyzing {request.ticker} for you. "
                response_text += f"Current price is ${price}, {direction} {abs(change):.2f}% today. "
                
                if "buy" in message or "invest" in message:
                    response_text += "Based on current market conditions, I recommend reviewing the fundamental and technical analysis tabs for a comprehensive view before making investment decisions."
                elif "risk" in message:
                    response_text += "Check out the Risk Analysis tab to see detailed risk metrics including beta, max drawdown, and Sharpe ratio."
                elif "price" in message or "cost" in message:
                    response_text += f"The stock is currently trading at ${price}. Historical data shows it's been quite active recently."
                else:
                    response_text += "What specific aspect would you like to know more about? I can help with fundamentals, technicals, or risk analysis."
                    if not request.apiKey:
                        response_text += " (Tip: Add an API key in Credentials for AI-powered insights!)"
            else:
                response_text = f"I'm having trouble fetching data for {request.ticker}. Please verify the ticker symbol is correct."
        else:
            response_text = "Hello! I'm your AI stock advisor. Please select a stock ticker using the input at the top, and I'll provide detailed analysis and insights."
            if not request.apiKey:
                response_text += " (Tip: Configure an LLM API key in the Credentials page for enhanced AI responses!)"
        
        return {
            "sender": "AI Advisor",
            "text": response_text,
            "timestamp": "2026-01-24T00:20:00Z"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/analyze")
async def analyze_stock(request: AnalysisRequest):
    try:
        analysis_type = request.type.lower()
        
        if analysis_type == "fundamental":
            agent = FundamentalAgent()
            return await agent.analyze(request.ticker, request.apiKey, request.provider)
        
        elif analysis_type == "technical":
            agent = TechnicalAgent()
            return await agent.analyze(request.ticker, request.period or '6mo', request.apiKey, request.provider)
        
        elif analysis_type == "risk":
            agent = RiskAgent()
            return await agent.analyze(request.ticker, request.apiKey, request.provider)
        
        elif analysis_type == "sentiment":
            agent = SentimentAgent()
            return await agent.analyze(request.ticker, request.apiKey, request.provider)
            
        elif analysis_type == "news":
            agent = NewsAgent()
            # News agent analyze is likely synchronous? No, let's keep it sync or make async?
            # Steps 1356 showed NewsAgent as sync def analyze. 
            # I should keep it sync or wrap it?
            # Python allows awaiting, but if it returns dict immediately, await fails.
            # I'll check NewsAgent. It uses 'def analyze'.
            # I won't await NewsAgent unless I updated it to async.
            return agent.analyze(request.ticker, request.apiKey, request.provider)
            
        elif analysis_type == "advisor":
            agent = AdvisorAgent()
            return await agent.analyze(request.ticker, request.apiKey, request.provider)
        
        else:
            return {
                "ticker": request.ticker,
                "type": request.type,
                "rating": "Neutral",
                "summary": f"Analysis type '{request.type}' not supported yet.",
                "key_metrics": {},
                "timestamp": "2026-01-24T00:25:00Z"
            }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
