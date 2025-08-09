import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import React from "react";

const NotFound: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>الصفحة غير موجودة</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {/* You can add more content here if needed */}
      </IonContent>
    </IonPage>
  );
};

export default NotFound;
