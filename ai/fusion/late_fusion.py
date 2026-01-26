class LateFusion:
    """
    Simple Late Fusion engine with fixed weights for Face and Physio signals.
    """
    def __init__(self, face_weight=0.4, physio_weight=0.6):
        self.face_weight = face_weight
        self.physio_weight = physio_weight
        
    def fuse(self, face_score: float, physio_score: float) -> tuple[float, float]:
        """
        Fuses facial score (0-10) and physio score (0-100).
        Returns (final_score, normalized_physio_score).
        """
        # Normalize physio 0-100 -> 0-10
        # If physio is already normalized, adjust this logic.
        # Assuming input physio is 0-100 based on simulation.
        physio_normalized = physio_score / 10.0
        
        # Weighted Average
        final_score = (face_score * self.face_weight) + (physio_normalized * self.physio_weight)
        
        return final_score, physio_normalized
