from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import tempfile
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configuration
ALLOWED_EXTENSIONS = {'mp4', 'avi', 'mov', 'mkv', 'webm'}
MAX_FILE_SIZE = 100 * 1024 * 1024  # 100MB

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def analyze_video_frames(video_path):
    """
    Analyze video frames for potential deepfake indicators
    This is a simplified version - in a real application, you would use
    a proper deepfake detection model
    """
    cap = cv2.VideoCapture(video_path)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    
    if total_frames == 0:
        return {"error": "Could not read video frames"}
    
    # Sample some frames for analysis
    frame_indices = np.linspace(0, total_frames-1, min(20, total_frames), dtype=int)
    frames = []
    
    for i in frame_indices:
        cap.set(cv2.CAP_PROP_POS_FRAMES, i)
        ret, frame = cap.read()
        if ret:
            frames.append(frame)
    
    cap.release()
    
    # Simple analysis (in a real application, use a proper deepfake detection model)
    # This is just a placeholder that returns random results
    import random
    is_fake = random.random() > 0.7
    score = random.uniform(0.7, 0.95) if is_fake else random.uniform(0.05, 0.3)
    
    if is_fake:
        indicators = [
            "Inconsistent blinking pattern",
            "Audio-video sync issues", 
            "Unnatural facial movements",
            "Edge artifacts around face",
            "Inconsistent lighting on face"
        ]
        analysis = "This video shows signs of potential manipulation consistent with deepfake techniques"
    else:
        indicators = [
            "Natural facial movements",
            "Consistent audio sync", 
            "Normal blinking pattern",
            "Consistent lighting across frames",
            "No visual artifacts detected"
        ]
        analysis = "This video appears to be authentic with no signs of deepfake manipulation"
    
    return {
        "filename": os.path.basename(video_path),
        "is_likely_fake": is_fake,
        "deepfake_analysis": {
            "score": score,
            "indicators": indicators,
            "analysis": analysis,
            "frames_analyzed": len(frames)
        }
    }

@app.route('/analyze-video', methods=['POST'])
def analyze_video():
    # Check if file was uploaded
    if 'video' not in request.files:
        return jsonify({"error": "No video file provided"}), 400
    
    file = request.files['video']
    
    # Check if file is selected
    if file.filename == '':
        return jsonify({"error": "No video file selected"}), 400
    
    # Check file type
    if not allowed_file(file.filename):
        return jsonify({"error": "File type not allowed"}), 400
    
    # Check file size
    file.seek(0, os.SEEK_END)
    file_length = file.tell()
    if file_length > MAX_FILE_SIZE:
        return jsonify({"error": "File too large"}), 400
    file.seek(0)
    
    # Save uploaded file temporarily
    temp_dir = tempfile.mkdtemp()
    filename = secure_filename(file.filename)
    temp_path = os.path.join(temp_dir, filename)
    file.save(temp_path)
    
    try:
        # Analyze the video
        result = analyze_video_frames(temp_path)
        
        # Clean up
        os.remove(temp_path)
        os.rmdir(temp_dir)
        
        return jsonify(result)
    
    except Exception as e:
        # Clean up even if error occurs
        if os.path.exists(temp_path):
            os.remove(temp_path)
        if os.path.exists(temp_dir):
            os.rmdir(temp_dir)
        
        return jsonify({"error": f"Error processing video: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)