# StockAI Demo Script
Write-Host "========================================"
Write-Host "   StockAI Research Assistant Demo"
Write-Host "========================================"
Write-Host ""

Write-Host "Checking services..." -ForegroundColor Yellow

# Test Frontend
try {
    $frontend = Invoke-WebRequest -Uri "http://localhost:5173" -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop
    Write-Host "[OK] Frontend (React): Running on port 5173" -ForegroundColor Green
}
catch {
    Write-Host "[FAIL] Frontend: Not running" -ForegroundColor Red
}

# Test Node.js Backend
try {
    $nodeBackend = Invoke-WebRequest -Uri "http://localhost:5000/health" -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop
    Write-Host "[OK] Node.js Backend: Running on port 5000" -ForegroundColor Green
}
catch {
    Write-Host "[FAIL] Node.js Backend: Not running" -ForegroundColor Red
}

# Test Python Agent
try {
    $pythonAgent = Invoke-WebRequest -Uri "http://localhost:8000/health" -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop
    Write-Host "[OK] Python AI Agent: Running on port 8000" -ForegroundColor Green
}
catch {
    Write-Host "[FAIL] Python AI Agent: Not running" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================"
Write-Host "   Testing AI Features"
Write-Host "========================================"
Write-Host ""

# Test Fundamental Analysis
Write-Host "Testing Fundamental Analysis (AAPL)..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/agent/analyze" -Method POST -ContentType "application/json" -Body '{"ticker":"AAPL","type":"Fundamental"}' -UseBasicParsing -ErrorAction Stop
    $data = $response.Content | ConvertFrom-Json
    Write-Host "  Ticker: $($data.ticker)" -ForegroundColor Cyan
    Write-Host "  Rating: $($data.rating)" -ForegroundColor Cyan
    Write-Host "  Summary: $($data.summary)" -ForegroundColor Green
}
catch {
    Write-Host "  Failed to get analysis" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================"
Write-Host "   Demo Complete!"
Write-Host "========================================"
Write-Host ""
Write-Host "Access the web interface at: http://localhost:5173" -ForegroundColor Green
