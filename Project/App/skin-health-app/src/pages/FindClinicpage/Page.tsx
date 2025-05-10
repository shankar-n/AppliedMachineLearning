import { useEffect, useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonMenuButton,
} from "@ionic/react";
import { Geolocation } from "@capacitor/geolocation";

const FindClinicPage: React.FC = () => {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );

  useEffect(() => {
    const getLocation = async () => {
      try {
        const coordinates = await Geolocation.getCurrentPosition();
        setLocation({
          lat: coordinates.coords.latitude,
          lng: coordinates.coords.longitude,
        });
      } catch (error) {
        console.error("Error fetching location:", error);
      }
    };

    getLocation();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Find a Clinic</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-height">
        {location ? (
          <iframe
            width="100%"
            height="100%"
            src={`https://www.google.com/maps/embed/v1/search?key=${apiKey}&q=skin+clinic&center=${location.lat},${location.lng}&zoom=14`}
            style={{ border: 0 }}
          ></iframe>
        ) : (
          <p>Fetching live location...</p>
        )}
      </IonContent>
    </IonPage>
  );
};

export default FindClinicPage;
