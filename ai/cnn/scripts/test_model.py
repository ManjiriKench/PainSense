import torch
from ai.cnn.models.resnet_pain import ResNetPainModel

model = ResNetPainModel(num_classes=3)

x = torch.randn(4, 3, 224, 224)
y = model(x)

print("Output shape:", y.shape)
print("Output:", y)
