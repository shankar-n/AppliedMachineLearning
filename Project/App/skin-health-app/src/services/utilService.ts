import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";

export const getClassMap = async () => {
  return await fetch("/assets/class_mapping.json")
    .then((response) => response.json())
    .catch((error) => console.error("Error fetching data:", error));
};

export const getDiagnosisHistory = async () => {
  try {
    const response = await Filesystem.readFile({
      path: "diagnosis_history.json",
      directory: Directory.Data,
      encoding: Encoding.UTF8,
    });

    const pastScans = JSON.parse(response.data) || [];
    return pastScans;
  } catch (error) {
    console.error("Error loading scan history:", error);
  }
};

// Function to save prediction
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const savePrediction = async (prediction: any) => {
  const fileName = "diagnosis_history.json";

  try {
    // Check if file exists
    const fileExists = await Filesystem.readFile({
      path: fileName,
      directory: Directory.Data,
      encoding: Encoding.UTF8,
    })
      .then(() => true)
      .catch(() => false);

    let predictions = [];

    if (fileExists) {
      // Read existing predictions
      const response = await Filesystem.readFile({
        path: fileName,
        directory: Directory.Data,
        encoding: Encoding.UTF8,
      });

      predictions = JSON.parse(response.data);
    }

    // Append new prediction
    predictions.push({
      timestamp: new Date().toISOString(),
      prediction,
    });

    // Write updated JSON back to file
    await Filesystem.writeFile({
      path: fileName,
      data: JSON.stringify(predictions, null, 2),
      directory: Directory.Data,
      encoding: Encoding.UTF8,
    });

    console.log("Prediction saved successfully!");
  } catch (error) {
    console.error("Error saving prediction:", error);
  }
};
