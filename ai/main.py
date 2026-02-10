import sys
import os
import cv2
import numpy as np
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from datetime import datetime
import uvicorn
import base64
from fastapi import Security, Depends
from fastapi.security.api_key import APIKeyHeader

# Add current directory to sys.path to ensure imports work regardless of run context
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(current_dir)

# Try imports
try:
    from facial.engines.paic_engine import PAICFacialEngine
    from fusion.fusion_engine import LateFusionEngine
    from physio.signal_generator import PhysioSignalGenerator
    from physio.pain_predictor import PhysioPainPredictor
    from data_logger import PainDataLogger
except ImportError:
    # If running from parent directory
    from ai.facial.engines.paic_engine import PAICFacialEngine
    from ai.fusion.fusion_engine import LateFusionEngine
    from ai.physio.signal_generator import PhysioSignalGenerator
    from ai.physio.pain_predictor import PhysioPainPredictor
    from ai.data_logger import PainDataLogger

import mediapipe as mp

app = FastAPI(title="PainSense AI Backend", description="AI Backend for Multimodal Pain Detection")

# API Key Security
API_KEY_NAME = "X-API-Key"
api_key_header = APIKeyHeader(name=API_KEY_NAME, auto_error=False)

# Get API key from environment variable or use a default for dev
# ⚠️ PRODUCTION WARNING: Set AI_API_KEY environment variable to a strong, unique key
# The default key below is only for local development
AI_API_KEY = os.getenv("AI_API_KEY", "painsense_secret_key_2024")

async def get_api_key(header_key: str = Security(api_key_header)):
    if header_key == AI_API_KEY:
        return header_key
    else:
        raise HTTPException(
            status_code=403, detail="Could not validate API Key"
        )

# Enable CORS
# ⚠️ PRODUCTION WARNING: Change allow_origins=["*"] to your specific frontend domain(s)
# Example: allow_origins=["https://your-frontend.com", "https://www.your-frontend.com"]
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
face_mesh = mp.solutions.face_mesh.FaceMesh(
    static_image_mode=True,  # Analyzing single frames/images
    max_num_faces=1,
    refine_landmarks=True,
    min_detection_confidence=0.5
)

# Initialize physiological signal system
PHYSIO_DATA_PATH = os.path.join(current_dir, "physio", "data", "PMHDB", "raw-data")
PHYSIO_MODEL_PATH = os.path.join(os.path.dirname(current_dir), "physio_cnn_gru.pth")

# Check if paths exist
if os.path.exists(PHYSIO_DATA_PATH):
    signal_generator = PhysioSignalGenerator(PHYSIO_DATA_PATH)
    print(f"[INFO] Signal generator initialized with {len(signal_generator.signal_segments)} segments")
else:
    signal_generator = None
    print(f"[WARNING] Physio data path not found: {PHYSIO_DATA_PATH}")

pain_predictor = PhysioPainPredictor(PHYSIO_MODEL_PATH if os.path.exists(PHYSIO_MODEL_PATH) else None)
print(f"[INFO] Pain predictor initialized (model loaded: {pain_predictor.model_loaded})")

# Initialize data logger
data_logger = PainDataLogger(
    data_dir=os.path.join(os.path.dirname(current_dir), "pain_data"),
    db_path=os.path.join(os.path.dirname(current_dir), "pain_database.db")
)
print("[INFO] Data logger initialized")

# Pydantic Models
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

class SignalGenerationRequest(BaseModel):
    pain_level: str = "random"  # "low", "medium", "high", or "random"
    batch_size: int = 1

class PhysioSignalPredictionResponse(BaseModel):
    pain_score: float
    confidence: float
    model_loaded: bool
    signal_metadata: Optional[Dict[str, Any]] = None

# New Models for Patient Monitoring
class PatientMonitoringRequest(BaseModel):
    patient_id: str
    facial_pain_score: Optional[float] = None
    physio_pain_score: Optional[float] = None
    fused_pain_score: Optional[float] = None
    confidence: Optional[float] = None
    face_detected: Optional[bool] = None
    metadata: Optional[Dict[str, Any]] = None

class PatientHistoryRequest(BaseModel):
    patient_id: str
    limit: int = 100
    start_time: Optional[str] = None
    end_time: Optional[str] = None


