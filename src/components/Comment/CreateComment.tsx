import {
  IonButtons,
  IonIcon,
  IonItem,
  IonTextarea,
  IonToast,
} from "@ionic/react";
import { send } from "ionicons/icons";
import { useContext, useState } from "react";
import axios from "../../config/axios";
import { GET_ALL_POSTS } from "../../config/urls";
import { AuthContext } from "../../context/AuthContext";

// Define props type
interface CreateCommentProps {
  sendToParent: (comment: string) => void;
}

const CreateComment: React.FC<CreateCommentProps> = ({ sendToParent }) => {
  const [newComment, setNewComment] = useState<string>("");
  const [showToast, setShowToast] = useState<boolean>(false);

  const auth = useContext(AuthContext);

  if (!auth) {
    throw new Error("AuthContext is not provided");
  }

  const { jwt } = auth;

  // Get post ID from URL
  const postId = window.location.pathname.split("/")[3];

  const onSubmit = async () => {
    const comment = {
      text: newComment,
    };

    try {
      await axios.post(`${GET_ALL_POSTS}/${postId}/create-comment`, comment, {
        headers: {
          Authorization: jwt || "",
        },
      });
    } catch (e: any) {
      console.error(e.response);
    }
  };

  const validateAndSubmit = () => {
    if (newComment && newComment.trim() !== "") {
      onSubmit();
      sendToParent(newComment);
      setNewComment("");
    } else {
      setShowToast(true);
    }
  };

  return (
    <>
      <IonItem className="ion-margin-bottom">
        <IonTextarea
          className="ion-margin"
          value={newComment}
          onIonChange={(e) => setNewComment(e.detail.value!)}
        />
        <IonButtons onClick={validateAndSubmit}>
          <IonIcon icon={send} className="send-icon" color="light" />
        </IonButtons>
      </IonItem>

      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message="يجب عليك إدخال تعليق"
        duration={1500}
        color="danger"
      />
    </>
  );
};

export default CreateComment;
