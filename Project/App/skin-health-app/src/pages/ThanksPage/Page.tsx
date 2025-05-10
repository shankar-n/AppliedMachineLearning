import React from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonMenuButton,
} from "@ionic/react";

const ThanksPage: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Project Acknowledgments</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>🙏 Thank You!</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <p>
              This project was developed for the{" "}
              <strong>Applied Machine Learning (AML)</strong> course this
              semester.
            </p>
            <p>
              Special thanks to <strong>Professor Raghav Kulkarni</strong> for
              his valuable guidance, my college for the opportunity, and the
              various research references that helped shape this project.
            </p>
            <p>
              The work on AI-powered dermatology and mobile optimization has
              been a rewarding journey, and I appreciate all the support along
              the way!
            </p>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default ThanksPage;
