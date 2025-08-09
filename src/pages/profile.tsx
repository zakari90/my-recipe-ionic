import { 
  IonAlert,
  IonCol,
  IonContent, 
  IonGrid, 
  IonImg, 
  IonLoading, 
  IonPage, 
  IonRow
} from "@ionic/react";
import Header from "../components/Header";
import './styles/profile.css';
import { useContext, useEffect, useState } from "react";
import axios from '../config/axios';
import { PROFILE_URL, PROFILE_UPDATE_URL, API_URL } from "../config/urls";
import { AuthContext } from "../context/AuthContext";
import UserDetails from "../components/UserProfile/UserDetails";
import UserAvatar from "../components/UserProfile/UserAvatar";

const Profile: React.FC = () => {
  const [showLoading, setShowLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [userImg, setUserImg] = useState<string | null>(null);
  const [password, setPassword] = useState<string>('');
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [blobUrl, setBlobUrl] = useState<string | undefined>(undefined);
  const auth = useContext(AuthContext);
  if (!auth) {
    throw new Error("AuthContext is not provided");
  }
  const { jwt } = auth;
 const getProfile = async (): Promise<void> => {
    setShowLoading(true);
    try {
      const res = await axios.get(PROFILE_URL, {
        headers: { Authorization: jwt ?? "" }
      });
      console.warn("Profile data:", res.data.img_url);
      
      setName(res.data.name);
      setEmail(res.data.email);
      setUserImg(res.data.img_url);
    } catch (e: any) {
      console.log(e.response);
    } finally {
      setShowLoading(false);
    }
  };
  useEffect(() => {
    getProfile();
  }, [blobUrl]);

 

  const onSubmit = async (): Promise<void> => {
    setShowLoading(true);
    const updateForm = {
      name,
      password
    };
    try {
      await axios.put(PROFILE_UPDATE_URL, updateForm, {
        headers: { Authorization: jwt ?? "" }
      });
    } catch (e: any) {
      console.log(e.response);
    } finally {
      setShowLoading(false);
    }
  };

  return (
    <IonPage>
           {showLoading ? (
        <IonLoading isOpen={showLoading} />
      ) : (
        <>
          <IonAlert
            isOpen={showAlert}
            header="تنبيه!"
            message="هل تريد بالفعل تعديل البيانات الشخصية؟"
            onDidDismiss={() => setShowAlert(false)}
            buttons={[
              { text: "موافق", handler: onSubmit },
              { text: "إلغاء", role: "cancel" }
            ]}
          />
          <Header headerTitle="صفحة المستخدم"  />
          <IonContent className="ion-padding">
            <IonGrid>
              <IonRow>
                <IonCol size-md="6" size-lg="4" offset-md="3" offset-lg="4">
                  <UserAvatar userImg={userImg ?? ""} imgUri={setBlobUrl} />
                  <UserDetails
                    name={name}
                    email={email}
                    userName={setName}
                    password={setPassword}
                    showAlert={setShowAlert}
                  />
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonContent>
        </>
      )}
    </IonPage>
  );
};

export default Profile;
