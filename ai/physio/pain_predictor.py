import torch
import numpy as np
from typing import Dict, List
import os
import sys

# Add project root to path for direct execution
current_dir = os.path.dirname(os.path.abspath(__file__))
# If running from ai/physio/pain_predictor.py, root is ../..
project_root = os.path.abspath(os.path.join(current_dir, "../../"))
if project_root not in sys.path:
    sys.path.append(project_root)

# Try import paths
try:
    from ai.physio.models.cnn_gru import CNN_GRU_PainModel
except ImportError:
    try:
        from physio.models.cnn_gru import CNN_GRU_PainModel
    except ImportError:
        # Fallback
        sys.path.append(os.path.join(project_root, "ai"))
        from physio.models.cnn_gru import CNN_GRU_PainModel


class PhysioPainPredictor:
    """
    Predicts pain scores from physiological signals using the trained CNN-GRU model.
    """
    
    def __init__(self, model_path: str = None, device: str = None):
        """
        Initialize the pain predictor.
        
        Parameters
        ----------
        model_path : str, optional
            Path to the trained model weights. If None, creates untrained model.
        device : str, optional
            Device to use ('cuda' or 'cpu'). Auto-detects if None.
        """
        if device is None:
            self.device = "cuda" if torch.cuda.is_available() else "cpu"
        else:
            self.device = device
        
        print(f"[INFO] Using device: {self.device}")
        
        # Initialize model
        self.model = CNN_GRU_PainModel(num_channels=5, gru_hidden_size=64)
        
        # Load weights if provided
        if model_path and os.path.exists(model_path):
            print(f"[INFO] Loading model weights from: {model_path}")
            self.model.load_state_dict(torch.load(model_path, map_location=self.device))
            self.model_loaded = True
        else:
            if model_path:
                print(f"[WARNING] Model path not found: {model_path}")
            print("[INFO] Using untrained model (for demonstration)")
            self.model_loaded = False
        
        self.model.to(self.device)
        self.model.eval()
        
    def predict(self, signals: np.ndarray) -> Dict:
        """
        Predict pain score from physiological signals.
        
        Parameters
        ----------
        signals : np.ndarray
            Signal array of shape (time_steps, channels) or (batch, time_steps, channels)
            e.g., (1250, 5) for a single 5-second window
        
        Returns
        -------
        dict
            Contains:
            - pain_score: float - predicted pain score (0-100)
            - confidence: float - prediction confidence (0-1)
            - model_loaded: bool - whether trained weights were loaded
        """
        # Handle single sample input
        if signals.ndim == 2:
            signals = signals[np.newaxis, ...]  # Add batch dimension
        
        try:
            # Convert to tensor
            x = torch.tensor(signals, dtype=torch.float32).to(self.device)
            
            # Predict
            with torch.no_grad():
                raw_prediction = self.model(x)
            
            # Convert to numpy
            pain_score = raw_prediction.cpu().numpy()[0]
            
            # Clip to valid range (0-100)
            pain_score = np.clip(pain_score, 0.0, 100.0)
            
            # ---------------------------------------------
            # Demo Heuristic / Calibration
            # ---------------------------------------------
            # If the raw prediction is very low but signal shows stress, modest boost.
            # This helps correct the "zeros bias" from training data in a demo.
            
            # Calculate simple stress metric from the signal (e.g. EDA/HR variance)
            # EDA is channel 1, HR is channel 3
            if signals.ndim == 2:
                # signal shape: (Time, Channel)
                eda_std = np.std(signals[:, 1]) 
                hr_std = np.std(signals[:, 3])  
                
                # If VERY high variability in autonomic signals but model predicts low
                # (Tuned thresholds: only boost when there's genuine high stress)
                if (eda_std > 2.0 or hr_std > 2.0) and pain_score < 25:
                    # Apply a moderate "stress factor" boost
                    boost = min((eda_std + hr_std) * 5.0, 40.0)
                    pain_score = max(pain_score, boost) 
            
            # Clip again just in case
            pain_score = np.clip(pain_score, 0.0, 100.0)
            
            # Calculate confidence (simplified - could be more sophisticated)
            # For now, just a function of how extreme the prediction is
            confidence = self._calculate_confidence(pain_score)
            
            return {
                "pain_score": float(pain_score),
                "confidence": float(confidence),
                "model_loaded": self.model_loaded,
                "device": self.device
            }
            
        except Exception as e:
            print(f"[ERROR] Prediction failed: {e}")
            return {
                "pain_score": 0.0,
                "confidence": 0.0,
                "error": str(e),
                "model_loaded": self.model_loaded
            }
    
    def predict_batch(self, signals_batch: List[np.ndarray]) -> List[Dict]:
        """
        Predict pain scores for a batch of signal windows.
        
        Parameters
        ----------
        signals_batch : list of np.ndarray
            List of signal arrays, each of shape (time_steps, channels)
        
        Returns
        -------
        list of dict
            List of prediction results
        """
        results = []
        for signals in signals_batch:
            result = self.predict(signals)
            results.append(result)
        return results
    
    def _calculate_confidence(self, pain_score: float) -> float:
        """
        Calculate prediction confidence based on pain score.
        
        This is a simplified confidence metric. In a production system,
        you might use:
        - Model uncertainty estimation (e.g., Monte Carlo dropout)
        - Ensemble predictions
        - Signal quality metrics
        
        Parameters
        ----------
        pain_score : float
            Predicted pain score
        
        Returns
        -------
        float
            Confidence value between 0 and 1
        """
        if not self.model_loaded:
            # Lower confidence for untrained model
            return 0.3
        
        # For demonstration: Higher confidence for mid-range scores
        # (assuming less certainty at extremes)
        normalized_score = pain_score / 100.0
        distance_from_middle = abs(normalized_score - 0.5)
        confidence = 0.95 - (distance_from_middle * 0.3)
        
        return max(0.5, min(1.0, confidence))
    
    def analyze_signals(self, signals: np.ndarray) -> Dict:
        """
        Full analysis including prediction and signal statistics.
        
        Parameters
        ----------
        signals : np.ndarray
            Signal array of shape (time_steps, channels)
        
        Returns
        -------
        dict
            Comprehensive analysis including prediction and signal stats
        """
        # Get prediction
        prediction = self.predict(signals)
        
        # Calculate signal statistics
        signal_stats = self._compute_signal_stats(signals)
        
        return {
            **prediction,
            "signal_statistics": signal_stats
        }
    
    def _compute_signal_stats(self, signals: np.ndarray) -> Dict:
        """
        Compute statistics for each physiological signal.
        
        Parameters
        ----------
        signals : np.ndarray
            Signal array of shape (time_steps, channels)
        
        Returns
        -------
        dict
            Statistics for each signal channel
        """
        signal_names = ["Bvp", "Eda_E4", "Tmp", "Hr", "Resp"]
        
        if signals.ndim == 3:
            signals = signals[0]  # Take first sample if batch
        
        stats = {}
        for i, name in enumerate(signal_names):
            channel_data = signals[:, i]
            stats[name] = {
                "mean": float(np.mean(channel_data)),
                "std": float(np.std(channel_data)),
                "min": float(np.min(channel_data)),
                "max": float(np.max(channel_data))
            }
        
        return stats


if __name__ == "__main__":
    # Test the predictor
    print("Testing Physiological Pain Predictor...")
    
    # Initialize predictor
    model_path = r"D:\python\Painsense\PainSense\physio_cnn_gru.pth"
    predictor = PhysioPainPredictor(model_path)
    
    # Create dummy signal for testing (1250 time steps, 5 channels)
    dummy_signals = np.random.randn(1250, 5).astype(np.float32)
    
    print("\nTesting single prediction...")
    result = predictor.predict(dummy_signals)
    print(f"Prediction result:")
    for key, value in result.items():
        print(f"  {key}: {value}")
    
    print("\nTesting full analysis...")
    analysis = predictor.analyze_signals(dummy_signals)
    print(f"Analysis result:")
    print(f"  Pain score: {analysis['pain_score']:.2f}")
    print(f"  Confidence: {analysis['confidence']:.2f}")
    print(f"  Signal statistics available: {len(analysis['signal_statistics'])} channels")
