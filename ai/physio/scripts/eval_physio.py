import torch
import numpy as np
from torch.utils.data import DataLoader

from ai.physio.data.painmonit_dataset import PainMonitDataset
from ai.physio.models.cnn_gru import CNN_GRU_PainModel

DATA_PATH = r"D:\python\Painsense\PainSense\ai\physio\data\PMHDB\raw-data"
MODEL_PATH = "physio_cnn_gru.pth"
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

def evaluate():
    dataset = PainMonitDataset(DATA_PATH)
    loader = DataLoader(dataset, batch_size=16, shuffle=False)

    model = CNN_GRU_PainModel().to(DEVICE)
    model.load_state_dict(torch.load(MODEL_PATH, map_location=DEVICE))
    model.eval()

    preds = []
    gts = []

    with torch.no_grad():
        for x, y in loader:
            x = x.to(DEVICE)
            y = y.to(DEVICE)

            p = model(x)

            preds.append(p.cpu().numpy())
            gts.append(y.cpu().numpy())

    preds = np.concatenate(preds)
    gts = np.concatenate(gts)

    mae = np.mean(np.abs(preds - gts))
    rmse = np.sqrt(np.mean((preds - gts) ** 2))

    acc_10 = np.mean(np.abs(preds - gts) <= 10) * 100
    acc_15 = np.mean(np.abs(preds - gts) <= 15) * 100
    acc_20 = np.mean(np.abs(preds - gts) <= 20) * 100

    print(f"MAE  : {mae:.2f}")
    print(f"RMSE : {rmse:.2f}")
    print(f"±10 accuracy: {acc_10:.1f}%")
    print(f"±15 accuracy: {acc_15:.1f}%")
    print(f"±20 accuracy: {acc_20:.1f}%")

if __name__ == "__main__":
    evaluate()
