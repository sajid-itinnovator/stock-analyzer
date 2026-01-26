
# Start Stock AI App
# This script starts all 3 services in separate terminal windows

Write-Open "Starting Stock Research App..."

# 1. Start Python Backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend-python; python main.py"

# 2. Start Node Backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend-node; npm run dev"

# 3. Start Frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Write-Host "All services started! Open http://localhost:5173 in your browser."
