import os
import cv2
import numpy as np
from typing import Tuple, Optional, Dict, Any
import uuid
from pathlib import Path
import logging
from fastapi import UploadFile, HTTPException
import shutil
import torch
import torchvision.transforms as transforms
from PIL import Image
import requests
from io import BytesIO
from .pose_estimation import PoseEstimator

from app.core.config import settings

# Initialize device
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

logger = logging.getLogger(__name__)

class VirtualTryOnService:
    def __init__(self):
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.segmentation_model = self._load_segmentation_model()
        self.pose_estimator = PoseEstimator()
        
        # Initialize result folder from settings
        self.result_folder = settings.RESULT_FOLDER
        
        # Create result folder if it doesn't exist
        os.makedirs(self.result_folder, exist_ok=True)
        logger.info(f"Initialized VirtualTryOnService on {self.device}. Result folder: {self.result_folder}")
        
    def _load_segmentation_model(self) -> Optional[torch.nn.Module]:
        """Load the segmentation model."""
        try:
            model = torch.hub.load('pytorch/vision:v0.10.0', 'deeplabv3_resnet50', pretrained=True)
            model = model.to(self.device)
            model.eval()
            logger.info("Successfully loaded DeepLabV3 model")
            return model
        except Exception as e:
            logger.error(f"Error loading segmentation model: {e}")
            return None

    async def process_image_upload(self, file: UploadFile) -> str:
        """
        Process an uploaded image file.
        
        Args:
            file: The uploaded file object from FastAPI
            
        Returns:
            str: The generated filename of the saved file
            
        Raises:
            HTTPException: If there's an error processing the file
        """
        logger.info(f"Processing image upload: {file.filename}")
        
        try:
            # Check if file is empty
            if not file.filename:
                error_msg = "No file provided"
                logger.error(error_msg)
                raise HTTPException(status_code=400, detail=error_msg)
            
            # Validate file extension
            file_extension = file.filename.split('.')[-1].lower()
            if not file_extension or file_extension not in settings.ALLOWED_EXTENSIONS:
                error_msg = f"File type not allowed. Allowed types: {', '.join(settings.ALLOWED_EXTENSIONS)}"
                logger.error(error_msg)
                raise HTTPException(status_code=400, detail=error_msg)
            
            # Create uploads directory if it doesn't exist
            os.makedirs(settings.UPLOAD_FOLDER, exist_ok=True)
            
            # Create unique filename with original extension
            filename = f"{uuid.uuid4()}.{file_extension}"
            file_path = os.path.join(settings.UPLOAD_FOLDER, filename)
            
            try:
                # Read file content
                file_content = await file.read()
                
                # Check file size (e.g., 10MB max)
                max_size = 10 * 1024 * 1024  # 10MB
                if len(file_content) > max_size:
                    error_msg = f"File too large. Max size: {max_size/(1024*1024):.1f}MB"
                    logger.error(error_msg)
                    raise HTTPException(status_code=400, detail=error_msg)
                
                # Verify it's a valid image by trying to open it
                try:
                    img = Image.open(BytesIO(file_content))
                    img.verify()  # Verify that it is, in fact, an image
                    img = Image.open(BytesIO(file_content))  # Reopen after verify
                    
                    # Convert to RGB if needed
                    if img.mode != 'RGB':
                        img = img.convert('RGB')
                    
                    # Save the processed image
                    img.save(file_path)
                    logger.info(f"Successfully saved uploaded file to: {file_path}")
                    
                except Exception as img_error:
                    error_msg = f"Invalid image file: {str(img_error)}"
                    logger.error(error_msg, exc_info=True)
                    raise HTTPException(status_code=400, detail=error_msg)
                
                return filename
                
            except HTTPException:
                raise  # Re-raise HTTP exceptions
                
            except Exception as e:
                error_msg = f"Error processing file content: {str(e)}"
                logger.error(error_msg, exc_info=True)
                raise HTTPException(status_code=500, detail=error_msg)
            
        except HTTPException:
            raise  # Re-raise HTTP exceptions
            
        except Exception as e:
            error_msg = f"Unexpected error processing file upload: {str(e)}"
            logger.error(error_msg, exc_info=True)
            raise HTTPException(status_code=500, detail="Error processing file upload")

    def _preprocess_image(self, image_path: str, target_size: tuple = (512, 512)) -> torch.Tensor:
        """Preprocess image for model input."""
        img = Image.open(image_path).convert('RGB')
        preprocess = transforms.Compose([
            transforms.Resize(target_size),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        ])
        return preprocess(img).unsqueeze(0).to(device)

    def _segment_garment(self, model, image_path: str) -> np.ndarray:
        """Segment the garment from the image."""
        input_tensor = self._preprocess_image(image_path)
        with torch.no_grad():
            output = model(input_tensor)['out'][0]
        output_predictions = output.argmax(0)
        
        # Convert to numpy and create mask
        mask = output_predictions.byte().cpu().numpy()
        return mask

    def _detect_garment_type(self, garment_img: np.ndarray, filename: str = '') -> str:
        """Detect garment type based on filename and image properties."""
        # First check filename for hints
        filename = filename.lower()
        if any(keyword in filename for keyword in ['hat', 'cap', 'beanie', 'head']):
            return 'hat'
        elif any(keyword in filename for keyword in ['shirt', 'top', 'tshirt', 'blouse']):
            return 'top'
        elif any(keyword in filename for keyword in ['pants', 'jeans', 'trousers', 'bottom']):
            return 'pants'
        
        # If no keywords in filename, use image properties
        h, w = garment_img.shape[:2]
        aspect_ratio = w / h if h > 0 else 1
        
        # For square-ish images, check if it looks like a hat
        if 0.8 <= aspect_ratio <= 1.2:
            # Check if the image has a curved top (common for hats)
            gray = cv2.cvtColor(garment_img, cv2.COLOR_BGR2GRAY)
            edges = cv2.Canny(gray, 50, 150)
            top_edges = edges[:h//3, :].sum()  # Check top third for edges
            if top_edges > edges[h//3:2*h//3, :].sum():
                return 'hat'
        
        if aspect_ratio > 1.3:
            return 'top'  # Wider than tall -> top
        elif aspect_ratio < 0.7:
            return 'pants'  # Taller than wide -> pants
        else:
            return 'top'  # Default to top for ambiguous cases

    def _remove_background(self, image: np.ndarray) -> np.ndarray:
        """Remove background from the garment image using color thresholding."""
        # Convert to HSV color space
        hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
        
        # Define color ranges for common background colors (white, light gray, etc.)
        lower_white = np.array([0, 0, 200], dtype=np.uint8)
        upper_white = np.array([180, 30, 255], dtype=np.uint8)
        
        # Create mask for white/light backgrounds
        mask = cv2.inRange(hsv, lower_white, upper_white)
        
        # Invert the mask to get the garment
        mask = cv2.bitwise_not(mask)
        
        # Apply morphological operations to clean up the mask
        kernel = np.ones((3,3), np.uint8)
        mask = cv2.erode(mask, kernel, iterations=1)
        mask = cv2.dilate(mask, kernel, iterations=2)
        
        # Find contours and keep only the largest one (the garment)
        contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        if contours:
            largest_contour = max(contours, key=cv2.contourArea)
            mask = np.zeros_like(mask)
            cv2.drawContours(mask, [largest_contour], -1, 255, -1)
        
        # Apply the mask to the original image
        result = cv2.bitwise_and(image, image, mask=mask)
        
        # Add alpha channel
        b, g, r = cv2.split(result)
        a = mask
        return cv2.merge([b, g, r, a])

    def _resize_garment(self, garment_img: np.ndarray, user_img: np.ndarray, garment_type: str) -> np.ndarray:
        """Resize garment based on its type and user image dimensions."""
        user_h, user_w = user_img.shape[:2]
        
        if garment_type == 'top':
            # For tops, make width 70-80% of user width for better coverage
            target_width = int(user_w * 0.75)
            aspect_ratio = garment_img.shape[1] / garment_img.shape[0]
            target_height = int(target_width / aspect_ratio)
            
            # Adjust height to be proportional to the body
            min_height = int(user_h * 0.4)  # At least 40% of body height
            max_height = int(user_h * 0.6)  # At most 60% of body height
            
            if target_height < min_height:
                target_height = min_height
                target_width = int(target_height * aspect_ratio)
            elif target_height > max_height:
                target_height = max_height
                target_width = int(target_height * aspect_ratio)
                
        elif garment_type == 'pants':
            # For pants, make width 40-50% of user width
            target_width = int(user_w * 0.45)
            aspect_ratio = garment_img.shape[1] / garment_img.shape[0]
            target_height = int(target_width / aspect_ratio)
            # Ensure pants aren't too tall
            max_height = int(user_h * 0.6)
            if target_height > max_height:
                target_height = max_height
                target_width = int(target_height * aspect_ratio)
                
        elif garment_type == 'hat':
            # For hats, make width 40-50% of user width
            target_width = int(user_w * 0.4)
            aspect_ratio = garment_img.shape[1] / garment_img.shape[0]
            target_height = int(target_width / aspect_ratio)
            
        return cv2.resize(garment_img, (target_width, target_height))

    def _position_garment(self, garment_img: np.ndarray, user_img: np.ndarray, garment_type: str) -> np.ndarray:
        """Position the garment on the user image based on its type."""
        user_h, user_w = user_img.shape[:2]
        
        # Ensure garment has 4 channels (RGBA)
        if garment_img.shape[2] == 3:
            garment_img = cv2.cvtColor(garment_img, cv2.COLOR_BGR2BGRA)
        
        garment_h, garment_w = garment_img.shape[:2]
        
        # Create a blank RGBA image the same size as user image
        positioned = np.zeros((user_h, user_w, 4), dtype=np.uint8)
        
        # Calculate positions based on garment type
        if garment_type == 'top':
            # Log dimensions for debugging
            logger.info(f"Positioning shirt - User: {user_h}x{user_w}, Garment: {garment_h}x{garment_w}")
            
            # Position shirt on the torso (chest area)
            x = (user_w - garment_w) // 2
            
            # Calculate position - start at 60% from top to ensure it's well below the neck
            y = int(user_h * 0.6)
            
            # Log initial position
            logger.info(f"Initial shirt position: x={x}, y={y}")
            
            # Ensure the shirt doesn't go below the waist
            max_y = int(user_h * 0.8) - garment_h
            y = min(y, max_y)
            
            # Ensure we don't go too high (but still below shoulders)
            min_y = int(user_h * 0.5)
            y = max(y, min_y)
            
            # Log final position
            logger.info(f"Final shirt position: x={x}, y={y}")
            
            # Ensure the shirt is wide enough
            min_width = int(user_w * 0.8)
            if garment_w < min_width:
                scale = min_width / garment_w
                new_w = int(garment_w * scale)
                new_h = int(garment_h * scale)
                garment_img = cv2.resize(garment_img, (new_w, new_h), interpolation=cv2.INTER_LINEAR)
                garment_h, garment_w = new_h, new_w
                logger.info(f"Resized shirt to: {new_w}x{new_h}")
                
                # Recalculate x position after resize
                x = (user_w - new_w) // 2
            
        elif garment_type == 'pants':
            # Position pants at lower body (waist down)
            x = (user_w - garment_w) // 2
            y = int(user_h * 0.5)  # Start at waist level
            
        elif garment_type == 'hat':
            # Position hat at the very top of the head
            x = (user_w - garment_w) // 2
            y = max(0, int(user_h * 0.05))  # Just below the top of the head
            
            # For hats, we might want to make them a bit larger
            scale = 1.2
            new_w = int(garment_w * scale)
            new_h = int(garment_h * scale)
            garment_img = cv2.resize(garment_img, (new_w, new_h), interpolation=cv2.INTER_LINEAR)
            x = (user_w - new_w) // 2
            y = max(0, int(user_h * 0.03))  # Slightly higher for hats
            
            # Update dimensions after resize
            garment_h, garment_w = new_h, new_w
            
        else:  # Default to top position
            x = (user_w - garment_w) // 2
            y = int(user_h * 0.2)
        
        # Ensure we're not going out of bounds
        y = max(0, min(y, user_h - garment_h))
        x = max(0, min(x, user_w - garment_w))
        
        # Place the garment on the positioned image using alpha blending
        if garment_h > 0 and garment_w > 0:
            # Extract the alpha channel from the garment
            garment_rgb = garment_img[:, :, :3]
            garment_alpha = garment_img[:, :, 3] / 255.0
            
            # Get the region of interest from the positioned image
            roi = positioned[y:y+garment_h, x:x+garment_w]
            
            # Blend the garment with the ROI
            for c in range(0, 3):
                roi[:, :, c] = (1. - garment_alpha) * roi[:, :, c] + garment_alpha * garment_rgb[:, :, c]
            
            # Update the alpha channel
            if roi.shape[2] > 3:  # If ROI has alpha channel
                roi_alpha = roi[:, :, 3] / 255.0
                new_alpha = np.maximum(roi_alpha, garment_alpha)
                roi[:, :, 3] = (new_alpha * 255).astype(np.uint8)
            
            positioned[y:y+garment_h, x:x+garment_w] = roi
        
        # Make sure we don't go out of bounds
        y = max(0, min(y, user_h - garment_h))
        x = max(0, min(x, user_w - garment_w))
        
        # Place the garment on the positioned image
        positioned[y:y+garment_h, x:x+garment_w] = garment_img
        return positioned

    def _simple_overlay(self, user_img: np.ndarray, garment_img: np.ndarray, alpha: float = 0.8) -> np.ndarray:
        """Simple overlay fallback when pose estimation fails."""
        result = user_img.copy()
        
        # Resize garment to be proportional to user
        h, w = user_img.shape[:2]
        gh, gw = garment_img.shape[:2]
        scale = min(w/(gw*1.5), h/(gh*1.5))  # 1.5x padding
        new_w, new_h = int(gw * scale), int(gh * scale)
        garment_img = cv2.resize(garment_img, (new_w, new_h), interpolation=cv2.INTER_LINEAR)
        
        # Center the garment
        x = (w - new_w) // 2
        y = (h - new_h) // 2
        
        return self._blend_images(result, garment_img, x, y, alpha)

    def _blend_images(self, bg_img: np.ndarray, fg_img: np.ndarray, x: int, y: int, alpha: float = 1.0) -> np.ndarray:
        """Blend foreground image with background at specified position."""
        result = bg_img.copy()
        fg_h, fg_w = fg_img.shape[:2]
        bg_h, bg_w = bg_img.shape[:2]
        
        # Ensure coordinates are within bounds
        x1, y1 = max(0, x), max(0, y)
        x2, y2 = min(bg_w, x + fg_w), min(bg_h, y + fg_h)
        
        # Adjust if out of bounds
        if x1 >= x2 or y1 >= y2:
            return result
            
        # Calculate the region of the foreground to use
        fg_x1, fg_y1 = max(0, -x), max(0, -y)
        fg_x2 = fg_x1 + (x2 - x1)
        fg_y2 = fg_y1 + (y2 - y1)
        
        # Extract the regions
        bg_region = result[y1:y2, x1:x2]
        fg_region = fg_img[fg_y1:fg_y2, fg_x1:fg_x2]
        
        # Handle different channel counts
        if len(fg_region.shape) == 2:  # Grayscale
            fg_region = cv2.cvtColor(fg_region, cv2.COLOR_GRAY2BGR)
        
        # If foreground has alpha channel, use it for blending
        if fg_region.shape[2] == 4:
            alpha_channel = fg_region[:, :, 3] / 255.0
            alpha_mask = alpha_channel[..., None] * alpha
        else:
            alpha_mask = np.ones((fg_region.shape[0], fg_region.shape[1], 1)) * alpha
        
        # Blend the images
        for c in range(0, 3):
            bg_region[..., c] = (
                alpha_mask[..., 0] * fg_region[..., c] +
                (1 - alpha_mask[..., 0]) * bg_region[..., c]
            )
        
        result[y1:y2, x1:x2] = bg_region
        return result

    def _overlay_garment(self, user_img: np.ndarray, garment_img: np.ndarray, garment_type: Optional[str] = None) -> np.ndarray:
        """
        Overlay the garment on the user image using pose estimation.
        
        Args:
            user_img: User image in BGR format
            garment_img: Garment image in BGR format with alpha channel
            garment_type: Type of garment (top, pants, hat, etc.)
            
        Returns:
            Image with garment overlaid on user
        """
        logger.info("Starting garment overlay process...")
        try:
            logger.info(f"Input image shape: {user_img.shape}")
            logger.info(f"Garment image shape: {garment_img.shape}")
            
            # Convert to RGB for pose estimation
            logger.info("Converting image to RGB for pose estimation...")
            user_img_rgb = cv2.cvtColor(user_img, cv2.COLOR_BGR2RGB)
            
            # Detect garment type if not provided
            if not garment_type:
                logger.info("Detecting garment type...")
                garment_type = self._detect_garment_type(garment_img)
                logger.info(f"Detected garment type: {garment_type}")
            
            # Remove background from garment
            logger.info("Removing background from garment...")
            garment_no_bg = self._remove_background(garment_img)
            if garment_no_bg is None or garment_no_bg.size == 0:
                logger.error("Failed to remove background from garment")
                return user_img
            logger.info(f"Garment after background removal shape: {garment_no_bg.shape}")
            
            # Estimate pose
            logger.info("Estimating pose...")
            keypoints = self.pose_estimator.estimate_pose(user_img)
            
            if not keypoints:
                logger.warning("Could not detect pose, falling back to simple overlay")
                return self._simple_overlay(user_img, garment_no_bg)
            
            logger.info(f"Detected {len(keypoints)} keypoints")
                
            # Get garment position based on pose
            logger.info("Calculating garment position...")
            x, y, width, height = self.pose_estimator.get_garment_position(keypoints, garment_type)
            logger.info(f"Calculated garment position: x={x}, y={y}, width={width}, height={height}")
            
            if width == 0 or height == 0:
                logger.warning("Could not determine garment position, falling back to simple overlay")
                return self._simple_overlay(user_img, garment_no_bg)
            
            # Resize garment to fit the calculated dimensions
            logger.info(f"Resizing garment to {width}x{height}...")
            resized_garment = cv2.resize(garment_no_bg, (width, height), interpolation=cv2.INTER_LINEAR)
            
            # Enable debug output
            debug = True
            if debug:
                debug_img = self.pose_estimator.draw_pose(user_img.copy(), keypoints)
                cv2.rectangle(debug_img, (x, y), (x + width, y + height), (0, 255, 0), 2)
                debug_path = os.path.join(settings.UPLOAD_FOLDER, 'debug_pose.jpg')
                cv2.imwrite(debug_path, debug_img)
                logger.info(f"Debug image saved to: {debug_path}")
            
            # Overlay the garment
            logger.info("Blending garment onto user image...")
            result = self._blend_images(user_img.copy(), resized_garment, x, y)
            
            logger.info("Garment overlay completed successfully")
            return result
            
        except Exception as e:
            logger.error(f"Error in garment overlay: {str(e)}", exc_info=True)
            logger.error(f"Error type: {type(e).__name__}")
            logger.error(f"Error details: {str(e)}")
            import traceback
            logger.error(f"Traceback: {traceback.format_exc()}")
            return user_img

    async def process_virtual_tryon(
        self, 
        user_image_path: str, 
        garment_image_path: str,
        output_path: Optional[str] = None
    ) -> str:
        """
        Process virtual try-on with the given user and garment images.
        
        Args:
            user_image_path: Path to the user's image file
            garment_image_path: Path to the garment image file
            output_path: Optional path to save the result
            
        Returns:
            Path to the processed result image
            
        Raises:
            HTTPException: If there's an error processing the images
        """
        try:
            logger.info(f"Starting virtual try-on process")
            logger.info(f"User image path: {user_image_path}")
            logger.info(f"Garment image path: {garment_image_path}")
            
            # Verify input files exist
            if not os.path.exists(user_image_path):
                error_msg = f"User image not found at path: {user_image_path}"
                logger.error(error_msg)
                raise HTTPException(status_code=400, detail=error_msg)
                
            if not os.path.exists(garment_image_path):
                error_msg = f"Garment image not found at path: {garment_image_path}"
                logger.error(error_msg)
                raise HTTPException(status_code=400, detail=error_msg)
            
            # Create output directory if it doesn't exist
            os.makedirs(self.result_folder, exist_ok=True)
            
            # Create output path if not provided
            if not output_path:
                output_filename = f"result_{uuid.uuid4()}.png"
                output_path = os.path.join(self.result_folder, output_filename)
            
            logger.info(f"Loading images...")
            # Load images with error handling
            try:
                user_img = cv2.imread(user_image_path)
                if user_img is None:
                    raise ValueError(f"Failed to load user image: {user_image_path}")
                    
                garment_img = cv2.imread(garment_image_path, cv2.IMREAD_UNCHANGED)
                if garment_img is None:
                    raise ValueError(f"Failed to load garment image: {garment_image_path}")
                    
                logger.info(f"User image shape: {user_img.shape}")
                logger.info(f"Garment image shape: {garment_img.shape}")
                
            except Exception as img_error:
                error_msg = f"Error loading images: {str(img_error)}"
                logger.error(error_msg, exc_info=True)
                raise HTTPException(status_code=400, detail=error_msg)
            
            try:
                # Detect garment type
                logger.info("Detecting garment type...")
                garment_type = self._detect_garment_type(garment_img)
                logger.info(f"Detected garment type: {garment_type}")
                
                # Process the virtual try-on with the pose estimator
                logger.info("Processing garment overlay...")
                result = self._overlay_garment(user_img, garment_img, garment_type)
                
                if result is None or not isinstance(result, np.ndarray):
                    error_msg = "Failed to process virtual try-on: Invalid result from overlay_garment"
                    logger.error(error_msg)
                    raise ValueError(error_msg)
                
                # Ensure the output directory exists
                os.makedirs(os.path.dirname(output_path), exist_ok=True)
                
                # Save result
                logger.info(f"Saving result to: {output_path}")
                if not cv2.imwrite(output_path, result):
                    error_msg = f"Failed to save result image to: {output_path}"
                    logger.error(error_msg)
                    raise IOError(error_msg)
                
                logger.info("Virtual try-on completed successfully")
                return output_path
                
            except Exception as proc_error:
                error_msg = f"Error during virtual try-on processing: {str(proc_error)}"
                logger.error(error_msg, exc_info=True)
                raise HTTPException(status_code=500, detail=error_msg)
            
        except HTTPException:
            # Re-raise HTTP exceptions as-is
            raise
            
        except Exception as e:
            # Catch any other exceptions and return a 500 error
            error_msg = f"Unexpected error in virtual try-on: {str(e)}"
            logger.error(error_msg, exc_info=True)
            raise HTTPException(status_code=500, detail=error_msg)
    
    async def process_video_stream(self, video_path: str) -> str:
        """Process a video stream for real-time virtual try-on."""
        try:
            output_path = os.path.join(self.result_folder, f"video_result_{uuid.uuid4()}.mp4")
            
            # TODO: Implement video processing with OpenCV
            # This is a placeholder that just copies the video
            shutil.copy2(video_path, output_path)
            
            return output_path
            
        except Exception as e:
            logger.error(f"Error processing video stream: {str(e)}")
            raise HTTPException(status_code=500, detail="Error processing video stream")
    
    def _resize_image(self, image: np.ndarray, width: int = None, height: int = None) -> np.ndarray:
        """Resize image while maintaining aspect ratio."""
        h, w = image.shape[:2]
        
        if width and height:
            return cv2.resize(image, (width, height), interpolation=cv2.INTER_AREA)
        
        if width:
            ratio = width / w
            dim = (width, int(h * ratio))
        else:
            ratio = height / h
            dim = (int(w * ratio), height)
            
        return cv2.resize(image, dim, interpolation=cv2.INTER_AREA)
    
    # def _load_model(self):
    #     """Load the virtual try-on model."""
    #     try:
    #         # TODO: Implement model loading logic
    #         # model = load_model(settings.MODEL_PATH)
    #         # return model
    #         pass
    #     except Exception as e:
    #         logger.error(f"Error loading model: {str(e)}")
    #         raise HTTPException(status_code=500, detail="Error loading model")

# Create a singleton instance
virtual_tryon_service = VirtualTryOnService()

# Helper function for API routes
async def process_virtual_tryon(user_image_path: str, garment_image_path: str) -> str:
    return await virtual_tryon_service.process_virtual_tryon(user_image_path, garment_image_path)
