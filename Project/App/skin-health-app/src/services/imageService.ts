import * as tf from "@tensorflow/tfjs";
import * as ort from "onnxruntime-web";

export const fileToONNXTensor = async (file: File): Promise<ort.Tensor> => {
  const img = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = 224;
  canvas.height = 224;

  if (ctx) {
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, 0, 0, 224, 224);
  } else {
    throw new Error("Failed to get 2D context from canvas.");
  }

  // ✅ Convert canvas image to TensorFlow.js tensor
  let tfTensor = tf.browser
    .fromPixels(canvas)
    .toFloat()
    .div(255.0) // Normalize to [0,1]
    .expandDims(0); // Add batch dimension

  // ✅ Apply ImageNet normalization (Subtract mean, divide by std)
  const mean = tf.tensor([0.485, 0.456, 0.406]);
  const std = tf.tensor([0.229, 0.224, 0.225]);
  tfTensor = tf.sub(tfTensor, mean).div(std); // Normalize using ImageNet

  // ✅ Convert HWC → CHW format
  tfTensor = tf.transpose(tfTensor, [0, 3, 1, 2]); // `[1, 224, 224, 3] → [1, 3, 224, 224]`

  // ✅ Convert TF.js tensor to a flat Float32Array for ONNX Runtime
  const floatArray = tfTensor.dataSync(); // Extract raw values

  return new ort.Tensor("float32", floatArray, [1, 3, 224, 224]);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const base64ToImage = (base64String: string, callback: any) => {
  // Convert Base64 string to binary data
  const byteCharacters = atob(base64String); // Decode Base64
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);

  // Create Blob object from binary data (Assume PNG format)
  const blob = new Blob([byteArray], { type: "image/png" });

  // Generate Object URL for usage in <img> tag
  const imageUrl = URL.createObjectURL(blob);

  callback(imageUrl);
};
