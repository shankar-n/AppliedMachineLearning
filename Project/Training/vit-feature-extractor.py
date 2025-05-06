import torch
from transformers import AutoImageProcessor, AutoModel
from PIL import Image
import numpy as np
import os
from torch.utils.data import DataLoader
from torchvision.datasets import ImageFolder
from torchvision import transforms


device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"Using device: {device}")

# Define the supported transformer models
MODEL_NAMES = {
    "dino_v2": "facebook/dinov2-large",
    "swin": "microsoft/swin-tiny-patch4-window7-224",
    "vit": "google/vit-base-patch16-224"
}

def preprocess_image():
    return transforms.Compose([
        transforms.Resize((224, 224)),  
        transforms.ToTensor(),
    ])

def extract_features(model, images):
    with torch.no_grad():
        outputs = model(images)
    return outputs.last_hidden_state.mean(dim=1)  # Mean pooling for feature representation

def process_image_folder(image_folder_path, model_type="dino_v2", batch_size=16):

    if model_type not in MODEL_NAMES:
        raise ValueError(f"Unsupported model type. Choose from {list(MODEL_NAMES.keys())}")

    # Load model and processor
    model_name = MODEL_NAMES[model_type]
    model = AutoModel.from_pretrained(model_name)
    processor = AutoImageProcessor.from_pretrained(model_name, use_fast=True)

    # Load dataset
    dataset = ImageFolder(root=image_folder_path, transform=preprocess_image())
    dataloader = DataLoader(dataset, batch_size=batch_size, shuffle=False)

    features_list = []
    labels_list = []
    for images, labels in dataloader:
        features = extract_features(model, images)
        features_list.append(features)
        labels_list.append(labels)

    return torch.cat(features_list), torch.cat(labels_list)  # Merge all feature tensors

# Map class names to labels
train_dir = './data/training_data/train'
test_dir = './data/training_data/test'
out_dir = './data/training_data'

for model_name in MODEL_NAMES:
    X_train, y_train = process_image_folder(train_dir, model_type=model_name)
    X_test, y_test= process_image_folder(test_dir, model_type=model_name)
    with open(out_dir + '/' + model_name + '_batch_16_data.pickle', 'wb') as handle:
        pickle.dump(a, handle, protocol=pickle.HIGHEST_PROTOCOL)