import yfinance as yf

def check_ticker(symbol):
    print(f"Checking {symbol}...")
    try:
        t = yf.Ticker(symbol)
        # Fast check: 'fast_info' or 'info'
        # fast_info is newer and faster in yfinance
        price = t.fast_info.last_price
        print(f"  [SUCCESS] {symbol}: Price = {price}")
        return True
    except Exception as e:
        print(f"  [FAIL] {symbol}: {e}")
        return False

def resolve(symbol):
    if "." in symbol:
        return symbol
        
    # Prioritize India
    indian = f"{symbol}.NS"
    if check_ticker(indian):
        return indian
        
    # Fallback to US/Global
    if check_ticker(symbol):
        return symbol
        
    return symbol # Return original if both fail

print("Resolution for TCS:", resolve("TCS"))
print("Resolution for AAPL:", resolve("AAPL"))
