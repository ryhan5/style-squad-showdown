from fastapi import APIRouter, File, UploadFile, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.responses import FileResponse, JSONResponse
from typing import List, Optional
import os
import uuid
from pathlib import Path
import json

from app.core.config import settings
from app.services.virtual_tryon import process_virtual_tryon, virtual_tryon_service

router = APIRouter()

@router.post("/upload/image")
async def upload_image(file: UploadFile = File(...)):
    """
    Upload an image file (user photo or garment).
    Returns the path to the saved file.
    """
    try:
        filename = await virtual_tryon_service.process_image_upload(file)
        return {"filename": filename, "url": f"/uploads/{filename}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

import logging
logger = logging.getLogger(__name__)

@router.post("/try-on")
async def virtual_try_on(
    user_image: str = "",
    garment_image: str = "",
    user_image_file: UploadFile = None,
    garment_image_file: UploadFile = None
):
    """
    Process virtual try-on with the provided images.
    Accepts either file paths or file uploads.
    """
    logger.info("=== Starting virtual try-on request ===")
    request_id = str(uuid.uuid4())
    logger.info(f"Request ID: {request_id}")
    
    # Track if we need to clean up uploaded files
    uploaded_files = []
    
    try:
        # Handle file uploads if provided
        if user_image_file:
            logger.info("Processing user image file upload")
            try:
                user_image = await virtual_tryon_service.process_image_upload(user_image_file)
                user_image_path = os.path.join(settings.UPLOAD_FOLDER, user_image)
                uploaded_files.append(user_image_path)
                logger.info(f"User image saved to: {user_image_path}")
            except Exception as e:
                error_msg = f"Error processing user image upload: {str(e)}"
                logger.error(error_msg, exc_info=True)
                raise HTTPException(status_code=400, detail=error_msg)
        else:
            user_image_path = user_image
            logger.info(f"Using provided user image path: {user_image_path}")
        
        if garment_image_file:
            logger.info("Processing garment image file upload")
            try:
                garment_image = await virtual_tryon_service.process_image_upload(garment_image_file)
                garment_image_path = os.path.join(settings.UPLOAD_FOLDER, garment_image)
                uploaded_files.append(garment_image_path)
                logger.info(f"Garment image saved to: {garment_image_path}")
            except Exception as e:
                error_msg = f"Error processing garment image upload: {str(e)}"
                logger.error(error_msg, exc_info=True)
                raise HTTPException(status_code=400, detail=error_msg)
        else:
            garment_image_path = garment_image
            logger.info(f"Using provided garment image path: {garment_image_path}")
        
        # Verify files exist and are accessible
        try:
            if not os.path.exists(user_image_path):
                error_msg = f"User image not found at path: {user_image_path}"
                logger.error(error_msg)
                raise HTTPException(status_code=400, detail=error_msg)
                
            if not os.access(user_image_path, os.R_OK):
                error_msg = f"Cannot read user image at path: {user_image_path}"
                logger.error(error_msg)
                raise HTTPException(status_code=400, detail=error_msg)
                
            if not os.path.exists(garment_image_path):
                error_msg = f"Garment image not found at path: {garment_image_path}"
                logger.error(error_msg)
                raise HTTPException(status_code=400, detail=error_msg)
                
            if not os.access(garment_image_path, os.R_OK):
                error_msg = f"Cannot read garment image at path: {garment_image_path}"
                logger.error(error_msg)
                raise HTTPException(status_code=400, detail=error_msg)
                
        except Exception as e:
            error_msg = f"Error validating image files: {str(e)}"
            logger.error(error_msg, exc_info=True)
            raise HTTPException(status_code=400, detail=error_msg)
        
        try:
            logger.info("Starting virtual try-on processing...")
            # Process the virtual try-on
            result_path = await process_virtual_tryon(user_image_path, garment_image_path)
            
            if not result_path or not os.path.exists(result_path):
                error_msg = f"Failed to generate result image. Result path: {result_path}"
                logger.error(error_msg)
                raise HTTPException(status_code=500, detail=error_msg)
            
            # Verify the result file is accessible
            if not os.access(result_path, os.R_OK):
                error_msg = f"Cannot read generated result image at path: {result_path}"
                logger.error(error_msg)
                raise HTTPException(status_code=500, detail=error_msg)
            
            # Return relative URL to the result
            result_url = result_path.replace('\\', '/').split('static/')[-1]
            logger.info(f"Virtual try-on completed successfully. Result URL: /static/{result_url}")
            
            # Clean up uploaded files if they're not needed anymore
            for file_path in uploaded_files:
                try:
                    if os.path.exists(file_path):
                        os.remove(file_path)
                        logger.info(f"Cleaned up temporary file: {file_path}")
                except Exception as e:
                    logger.warning(f"Failed to clean up temporary file {file_path}: {str(e)}")
            
            return {"result_url": f"/static/{result_url}"}
            
        except HTTPException:
            raise  # Re-raise HTTP exceptions as-is
            
        except Exception as e:
            error_msg = f"Error during virtual try-on processing: {str(e)}"
            logger.error(error_msg, exc_info=True)
            raise HTTPException(status_code=500, detail=error_msg)
            
    except HTTPException as http_err:
        # Log the HTTP error details
        logger.error(f"HTTP error {http_err.status_code}: {http_err.detail}")
        raise
        
    except Exception as e:
        error_msg = f"Unexpected error in virtual try-on endpoint: {str(e)}"
        logger.error(error_msg, exc_info=True)
        raise HTTPException(status_code=500, detail=error_msg)
        
    finally:
        # Ensure any temporary files are cleaned up
        for file_path in uploaded_files:
            try:
                if os.path.exists(file_path):
                    os.remove(file_path)
                    logger.info(f"Cleaned up temporary file in finally block: {file_path}")
            except Exception as e:
                logger.warning(f"Failed to clean up temporary file {file_path} in finally block: {str(e)}")
        
        logger.info(f"=== Completed virtual try-on request {request_id} ===")

@router.websocket("/ws/try-on/{client_id}")
async def websocket_try_on(websocket: WebSocket, client_id: str):
    """
    WebSocket endpoint for real-time virtual try-on.
    """
    await websocket.accept()
    try:
        while True:
            # Receive message from client
            data = await websocket.receive_json()
            
            # Process message
            if data["type"] == "try_on":
                # Process the try-on request
                result_path = await process_virtual_tryon(
                    data["user_image"], 
                    data["garment_image"]
                )
                
                # Send result back to client
                result_url = result_path.replace('\\', '/').split('static/')[-1]
                await websocket.send_json({
                    "type": "result",
                    "result_url": f"/static/{result_url}"
                })
                
    except WebSocketDisconnect:
        print(f"Client {client_id} disconnected")
    except Exception as e:
        print(f"Error in WebSocket: {str(e)}")
        await websocket.close()

@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "ok", "service": "virtual-tryon-api"}
