AI/ML models and logic will be implemented here.

## How to Run the AI Backend API

This folder contains a FastAPI application that wraps the facial and fusion engines.

### 1. Install Dependencies
Navigate to this folder or the root and run:
```bash
pip install -r ai/requirements.txt
```

### 2. Run the Server
From the project root:
```bash
python ai/main.py
```
Or using uvicorn from the `ai` directory:
```bash
cd ai
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
The API will be available at `http://localhost:8000`.
Documentation is available at `http://localhost:8000/docs`.

### 3. API Endpoints

- **POST /analyze/face**: Upload an image file to get facial pain analysis.
- **POST /analyze/full**: Upload an image + physiological data (form fields) to get a fused pain score.
  - Fields: `file` (image), `physio_pain` (float), `physio_quality` (float), `physio_artifact` (bool).

## System Architecture & How It Works

The AI system is composed of three main modular components designed to mimic clinical multimodal pain assessment.

### 1. Facial Expression Analysis (PAIC Engine)
**File:** `facial/engines/paic_engine.py`

This engine implements a rule-based analysis of the **Pain Assessment in Impairment of Cognition (PAIC)** scale. It uses **MediaPipe Face Mesh** to extract 468 facial landmarks and computes geometric ratios to detect specific Action Units (AUs) associated with pain:

- **Eye Tightening (Orbicularis Oculi)**: Measures the "squinting" ratio of the eyes.
- **Brow Lowering (Corrugator)**: Measures the distance between eyebrows and eyes.
- **Mouth Opening**: Detects vertical extension of the mouth.
- **Nose Wrinkling (Levator)**: Measures the scrunching of the nose/upper lip area.

**Scoring:**
- It detects these features and assigns a raw score (0-12).
- The score is normalized to a 0-10 scale.
- A **Temporal Smoothing** buffer (1.5s window) is applied to prevent jitter and ensure sustained expressions are prioritized over fleeting noise.

### 2. Sensor Fusion Engine (Late Fusion)
**File:** `fusion/fusion_engine.py`

The fusion engine combines the visual (Facial) and vital (Physiological) signals using a **Reliability-Weighted Late Fusion** approach. Unlike simple averaging, this system dynamically adjusts trust in each modality.

**Logic:**
1.  **Normalization**: Inputs are standardized to a common 0-10 scale.
2.  **Reliability Estimation**:
    - *Facial Reliability (wF)*: Reduced if no face is detected or few features are active (base trust 0.3 + boost).
    - *Physio Reliability (wP)*: Reduced if signal quality is low or motion artifacts are present.
3.  **Weighted Fusion**:
    The final score is a weighted average based on the calculated reliability of each source.
4.  **Conflict Detection**: If the two scores differ by >3.0 points, the system flags a "Disagreement" and outputs an explanation suggesting manual review.

### 3. API Wrapper (FastAPI)
**File:** `main.py`

This layer provides the interface for external applications (like the Frontend).
- It accepts raw images (webcam frames) and numerical physiological data.
- It orchestrates the flow: Image -> MediaPipe -> PAIC Engine -> Fusion Engine <- Physio Data.
- It returns a comprehensive JSON object containing the final score, component scores, reliability metrics, and explainability text.

