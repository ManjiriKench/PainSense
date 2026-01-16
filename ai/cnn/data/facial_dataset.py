import os
from PIL import Image
import torch
from torch.utils.data import Dataset
from torchvision import transforms

IMAGE_SIZE = 224


class FacialPainDataset(Dataset):
    """
    CNN dataset for facial pain recognition.
    Pain label is inferred from filename.
    """

    def __init__(self, data_root, transform=None):
        """
        Expected structure:

        ai/cnn/data/processed/pain/
            ├── S001/
            │   ├── AlgometerPain_*.jpg
            │   ├── LaserPain_*.jpg
            │   └── Neutral_*.jpg
            ├── S002/
            └── ...
        """
        self.samples = []
        self.transform = transform if transform else self.default_transforms()

        subjects = sorted(os.listdir(data_root))
        print("[DEBUG] Subjects found:", subjects[:5])

        for subject in subjects:
            subject_path = os.path.join(data_root, subject)
            if not os.path.isdir(subject_path):
                continue

            for img_name in os.listdir(subject_path):
                if not img_name.lower().endswith((".jpg", ".png")):
                    continue

                img_path = os.path.join(subject_path, img_name)
                label = self._label_from_filename(img_name)

                if label is None:
                    continue

                self.samples.append((img_path, label))

        print(f"[INFO] Total facial images: {len(self.samples)}")

    def _label_from_filename(self, filename):
        name = filename.lower()

        if "neutral" in name:
            return 0
        elif "algometer" in name:
            return 1
        elif "laser" in name:
            return 2
        else:
            return None  # skip posed or unknown

    def default_transforms(self):
        return transforms.Compose([
            transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),
            transforms.ToTensor(),
            transforms.Normalize(
                mean=[0.485, 0.456, 0.406],
                std=[0.229, 0.224, 0.225]
            )
        ])

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        img_path, label = self.samples[idx]

        image = Image.open(img_path).convert("RGB")
        image = self.transform(image)

        label = torch.tensor(label, dtype=torch.long)

        return image, label
