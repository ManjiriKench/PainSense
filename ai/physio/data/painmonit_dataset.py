import os
import pickle
import numpy as np
import pandas as pd
import torch
from torch.utils.data import Dataset

# -----------------------------
# CONFIG
# -----------------------------
PHYSIO_COLUMNS = ["Bvp", "Eda_E4", "Tmp", "Hr", "Resp"]
LABEL_COLUMN = "COVAS"

SAMPLING_RATE = 250
WINDOW_SECONDS = 5
STRIDE_SECONDS = 1

WINDOW_SIZE = WINDOW_SECONDS * SAMPLING_RATE
STRIDE_SIZE = STRIDE_SECONDS * SAMPLING_RATE


class PainMonitDataset(Dataset):
    """
    Robust dataset loader for PainMonit PMED physiological signals.
    Produces (window, label) pairs with NO NaNs.
    """

    def __init__(self, data_dir):
        self.samples = []

        csv_files = [
            os.path.join(data_dir, f)
            for f in os.listdir(data_dir)
            if f.endswith(".csv")
        ]

        # Load all 52 subjects for full training
        # if len(csv_files) > 10:
        #     print(f"[INFO] Limiting training data to 10 subjects for rapid convergence (out of {len(csv_files)})")
        #     csv_files = csv_files[:10]

        print(f"[INFO] Loading all {len(csv_files)} subject files for comprehensive training...")

        for file_path in csv_files:
            try:
                self._process_subject(file_path)
            except Exception as e:
                print(f"[WARNING] Skipping {file_path}: {e}")

        print(f"[INFO] Total windows created: {len(self.samples)}")

    def _process_subject(self, file_path):
        df = pd.read_csv(
            file_path,
            sep=";",
            decimal=",",
            engine="python",
            on_bad_lines="skip"
        )

        # Force numeric conversion
        for col in PHYSIO_COLUMNS + [LABEL_COLUMN]:
            df[col] = pd.to_numeric(df[col], errors="coerce")

        # Drop rows with no physio data
        df = df.dropna(subset=PHYSIO_COLUMNS, how="all")

        signals = df[PHYSIO_COLUMNS].values.astype(np.float32)
        labels = df[LABEL_COLUMN].values.astype(np.float32)

        # -----------------------------
        # Robust normalization
        # -----------------------------
        for i in range(signals.shape[1]):
            col = signals[:, i]
            valid = np.isfinite(col)

            if valid.sum() < 10:
                continue

            mean = col[valid].mean()
            std = col[valid].std()

            if std < 1e-6:
                std = 1.0

            signals[:, i] = (col - mean) / std

        # -----------------------------
        # Sliding windows
        # -----------------------------
        for start in range(0, len(signals) - WINDOW_SIZE, STRIDE_SIZE):
            end = start + WINDOW_SIZE

            window = signals[start:end]
            window_labels = labels[start:end]

            # Skip windows with bad inputs
            if not np.isfinite(window).all():
                continue

            # Require at least 20% valid labels
            valid_labels = np.isfinite(window_labels)
            if valid_labels.sum() < 0.2 * len(window_labels):
                continue

            # -----------------------------
            # Class Balancing (CRITICAL)
            # -----------------------------
            # The dataset has too many "0" or low pain samples.
            # We must aggressively skip them to let the model see high pain.
            
            # Label smoothing / cleaning
            label = np.nanmean(window_labels)
            label = np.clip(label, 0.0, 100.0)
            
            # Undersample Logic:
            # If pain < 10 (Low), keep only 5% of samples
            # If pain >= 10 (Med/High), keep 100% of samples
            if label < 10:
                if np.random.rand() > 0.05:
                    continue

            self.samples.append((window, label))

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        window, label = self.samples[idx]

        window = torch.tensor(window, dtype=torch.float32)
        label = torch.tensor(label, dtype=torch.float32)

        return window, label
