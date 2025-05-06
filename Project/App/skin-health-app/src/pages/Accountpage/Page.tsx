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
} from "@ionic/react";

const AccountPage: React.FC = () => {
  const userData = {
    name: "John/Jane Doe",
    age: 25,
    height: "Unknown",
    weight: "Unknown",
  };

  const pastScans = [
    { id: 1, condition: "Eczema", date: "2025-04-20" },
    { id: 2, condition: "Psoriasis", date: "2025-04-18" },
  ];

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

        <IonTitle className="ion-padding-top">Past Scans</IonTitle>
        <IonList>
          {pastScans.map((scan) => (
            <IonItem key={scan.id}>
              <IonLabel>
                {scan.condition} - {scan.date}
              </IonLabel>
            </IonItem>
          ))}
        </IonList>

        <IonButton expand="full" color="primary">
          Edit Profile
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default AccountPage;
