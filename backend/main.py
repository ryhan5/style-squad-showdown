import logging
import os
import sys
from pathlib import Path
from typing import List, Optional
import uuid
from datetime import datetime

from fastapi import FastAPI, UploadFile, File, WebSocket, WebSocketDisconnect, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
import uvicorn

from app.api.routes import router as api_router
from app.core.config import settings
from app.services.virtual_tryon import process_virtual_tryon

# Configure logging
from log_config import get_logger
logger = get_logger(__name__)

# Log unhandled exceptions
def handle_exception(exc_type, exc_value, exc_traceback):
    if issubclass(exc_type, KeyboardInterrupt):
        sys.__excepthook__(exc_type, exc_value, exc_traceback)
        return
    logger.critical("Uncaught exception", exc_info=(exc_type, exc_value, exc_traceback))

sys.excepthook = handle_exception

# Create necessary directories
os.makedirs("uploads", exist_ok=True)
os.makedirs("static/results", exist_ok=True)
os.makedirs("logs", exist_ok=True)

app = FastAPI(
    title="Virtual Try-On API",
    version="1.0.0",
    on_startup=[lambda: logger.info("Starting Virtual Try-On API")],
    on_shutdown=[lambda: logger.info("Shutting down Virtual Try-On API")]
)

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "Internal server error"},
    )

# Log all requests
@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"Request: {request.method} {request.url}")
    try:
        response = await call_next(request)
        logger.info(f"Response status: {response.status_code}")
        return response
    except Exception as e:
        logger.error(f"Request failed: {str(e)}", exc_info=True)
        raise

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Include API routes
app.include_router(api_router, prefix="/api")

# WebSocket endpoint for real-time updates
active_connections: List[WebSocket] = []

@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    await websocket.accept()
    active_connections.append(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Handle incoming WebSocket messages if needed
    except WebSocketDisconnect:
        active_connections.remove(websocket)

@app.get("/")
async def read_root():
    return {"message": "Welcome to Virtual Try-On API"}

if __name__ == "__main__":
    logger.info("Starting Uvicorn server...")
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="debug",
        access_log=True,
    )
