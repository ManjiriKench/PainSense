# ai/fusion/fusion_engine.py

from datetime import datetime
from typing import Dict, Optional


class LateFusionEngine:
    """
    Clinically grounded late fusion engine for pain estimation.
    Combines facial (PAIC) and physiological pain signals using
    reliability-weighted decision logic.
    """

    # -------------------------
    # Reliability Estimators
    # -------------------------

    def facial_reliability(
        self,
        face_detected: bool,
        active_features: int
    ) -> float:
        """
        Reliability of facial pain signal based on:
        - Face presence
        - Number of active PAIC features
        """
        if not face_detected:
            return 0.0

        # Base trust + feature boost
        reliability = 0.3 + 0.15 * active_features
        return min(1.0, reliability)

    def physio_reliability(
        self,
        signal_quality: float,
        motion_artifact: bool
    ) -> float:
        """
        Reliability of physiological pain signal.
        signal_quality: [0,1]
        motion_artifact: boolean
        """
        reliability = max(0.2, signal_quality)

        if motion_artifact:
            reliability *= 0.5

        return round(reliability, 2)

    # -------------------------
    # Core Fusion Logic
    # -------------------------

    def fuse(
        self,
        facial: Dict,
        physio: Dict
    ) -> Dict:
        """
        Perform late fusion.

        facial:
            {
                "pain": float (0–10),
                "features": dict,
                "face_detected": bool
            }

        physio:
            {
                "pain": float (0–100),
                "signal_quality": float (0–1),
                "motion_artifact": bool
            }
        """

        # ---------- Normalize ----------
        F = facial["pain"]
        P = physio["pain"] / 10.0  # 0–100 → 0–10

        # ---------- Reliability ----------
        active_features = sum(facial["features"].values())

        wF = self.facial_reliability(
            facial["face_detected"],
            active_features
        )

        wP = self.physio_reliability(
            physio["signal_quality"],
            physio["motion_artifact"]
        )

        # ---------- Fusion ----------
        if wF + wP == 0:
            final_pain = None
            confidence = 0.0
        else:
            final_pain = (wF * F + wP * P) / (wF + wP)
            confidence = min(1.0, (wF + wP) / 2.0)

        # ---------- Disagreement ----------
        disagreement = abs(F - P) >= 3.0

        # ---------- Output ----------
        return {
            "timestamp": datetime.utcnow().isoformat(),
            "painLevel": round(final_pain, 2) if final_pain is not None else None,
            "confidence": round(confidence, 2),

            # transparency for frontend / clinicians
            "facialPain": round(F, 2),
            "physioPain": round(P, 2),
            "facialReliability": wF,
            "physioReliability": wP,
            "disagreement": disagreement,

            "explanation": self._explain(wF, wP, disagreement)
        }

    # -------------------------
    # Human-Readable Explanation
    # -------------------------

    def _explain(self, wF, wP, disagreement) -> str:
        if disagreement:
            return (
                "Facial and physiological pain signals disagree. "
                "Manual clinical review recommended."
            )

        if wF > wP:
            return "Pain estimate driven primarily by facial expression analysis."

        if wP > wF:
            return "Pain estimate driven primarily by physiological signals."

        return "Pain estimate derived from balanced multimodal agreement."
