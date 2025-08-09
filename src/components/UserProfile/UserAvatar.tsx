import { IonAvatar, IonImg, IonIcon } from "@ionic/react";
import { addOutline } from "ionicons/icons";
import { useContext, useEffect, useRef, useState, FC } from "react";
import avatar from "../../pages/assets/images/avatar.png";
import { usePhotoGallery } from "../../hooks/usePhotoGallery";
import axios from "../../config/axios";
import { UPLOAD_USER_PHOTO, API_URL } from "../../config/urls";
import { AuthContext } from "../../context/AuthContext";

// ---------- Props Interface ----------
interface UserAvatarProps {
  userImg?: string;
  imgUri: (uri: string) => void;
}

const UserAvatar: FC<UserAvatarProps> = ({ userImg: initialUserImg, imgUri }) => {
  const [userImg, setUserImg] = useState<string | undefined>(initialUserImg);
  const auth = useContext(AuthContext);
  if (!auth) {
    throw new Error("AuthContext is not provided");
  }
  const { jwt } = auth;

  const takePhotoRef = useRef<any>(null);
  const { takePhoto, blobUrl } = usePhotoGallery();

  useEffect(() => {
    if (blobUrl) {
      setUserImg(blobUrl);
      uploadPhoto(blobUrl);
    }
  }, [blobUrl]);

  const uploadPhoto = async (blobUrl: string) => {
    const photoData = new FormData();
    try {
      const response = await fetch(blobUrl);
      const blob = await response.blob();
      photoData.append("avatar", blob);
      const res = await axios.put(UPLOAD_USER_PHOTO, photoData, {
        headers: {
          Authorization: jwt?? "",
        },
      });
      console.log(res);
      imgUri(blobUrl);
    } catch (e: any) {
      console.error(e?.response || e);
    }
  };

  return (
    <div className="avatar-container">
      
      <IonAvatar
        className="avatar"
        ref={takePhotoRef}
        onClick={() => {
          takePhoto();
        }}
      >
        <IonImg src={userImg ? API_URL + userImg : avatar} />
      </IonAvatar>
      <IonIcon
        icon={addOutline}
        color="light"
        className="user-icon"
        onClick={() => {
          takePhotoRef.current?.click();
        }}
      />
    </div>
  );
};

export default UserAvatar;
