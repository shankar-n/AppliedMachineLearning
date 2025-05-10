import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonButtons,
  IonMenuButton,
} from "@ionic/react";

const HomePage: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Welcome to Skin Health Companion</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {/* Hero Banner */}
        <div className="hero-container">
          <img
            src="/assets/home_1.jpg"
            alt="Healthy Skin Tips"
            className="hero-image"
          />
          <div className="hero-text">
            <h2>Your AI-Powered Skin Guide</h2>
            <p>
              Discover AI diagnostics, real dermatology clinics, and expert
              skincare tips.
            </p>
          </div>
        </div>

        {/* Skin Health Facts Section */}
        <h3 className="section-title">Skin Health Facts You Should Know</h3>
        <IonGrid className="facts-grid">
          <IonRow>
            <IonCol>
              <div className="fact-box">
                <img
                  src="/assets/home_2.png"
                  alt="Sunscreen Application"
                  className="fact-image"
                />
                <p>
                  <strong>Fact:</strong> UV rays can cause premature aging.
                  Apply sunscreen daily.
                </p>
              </div>
            </IonCol>
            <IonCol>
              <div className="fact-box">
                <img
                  src="/assets/home_3.png"
                  alt="Hydration"
                  className="fact-image"
                />
                <p>
                  <strong>Fact:</strong> Dehydration affects skin elasticity.
                  Drink at least 2L of water daily.
                </p>
              </div>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <div className="fact-box">
                <img
                  src="/assets/home_4.png"
                  alt="Healthy Food"
                  className="fact-image"
                />
                <p>
                  <strong>Fact:</strong> Vitamin-rich foods improve skin
                  texture. Eat leafy greens and nuts.
                </p>
              </div>
            </IonCol>
            <IonCol>
              <div className="fact-box">
                <img
                  src="/assets/home_5.png"
                  alt="Skin Care Routine"
                  className="fact-image"
                />
                <p>
                  <strong>Fact:</strong> Consistency matters. Stick to a simple
                  skincare routine for best results.
                </p>
              </div>
            </IonCol>
          </IonRow>
        </IonGrid>

        {/* AI-Powered Assistance Section */}
        <h3 className="section-title">AI-Powered Insights for Your Skin</h3>
        <p>
          Get personalized skincare recommendations based on AI-driven analysis.
        </p>
        <IonButton expand="full" color="tertiary" href="/diagnosis">
          Try AI Skin Diagnosis
        </IonButton>

        {/* Find Nearby Dermatologists */}
        <h3 className="section-title">Find a Dermatologist Near You</h3>
        <p>Need expert consultation? Locate clinics in your area.</p>
        <IonButton expand="full" color="secondary" href="/find-clinic">
          Find a Skin Clinic
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default HomePage;
