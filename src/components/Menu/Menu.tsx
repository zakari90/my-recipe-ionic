import {
  IonContent,
  IonHeader,
  IonMenu,
  IonTitle,
  IonList,
  IonItem,
  IonToolbar,
  IonLabel,
  IonIcon,
  IonAvatar,
  IonImg,
  IonText,
  IonLoading,
} from "@ionic/react";
import {
  personCircleOutline,
  clipboardOutline,
  logOutOutline,
} from "ionicons/icons";
import avatar from "../../pages/assets/images/avatar.png";
import axios from "../../config/axios";
import { PROFILE_URL, API_URL } from "../../config/urls";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Storage } from "@capacitor/storage";
import { useHistory } from "react-router";

const Menu: React.FC = () => {
  const [showLoading, setShowLoading] = useState<boolean>(false);
  const [name, setName] = useState<string | undefined>();
  const [profileImg, setProfileImg] = useState<string | undefined>();
  const [side, setSide] = useState<"start" | "end">("start");

  const auth = useContext(AuthContext);
  const history = useHistory();

  if (!auth) {
    throw new Error("AuthContext is not provided");
  }

  const { jwt, setLoggedIn } = auth;

  // useEffect(() => {
  //   const x = window.matchMedia("(max-width: 992px)");
  //   handleResponsiveSide(x); // initial call
  //   x.addEventListener("change", handleResponsiveSide);

  //   return () => {
  //     x.removeEventListener("change", handleResponsiveSide);
  //   };
  // }, []);

  // const handleResponsiveSide = (x: MediaQueryListEvent | MediaQueryList) => {
  //   if (x.matches) {
  //     setSide("end");
  //   } else {
  //     setSide("start");
  //   }
  // };

  useEffect(() => {
    getProfile();
  }, []);

  const logOut = async () => {
    await Storage.remove({ key: "accessToken" });
    setLoggedIn(false);
    history.push("/account/login");
  };

  const getProfile = async () => {
    setShowLoading(true);
    try {
      const res = await axios.get(PROFILE_URL, {
        headers: {
          Authorization: jwt || "",
        },
      });

      setName(res.data.name);
      setProfileImg(res.data.img_url);
    } catch (e: any) {
      console.error(e.response);
    } finally {
      setShowLoading(false);
    }
  };

  return (
    <IonMenu side="end" contentId="menu">
      {showLoading ? (
        <IonLoading isOpen={showLoading} />
      ) : (
        <>
          <IonHeader>
            <IonToolbar>
              <IonTitle>قائمة</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonAvatar className="avatar">
              {profileImg ? (
                <IonImg src={API_URL + profileImg} />
              ) : (
                <IonImg src={avatar} />
              )}
            </IonAvatar>
            <div className="ion-text-center ion-margin-top">
              <IonText color="warning">
                <h3>{name}</h3>
              </IonText>
            </div>
            <IonList>
              <IonItem routerLink="/my-recipe/account/profile">
                <IonIcon color="primary" icon={personCircleOutline} />
                <IonLabel className="ion-margin">الصفحة الشخصية</IonLabel>
              </IonItem>
              <IonItem routerLink="/my-recipe/my-posts">
                <IonIcon color="primary" icon={clipboardOutline} />
                <IonLabel className="ion-margin">منشوراتي</IonLabel>
              </IonItem>
              <IonItem onClick={logOut}>
                <IonIcon color="primary" icon={logOutOutline} />
                <IonLabel className="ion-margin">تسجيل الخروج</IonLabel>
              </IonItem>
            </IonList>
          </IonContent>
        </>
      )}
    </IonMenu>
  );
};

export default Menu;