@app.get("/")
def read_root():
    return {"status": "active", "message": "PainSense AI Backend is running"}

@app.post("/analyze/face")
async def analyze_face(file: UploadFile = File(...), api_key: str = Depends(get_api_key)):
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
async def analyze_fusion(data: FusionInput, api_key: str = Depends(get_api_key)):
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
    physio_artifact: bool = Form(False),
    api_key: str = Depends(get_api_key)
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

@app.post("/physio/generate")
async def generate_physio_signals(request: SignalGenerationRequest, api_key: str = Depends(get_api_key)):
    """
    Generate simulated physiological signals from training data.
    
    This endpoint samples from the PMHDB dataset to generate realistic signal windows.
    """
    try:
        if signal_generator is None:
            raise HTTPException(
                status_code=503, 
                detail="Signal generator not available. Training data not found."
            )
        
        if request.batch_size < 1 or request.batch_size > 10:
            raise HTTPException(
                status_code=400,
                detail="Batch size must be between 1 and 10"
            )
        
        if request.pain_level not in ["low", "medium", "high", "random"]:
            raise HTTPException(
                status_code=400,
                detail="Pain level must be one of: low, medium, high, random"
            )
        
        # Generate signals
        if request.batch_size == 1:
            signal_data = signal_generator.generate_signal(request.pain_level)
            return {
                "signals": signal_data["signals"].tolist(),
                "actual_pain_score": signal_data["pain_score"],
                "metadata": signal_data["metadata"]
            }
        else:
            batch = signal_generator.generate_batch(request.batch_size, request.pain_level)
            return {
                "batch": [
                    {
                        "signals": item["signals"].tolist(),
                        "actual_pain_score": item["pain_score"],
                        "metadata": item["metadata"]
                    }
                    for item in batch
                ]
            }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/physio/predict")
async def predict_from_signals(signals: Dict[str, Any], api_key: str = Depends(get_api_key)):
    """
    Predict pain score from physiological signals.
    
    Expected input format:
    {
        "signals": [[...], [...], ...],  // (1250, 5) array of physiological signals
        "include_stats": false  // Optional: include signal statistics
    }
    """
    try:
        if "signals" not in signals:
            raise HTTPException(
                status_code=400,
                detail="Missing 'signals' field in request body"
            )
        
        # Convert to numpy array
        signal_array = np.array(signals["signals"], dtype=np.float32)
        
        # Validate shape
        if signal_array.shape != (1250, 5):
            raise HTTPException(
                status_code=400,
                detail=f"Invalid signal shape. Expected (1250, 5), got {signal_array.shape}"
            )
        
        # Predict
        include_stats = signals.get("include_stats", False)
        
        if include_stats:
            result = pain_predictor.analyze_signals(signal_array)
        else:
            result = pain_predictor.predict(signal_array)
        
        return result
    
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/physio/simulate")
async def simulate_physio_pain(request: SignalGenerationRequest, api_key: str = Depends(get_api_key)):
    """
    Complete simulation: Generate signals and predict pain score.
    
    This is the main endpoint for the simulation system. It:
    1. Generates realistic physiological signals from training data
    2. Feeds them to the pain prediction model
    3. Returns both the signals and the predicted pain score
    """
    try:
        if signal_generator is None:
            raise HTTPException(
                status_code=503,
                detail="Signal generator not available. Training data not found."
            )
        
        if request.pain_level not in ["low", "medium", "high", "random"]:
            raise HTTPException(
                status_code=400,
                detail="Pain level must be one of: low, medium, high, random"
            )
        
        # Generate signal
        signal_data = signal_generator.generate_signal(request.pain_level)
        
        # Predict pain score
        prediction = pain_predictor.predict(signal_data["signals"])
        
        return {
            "generated_signals": {
                "signals": signal_data["signals"].tolist(),
                "actual_pain_score": signal_data["pain_score"],
                "metadata": signal_data["metadata"]
            },
            "prediction": {
                "predicted_pain_score": prediction["pain_score"],
                "confidence": prediction["confidence"],
                "model_loaded": prediction["model_loaded"]
            },
            "comparison": {
                "actual_vs_predicted_diff": abs(signal_data["pain_score"] - prediction["pain_score"]),
                "pain_level_category": request.pain_level
            }
        }
    
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/physio/stats")
async def get_physio_stats(api_key: str = Depends(get_api_key)):
    """
    Get statistics about the loaded physiological signal dataset.
    """
    try:
        if signal_generator is None:
            raise HTTPException(
                status_code=503,
                detail="Signal generator not available. Training data not found."
            )
        
        stats = signal_generator.get_statistics()
        return stats
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============================================================================
# BACKEND INTEGRATION ENDPOINTS
# For backend team to log and retrieve patient pain scores
# ============================================================================

