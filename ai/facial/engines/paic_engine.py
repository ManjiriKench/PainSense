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
    def eye_tightening(self, landmarks):
        # Eye Aspect Ratio (both eyes)
        left = [33, 160, 158, 133, 153, 144]
        right = [362, 385, 387, 263, 373, 380]

        def ear(eye):
            vertical = self.euclidean(landmarks[eye[1]], landmarks[eye[5]]) + \
                       self.euclidean(landmarks[eye[2]], landmarks[eye[4]])
            horizontal = self.euclidean(landmarks[eye[0]], landmarks[eye[3]])
            return vertical / (2.0 * horizontal)

        ear_avg = (ear(left) + ear(right)) / 2.0
        return 1.0 if ear_avg < 0.20 else 0.0  # PAIC: eyes squeezed

    def mouth_opening(self, landmarks):
        top = landmarks[13]
        bottom = landmarks[14]
        face_height = self.euclidean(landmarks[10], landmarks[152])
        ratio = self.euclidean(top, bottom) / face_height
        return 1.0 if ratio > 0.035 else 0.0

    def brow_lowering(self, landmarks):
        brow = landmarks[70]
        eye = landmarks[159]
        face_height = self.euclidean(landmarks[10], landmarks[152])
        ratio = self.euclidean(brow, eye) / face_height
        return 1.0 if ratio < 0.020 else 0.0

    def grimacing(self, eye, mouth, brow):
        return 1.0 if (eye + mouth + brow) >= 2 else 0.0

    # ---------- PAIC Score ----------
    def compute_paic(self, landmarks):
        eye = self.eye_tightening(landmarks)
        mouth = self.mouth_opening(landmarks)
        brow = self.brow_lowering(landmarks)
        grimace = self.grimacing(eye, mouth, brow)

        score = 0
        score += 3 if eye else 0
        score += 2 if brow else 0
        score += 1 if mouth else 0
        score += 2 if grimace else 0

        return score, {
            "eye_tightening": eye,
            "mouth_open": mouth,
            "brow_lower": brow,
            "grimace": grimace
        }

    # ---------- Temporal Smoothing ----------
    def temporal_score(self, score):
        now = time.time()
        self.history.append((now, score))
        self.history = [(t, s) for t, s in self.history if now - t <= self.window_seconds]

        avg_score = np.mean([s for _, s in self.history])
        pain_0_10 = min(10, (avg_score / 8.0) * 10)

        return round(pain_0_10, 2)
