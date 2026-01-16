from ai.cnn.data.facial_dataset import FacialPainDataset

DATA_PATH = r"D:\python\Painsense\PainSense\ai\cnn\data\processed\pain"

dataset = FacialPainDataset(DATA_PATH)

img, label = dataset[0]
print("Image shape:", img.shape)
print("Label:", label)
