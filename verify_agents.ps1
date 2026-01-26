# StockAI Agent Verification Script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   StockAI Agent Verification" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Test Fundamental Agent
Write-Host "`n1. Testing Fundamental Analysis (AAPL)..." -ForegroundColor Yellow
try {
    $res = Invoke-WebRequest -Uri "http://localhost:8000/agent/analyze" -Method POST -Body '{"ticker":"AAPL","type":"Fundamental"}' -ContentType "application/json" -UseBasicParsing
    $data = $res.Content | ConvertFrom-Json
    Write-Host "   Rating: $($data.rating)" -ForegroundColor Green
    Write-Host "   Summary: $($data.summary.Substring(0, 50))..." -ForegroundColor Gray
}
catch { Write-Host "   Failed" -ForegroundColor Red }

# Test Technical Agent
Write-Host "`n2. Testing Technical Analysis (AAPL)..." -ForegroundColor Yellow
try {
    $res = Invoke-WebRequest -Uri "http://localhost:8000/agent/analyze" -Method POST -Body '{"ticker":"AAPL","type":"Technical"}' -ContentType "application/json" -UseBasicParsing
    $data = $res.Content | ConvertFrom-Json
    Write-Host "   Rating: $($data.rating)" -ForegroundColor Green
    Write-Host "   Summary: $($data.summary.Substring(0, 50))..." -ForegroundColor Gray
}
catch { Write-Host "   Failed" -ForegroundColor Red }

# Test Risk Agent
Write-Host "`n3. Testing Risk Analysis (AAPL)..." -ForegroundColor Yellow
try {
    $res = Invoke-WebRequest -Uri "http://localhost:8000/agent/analyze" -Method POST -Body '{"ticker":"AAPL","type":"Risk"}' -ContentType "application/json" -UseBasicParsing
    $data = $res.Content | ConvertFrom-Json
    Write-Host "   Rating: $($data.rating)" -ForegroundColor Green
    Write-Host "   Summary: $($data.summary.Substring(0, 50))..." -ForegroundColor Gray
}
catch { Write-Host "   Failed" -ForegroundColor Red }

# Test Sentiment Agent
Write-Host "`n4. Testing Sentiment Analysis (AAPL)..." -ForegroundColor Yellow
try {
    $res = Invoke-WebRequest -Uri "http://localhost:8000/agent/analyze" -Method POST -Body '{"ticker":"AAPL","type":"Sentiment"}' -ContentType "application/json" -UseBasicParsing
    $data = $res.Content | ConvertFrom-Json
    Write-Host "   Rating: $($data.rating)" -ForegroundColor Green
    Write-Host "   Summary: $($data.summary.Substring(0, 50))..." -ForegroundColor Gray
}
catch { Write-Host "   Failed" -ForegroundColor Red }

# Test News Agent
Write-Host "`n5. Testing News Analysis (AAPL)..." -ForegroundColor Yellow
try {
    $res = Invoke-WebRequest -Uri "http://localhost:8000/agent/analyze" -Method POST -Body '{"ticker":"AAPL","type":"News"}' -ContentType "application/json" -UseBasicParsing
    $data = $res.Content | ConvertFrom-Json
    Write-Host "   Rating: $($data.rating)" -ForegroundColor Green
    Write-Host "   Summary: $($data.summary.Substring(0, 50))..." -ForegroundColor Gray
}
catch { Write-Host "   Failed" -ForegroundColor Red }

# Test AI Advisor Agent
Write-Host "`n6. Testing AI Advisor (Aggregator) (AAPL)..." -ForegroundColor Yellow
try {
    $res = Invoke-WebRequest -Uri "http://localhost:8000/agent/analyze" -Method POST -Body '{"ticker":"AAPL","type":"Advisor"}' -ContentType "application/json" -UseBasicParsing
    $data = $res.Content | ConvertFrom-Json
    Write-Host "   Verdict: $($data.rating)" -ForegroundColor Green -BackgroundColor Black
    Write-Host "   Summary logic: $($data.key_metrics.PSObject.Properties['Primary Driver'].Value)" -ForegroundColor Gray
}
catch { Write-Host "   Failed" -ForegroundColor Red }

Write-Host "`nDone."
