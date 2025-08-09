import {
  IonBackButton,
  IonButtons,
  IonHeader,
  IonMenuButton,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React from "react";

// Define the props type
interface HeaderProps {
  headerTitle: string;
  defaultHref?: string;
  disabledBackButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  headerTitle,
  defaultHref,
  disabledBackButton = false,
}) => {
  return (
    <IonHeader>
      <IonToolbar color="primary">
        <IonTitle>{headerTitle}</IonTitle>
        <IonButtons slot="end">
          <IonMenuButton />
        </IonButtons>
        <IonButtons slot="start">
          <IonBackButton
            defaultHref={defaultHref}
            disabled={disabledBackButton}
          />
        </IonButtons>
      </IonToolbar>
    </IonHeader>
  );
};

export default Header;
