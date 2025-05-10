// import React, { useRef, useState } from "react";
// import {
//   IonPage,
//   IonHeader,
//   IonToolbar,
//   IonTitle,
//   IonContent,
//   IonSelect,
//   IonSelectOption,
//   IonButton,
//   IonImg,
//   IonLabel,
//   IonList,
//   IonItem,
//   IonButtons,
//   IonMenuButton,
//   IonSpinner,
// } from "@ionic/react";

// import { runOnnxInference } from "../../services/onnxService";
// import { Chart } from "chart.js/auto";
// import { fetchApiDiagnosis } from "../../services/apiService";
// import BarChart from "../../components/BarChart";
// import { getClassMap, savePrediction } from "../../services/utilService";
// import { base64ToImage } from "../../services/imageService";

// const AiDiagnosis: React.FC = () => {
//   const [selectedModel, setSelectedModel] = useState("vit");
//   const [selectedImage, setSelectedImage] = useState<File | null>(null);
//   const [diagnosisResult, setDiagnosisResult] = useState<string | null>(null);
//   const [chartLabels, setChartLabels] = useState<string[]>([]);
//   const [chartValues, setChartValues] = useState<number[]>([]);
//   const [xaiURL, setxaiURL] = useState<string>("");
//   const [isLoading, setIsLoading] = useState(false);

//   // Ref for auto-scroll functionality
//   const resultRef = useRef<HTMLDivElement>(null);
//   const chartInstanceRef = useRef<Chart | null>(null);

//   const handleFileSelection = async (
//     event: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     if (event.target.files && event.target.files[0]) {
//       setSelectedImage(event.target.files[0]);
//       redraw_chart();
//     }
//   };

//   const redraw_chart = () => {
//     // ✅ Destroy previous chart instance before updating data
//     if (chartInstanceRef.current) {
//       chartInstanceRef.current.destroy();
//       chartInstanceRef.current = null;

//       setIsLoading(true);
//       setDiagnosisResult(null);
//       setChartLabels([]);
//       setChartValues([]);
//       setxaiURL("");
//     }
//   };

//   const handleDiagnosis = async () => {
//     if (!selectedImage) {
//       alert("Please select an image first.");
//       return;
//     }

//     redraw_chart();

//     if (selectedModel === "vit") {
//       // Online API Request
//       const { top_labels, top_probs, xai_output } = await fetchApiDiagnosis(
//         selectedImage
//       );
//       getClassMap().then((classMap) => {
//         const mappedLabels = top_labels.map((label) => classMap[label]);
//         setChartLabels(mappedLabels);
//       });
//       if (xai_output) {
//         base64ToImage(xai_output, setxaiURL);
//       }
//       setChartValues(top_probs);
//       setDiagnosisResult("Diagnosis complete.");
//       setIsLoading(false);
//       savePrediction({ top_labels, top_probs, xai_output });
//     } else {
//       // Offline ONNX Model Inference
//       const result = await runOnnxInference(selectedImage);
//       if (!result) {
//         alert("Inference failed. Please try again.");
//         setIsLoading(false);
//         return;
//       }
//       const { top_labels, top_probs } = result;
//       savePrediction(result);
//       getClassMap().then((classMap) => {
//         const mappedLabels = top_labels.map((label) => classMap[label]);
//         setChartLabels(mappedLabels);
//       });
//       setChartValues(top_probs);
//       setDiagnosisResult("Diagnosis complete.");
//       setIsLoading(false);
//     }

//     setTimeout(
//       () => resultRef.current?.scrollIntoView({ behavior: "smooth" }),
//       500
//     );
//   };

//   return (
//     <IonPage>
//       <IonHeader>
//         <IonToolbar>
//           <IonButtons slot="start">
//             <IonMenuButton />
//           </IonButtons>
//           <IonTitle>AI Skin Condition Diagnosis</IonTitle>
//         </IonToolbar>
//       </IonHeader>
//       <IonContent className="ion-padding">
//         {/* Instructions */}
//         <IonList>
//           <IonItem>
//             <IonLabel className="instruction-text">
//               <h2>📸 How to Take a Proper Photograph</h2>
//               <ul>
//                 <li>
//                   <strong>Lighting:</strong> Ensure bright, natural light; avoid
//                   shadows.
//                 </li>
//                 <li>
//                   <strong>Distance:</strong> Hold the camera <b>10-15cm</b> away
//                   from the affected area.
//                 </li>
//                 <li>
//                   <strong>Focus:</strong> Make sure the image is <b>clear</b>{" "}
//                   and <b>sharp</b>.
//                 </li>
//                 <li>
//                   <strong>Background:</strong> Use a <b>neutral backdrop</b> to
//                   enhance AI detection.
//                 </li>
//               </ul>
//             </IonLabel>
//           </IonItem>
//         </IonList>

//         {/* Model Selection */}
//         <IonLabel className="model-selection-text">
//           <h3>🤖 Select AI Model</h3>
//         </IonLabel>
//         <IonSelect
//           value={selectedModel}
//           onIonChange={(e) => setSelectedModel(e.detail.value)}
//           className="styled-dropdown"
//         >
//           <IonSelectOption value="vit">
//             Transformer based (Online) - More accurate cloud-based diagnosis
//           </IonSelectOption>
//           <IonSelectOption value="cnn">
//             Retrained CNN (Offline) - Fast on-device inference
//           </IonSelectOption>
//         </IonSelect>

