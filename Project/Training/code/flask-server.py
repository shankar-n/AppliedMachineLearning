import torch
import numpy as np
import matplotlib.pyplot as plt
from transformers import AutoModelForImageClassification, AutoProcessor
from PIL import Image
import io
from io import BytesIO
import base64 
from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
from pytorch_grad_cam import run_dff_on_image, GradCAM
from pytorch_grad_cam.utils.model_targets import ClassifierOutputTarget
from pytorch_grad_cam.utils.image import show_cam_on_image
from torchvision import transforms

""" Model wrapper to return a tensor"""
class HuggingfaceToTensorModelWrapper(torch.nn.Module):
    def __init__(self, model):
        super(HuggingfaceToTensorModelWrapper, self).__init__()
        self.model = model

    def forward(self, x):
        return self.model(x).logits

def reshape_transform_vit_huggingface(x):
    # Remove the CLS token:
    activations = x[:, 1:, :]
    activations = activations.view(activations.shape[0], 14, 14, activations.shape[2])
    # Transpose the features to be in the second coordinate:
    activations = activations.transpose(2, 3).transpose(1, 2)
    return activations

def pil_to_base64(image):
    """Convert a PIL image to Base64 encoding."""
    buffer = BytesIO()
    image.save(buffer, format="PNG")  # Save in PNG format
    return base64.b64encode(buffer.getvalue()).decode("utf-8")

# ✅ Load Model & Processor (Only once during initialization)
model_name = "vit-finetuned-dermnet"
model = AutoModelForImageClassification.from_pretrained(model_name)
model.eval()
processor = AutoProcessor.from_pretrained(model_name)

my_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]), #ImageNet Weights
    transforms.ToPILImage()
])

# target_layer_dff = model.vit.layernorm
target_layer_gradcam = model.vit.encoder.layer[-2].output

target_layers = [target_layer_gradcam]

with open('id2label.pkl', 'rb') as f:
    id2label  = pickle.load(f)

app = Flask(__name__)
CORS(app)

def explain_image(image_bytes):
    """Predicts class & Grad-CAM visualizations."""
    
    # ✅ Load and preprocess image
    org_image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    # image = my_transform(org_image)
    inputs = processor(images=org_image, return_tensors="pt")
    image_tensor = inputs["pixel_values"]

    # ✅ Run Model Inference
    with torch.no_grad():
        output = model(**inputs)
        logits = output.logits
        probabilities = torch.nn.functional.softmax(logits, dim=-1)
        top_probs, top_indices = torch.topk(probabilities, 5)
        top_indices = top_indices.squeeze().tolist()
        top_indices = [int(id2label[str(ind)]) for ind in top_indices]

    targets = [ClassifierOutputTarget(top_indices[0])]

    my_img=np.array(org_image.resize((224,224)))/255

    with GradCAM(model=HuggingfaceToTensorModelWrapper(model), target_layers=target_layers, reshape_transform=reshape_transform_vit_huggingface) as cam:
      grayscale_cam = cam(input_tensor=image_tensor, targets=targets, aug_smooth=True)
      grayscale_cam = grayscale_cam[0, :]
      visualization = show_cam_on_image(my_img, grayscale_cam, use_rgb=True)
      model_outputs = cam.outputs

    xai_output = pil_to_base64(Image.fromarray(visualization))

    
    return {
        "top_labels": top_indices,
        "top_probs": top_probs.squeeze().tolist(),
        "xai_output": xai_output
    }

    
@app.route('/predict', methods=['POST'])
def predict():
    """Flask API endpoint to handle image uploads and return predictions."""
    if 'image' not in request.files:
        return jsonify({"error": "No image provided"}), 400
    
    # ✅ Read Image from Request
    image_file = request.files['image']
    image_bytes = image_file.read()

    # ✅ Run Prediction Function
    result = explain_image(image_bytes)

    return jsonify(result)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000,debug=True)