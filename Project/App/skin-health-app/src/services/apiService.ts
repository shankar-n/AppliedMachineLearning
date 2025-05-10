import { Capacitor } from "@capacitor/core";

export async function fetchApiDiagnosis(
  selectedImage: File
): Promise<{ top_labels: number[]; top_probs: number[]; xai_output: string }> {
  const formData = new FormData();
  formData.append("image", selectedImage);

  const api_url =
    Capacitor.getPlatform() === "android"
      ? "http://10.0.2.2:5000/predict"
      : "http://127.0.0.1:5000/predict"; // Use this for Android emulator

  const response = await fetch(api_url, {
    method: "POST",
    body: formData,
    referrerPolicy: "unsafe-url",
  });

  const data = await response.json();
  console.log("API Response:", data); // Log the API response for debugging
  return data;
}
