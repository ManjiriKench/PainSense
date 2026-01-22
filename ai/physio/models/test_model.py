import torch
from cnn_gru import CNN_GRU_PainModel

if __name__ == "__main__":
    model = CNN_GRU_PainModel()

    # Fake batch: 4 samples, 5 seconds @ 250 Hz, 5 channels
    x = torch.randn(4, 1250, 5)

    y = model(x)

    print("Output shape:", y.shape)
    print("Output values:", y)
