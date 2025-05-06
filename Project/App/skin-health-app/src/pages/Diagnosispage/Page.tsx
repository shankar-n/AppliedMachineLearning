import React, { useRef, useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonImg,
  IonLabel,
  IonList,
  IonItem,
  IonButtons,
  IonMenuButton,
} from "@ionic/react";

import { predict } from "../../services/onnxService";

const AiDiagnosis: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState("cnn");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imgArray, setimgArray] = useState<Float32Array>();
  const [diagnosisResult, setDiagnosisResult] = useState<string | null>(null);

  // Ref for auto-scroll functionality
  const resultRef = useRef<HTMLDivElement>(null);

  async function fileToFloat32Array(file: File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        if (event.target) {
          img.src = event.target.result as string;
        }

        img.onload = () => {
          // Create a canvas element
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          // Resize to match model input size
          canvas.width = 224;
          canvas.height = 224;
          if (ctx) {
            ctx.drawImage(img, 0, 0, 224, 224);
            // Get pixel data
            const imageData = ctx.getImageData(0, 0, 224, 224).data; // RGBA format
            // Convert RGBA to Float32Array (Normalized between [0, 1])
            const floatArray = new Float32Array(3 * 224 * 224);
            let index = 0;
            for (let i = 0; i < imageData.length; i += 4) {
              // Skip Alpha channel
              floatArray[index++] = imageData[i] / 255; // Red
              floatArray[index++] = imageData[i + 1] / 255; // Green
              floatArray[index++] = imageData[i + 2] / 255; // Blue
            }

            resolve(floatArray);
          } else {
            console.error("Failed to get 2D context for canvas.");
          }
        };
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Placeholder function for ONNX inference
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const runOnnxInference = async (): Promise<string> => {
    if (imgArray) {
      predict(imgArray).then((predictions) => {
        console.log("Final Predictions:", predictions);
      });
    } else {
      console.error("Image array is undefined.");
    }

    return "Predicted condition: Eczema"; // Replace with actual ONNX inference logic
  };

  const handleFileSelection = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(event.target.files[0]);
      const imageData = (await fileToFloat32Array(
        event.target.files[0]
      )) as Float32Array;
      setimgArray(imageData);
    }
  };

  const handleDiagnosis = async () => {
    if (!selectedImage) {
      alert("Please select an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedImage);

    if (selectedModel === "vit") {
      // Online API request for ViT model
      const response = await fetch("https://api.example.com/vit-diagnosis", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setDiagnosisResult(data.result);
    } else {
      // Offline ONNX model inference (Placeholder example)
      const result = await runOnnxInference();
      setDiagnosisResult(result);
    }

    // Auto-scroll to the result section
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 500);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>AI Skin Condition Diagnosis</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {/* Instructions */}
        <IonList>
          <IonItem>
            <IonLabel className="instruction-text">
              <h2>📸 How to Take a Proper Photograph</h2>
              <ul>
                <li>
                  <strong>Lighting:</strong> Ensure bright, natural light; avoid
                  shadows.
                </li>
                <li>
                  <strong>Distance:</strong> Hold the camera <b>10-15cm</b> away
                  from the affected area.
                </li>
                <li>
                  <strong>Focus:</strong> Make sure the image is <b>clear</b>{" "}
                  and <b>sharp</b>.
                </li>
                <li>
                  <strong>Background:</strong> Use a <b>neutral backdrop</b> to
                  enhance AI detection.
                </li>
              </ul>
            </IonLabel>
          </IonItem>
        </IonList>

        {/* Model Selection */}
        <IonLabel className="model-selection-text">
          <h3>🤖 Select AI Model</h3>
        </IonLabel>
        <IonSelect
          value={selectedModel}
          onIonChange={(e) => setSelectedModel(e.detail.value)}
          className="styled-dropdown "
        >
          <IonSelectOption value="cnn">
            CNN (Offline) - Fast on-device inference
          </IonSelectOption>
          <IonSelectOption value="vit">
            ViT (Online) - More accurate cloud-based diagnosis
          </IonSelectOption>
        </IonSelect>

        {/* Image Upload */}
        <IonButton expand="full" className="upload-button">
          <label
            htmlFor="file-upload"
            style={{ cursor: "pointer", width: "100%" }}
          >
            📂 Select a Picture
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleFileSelection}
            style={{ display: "none" }}
          />
        </IonButton>

        {/* Display Image & Results */}
        {selectedImage && (
          <>
            <IonImg
              src={URL.createObjectURL(selectedImage)}
              alt="Selected Skin Image"
              className="selected-image"
            />

            <IonButton
              expand="full"
              color="success"
              className="diagnosis-button"
              onClick={handleDiagnosis}
            >
              🔍 Analyze
            </IonButton>
          </>
        )}
        {diagnosisResult && (
          <div ref={resultRef}>
            <IonLabel className="diagnosis-result">
              <h3>🩺 Diagnosis Result:</h3>
              <p>{diagnosisResult}</p>
            </IonLabel>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default AiDiagnosis;
