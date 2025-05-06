import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
} from "@ionic/react";

import { useLocation } from "react-router-dom";
import {
  homeOutline,
  homeSharp,
  globeOutline,
  globeSharp,
  heartOutline,
  heartSharp,
  scanOutline,
  scanSharp,
  peopleOutline,
  peopleSharp,
} from "ionicons/icons";
import "./Menu.css";

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}

const appPages: AppPage[] = [
  {
    title: "Home",
    url: "/home",
    iosIcon: homeOutline,
    mdIcon: homeSharp,
  },
  {
    title: "AI Diagnosis",
    url: "/diagnosis",
    iosIcon: scanOutline,
    mdIcon: scanSharp,
  },
  {
    title: "DermaWiki",
    url: "/wiki",
    iosIcon: globeOutline,
    mdIcon: globeSharp,
  },
  {
    title: "Find a Clinic",
    url: "/find-clinic",
    iosIcon: heartOutline,
    mdIcon: heartSharp,
  },
  {
    title: "Account",
    url: "/account",
    iosIcon: peopleOutline,
    mdIcon: peopleSharp,
  },
];

const Menu: React.FC = () => {
  const location = useLocation();

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <IonList id="menu-list">
          <IonListHeader>
            <IonNote>Skin Health Companion</IonNote>
            <IonNote>Version 1.0</IonNote>
          </IonListHeader>
          {appPages.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem
                  className={
                    location.pathname === appPage.url ? "selected" : ""
                  }
                  routerLink={appPage.url}
                  routerDirection="none"
                  lines="none"
                  detail={false}
                >
                  <IonIcon
                    aria-hidden="true"
                    slot="start"
                    ios={appPage.iosIcon}
                    md={appPage.mdIcon}
                  />
                  <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
