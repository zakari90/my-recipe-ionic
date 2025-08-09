import { IonButtons, IonCol, IonIcon } from "@ionic/react";
import { heartOutline, heart } from "ionicons/icons";
import { useContext, useEffect, useState } from "react";
import axios from "../../config/axios";
import { GET_ALL_POSTS } from "../../config/urls";
import { AuthContext } from "../../context/AuthContext";


interface LikeProps {
  sendToParent: (likeCount: number ) => void;
}

const Like: React.FC<LikeProps> = ({ sendToParent }) => {
  const [likeCount, setLikeCount] = useState<number >();
  const [userLiked, setUserLiked] = useState<boolean>(false);
  const [refreshLike, setRefreshLike] = useState<number>(0); // use number as a simple trigger

  const auth = useContext(AuthContext);

  if (!auth) {
    throw new Error("AuthContext is not provided");
  }

  const { jwt } = auth;

  const postId = window.location.pathname.split("/")[3];

  useEffect(() => {
    getLikes();
    sendLikeCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshLike]);

  const getLikes = async () => {
    try {
      const res = await axios.get(`${GET_ALL_POSTS}/${postId}/like-count`, {
        headers: {
          Authorization: jwt || "",
        },
      });

      setLikeCount(res.data.likes);
      setUserLiked(res.data.userLiked);
    } catch (e: any) {
      console.error(e.response);
    }
  };

  const like = async () => {
    try {
      const res = await axios.put(
        `${GET_ALL_POSTS}/${postId}/like`,
        {},
        {
          headers: {
            Authorization: jwt || "",
          },
        }
      );

      // Trigger refresh
      setRefreshLike((prev) => prev + 1);
    } catch (e: any) {
      console.error(e.response);
    }
  };

  const sendLikeCount = () => {
    sendToParent(likeCount??0);
  };

  return (
    <IonCol size="2">
      <IonButtons onClick={like}>
        {userLiked ? (
          <IonIcon icon={heart} color="danger" className="post-icon" />
        ) : (
          <IonIcon icon={heartOutline} color="primary" className="post-icon" />
        )}
      </IonButtons>
    </IonCol>
  );
};

export default Like;
