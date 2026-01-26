import yfinance as yf
from datetime import datetime, timedelta
import pandas as pd
from typing import Dict, Any, Optional

class StockDataService:
    """Service for fetching and processing stock data"""

    @staticmethod
    def resolve_ticker(ticker: str) -> str:
        """
        Smart resolution for Indian traders.
        If ticker has no suffix, try .NS (National Stock Exchange of India).
        If that fails, fallback to original (US/Global).
        """
        ticker = ticker.upper().strip()
        if "." in ticker:
            return ticker
        
        # Indian Context Priority
        indian_ticker = f"{ticker}.NS"
        try:
            # Quick check using fast_info
            stock = yf.Ticker(indian_ticker)
            # Accessing fast_info triggers the fetch. keys() checks if it's valid.
            if stock.fast_info.last_price is not None:
                return indian_ticker
        except:
            pass
            
        return ticker

    @staticmethod
    def get_stock_info(ticker: str) -> Optional[Dict[str, Any]]:
        """Fetch basic stock information"""
        ticker = StockDataService.resolve_ticker(ticker)
        try:
            stock = yf.Ticker(ticker)
            info = stock.info
            
            return {
                'symbol': ticker,
                'name': info.get('longName', ticker),
                'price': info.get('currentPrice', info.get('regularMarketPrice', 0)),
                'change': info.get('regularMarketChangePercent', 0),
                'volume': info.get('volume', 0),
                'marketCap': info.get('marketCap', 0),
                'sector': info.get('sector', 'N/A'),
                'industry': info.get('industry', 'N/A'),
                'currency': info.get('currency', 'USD'),
            }
        except Exception as e:
            print(f"Error fetching stock info for {ticker}: {e}")
            return None
    
    @staticmethod
    def get_fundamental_metrics(ticker: str) -> Optional[Dict[str, Any]]:
        """Fetch fundamental analysis metrics"""
        ticker = StockDataService.resolve_ticker(ticker)
        try:
            stock = yf.Ticker(ticker)
            info = stock.info
            
            return {
                'pe_ratio': info.get('trailingPE', 0),
                'forward_pe': info.get('forwardPE', 0),
                'peg_ratio': info.get('pegRatio', 0),
                'price_to_book': info.get('priceToBook', 0),
                'debt_to_equity': info.get('debtToEquity', 0),
                'roe': info.get('returnOnEquity', 0),
                'profit_margin': info.get('profitMargins', 0),
                'revenue_growth': info.get('revenueGrowth', 0),
                'earnings_growth': info.get('earningsGrowth', 0),
                'dividend_yield': info.get('dividendYield', 0),
            }
        except Exception as e:
            print(f"Error fetching fundamentals for {ticker}: {e}")
            return None
    
    @staticmethod
    def get_technical_metrics(ticker: str, period: str = '1mo') -> Optional[Dict[str, Any]]:
        """Fetch technical analysis metrics"""
        ticker = StockDataService.resolve_ticker(ticker)
        try:
            stock = yf.Ticker(ticker)
            hist = stock.history(period=period)
            
            if hist.empty:
                return None
            
            # Calculate basic technical indicators
            current_price = hist['Close'].iloc[-1]
            sma_20 = hist['Close'].rolling(window=20).mean().iloc[-1] if len(hist) >= 20 else current_price
            sma_50 = hist['Close'].rolling(window=50).mean().iloc[-1] if len(hist) >= 50 else current_price
            
            # Calculate volatility
            returns = hist['Close'].pct_change()
            volatility = returns.std() * (252 ** 0.5)  # Annualized
            
            # Price momentum
            price_change_1w = ((current_price - hist['Close'].iloc[-5]) / hist['Close'].iloc[-5] * 100) if len(hist) >= 5 else 0
            price_change_1m = ((current_price - hist['Close'].iloc[0]) / hist['Close'].iloc[0] * 100)
            
            return {
                'current_price': round(current_price, 2),
                'sma_20': round(sma_20, 2),
                'sma_50': round(sma_50, 2),
                'volatility': round(volatility * 100, 2),
                'price_change_1w': round(price_change_1w, 2),
                'price_change_1m': round(price_change_1m, 2),
                'volume_avg': int(hist['Volume'].mean()),
                'high_52w': round(hist['High'].max(), 2),
                'low_52w': round(hist['Low'].min(), 2),
            }
        except Exception as e:
            print(f"Error fetching technical data for {ticker}: {e}")
            return None
    
    @staticmethod
    def get_risk_metrics(ticker: str) -> Optional[Dict[str, Any]]:
        """Calculate risk metrics"""
        ticker = StockDataService.resolve_ticker(ticker)
        try:
            stock = yf.Ticker(ticker)
            info = stock.info
            hist = stock.history(period='1y')
            
            if hist.empty:
                return None
            
            # Calculate beta
            beta = info.get('beta', 1.0)
            
            # Calculate max drawdown
            cumulative = (1 + hist['Close'].pct_change()).cumprod()
            running_max = cumulative.expanding().max()
            drawdown = (cumulative - running_max) / running_max
            max_drawdown = drawdown.min() * 100
            
            # Calculate Sharpe ratio (simplified)
            returns = hist['Close'].pct_change()
            sharpe = (returns.mean() / returns.std()) * (252 ** 0.5) if returns.std() > 0 else 0
            
            return {
                'beta': round(beta, 2),
                'max_drawdown': round(max_drawdown, 2),
                'sharpe_ratio': round(sharpe, 2),
                'volatility': round(returns.std() * (252 ** 0.5) * 100, 2),
            }
        except Exception as e:
            print(f"Error calculating risk metrics for {ticker}: {e}")
            return None

    @staticmethod
    def get_price_history(ticker: str, period: str = '6mo') -> Optional[Dict[str, Any]]:
        """Fetch historical price data for charting"""
        ticker = StockDataService.resolve_ticker(ticker)
        try:
            stock = yf.Ticker(ticker)
            # Fetch history with 1d interval for candles
            hist = stock.history(period=period, interval='1d')
            
            if hist.empty:
                return None
            
            # Try to get currency from meta
            meta = stock.history_metadata
            currency = meta.get('currency', 'USD') if meta else 'USD'
            
            dates = hist.index.strftime('%Y-%m-%d').tolist()
            return {
                'dates': dates,
                'currency': currency,
                'open': hist['Open'].round(2).tolist(),
                'high': hist['High'].round(2).tolist(),
                'low': hist['Low'].round(2).tolist(),
                'close': hist['Close'].round(2).tolist(),
                'volume': hist['Volume'].tolist()
            }
        except Exception as e:
            print(f"Error fetching history for {ticker}: {e}")
            return None
