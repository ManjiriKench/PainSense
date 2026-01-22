import torch
import torch.nn as nn
from torch.utils.data import DataLoader
from tqdm import tqdm

from ai.physio.data.painmonit_dataset import PainMonitDataset
from ai.physio.models.cnn_gru import CNN_GRU_PainModel

# -----------------------------
# CONFIG
# -----------------------------
DATA_PATH = r"D:\python\Painsense\PainSense\ai\physio\data\PMHDB\raw-data"

BATCH_SIZE = 8
EPOCHS = 5
LEARNING_RATE = 1e-3

DEVICE = "cuda" if torch.cuda.is_available() else "cpu"


def train():
    print(f"[INFO] Using device: {DEVICE}")

    dataset = PainMonitDataset(DATA_PATH)
    loader = DataLoader(
        dataset,
        batch_size=BATCH_SIZE,
        shuffle=True,
        num_workers=0
    )

    model = CNN_GRU_PainModel().to(DEVICE)
    criterion = nn.MSELoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=LEARNING_RATE)

    for epoch in range(EPOCHS):
        model.train()
        epoch_loss = 0.0

        progress_bar = tqdm(loader, desc=f"Epoch {epoch+1}/{EPOCHS}")

        for x, y in progress_bar:
            x = x.to(DEVICE)
            y = y.to(DEVICE)

            # 🔒 Absolute safety checks
            if not torch.isfinite(x).all():
                continue
            if not torch.isfinite(y).all():
                continue

            preds = model(x)

            if not torch.isfinite(preds).all():
                continue

            loss = criterion(preds, y)

            if not torch.isfinite(loss):
                continue

            optimizer.zero_grad()
            loss.backward()
            torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
            optimizer.step()

            epoch_loss += loss.item()
            progress_bar.set_postfix(loss=loss.item())

        avg_loss = epoch_loss / max(len(loader), 1)
        print(f"[Epoch {epoch+1}] Avg Loss: {avg_loss:.4f}")

    torch.save(model.state_dict(), "physio_cnn_gru.pth")
    print("[INFO] Model saved as physio_cnn_gru.pth")


if __name__ == "__main__":
    train()
