/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSearchbar,
  IonList,
  IonItem,
  IonLabel,
  IonImg,
  IonButtons,
  IonMenuButton,
} from "@ionic/react";

const WikiPage: React.FC = () => {
  interface SkinConditionDetails {
    image_url: string;
    symptoms: string;
    cure_remedy?: string;
    home_remedies?: string;
    severity?: string;
  }

  interface SkinConditions {
    [category: string]: {
      [name: string]: SkinConditionDetails;
    };
  }

  const [skinConditions, setSkinConditions] = useState<SkinConditions>({});
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("/assets/dermawiki.json")
      .then((response) => response.json())
      .then((data) => setSkinConditions(data.skin_conditions))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const filteredConditions = Object.entries(skinConditions)
    .flatMap(([category, conditions]) =>
      Object.entries(conditions).map(([name, details]) => ({
        category,
        name,
        image: details.image_url,
        symptoms: details.symptoms,
        cure_remedy: details.cure_remedy,
        home_remedies: details.home_remedies,
        severity: details.severity,
      }))
    )
    .filter(({ name }) =>
      name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Skin Conditions Database</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonSearchbar
          value={searchTerm}
          onIonInput={(e) => setSearchTerm(e.detail.value!)}
          placeholder="Search skin conditions..."
        />

        <IonList>
          {filteredConditions.map(
            (
              {
                category,
                name,
                image,
                symptoms,
                cure_remedy,
                home_remedies,
                severity,
              },
              index
            ) => (
              <IonItem key={index}>
                {/* <IonImg
                  src={image}
                  alt={name}
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "10px",
                  }}
                /> */}
                <IonLabel>
                  <h2>{name}</h2>
                  <h3>{category}</h3>
                  <p>
                    <strong>Symptoms:</strong> {symptoms}
                  </p>
                  <p>
                    <strong>Remedy:</strong> {cure_remedy}
                  </p>
                  <p>
                    <strong>Home Remedies:</strong> {home_remedies}
                  </p>
                  <p>
                    <strong>Severity:</strong> {severity}
                  </p>
                </IonLabel>
              </IonItem>
            )
          )}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default WikiPage;
