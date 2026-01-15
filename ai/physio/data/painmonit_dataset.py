import os
import numpy as np
import pandas as pd
import torch
from torch.utils.data import Dataset

# -----------------------------
# CONFIG (LOCKED DECISIONS)
# -----------------------------
PHYSIO_COLUMNS = ["Bvp", "Eda_E4", "Tmp", "Hr", "Resp"]
LABEL_COLUMN = "COVAS"

SAMPLING_RATE = 250        # Hz (inferred)
WINDOW_SECONDS = 5         # seconds
STRIDE_SECONDS = 1         # seconds

WINDOW_SIZE = WINDOW_SECONDS * SAMPLING_RATE   # 1250
STRIDE_SIZE = STRIDE_SECONDS * SAMPLING_RATE   # 250


class PainMonitDataset(Dataset):
    """
    Dataset for PainMonit PMED physiological signals.
    Produces (window, label) pairs for CNN + GRU.
    """

    def __init__(self, data_dir):
        self.samples = []

        csv_files = [
            os.path.join(data_dir, f)
            for f in os.listdir(data_dir)
            if f.endswith(".csv")
        ]

        for file_path in csv_files:
            self._process_subject(file_path)

        print(f"[INFO] Total windows created: {len(self.samples)}")

    def _process_subject(self, file_path):
        df = pd.read_csv(file_path, sep=";", decimal=",")

        # Select signals and label
        signals = df[PHYSIO_COLUMNS].values.astype(np.float32)
        labels = df[LABEL_COLUMN].values.astype(np.float32)

        # Per-subject normalization (Z-score)
        mean = signals.mean(axis=0)
        std = signals.std(axis=0) + 1e-8
        signals = (signals - mean) / std

        # Sliding window
        for start in range(0, len(signals) - WINDOW_SIZE, STRIDE_SIZE):
            end = start + WINDOW_SIZE

            window = signals[start:end]
            label = labels[start:end].mean()  # average pain in window

            self.samples.append((window, label))

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        window, label = self.samples[idx]

        window = torch.tensor(window)          # (T, C)
        label = torch.tensor(label)

        return window, label
