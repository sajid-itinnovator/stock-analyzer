from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import agent

app = FastAPI(title="StockAI Agents API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(agent.router, prefix="/agent", tags=["Agents"])

@app.get("/health")
async def health_check():
    return {"status": "ok", "message": "Python AI Agent service is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
