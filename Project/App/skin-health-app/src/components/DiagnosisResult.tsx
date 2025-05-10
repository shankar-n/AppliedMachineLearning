import React, { useEffect, useState } from "react";
import { IonLabel, IonImg } from "@ionic/react";
import PieChart from "./PieChart";
import { getClassMap } from "../services/utilService";

interface DiagnosisResultProps {
  top_labels: number[];
  top_probs: number[];
  xai_output: string;
}

const DiagnosisResult: React.FC<DiagnosisResultProps> = ({
  top_labels,
  top_probs,
  xai_output,
}) => {
  const [chartLabels, setChartLabels] = useState<string[]>([]);

  useEffect(() => {
    const mapLabels = async () => {
      const classMap = await getClassMap();
      const mappedLabels = top_labels.map(
        (label) => classMap[label] || "Unknown"
      );
      setChartLabels(mappedLabels);
    };

    if (top_labels.length) {
      mapLabels();
    }
  }, [top_labels]);

  return (
    <div style={{ maxHeight: "500px" }}>
      {chartLabels.length === 0 ? (
        <></>
      ) : (
        <>
          <IonLabel className="diagnosis-result">
            <h3>🩺 Diagnosis Result:</h3>
          </IonLabel>
          <PieChart labels={chartLabels} values={top_probs} />

          {xai_output && (
            <div style={{ padding: "20px" }}>
              <IonLabel
                className="diagnosis-result"
                style={{ padding: "20px" }}
              >
                <h3>
                  🔍 Explainable AI (XAI): Gradient Class Activation Mapping
                  (Grad-CAM)
                </h3>
              </IonLabel>
              <IonImg
                key={xai_output}
                src={xai_output}
                alt="Explainable AI Output"
                className="xai-image"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DiagnosisResult;
