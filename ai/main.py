import sys
import os
import cv2
import numpy as np
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any
import uvicorn
import base64

# Add current directory to sys.path to ensure imports work regardless of run context
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(current_dir)

# Try imports
try:
    from facial.engines.paic_engine import PAICFacialEngine
    from fusion.fusion_engine import LateFusionEngine
except ImportError:
    # If running from parent directory
    from ai.facial.engines.paic_engine import PAICFacialEngine
    from ai.fusion.fusion_engine import LateFusionEngine

from mediapipe.python.solutions.face_mesh import FaceMesh

app = FastAPI(title="PainSense AI Backend", description="AI Backend for Multimodal Pain Detection")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for the friend's frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global instances
paic_engine = PAICFacialEngine()
fusion_engine = LateFusionEngine()
face_mesh = FaceMesh(
    static_image_mode=True,  # Analyzing single frames/images
    max_num_faces=1,
    refine_landmarks=True,
    min_detection_confidence=0.5
)

class PhysioInput(BaseModel):
    pain: float
    signal_quality: float = 1.0
    motion_artifact: bool = False

class FusionInput(BaseModel):
    facial: Dict[str, Any]
    physio: PhysioInput

class FullAnalysisResponse(BaseModel):
    facial_analysis: Dict[str, Any]
    fusion_result: Dict[str, Any]

@app.get("/")
def read_root():
    return {"status": "active", "message": "PainSense AI Backend is running"}

@app.post("/analyze/face")
async def analyze_face(file: UploadFile = File(...)):
    """
    Upload an image to get facial pain analysis.
    """
    try:
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if frame is None:
            raise HTTPException(status_code=400, detail="Invalid image file")

        # Process with MediaPipe
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        result = face_mesh.process(rgb)

        facial_data = {
            "pain": 0.0,
            "features": {},
            "face_detected": False
        }

        if result.multi_face_landmarks:
            facial_data["face_detected"] = True
            face = result.multi_face_landmarks[0]
            h, w, _ = frame.shape
            landmarks = [(int(p.x * w), int(p.y * h)) for p in face.landmark]

            raw_score, features = paic_engine.compute_paic(landmarks)
            # We use the raw score directly for single-frame analysis if temporal smoothing isn't desired per-request
            # Or we can use temporal_score if we assume a stream. 
            # For an API, let's use temporal_score but acknowledge it updates global state.
            facial_pain_score = paic_engine.temporal_score(raw_score)
            
            facial_data["pain"] = facial_pain_score
            facial_data["features"] = features
        else:
            # No face detected
            pass

        return facial_data

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze/fusion")
async def analyze_fusion(data: FusionInput):
    """
    Fuse existing facial data with physio data.
    """
    try:
        # Convert Pydantic model to dicts expected by the engine
        facial_dict = data.facial
        physio_dict = data.physio.dict()
        
        result = fusion_engine.fuse(facial_dict, physio_dict)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze/full")
async def analyze_full(
    file: UploadFile = File(...),
    physio_pain: float = Form(...),
    physio_quality: float = Form(1.0),
    physio_artifact: bool = Form(False)
):
    """
    Full analysis: Upload image + provide physio stats in one go.
    """
    try:
        # 1. Face Analysis
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if frame is None:
            raise HTTPException(status_code=400, detail="Invalid image file")

        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        result = face_mesh.process(rgb)

        facial_data = {
            "pain": 0.0,
            "features": {
                 "eye_tightening": 0.0,
                 "mouth_open": 0.0,
                 "brow_lower": 0.0,
                 "nose_wrinkle": 0.0,
                 "grimace": 0.0
            },
            "face_detected": False
        }

        if result.multi_face_landmarks:
            facial_data["face_detected"] = True
            face = result.multi_face_landmarks[0]
            h, w, _ = frame.shape
            landmarks = [(int(p.x * w), int(p.y * h)) for p in face.landmark]

            raw_score, features = paic_engine.compute_paic(landmarks)
            facial_pain_score = paic_engine.temporal_score(raw_score)
            
            facial_data["pain"] = facial_pain_score
            facial_data["features"] = features

        # 2. Physio Data
        physio_data = {
            "pain": physio_pain,
            "signal_quality": physio_quality,
            "motion_artifact": physio_artifact
        }

        # 3. Fusion
        fusion_result = fusion_engine.fuse(facial_data, physio_data)

        return {
            "facial_analysis": facial_data,
            "fusion_result": fusion_result
        }

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
