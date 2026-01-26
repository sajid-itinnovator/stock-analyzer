import yfinance as yf
import json

def check_news():
    ticker = "AAPL"
    try:
        stock = yf.Ticker(ticker)
        news = stock.news
        
        print(f"News count: {len(news)}")
        
        if len(news) > 0:
            print("First item keys:", news[0].keys())
            print("First item sample:", json.dumps(news[0], default=str, indent=2))
        else:
            print("No news found")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_news()
