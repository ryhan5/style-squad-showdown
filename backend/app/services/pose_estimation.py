import cv2
import numpy as np
from typing import Tuple, Dict, List, Optional, Any
import logging
import os

logger = logging.getLogger(__name__)

class PoseEstimator:
    def __init__(self, model_path: Optional[str] = None):
        """
        Initialize the pose estimation model using OpenCV's DNN module.
        
        Args:
            model_path: Path to the OpenPose model files
        """
        self.net = None
        self.in_height = 368
        self.in_width = 368
        self.threshold = 0.1
        self.pose_pairs = [
            [1, 0], [1, 2], [2, 3], [3, 4], [1, 5], [5, 6],
            [6, 7], [1, 8], [8, 9], [9, 10], [1, 11], [11, 12], [12, 13]
        ]
        self.keypoints_map = {
            0: "Nose", 1: "Neck", 2: "RShoulder", 3: "RElbow", 4: "RWrist",
            5: "LShoulder", 6: "LElbow", 7: "LWrist", 8: "RHip", 9: "RKnee",
            10: "RAnkle", 11: "LHip", 12: "LKnee", 13: "LAnkle", 14: "REye",
            15: "LEye", 16: "REar", 17: "LEar"
        }
        
        try:
            # Try to load the model from the specified path or use a default model
            if model_path and os.path.exists(model_path):
                proto_file = os.path.join(model_path, "pose_deploy_linevec.prototxt")
                weights_file = os.path.join(model_path, "pose_iter_440000.caffemodel")
                self.net = cv2.dnn.readNetFromCaffe(proto_file, weights_file)
                logger.info("Loaded custom OpenPose model")
            else:
                # Fallback to a simpler approach if model loading fails
                logger.warning("Could not load OpenPose model, using simple body detection")
        except Exception as e:
            logger.warning(f"Failed to load pose estimation model: {e}")

    def estimate_pose(self, image: np.ndarray) -> Optional[Dict[str, Tuple[float, float]]]:
        """
        Estimate pose keypoints from an image using OpenCV's DNN module.
        
        Args:
            image: Input image in BGR format
            
        Returns:
            Dictionary of landmark names to (x, y) coordinates, or None if no pose detected
        """
        if self.net is None:
            return self._estimate_pose_simple(image)
            
        try:
            # Prepare the frame
            frame_height, frame_width = image.shape[:2]
            
            # Prepare the frame for the network
            inp_blob = cv2.dnn.blobFromImage(
                image, 1.0 / 255, (self.in_width, self.in_height),
                (0, 0, 0), swapRB=False, crop=False)
                
            # Set the input to the network
            self.net.setInput(inp_blob)
            
            # Run forward pass to get the output
            output = self.net.forward()
            
            # Extract keypoints
            points = []
            keypoints = {}
            
            for i in range(len(self.keypoints_map)):
                # Confidence map of corresponding body's part.
                prob_map = output[0, i, :, :]
                prob_map = cv2.resize(prob_map, (frame_width, frame_height))
                
                # Find global maxima of the prob_map.
                min_val, prob, min_loc, point = cv2.minMaxLoc(prob_map)
                
                if prob > self.threshold:
                    x = point[0]
                    y = point[1]
                    keypoints[self.keypoints_map[i]] = (x, y)
                    points.append((x, y))
                else:
                    points.append(None)
            
            return keypoints if keypoints else None
            
        except Exception as e:
            logger.error(f"Error in pose estimation: {e}")
            return self._estimate_pose_simple(image)
    
    def _estimate_pose_simple(self, image: np.ndarray) -> Optional[Dict[str, Tuple[float, float]]]:
        """
        A simple fallback pose estimation that detects face and body using OpenCV's Haar cascades.
        This is used when the DNN model is not available.
        """
        try:
            # Convert to grayscale
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            
            # Load the pre-trained Haar Cascade models
            face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
            upper_body_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_upperbody.xml')
            
            # Detect faces and upper body
            faces = face_cascade.detectMultiScale(gray, 1.1, 4)
            bodies = upper_body_cascade.detectMultiScale(gray, 1.1, 4)
            
            keypoints = {}
            
            # If we found a face, use it as a reference
            if len(faces) > 0:
                x, y, w, h = faces[0]
                keypoints["Nose"] = (x + w // 2, y + h // 2)
                keypoints["Neck"] = (x + w // 2, y + h)
            
            # If we found an upper body, use it as a reference
            if len(bodies) > 0:
                x, y, w, h = bodies[0]
                if "Neck" not in keypoints:
                    keypoints["Neck"] = (x + w // 2, y + h // 4)
                keypoints["RShoulder"] = (x + w, y + h // 4)
                keypoints["LShoulder"] = (x, y + h // 4)
                keypoints["RHip"] = (x + w, y + h)
                keypoints["LHip"] = (x, y + h)
            
            return keypoints if keypoints else None
            
        except Exception as e:
            logger.error(f"Error in simple pose estimation: {e}")
            return None
        
        return keypoints

    def draw_pose(self, image: np.ndarray, keypoints: Dict[str, Tuple[float, float]]) -> np.ndarray:
        """
        Draw the detected pose on the image for debugging.
        
        Args:
            image: Input image in BGR format
            keypoints: Dictionary of landmark names to (x, y) coordinates
            
        Returns:
            Image with pose drawn
        """
        if not keypoints:
            return image
            
        try:
            # Create a copy of the image
            debug_image = image.copy()
            
            # Draw keypoints
            for name, point in keypoints.items():
                if point:
                    x, y = int(point[0]), int(point[1])
                    # Draw the point
                    cv2.circle(debug_image, (x, y), 5, (0, 255, 0), -1)
                    # Add label
                    cv2.putText(debug_image, name, (x + 5, y - 5), 
                               cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 1)
            
            # Define connections based on available keypoints
            connections = []
            
            # Torso
            if 'Neck' in keypoints and 'RShoulder' in keypoints:
                connections.append(('Neck', 'RShoulder'))
            if 'Neck' in keypoints and 'LShoulder' in keypoints:
                connections.append(('Neck', 'LShoulder'))
            if 'RShoulder' in keypoints and 'RHip' in keypoints:
                connections.append(('RShoulder', 'RHip'))
            if 'LShoulder' in keypoints and 'LHip' in keypoints:
                connections.append(('LShoulder', 'LHip'))
            if 'RHip' in keypoints and 'LHip' in keypoints:
                connections.append(('RHip', 'LHip'))
                
            # Arms
            if 'RShoulder' in keypoints and 'RElbow' in keypoints:
                connections.append(('RShoulder', 'RElbow'))
            if 'RElbow' in keypoints and 'RWrist' in keypoints:
                connections.append(('RElbow', 'RWrist'))
            if 'LShoulder' in keypoints and 'LElbow' in keypoints:
                connections.append(('LShoulder', 'LElbow'))
            if 'LElbow' in keypoints and 'LWrist' in keypoints:
                connections.append(('LElbow', 'LWrist'))
                
            # Legs
            if 'RHip' in keypoints and 'RKnee' in keypoints:
                connections.append(('RHip', 'RKnee'))
            if 'RKnee' in keypoints and 'RAnkle' in keypoints:
                connections.append(('RKnee', 'RAnkle'))
            if 'LHip' in keypoints and 'LKnee' in keypoints:
                connections.append(('LHip', 'LKnee'))
            if 'LKnee' in keypoints and 'LAnkle' in keypoints:
                connections.append(('LKnee', 'LAnkle'))
            
            # Draw connections
            for (part_a, part_b) in connections:
                if part_a in keypoints and part_b in keypoints:
                    pt_a = keypoints[part_a]
                    pt_b = keypoints[part_b]
                    
                    if pt_a and pt_b:
                        cv2.line(debug_image, 
                                (int(pt_a[0]), int(pt_a[1])), 
                                (int(pt_b[0]), int(pt_b[1])), 
                                (0, 255, 255), 2)
            
            return debug_image
            
        except Exception as e:
            logger.error(f"Error drawing pose: {e}")
            return image

    def get_garment_position(
        self, 
        keypoints: Dict[str, Tuple[float, float]], 
        garment_type: str
    ) -> Tuple[int, int, int, int]:
        """
        Calculate the position and size of the garment based on pose keypoints.
        
        Args:
            keypoints: Dictionary of detected keypoints
            garment_type: Type of garment ('top', 'bottom', 'hat', etc.)
            
        Returns:
            Tuple of (x, y, width, height) for the garment
        """
        if not keypoints:
            logger.warning("No keypoints provided for garment positioning")
            return 0, 0, 0, 0
            
        # Get image dimensions from keypoints (approximate)
        max_x = max([k[0] for k in keypoints.values()]) if keypoints else 0
        max_y = max([k[1] for k in keypoints.values()]) if keypoints else 0
        height, width = max_y * 2, max_x * 2
        
        try:
            if garment_type == 'top':
                # Use shoulders and neck for top positioning
                if 'RShoulder' in keypoints and 'LShoulder' in keypoints and 'Neck' in keypoints:
                    neck = keypoints['Neck']
                    r_shoulder = keypoints['RShoulder']
                    l_shoulder = keypoints['LShoulder']
                    
                    # Calculate shoulder width and body center
                    shoulder_width = abs(r_shoulder[0] - l_shoulder[0])
                    center_x = (r_shoulder[0] + l_shoulder[0]) // 2
                    
                    # Calculate dimensions
                    garment_width = int(shoulder_width * 1.8)  # Add padding
                    garment_height = int(garment_width * 1.2)  # Slightly taller than wide
                    
                    # Position
                    x = center_x - garment_width // 2
                    y = neck[1] - garment_height // 3  # Start above neck
                    
                    return max(0, x), max(0, y), garment_width, garment_height
                
            elif garment_type == 'bottom':
                # Use hips for bottom positioning
                if 'RHip' in keypoints and 'LHip' in keypoints:
                    r_hip = keypoints['RHip']
                    l_hip = keypoints['LHip']
                    
                    # Calculate hip width and center
                    hip_width = abs(r_hip[0] - l_hip[0])
                    center_x = (r_hip[0] + l_hip[0]) // 2
                    
                    # Calculate dimensions
                    garment_width = int(hip_width * 1.6)  # Add padding
                    garment_height = int(garment_width * 0.8)  # Wider than tall
                    
                    # Position
                    x = center_x - garment_width // 2
                    y = min(r_hip[1], l_hip[1])  # Start at the higher hip point
                    
                    return max(0, x), y, garment_width, garment_height
                
            elif garment_type == 'hat':
                # Use nose and eyes for hat positioning
                if 'Nose' in keypoints:
                    nose = keypoints['Nose']
                    eye_level = nose[1] - 40  # Approximate eye level
                    
                    # Calculate hat size based on face size
                    hat_size = int(width * 0.3)
                    
                    # Position hat above the head
                    x = nose[0] - hat_size // 2
                    y = eye_level - hat_size
                    
                    return max(0, x), max(0, y), hat_size, hat_size
            
            # Fallback positioning based on available keypoints
            if 'Neck' in keypoints:
                neck = keypoints['Neck']
                size = int(width * 0.4)  # Default size
                x = neck[0] - size // 2
                y = neck[1] - size // 2
                return max(0, x), max(0, y), size, size
                
            # Last resort: use image center
            logger.warning("Using fallback garment positioning")
            size = min(width, height) // 3
            return (width - size) // 2, (height - size) // 2, size, size
            
        except Exception as e:
            logger.error(f"Error in get_garment_position: {e}")
            # Return a safe default
            size = min(width, height) // 3
            return (width - size) // 2, (height - size) // 2, size, size

    def _get_top_position(self, keypoints: Dict[str, Tuple[float, float]]) -> Tuple[int, int, int, int]:
        """Calculate position for a top (shirt/jacket)."""
        # Get relevant keypoints
        left_shoulder = keypoints.get('LEFT_SHOULDER')
        right_shoulder = keypoints.get('RIGHT_SHOULDER')
        left_hip = keypoints.get('LEFT_HIP')
        right_hip = keypoints.get('RIGHT_HIP')
        
        if not all([left_shoulder, right_shoulder, left_hip, right_hip]):
            return 0, 0, 0, 0
            
        # Calculate width based on shoulder width
        shoulder_width = abs(left_shoulder[0] - right_shoulder[0])
        width = int(shoulder_width * 1.4)  # Add some margin
        
        # Calculate height based on shoulder to hip distance
        shoulder_y = min(left_shoulder[1], right_shoulder[1])
        hip_y = max(left_hip[1], right_hip[1])
        height = int((hip_y - shoulder_y) * 1.1)  # Add some margin
        
        # Center x-coordinate
        center_x = (left_shoulder[0] + right_shoulder[0]) // 2
        x = center_x - (width // 2)
        
        # Start y-coordinate slightly above shoulders
        y = int(shoulder_y - (height * 0.1))
        
        return x, y, width, height
    
    def _get_pants_position(self, keypoints: Dict[str, Tuple[float, float]]) -> Tuple[int, int, int, int]:
        """Calculate position for pants."""
        left_hip = keypoints.get('LEFT_HIP')
        right_hip = keypoints.get('RIGHT_HIP')
        left_knee = keypoints.get('LEFT_KNEE')
        right_knee = keypoints.get('RIGHT_KNEE')
        
        if not all([left_hip, right_hip, left_knee, right_knee]):
            return 0, 0, 0, 0
            
        # Calculate width based on hip width
        hip_width = abs(left_hip[0] - right_hip[0])
        width = int(hip_width * 1.3)  # Add some margin
        
        # Calculate height based on hip to knee distance
        hip_y = min(left_hip[1], right_hip[1])
        knee_y = max(left_knee[1], right_knee[1])
        height = int((knee_y - hip_y) * 1.5)  # Extend below knees
        
        # Center x-coordinate
        center_x = (left_hip[0] + right_hip[0]) // 2
        x = center_x - (width // 2)
        
        # Start y-coordinate at hips
        y = int(hip_y - (height * 0.1))
        
        return x, y, width, height
    
    def _get_hat_position(self, keypoints: Dict[str, Tuple[float, float]]) -> Tuple[int, int, int, int]:
        """Calculate position for a hat."""
        left_ear = keypoints.get('LEFT_EAR')
        right_ear = keypoints.get('RIGHT_EAR')
        nose = keypoints.get('NOSE')
        
        if not all([left_ear, right_ear, nose]):
            return 0, 0, 0, 0
            
        # Calculate width based on head width
        head_width = abs(left_ear[0] - right_ear[0])
        width = int(head_width * 1.8)  # Make hat wider than head
        height = int(width * 0.6)  # Keep aspect ratio
        
        # Center x-coordinate
        center_x = (left_ear[0] + right_ear[0]) // 2
        x = center_x - (width // 2)
        
        # Position above head
        head_top = min(left_ear[1], right_ear[1], nose[1])
        y = int(head_top - (height * 0.8))  # Position above head
        
        return x, y, width, height

    def draw_pose(self, image: np.ndarray, keypoints: Dict[str, Tuple[float, float]]) -> np.ndarray:
        """Draw pose landmarks on the image for debugging."""
        if not keypoints:
            return image
            
        # Create a copy of the image
        img_copy = image.copy()
        
        # Draw keypoints
        for name, (x, y) in keypoints.items():
            cv2.circle(img_copy, (int(x), int(y)), 5, (0, 255, 0), -1)
            cv2.putText(img_copy, name, (int(x), int(y) - 10), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.3, (0, 0, 255), 1)
        
        return img_copy
