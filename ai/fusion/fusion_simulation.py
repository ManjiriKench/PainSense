import cv2
import sys
import os
import time

# Add the parent directory to sys.path to allow imports from 'ai' package
# Assuming path: .../PainSense/ai/fusion/this_script.py
current_dir = os.path.dirname(os.path.abspath(__file__)) # .../ai/fusion
parent_dir = os.path.dirname(current_dir) # .../ai
grandparent_dir = os.path.dirname(parent_dir) # .../PainSense

# Add potential roots to path to ensure imports work
sys.path.append(grandparent_dir)
sys.path.append(parent_dir)
sys.path.append(current_dir) # To import late_fusion from same dir if needed

from mediapipe.python.solutions.face_mesh import FaceMesh

# Import PAIC Engine
try:
    from ai.facial.engines.paic_engine import PAICFacialEngine
except ImportError:
    try:
        from facial.engines.paic_engine import PAICFacialEngine
    except ImportError:
        print("Error: Could not import PAICFacialEngine.")
        sys.exit(1)

# Import Late Fusion
try:
    from ai.fusion.late_fusion import LateFusion
except ImportError:
    try:
        from late_fusion import LateFusion
    except ImportError:
        print("Error: Could not import LateFusion.")
        sys.exit(1)

def main():
    # Initialize Engines
    paic = PAICFacialEngine()
    fusion = LateFusion(face_weight=0.4, physio_weight=0.6)
    
    face_mesh = FaceMesh(
        static_image_mode=False,
        max_num_faces=1,
        refine_landmarks=True,
        min_detection_confidence=0.7,
        min_tracking_confidence=0.7
    )

    cap = cv2.VideoCapture(0)
    
    # Physio Simulation State
    physio_score = 0.0
    decay_rate = 1.0     # Decrease per frame when not pressed
    increase_rate = 2.0  # Increase per frame when pressed
    
    print("Starting Fusion Simulation...")
    print("Press 'Up Arrow' (or 'W') to increase Physiological Signal.")
    print("Press 'ESC' to exit.")

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        result = face_mesh.process(rgb)

        # -----------------------------
        # 1. Facial Analysis
        # -----------------------------
        facial_pain_score = 0.0
        
        if result.multi_face_landmarks:
            for face in result.multi_face_landmarks:
                h, w, _ = frame.shape
                landmarks = [(int(p.x * w), int(p.y * h)) for p in face.landmark]

                raw_score, features = paic.compute_paic(landmarks)
                facial_pain_score = paic.temporal_score(raw_score)

        # -----------------------------
        # 2. Physiological Simulation (Keyboard)
        # -----------------------------
        key = cv2.waitKey(1)
        
        is_up_pressed = False
        # Windows Arrow Key Codes & WASD
        if key in [2490368, 2555904, 65362, 82, 38, 119, 87]:
            is_up_pressed = True
            
        if is_up_pressed:
            physio_score += increase_rate
        else:
            physio_score -= decay_rate
        
        physio_score = max(0.0, min(100.0, physio_score))

        # -----------------------------
        # 3. Fusion
        # -----------------------------
        final_score, physio_norm = fusion.fuse(facial_pain_score, physio_score)

        # -----------------------------
        # 4. Visualization
        # -----------------------------
        
        # Draw Dashboard Background
        cv2.rectangle(frame, (0, 0), (450, 180), (0, 0, 0), -1) 
        
        # Titles
        cv2.putText(frame, "MULTIMODAL PAIN DETECTION", (20, 25), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 1)
        
        # Facial
        cv2.putText(frame, f"Face (Weight 0.4): {facial_pain_score:.1f}/10", (20, 55), 
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 255), 1)
        # Bar for Face
        cv2.rectangle(frame, (250, 45), (250 + int(facial_pain_score * 15), 55), (0, 255, 255), -1)

        # Physio
        cv2.putText(frame, f"Physio (Weight 0.6): {physio_norm:.1f}/10", (20, 85), 
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 0, 255), 1)
        # Bar for Physio
        cv2.rectangle(frame, (250, 75), (250 + int(physio_norm * 15), 85), (255, 0, 255), -1)
        if is_up_pressed:
             cv2.circle(frame, (420, 80), 5, (255, 0, 255), -1)

        # Fused Result
        # Color scale from Green to Red based on pain
        f_color = (0, 255 - int(final_score * 25.5), int(final_score * 25.5))
        
        cv2.putText(frame, "---------------------------------", (20, 105), cv2.FONT_HERSHEY_SIMPLEX, 0.3, (100, 100, 100), 1)
        
        cv2.putText(frame, f"FUSED SCORE: {final_score:.1f}", (20, 135), 
                    cv2.FONT_HERSHEY_SIMPLEX, 1.0, f_color, 3)
        
        # Status Text
        status = "NO PAIN"
        if final_score > 7: status = "SEVERE PAIN"
        elif final_score > 3: status = "MILD PAIN"
        
        cv2.putText(frame, status, (20, 165), cv2.FONT_HERSHEY_SIMPLEX, 0.7, f_color, 2)

        cv2.imshow("PainSense Fusion Demo", frame)
        
        if key & 0xFF == 27: # ESC
            break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()
