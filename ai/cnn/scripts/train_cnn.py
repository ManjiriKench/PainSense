import torch
import torch.nn as nn
from torch.utils.data import DataLoader, random_split
from tqdm import tqdm

from ai.cnn.data.facial_dataset import FacialPainDataset
from ai.cnn.models.resnet_pain import ResNetPainModel

# -----------------------------
# CONFIG
# -----------------------------
DATA_PATH = r"D:\python\Painsense\PainSense\ai\cnn\data\processed\pain"

BATCH_SIZE = 16
EPOCHS = 5
LEARNING_RATE = 1e-4
VAL_SPLIT = 0.2

DEVICE = "cuda" if torch.cuda.is_available() else "cpu"


# -----------------------------
# TRAIN FUNCTION
# -----------------------------
def train():
    print(f"[INFO] Using device: {DEVICE}")

    # Dataset
    dataset = FacialPainDataset(DATA_PATH)

    # Train / Val split
    val_size = int(len(dataset) * VAL_SPLIT)
    train_size = len(dataset) - val_size

    train_dataset, val_dataset = random_split(
        dataset, [train_size, val_size]
    )

    train_loader = DataLoader(
        train_dataset,
        batch_size=BATCH_SIZE,
        shuffle=True,
        num_workers=0
    )

    val_loader = DataLoader(
        val_dataset,
        batch_size=BATCH_SIZE,
        shuffle=False,
        num_workers=0
    )

    # Model
    model = ResNetPainModel(num_classes=3).to(DEVICE)

    # Loss & Optimizer
    criterion = nn.CrossEntropyLoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=LEARNING_RATE)

    # -----------------------------
    # TRAINING LOOP
    # -----------------------------
    for epoch in range(EPOCHS):
        model.train()
        train_loss = 0.0
        correct = 0
        total = 0

        progress_bar = tqdm(train_loader, desc=f"Epoch {epoch+1}/{EPOCHS}")

        for images, labels in progress_bar:
            images = images.to(DEVICE)
            labels = labels.to(DEVICE)

            optimizer.zero_grad()

            outputs = model(images)
            loss = criterion(outputs, labels)

            loss.backward()
            optimizer.step()

            train_loss += loss.item()

            _, preds = torch.max(outputs, 1)
            correct += (preds == labels).sum().item()
            total += labels.size(0)

            progress_bar.set_postfix(loss=loss.item())

        train_acc = 100 * correct / total
        avg_loss = train_loss / len(train_loader)

        print(f"[Epoch {epoch+1}] Train Loss: {avg_loss:.4f} | Train Acc: {train_acc:.2f}%")

        # -----------------------------
        # VALIDATION
        # -----------------------------
        model.eval()
        val_correct = 0
        val_total = 0

        with torch.no_grad():
            for images, labels in val_loader:
                images = images.to(DEVICE)
                labels = labels.to(DEVICE)

                outputs = model(images)
                _, preds = torch.max(outputs, 1)

                val_correct += (preds == labels).sum().item()
                val_total += labels.size(0)

        val_acc = 100 * val_correct / val_total
        print(f"[Epoch {epoch+1}] Validation Acc: {val_acc:.2f}%\n")

    # Save model
    torch.save(model.state_dict(), "cnn_facial_pain.pth")
    print("[INFO] CNN model saved as cnn_facial_pain.pth")


if __name__ == "__main__":
    train()
