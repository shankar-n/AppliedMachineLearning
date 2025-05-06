import * as ort from "onnxruntime-web";

export async function loadONNXModel() {
  try {
    const session = await ort.InferenceSession.create("resources/model.onnx");
    console.log("✅ ONNX Model Loaded Successfully!");
    return session;
  } catch (error) {
    console.error("❌ Error loading ONNX model:", error);
  }
}

function normalizeTensor(tensor: ort.Tensor): ort.Tensor {
  const mean: number[] = [0.485, 0.456, 0.406];
  const std: number[] = [0.229, 0.224, 0.225];

  const data = tensor.data as Float32Array;
  for (let i = 0; i < data.length; i++) {
    const channel = i % 3; // Get Red, Green, or Blue index
    data[i] = (data[i] / 255 - mean[channel]) / std[channel];
  }

  return tensor;
}

export function preprocessImage(imageData: Float32Array) {
  // Assuming imageData is a Float32Array with shape [3, 224, 224]
  return normalizeTensor(
    new ort.Tensor("float32", imageData, [1, 3, 224, 224])
  );
}

export async function predict(imageData: Float32Array) {
  const session = await loadONNXModel();
  if (!session) return;

  const inputTensor = preprocessImage(imageData);
  const results = await session.run({ input: inputTensor });

  console.log("🔥 Prediction Result:", results.output);
  return results.output;
}
