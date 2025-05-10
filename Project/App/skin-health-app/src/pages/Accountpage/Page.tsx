import React, { useState, useEffect } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonButtons,
  IonMenuButton,
  IonModal,
  IonFooter,
} from "@ionic/react";

import DiagnosisResult from "../../components/DiagnosisResult";
import { getDiagnosisHistory, getClassMap } from "../../services/utilService";
import { Capacitor } from "@capacitor/core";

interface ScanRecord {
  timestamp: string;
  prediction: {
    top_labels: number[];
    top_probs: number[];
    xai_output: string;
  };
  condition?: string; // Dynamically retrieved label
}

const AccountPage: React.FC = () => {
  const userData = {
    name: "John/Jane Doe",
    age: 25,
    height: "Unknown",
    weight: "Unknown",
  };

  const [scanHistory, setScanHistory] = useState<ScanRecord[]>([]);
  const [selectedScan, setSelectedScan] = useState<ScanRecord | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Load past diagnoses and map labels
  useEffect(() => {
    const fetchScans = async () => {
      try {
        const results = await getDiagnosisHistory(); // Fetch stored diagnosis data
        const classMap = await getClassMap(); // Fetch class mappings

        console.log("Results:", results);
        // Process results and map condition names
        const processedScans = results.map((scan: ScanRecord) => ({
          ...scan,
          condition: classMap[scan.prediction.top_labels[0]] || "Unknown", // Map predicted condition
        }));

        setScanHistory(processedScans);
      } catch (error) {
        console.error("Error loading scan history:", error);
      }
    };

    fetchScans();
  }, []);

  // Open DiagnosisResult in a Modal on click
  const handleOpenScan = (scan: ScanRecord) => {
    setSelectedScan(scan);
    setShowModal(true);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Account</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList>
          <IonItem>
            <IonLabel>
              <strong>Name:</strong> {userData.name}
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>
              <strong>Age:</strong> {userData.age}
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>
              <strong>Height:</strong> {userData.height}
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>
              <strong>Weight:</strong> {userData.weight}
            </IonLabel>
          </IonItem>
        </IonList>
        <IonButton expand="full" color="primary">
          Edit Profile
        </IonButton>

        {/* Past Scans Section */}
        <IonTitle
          className="ion-padding-top"
          style={{ padding: "20px", color: "red" }}
        >
          Past Scans
        </IonTitle>
        <IonList>
          {scanHistory.map((scan, index) => (
            <IonItem key={index} button onClick={() => handleOpenScan(scan)}>
              <IonLabel>
                {scan.condition} -{" "}
                {new Date(scan.timestamp).toLocaleString("en-US", {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </IonLabel>
            </IonItem>
          ))}
        </IonList>

        {/* Diagnosis Result Modal */}
        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          <IonButton
            style={{ margin: "10px" }}
            expand="full"
            onClick={() => setShowModal(false)}
          >
            Close
          </IonButton>
          <IonContent className="ion-padding">
            {selectedScan && (
              <IonContent className="ion-padding">
                <DiagnosisResult
                  top_labels={selectedScan.prediction.top_labels}
                  top_probs={selectedScan.prediction.top_probs}
                  xai_output={selectedScan.prediction.xai_output}
                />
              </IonContent>
            )}
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default AccountPage;
