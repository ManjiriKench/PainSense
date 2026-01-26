import numpy as np
import time

class PAICFacialEngine:
    def __init__(self):
        self.history = []
        self.window_seconds = 2.0
        self.last_time = time.time()

    # ---------- Geometry Helpers ----------
    def euclidean(self, p1, p2):
        return np.linalg.norm(np.array(p1) - np.array(p2))

    # ---------- PAIC Facial Feature Scores ----------
    # ---------- PAIC Facial Feature Scores ----------
    def eye_tightening(self, landmarks):
        # Eye Aspect Ratio (both eyes)
        # Relaxed threshold to make it easier to trigger
        left = [33, 160, 158, 133, 153, 144]
        right = [362, 385, 387, 263, 373, 380]

        def ear(eye):
            p = np.array([landmarks[i] for i in eye])
            vertical = np.linalg.norm(p[1] - p[5]) + np.linalg.norm(p[2] - p[4])
            horizontal = np.linalg.norm(p[0] - p[3])
            return vertical / (2.0 * horizontal)

        ear_avg = (self.ear_from_indices(landmarks, left) + 
                   self.ear_from_indices(landmarks, right)) / 2.0
        
        # Increased threshold from 0.20 to 0.22 for better sensitivity
        return 1.0 if ear_avg < 0.22 else 0.0

    def ear_from_indices(self, landmarks, indices):
         # Helper to clean up the code
        p = [landmarks[i] for i in indices]
        vertical = self.euclidean(p[1], p[5]) + self.euclidean(p[2], p[4])
        horizontal = self.euclidean(p[0], p[3])
        return vertical / (2.0 * horizontal)

    def mouth_opening(self, landmarks):
        top = landmarks[13]
        bottom = landmarks[14]
        face_height = self.euclidean(landmarks[10], landmarks[152])
        ratio = self.euclidean(top, bottom) / face_height
        # Slight adjustment
        return 1.0 if ratio > 0.035 else 0.0

    def brow_lowering(self, landmarks):
        brow = landmarks[70] # Mid-brow
        eye = landmarks[159] # Mid-eye level
        face_height = self.euclidean(landmarks[10], landmarks[152])
        ratio = self.euclidean(brow, eye) / face_height
        # Increased threshold from 0.020 to 0.025 to make it easier to detect
        return 1.0 if ratio < 0.025 else 0.0

    def nose_wrinkling(self, landmarks):
        # Upper Lip Raiser (AU10)
        # Measure distance between nose tip (1) and upper lip top (13)
        nose_tip = landmarks[1]
        upper_lip = landmarks[13]
        face_height = self.euclidean(landmarks[10], landmarks[152])
        
        ratio = self.euclidean(nose_tip, upper_lip) / face_height
        
        # Threshold: When snarl/wrinkle occurs, this distance decreases significantly
        # Normal is approx 0.04-0.05 depending on face
        return 1.0 if ratio < 0.040 else 0.0

    def grimacing(self, active_count):
        # If 2 or more core features are active, we consider it a grimace
        return 1.0 if active_count >= 2 else 0.0

    # ---------- PAIC Score ----------
    def compute_paic(self, landmarks):
        eye = self.eye_tightening(landmarks)
        mouth = self.mouth_opening(landmarks)
        brow = self.brow_lowering(landmarks)
        nose = self.nose_wrinkling(landmarks)
        
        active_count = eye + mouth + brow + nose
        grimace = self.grimacing(active_count)

        # Revised Scoring Scheme (Max = 12, Normalized to 10)
        # Giving more weight to combinations
        score = 0
        score += 3 if eye else 0
        score += 2 if brow else 0
        score += 2 if mouth else 0
        score += 2 if nose else 0
        score += 3 if grimace else 0
        
        # Features for UI
        features = {
            "eye_tightening": eye,
            "mouth_open": mouth,
            "brow_lower": brow,
            "nose_wrinkle": nose,
            "grimace": grimace
        }

        return score, features

    # ---------- Temporal Smoothing ----------
    def temporal_score(self, score):
        now = time.time()
        self.history.append((now, score))
        # Keep last 1.5 seconds for faster response (was 2.0)
        self.history = [(t, s) for t, s in self.history if now - t <= 1.5]

        if not self.history:
            return 0.0

        avg_score = np.mean([s for _, s in self.history])
        
        # Max raw score is now 12 (3+2+2+2+3)
        # We scale it so 10/10 is achievable even without perfection
        # e.g. Normalized against 10.0
        pain_0_10 = min(10, (avg_score / 10.0) * 10)

        return round(pain_0_10, 2)
