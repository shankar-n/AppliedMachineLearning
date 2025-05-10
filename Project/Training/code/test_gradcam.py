from torchvision import transforms
from torch.nn.functional import softmax
import numpy as np
from PIL import Image
from transformers import AutoModelForImageClassification, AutoProcessor
from pytorch_grad_cam import run_dff_on_image, GradCAM
from pytorch_grad_cam.utils.model_targets import ClassifierOutputTarget
from pytorch_grad_cam.utils.image import show_cam_on_image
import torch

""" Model wrapper to return a tensor"""
class HuggingfaceToTensorModelWrapper(torch.nn.Module):
    def __init__(self, model):
        super(HuggingfaceToTensorModelWrapper, self).__init__()
        self.model = model

    def forward(self, x):
        return self.model(x).logits

# Define transformation
my_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]) #ImageNet Weights
])

rgb_img = Image.open('./sample_image.jpg').convert("RGB")
# inputs = my_transform(img)
img = my_transform(rgb_img).unsqueeze(0)


model_name = "vit-finetuned-dermnet"
model = AutoModelForImageClassification.from_pretrained(model_name)
model.eval()
processor = AutoProcessor.from_pretrained(model_name)


def category_name_to_index(model, category_name):
    name_to_index = dict((v, k) for k, v in model.config.id2label.items())
    return name_to_index[category_name]

def reshape_transform_vit_huggingface(x):
    # Remove the CLS token:
    activations = x[:, 1:, :]
    activations = activations.view(activations.shape[0], 14, 14, activations.shape[2])
    # Transpose the features to be in the second coordinate:
    activations = activations.transpose(2, 3).transpose(1, 2)
    return activations

target_layer_dff = model.vit.layernorm
target_layer_gradcam = model.vit.encoder.layer[-2].output


# We have to specify the target we want to generate the CAM for.
targets = [ClassifierOutputTarget(category_name_to_index(model, '1')),]

new_img = Image.fromarray(run_dff_on_image(model=model,
                          target_layer=target_layer_dff,
                          classifier=model.classifier,
                          img_pil=rgb_img,
                          img_tensor=img,
                          reshape_transform=reshape_transform_vit_huggingface,
                          n_components=4,
                          top_k=2))

# input_tensor = processor(images=img, return_tensors="pt")

# Construct the CAM object once, and then re-use it on many images.
# with GradCAM(model=HuggingfaceToTensorModelWrapper(model), target_layers=[target_layer_gradcam],  reshape_transform=reshape_transform_vit_huggingface) as cam:
#   # You can also pass aug_smooth=True and eigen_smooth=True, to apply smoothing.
#   grayscale_cam = cam(input_tensor=img, targets=targets)
#   # In this example grayscale_cam has only one image in the batch:
#   grayscale_cam = grayscale_cam[0, :]
#   visualization = show_cam_on_image(img, grayscale_cam, use_rgb=True)
#   # You can also get the model outputs without having to redo inference
#   model_outputs = cam.outputs