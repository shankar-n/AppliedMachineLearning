import * as ort from "onnxruntime-web";
import { fileToONNXTensor } from "./imageService";

export async function loadONNXModel() {
  try {
    const session = await ort.InferenceSession.create("assets/model.onnx");
    console.log("✅ ONNX Model Loaded Successfully!");
    return session;
  } catch (error) {
    console.error("❌ Error loading ONNX model:", error);
  }
}

export function softmax(logits: Float32Array): Float32Array {
  // ✅ Compute Softmax for an array of logits
  const maxLogit = Math.max(...logits); // Prevent overflow
  const exps = logits.map((x) => Math.exp(x - maxLogit));
  const sumExps = exps.reduce((sum, x) => sum + x, 0);
  return exps.map((x) => x / sumExps);
}

interface PredictionResult {
  value: number;
  index: number;
}

interface TopPredictions {
  top_labels: number[];
  top_probs: number[];
}

export function getTop5Predictions(results: Float32Array): TopPredictions {
  const probs = softmax(results);

  const sortedIndices: PredictionResult[] = Array.from(probs)
    .map((value: number, index: number): PredictionResult => ({ value, index }))
    .sort((a: PredictionResult, b: PredictionResult) => b.value - a.value) // Sort descending
    .slice(0, 5); // Take top 5

  return {
    top_labels: sortedIndices.map((item: PredictionResult) => item.index),
    top_probs: sortedIndices.map((item: PredictionResult) => item.value),
  };
}

export async function runOnnxInference(file: File) {
  const session = await loadONNXModel();
  if (session) {
    const inputTensor = await fileToONNXTensor(file);

    // console.log("Input Tensor:", inputTensor);

    const results = await session.run({ input: inputTensor });
    const topPredictions = getTop5Predictions(
      results.output.data as Float32Array
    );
    // console.log("🔥 Prediction Result:", topPredictions);

    return topPredictions;
  }
}
