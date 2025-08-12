import {
  IonAvatar,
  IonCard,
  IonCardSubtitle,
  IonGrid,
  IonImg,
  IonRow,
  IonText,
  IonSkeletonText,
} from "@ionic/react";
import avatar from "../../pages/assets/images/avatar.png";
import axios from "../../config/axios";
import { GET_ALL_POSTS, API_URL } from "../../config/urls";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

// Comment type based on your backend response
interface CommentType {
  id: number;
  text: string;
  User: {
    name: string;
    img_uri: string | null;
  };
}


interface GetCommentProps {
  comment: string; 
}

const GetComment: React.FC<GetCommentProps> = ({ comment }) => {
  const [comments, setComments] = useState<CommentType[] | []>([]);

  const auth = useContext(AuthContext);

  if (!auth) {
    throw new Error("AuthContext is not provided");
  }

  const { jwt } = auth;

  const postId = window.location.pathname.split("/")[3];

  useEffect(() => {
    getComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [comment]);

  const getComments = async () => {
    try {
      const res = await axios.get(`${GET_ALL_POSTS}/${postId}/get-comments`, {
        headers: {
          Authorization: jwt || "",
        },
      });
      setComments(res.data);
    } catch (e: any) {
      console.error(e.response);
    }
  };

  return (
    <IonGrid className="ion-no-margin">
      {comments ? (
        comments.map((commentItem) => (
          <IonRow key={commentItem.id}>
            <IonAvatar className="comment-avatar">
              {commentItem.User.img_uri ? (
                <IonImg src={API_URL + commentItem.User.img_uri} />
              ) : (
                <IonImg src={avatar} />
              )}
            </IonAvatar>
            <IonCard className="comment-card ion-padding">
              <IonCardSubtitle color="warning">
                {commentItem.User.name}
              </IonCardSubtitle>
              <IonText className="comment-text">{commentItem.text}</IonText>
            </IonCard>
          </IonRow>
        ))
      ) : (
        <IonCard>
          <IonGrid className="ion-margin-right">
            <IonRow>
              <IonAvatar>
                <IonSkeletonText animated style={{ width: "20%" }} />
              </IonAvatar>
              <IonCardSubtitle>
                <p>
                  <IonSkeletonText animated style={{ width: "50%" }} />
                </p>
              </IonCardSubtitle>
            </IonRow>
            <IonText>
              <p>
                <IonSkeletonText animated style={{ width: "50%" }} />
              </p>
            </IonText>
          </IonGrid>
        </IonCard>
      )}
    </IonGrid>
  );
};

export default GetComment;