@app.post("/backend/log-pain-score")
async def log_pain_score(data: PatientMonitoringRequest, api_key: str = Depends(get_api_key)):
    """
    Log a pain score for a patient to both CSV and database.
    
    This endpoint should be called every 5 seconds (or at desired interval)
    with the patient's pain assessment data.
    
    Request body:
    {
        "patient_id": "PATIENT_123",
        "facial_pain_score": 45.2,
        "physio_pain_score": 50.1,
        "fused_pain_score": 47.8,
        "confidence": 0.87,
        "face_detected": true,
        "metadata": {...}
    }
    """
    try:
        pain_data = {
            "facial_pain_score": data.facial_pain_score,
            "physio_pain_score": data.physio_pain_score,
            "fused_pain_score": data.fused_pain_score,
            "confidence": data.confidence,
            "face_detected": data.face_detected,
            "model_loaded": pain_predictor.model_loaded,
            "metadata": data.metadata or {}
        }
        
        success = data_logger.log_pain_score(data.patient_id, pain_data)
        
        return {
            "status": "success",
            "patient_id": data.patient_id,
            "timestamp": datetime.now().isoformat(),
            "csv_path": str(data_logger.get_csv_path(data.patient_id)),
            "logged": success
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/backend/patient-history/{patient_id}")
async def get_patient_history(
    patient_id: str, 
    limit: int = 100,
    api_key: str = Depends(get_api_key)
):
    """
    Get pain score history for a specific patient from database.
    
    Query parameters:
    - limit: Maximum number of records to return (default: 100)
    
    Returns list of pain records ordered by most recent first.
    """
    try:
        history = data_logger.get_patient_history(patient_id, limit=limit)
        
        return {
            "status": "success",
            "patient_id": patient_id,
            "total_records": len(history),
            "history": history
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/backend/latest-score/{patient_id}")
async def get_latest_score(patient_id: str, api_key: str = Depends(get_api_key)):
    """
    Get the most recent pain score for a patient.
    
    This is useful for real-time monitoring displays.
    """
    try:
        latest = data_logger.get_latest_score(patient_id)
        
        if latest is None:
            raise HTTPException(
                status_code=404,
                detail=f"No records found for patient {patient_id}"
            )
        
        return {
            "status": "success",
            "patient_id": patient_id,
            "latest_score": latest
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/backend/export-csv/{patient_id}")
async def export_patient_csv(patient_id: str, api_key: str = Depends(get_api_key)):
    """
    Download patient's pain data as CSV file.
    
    The CSV is automatically generated in real-time as scores are logged.
    This endpoint returns the file for download.
    """
    try:
        csv_path = data_logger.get_csv_path(patient_id)
        
        if not csv_path.exists():
            raise HTTPException(
                status_code=404,
                detail=f"No data file found for patient {patient_id}"
            )
        
        return FileResponse(
            path=str(csv_path),
            media_type='text/csv',
            filename=f"{patient_id}_pain_log.csv"
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/backend/all-patients")
async def get_all_patients(api_key: str = Depends(get_api_key)):
    """
    Get list of all patients in the database.
    
    Returns patient IDs for which pain data has been logged.
    """
    try:
        patients = data_logger.get_all_patients()
        
        return {
            "status": "success",
            "total_patients": len(patients),
            "patients": patients
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/backend/clear-patient/{patient_id}")
async def clear_patient_data(patient_id: str, api_key: str = Depends(get_api_key)):
    """
    Clear all data for a patient (CSV file and database records).
    
    ⚠️ WARNING: This permanently deletes all pain records for the patient!
    """
    try:
        success = data_logger.clear_patient_data(patient_id)
        
        return {
            "status": "success",
            "patient_id": patient_id,
            "cleared": success,
            "message": f"All data for patient {patient_id} has been deleted"
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