//         {/* Image Upload */}
//         <IonButton expand="full" className="upload-button">
//           <label
//             htmlFor="file-upload"
//             style={{ cursor: "pointer", width: "100%" }}
//           >
//             📂 Select a Picture
//           </label>
//           <input
//             id="file-upload"
//             type="file"
//             accept="image/*"
//             onChange={handleFileSelection}
//             style={{ display: "none" }}
//           />
//         </IonButton>

//         {/* Display Image & Results */}
//         {selectedImage && (
//           <>
//             <IonImg
//               src={URL.createObjectURL(selectedImage)}
//               alt="Selected Skin Image"
//               className="selected-image"
//             />

//             <IonButton
//               expand="full"
//               color="success"
//               className="diagnosis-button"
//               onClick={handleDiagnosis}
//             >
//               🔍 Analyze
//             </IonButton>
//           </>
//         )}
//         {diagnosisResult && (
//           <div ref={resultRef} style={{ maxHeight: "500px" }}>
//             <IonLabel className="diagnosis-result">
//               <h3>🩺 Diagnosis Result:</h3>
//               <p>{diagnosisResult}</p>
//             </IonLabel>
//             {isLoading ? (
//               <IonSpinner name="circular" className="warning" />
//             ) : (
//               <>
//                 <BarChart
//                   labels={chartLabels}
//                   values={chartValues}
//                   onChartInstanceUpdate={(chart) =>
//                     (chartInstanceRef.current = chart)
//                   }
//                 />

//                 {selectedModel === "vit" && (
//                   <>
//                     <IonLabel className="xai-label">
//                       <h3 className="center">
//                         🔍 XAI: Gradient Class Activation Mapping
//                       </h3>
//                     </IonLabel>

//                     <IonImg
//                       key={xaiURL}
//                       src={xaiURL}
//                       alt="Explainable AI Output"
//                       className="xai-image"
//                       style={{ display: xaiURL ? "block" : "none" }}
//                     />
//                   </>
//                 )}
//               </>
//             )}
//           </div>
//         )}
//       </IonContent>
//     </IonPage>
//   );
// };

// export default AiDiagnosis;

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
  IonCard,
  IonCardContent,
} from "@ionic/react";

import { runOnnxInference } from "../../services/onnxService";
import { fetchApiDiagnosis } from "../../services/apiService";
import { savePrediction } from "../../services/utilService";
import { base64ToImage } from "../../services/imageService";
import DiagnosisResult from "../../components/DiagnosisResult";

const AiDiagnosis: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState("vit");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [top_labels, setTopLabels] = useState<number[]>([]);
  const [top_probs, setTopProbs] = useState<number[]>([]);
  const [xaiURL, setxaiURL] = useState<string>("");

  const resultRef = useRef<HTMLDivElement>(null);

  const handleFileSelection = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(event.target.files[0]);
      resetDiagnosisState();
    }
  };

  const resetDiagnosisState = () => {
    setTopLabels([]);
    setTopProbs([]);
    setxaiURL("");
  };

  const handleDiagnosis = async () => {
    if (!selectedImage) {
      alert("Please select an image first.");
      return;
    }

    resetDiagnosisState();

    let diagnosisData;

    if (selectedModel === "vit") {
      diagnosisData = await fetchApiDiagnosis(selectedImage);
      if (diagnosisData.xai_output) {
        base64ToImage(diagnosisData.xai_output, setxaiURL);
      }
    } else {
      diagnosisData = await runOnnxInference(selectedImage);
      if (!diagnosisData) {
        alert("Inference failed. Please try again.");
        return;
      }
    }

    setTopLabels(diagnosisData.top_labels);
    setTopProbs(diagnosisData.top_probs);
    savePrediction({
      top_labels: diagnosisData.top_labels,
      top_probs: diagnosisData.top_probs,
      xai_output: xaiURL,
    });

    setTimeout(
      () => resultRef.current?.scrollIntoView({ behavior: "smooth" }),
      500
    );
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
        <IonCard color="warning" className="advisory-card">
          <IonCardContent>
            <IonLabel className="advisory-text">
              <h3>⚠️ Advisory Notice</h3>
              <p>
                This diagnosis is an AI-generated <strong>prediction</strong>{" "}
                and should <strong>not</strong> be considered a confirmed
                medical assessment.
              </p>
              <p>
                AI models may occasionally <strong>misclassify</strong>{" "}
                conditions. We highly recommend consulting a{" "}
                <strong>qualified doctor</strong> or{" "}
                <strong>skincare professional</strong> for an accurate
                evaluation and appropriate medical guidance.
              </p>
              <p>
                Proceed with <strong>professional advice</strong> to ensure the
                best care for your skin health.
              </p>
            </IonLabel>
          </IonCardContent>
        </IonCard>

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
          onIonChange={(e) => {
            resetDiagnosisState();
            setSelectedModel(e.detail.value);
          }}
          className="styled-dropdown"
        >
          <IonSelectOption value="vit">
            Transformer-based (Online) - More accurate cloud-based diagnosis
          </IonSelectOption>
          <IonSelectOption value="cnn">
            Retrained CNN (Offline) - Fast on-device inference
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

        {/* Display Image & Diagnosis */}
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

        {/* Render Diagnosis Result */}
        <div ref={resultRef}>
          <DiagnosisResult
            key={xaiURL}
            top_labels={top_labels}
            top_probs={top_probs}
            xai_output={xaiURL}
          />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AiDiagnosis;
