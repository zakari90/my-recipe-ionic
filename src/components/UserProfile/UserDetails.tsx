import {
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonToast,
} from "@ionic/react";
import { useState } from "react";

interface UserDetailsProps {
  name: string;
  email: string;
  userName: (name: string) => void;
  password: (pass: string) => void;
  showAlert: (show: boolean) => void;
}

const UserDetails: React.FC<UserDetailsProps> = ({
  name: initialName,
  email,
  userName,
  password: setPasswordCallback,
  showAlert,
}) => {
  const [name, setName] = useState<string>(initialName);
  const [password, setPassword] = useState<string>("");
  const [disabled, setDisabled] = useState<boolean>(true);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [showPassToast, setShowPassToast] = useState<boolean>(false);

  const handleClick = () => {
    if (name && password) {
      if (password.length < 5) {
        setShowPassToast(true);
      } else {
        userName(name);
        setPasswordCallback(password);
        showAlert(true);
      }
    } else {
      setShowToast(true);
    }
  };

  return (
    <IonList>
      <IonItem>
        <IonLabel position="floating" color="warning">
          الاسم
        </IonLabel>
        <IonInput
          value={name}
          onIonChange={(e) => setName(e.detail.value!)}
        />
      </IonItem>
      <IonItem>
        <IonLabel position="floating" color="warning">
          البريد الإلكتروني
        </IonLabel>
        <IonInput value={email} disabled />
      </IonItem>
      <IonItem>
        <IonLabel position="floating" color="warning">
          كلمة المرور
        </IonLabel>
        <IonInput
          type="password"
          value={password}
          onIonChange={(e) => {
            setPassword(e.detail.value!);
            setDisabled(false);
          }}
        />
      </IonItem>
      <div className="btn">
        <IonButton onClick={handleClick} expand="block" disabled={disabled}>
          تعديل البيانات
        </IonButton>
      </div>
      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message="يجب عليك إدخال جميع الحقول"
        duration={1500}
        color="danger"
      />
      <IonToast
        isOpen={showPassToast}
        onDidDismiss={() => setShowPassToast(false)}
        message="يجب عليك إدخال أكثر من خمسة محارف لكلمة المرور"
        duration={1500}
        color="danger"
      />
    </IonList>
  );
};

export default UserDetails;
