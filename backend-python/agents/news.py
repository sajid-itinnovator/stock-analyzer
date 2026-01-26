from typing import Dict, Any, Optional
import yfinance as yf
from datetime import datetime
import requests
import json

class NewsAgent:
    def analyze(self, ticker: str, api_key: Optional[str] = None, provider: Optional[str] = 'none') -> Dict[str, Any]:
        
        # Method 1: Firecrawl
        if provider == 'firecrawl' and api_key:
            return self._analyze_with_firecrawl(ticker, api_key)
            
        # Method 2: Spider Cloud
        if provider == 'spider' and api_key:
            return self._analyze_with_spider(ticker, api_key)

        # Method 3: Crawl4AI
        if provider == 'crawl4ai' and api_key:
            return self._analyze_with_crawl4ai(ticker, api_key)
            
        # Fallback to Yahoo Finance
        return self._analyze_with_yfinance(ticker)
    
    def _analyze_with_firecrawl(self, ticker: str, api_key: str) -> Dict[str, Any]:
        try:
            url = "https://api.firecrawl.dev/v0/search"
            headers = {"Authorization": f"Bearer {api_key}"}
            payload = {
                "query": f"latest financial news {ticker} stock market",
                "limit": 5,
                "pageOptions": {"onlyMainContent": True}
            }
            
            response = requests.post(url, json=payload, headers=headers)
            if response.status_code != 200:
                print(f"Firecrawl API Error: {response.text}")
                return self._analyze_with_yfinance(ticker)
                
            data = response.json()
            results = data.get('data', [])
            
            summary = f"Latest News for {ticker} (via Firecrawl):\n\n"
            for i, item in enumerate(results[:5], 1):
                title = item.get('title', 'No Title')
                link = item.get('url', '#')
                snippet = item.get('markdown', '')[:100] + "..."
                summary += f"{i}. **{title}**\n{snippet}\n[Read more]({link})\n\n"
                
            return {
                "ticker": ticker,
                "type": "News",
                "rating": "Informational",
                "summary": summary,
                "key_metrics": { "Source": "Firecrawl", "Items": len(results), "Mode": "Search" }
            }
        except Exception as e:
            print(f"Firecrawl exception: {e}")
            return self._analyze_with_yfinance(ticker)

    def _analyze_with_spider(self, ticker: str, api_key: str) -> Dict[str, Any]:
        try:
            # Spider Cloud API (Search)
            url = "https://api.spider.cloud/v1/search"
            headers = {
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            }
            # Strictly adhering to Search API docs (search, limit)
            payload = {
                "search": f"latest financial news {ticker}",
                "limit": 5
            }
            
            response = requests.post(url, json=payload, headers=headers)
            if response.status_code != 200:
                print(f"Spider API Error: {response.text}")
                return self._analyze_with_yfinance(ticker)
                
            results = response.json() # Assuming list or data object
            # Adjust parsing based on actual Spider API response structure
            if isinstance(results, dict) and 'data' in results:
                results = results['data']
            
            summary = f"Latest News for {ticker} (via Spider Cloud):\n\n"
            for i, item in enumerate(results[:5], 1):
                title = item.get('title', 'No Title')
                link = item.get('url', '#')
                content = item.get('content', '')[:100] + "..."
                summary += f"{i}. **{title}**\n{content}\n[Read more]({link})\n\n"

            return {
                "ticker": ticker,
                "type": "News",
                "rating": "Informational",
                "summary": summary,
                "key_metrics": { "Source": "Spider Cloud", "Items": len(results), "Mode": "Search" }
            }
        except Exception as e:
            print(f"Spider exception: {e}")
            return self._analyze_with_yfinance(ticker)

    def _analyze_with_crawl4ai(self, ticker: str, api_key: str) -> Dict[str, Any]:
        try:
            # Crawl4AI placeholder logic
            print("Crawl4AI selected but requires local library installation. Falling back to yfinance.")
            return self._analyze_with_yfinance(ticker)

        except Exception as e:
            return self._analyze_with_yfinance(ticker)

    def _analyze_with_yfinance(self, ticker: str) -> Dict[str, Any]:
        try:
            stock = yf.Ticker(ticker)
            news = stock.news
            
            if not news:
                return {
                    "ticker": ticker,
                    "type": "News",
                    "rating": "N/A",
                    "summary": "No recent news found found via Yahoo Finance.",
                    "key_metrics": {}
                }
            
            # Extract and format headlines with dates
            summary = f"Latest News Analysis for {ticker} (via Yahoo Finance):\n\n"
            
            news_count = 0
            latest_date = None
            valid_items = []

            for n in news:
                # Handle potential nested structure from Yahoo Finance
                title = n.get('title')
                if not title and 'content' in n:
                    title = n['content'].get('title')
                
                if not title: continue
                
                publisher = n.get('publisher', 'Unknown Source')
                if publisher == 'Unknown Source' and 'content' in n:
                    provider = n['content'].get('provider')
                    if provider:
                        publisher = provider.get('displayName', 'Unknown Source')

                # Try to get timestamp
                ts = n.get('providerPublishTime', 0)
                
                # Check nested pubDate if top-level is missing
                if (ts == 0 or ts is None) and 'content' in n:
                     pub_date = n['content'].get('pubDate')
                     if pub_date and isinstance(pub_date, str):
                         try:
                             # Handle ISO format like "2026-01-23T21:46:00Z"
                             pub_date = pub_date.replace('Z', '+00:00')
                             dt = datetime.fromisoformat(pub_date)
                             ts = dt.timestamp()
                         except:
                             pass

                date_str = "Date Unknown"
                if ts and isinstance(ts, (int, float)) and ts > 0:
                    try:
                        date_str = datetime.fromtimestamp(ts).strftime('%Y-%m-%d %H:%M')
                        if not latest_date: latest_date = date_str
                    except: pass
                
                # Extract Link
                link = n.get('link')
                if not link and 'content' in n:
                    if 'canonicalUrl' in n['content']:
                         link = n['content']['canonicalUrl'].get('url')
                    if not link and 'clickThroughUrl' in n['content']:
                         link = n['content']['clickThroughUrl'].get('url')

                valid_items.append({ "title": title, "publisher": publisher, "date": date_str, "link": link })
            
            for i, item in enumerate(valid_items[:8], 1):
                summary += f"{i}. **{item['date']}** | _{item['publisher']}_\n{item['title']}\n"
                if item.get('link'):
                    summary += f"[Read more]({item['link']})\n\n"
                else:
                    summary += "\n"
                news_count += 1
            
            if news_count == 0:
                 return { "ticker": ticker, "type": "News", "rating": "N/A", "summary": "News found but contained no valid titles.", "key_metrics": {} }

            return {
                "ticker": ticker,
                "type": "News",
                "rating": "High Activity" if news_count >= 5 else "Moderate Activity",
                "summary": summary,
                "key_metrics": {
                    "News items retrieved": news_count,
                    "Latest Update": latest_date or "N/A",
                    "Primary Source": valid_items[0]['publisher'] if valid_items else "Unknown"
                }
            }
        except Exception as e:
            return { "ticker": ticker, "type": "News", "error": str(e) }
