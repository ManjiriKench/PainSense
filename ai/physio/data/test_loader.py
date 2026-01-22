# test_loader.py
from painmonit_dataset import PainMonitDataset

DATA_PATH = r"D:\python\Painsense\PainSense\ai\physio\data\PMHDB\raw-data"

dataset = PainMonitDataset(DATA_PATH)

x, y = dataset[0]
print("Input shape:", x.shape)   # should be (1250, 5)
print("Label:", y)
