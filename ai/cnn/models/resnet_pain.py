import torch
import torch.nn as nn
from torchvision import models


class ResNetPainModel(nn.Module):
    """
    ResNet18-based CNN for facial pain classification.
    Output: 3 classes (Neutral, Algometer, Laser)
    """

    def __init__(self, num_classes=3):
        super().__init__()

        # Load pretrained ResNet18
        self.backbone = models.resnet18(pretrained=True)

        # Replace final classification layer
        in_features = self.backbone.fc.in_features
        self.backbone.fc = nn.Linear(in_features, num_classes)

    def forward(self, x):
        """
        x: (B, 3, 224, 224)
        """
        return self.backbone(x)
