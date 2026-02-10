import os
import numpy as np
import pandas as pd
from typing import Dict, List, Tuple
import random


class PhysioSignalGenerator:
    """
    Generates realistic physiological signals from PMHDB training data.
    
    This class samples from the actual dataset to generate simulated signals
    that can be fed into the pain prediction model.
    """
    
    def __init__(self, data_dir: str):
        """
        Initialize the signal generator by loading training data.
        
        Parameters
        ----------
        data_dir : str
            Path to the directory containing PMHDB CSV files
        """
        self.data_dir = data_dir
        self.signal_columns = ["Bvp", "Eda_E4", "Tmp", "Hr", "Resp"]
        self.label_column = "COVAS"
        self.sampling_rate = 250  # Hz
        self.window_seconds = 5
        self.window_size = self.window_seconds * self.sampling_rate  # 1250 samples
        
        # Load and cache signal segments from training data
        self.signal_segments = []
        self._load_signal_segments()
        
    def _load_signal_segments(self):
        """
        Load signal segments from all CSV files in the data directory.
        """
        csv_files = [
            os.path.join(self.data_dir, f)
            for f in os.listdir(self.data_dir)
            if f.endswith(".csv")
        ]
        
        print(f"[INFO] Found {len(csv_files)} total files.")
        
        # Optimization: Load only a subset of files to save memory and startup time
        # For demonstration/testing, 3 files provide enough variety (approx 2000-3000 samples)
        # 52 files would take minutes to load; 3 files take <5 seconds.
        MAX_FILES_TO_LOAD = 3
        if len(csv_files) > MAX_FILES_TO_LOAD:
            print(f"[INFO] Optimization enabled: Loading only {MAX_FILES_TO_LOAD} files for demo mode.")
            csv_files = csv_files[:MAX_FILES_TO_LOAD]
            
        print(f"[INFO] Loading signal segments from {len(csv_files)} files...")
        
        for file_path in csv_files:
            try:
                df = pd.read_csv(
                    file_path,
                    sep=";",
                    decimal=",",
                    engine="python",
                    nrows=5000,
                    on_bad_lines="skip"
                )
                
                # Force numeric conversion
                for col in self.signal_columns + [self.label_column]:
                    if col in df.columns:
                        df[col] = pd.to_numeric(df[col], errors="coerce")
                
                # Drop rows with no physio data
                df = df.dropna(subset=self.signal_columns, how="all")
                
                if len(df) < self.window_size:
                    continue
                
                signals = df[self.signal_columns].values.astype(np.float32)
                labels = df[self.label_column].values.astype(np.float32)
                
                # Extract windows
                for start in range(0, len(signals) - self.window_size, self.window_size // 2):
                    end = start + self.window_size
                    
                    window = signals[start:end]
                    window_labels = labels[start:end]
                    
                    # Skip windows with bad data
                    if not np.isfinite(window).all():
                        continue
                    
                    # Require at least 20% valid labels
                    valid_labels = np.isfinite(window_labels)
                    if valid_labels.sum() < 0.2 * len(window_labels):
                        continue
                    
                    # Calculate average pain score for this window
                    avg_pain = np.nanmean(window_labels)
                    avg_pain = np.clip(avg_pain, 0.0, 100.0)
                    
                    # Store the segment with its pain level
                    self.signal_segments.append({
                        "signals": window,
                        "pain_score": avg_pain
                    })
                    
            except Exception as e:
                print(f"[WARNING] Failed to load {file_path}: {e}")
                continue
        
        print(f"[INFO] Loaded {len(self.signal_segments)} signal segments")
        
    def generate_signal(self, target_pain_level: str = "random") -> Dict:
        """
        Generate a physiological signal segment.
        
        Parameters
        ----------
        target_pain_level : str
            One of: "low" (0-30), "medium" (30-60), "high" (60-100), or "random"
        
        Returns
        -------
        dict
            Contains:
            - signals: np.ndarray of shape (1250, 5) - the physiological signals
            - pain_score: float - the actual pain score from the dataset
            - metadata: dict with signal information
        """
        if not self.signal_segments:
            raise ValueError("No signal segments loaded. Check data directory.")
        
        # Filter segments by pain level
        if target_pain_level == "low":
            candidates = [s for s in self.signal_segments if s["pain_score"] < 30]
        elif target_pain_level == "medium":
            candidates = [s for s in self.signal_segments if 30 <= s["pain_score"] < 60]
        elif target_pain_level == "high":
            candidates = [s for s in self.signal_segments if s["pain_score"] >= 60]
        else:  # random
            candidates = self.signal_segments
        
        if not candidates:
            # Fallback to all segments if no candidates match
            candidates = self.signal_segments
        
        # Randomly select a segment
        segment = random.choice(candidates)
        
        # Apply normalization (same as training)
        signals = segment["signals"].copy()
        normalized_signals = self._normalize_signals(signals)
        
        return {
            "signals": normalized_signals,
            "pain_score": segment["pain_score"],
            "metadata": {
                "window_size": self.window_size,
                "sampling_rate": self.sampling_rate,
                "duration_seconds": self.window_seconds,
                "signal_names": self.signal_columns
            }
        }
    
    def _normalize_signals(self, signals: np.ndarray) -> np.ndarray:
        """
        Normalize signals using z-score normalization.
        
        Parameters
        ----------
        signals : np.ndarray
            Raw signals of shape (time_steps, channels)
        
        Returns
        -------
        np.ndarray
            Normalized signals
        """
        normalized = signals.copy()
        
        for i in range(signals.shape[1]):
            col = normalized[:, i]
            valid = np.isfinite(col)
            
            if valid.sum() < 10:
                continue
            
            mean = col[valid].mean()
            std = col[valid].std()
            
            if std < 1e-6:
                std = 1.0
            
            normalized[:, i] = (col - mean) / std
        
        return normalized
    
    def generate_batch(self, batch_size: int = 1, target_pain_level: str = "random") -> List[Dict]:
        """
        Generate a batch of signal segments.
        
        Parameters
        ----------
        batch_size : int
            Number of segments to generate
        target_pain_level : str
            Pain level filter for all segments
        
        Returns
        -------
        list of dict
            List of generated segments
        """
        return [self.generate_signal(target_pain_level) for _ in range(batch_size)]
    
    def get_statistics(self) -> Dict:
        """
        Get statistics about the loaded signal segments.
        
        Returns
        -------
        dict
            Statistics about the loaded data
        """
        if not self.signal_segments:
            return {"error": "No segments loaded"}
        
        pain_scores = [s["pain_score"] for s in self.signal_segments]
        
        return {
            "total_segments": len(self.signal_segments),
            "pain_score_range": {
                "min": float(np.min(pain_scores)),
                "max": float(np.max(pain_scores)),
                "mean": float(np.mean(pain_scores)),
                "std": float(np.std(pain_scores))
            },
            "distribution": {
                "low_pain (0-30)": sum(1 for p in pain_scores if p < 30),
                "medium_pain (30-60)": sum(1 for p in pain_scores if 30 <= p < 60),
                "high_pain (60-100)": sum(1 for p in pain_scores if p >= 60)
            }
        }


if __name__ == "__main__":
    # Test the generator
    data_path = r"D:\python\Painsense\PainSense\ai\physio\data\PMHDB\raw-data"
    
    print("Initializing Signal Generator...")
    generator = PhysioSignalGenerator(data_path)
    
    print("\nGenerator Statistics:")
    stats = generator.get_statistics()
    for key, value in stats.items():
        print(f"  {key}: {value}")
    
    print("\n" + "="*50)
    print("Generating test signals...")
    print("="*50)
    
    for pain_level in ["low", "medium", "high", "random"]:
        print(f"\n{pain_level.upper()} Pain Signal:")
        signal_data = generator.generate_signal(pain_level)
        print(f"  Signal shape: {signal_data['signals'].shape}")
        print(f"  Pain score: {signal_data['pain_score']:.2f}")
        print(f"  Metadata: {signal_data['metadata']}")
