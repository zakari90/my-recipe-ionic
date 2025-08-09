import { 
  IonAlert, 
  IonButton, 
  IonCol, 
  IonContent, 
  IonGrid, 
  IonInput, 
  IonItem, 
  IonLabel, 
  IonList, 
  IonLoading, 
  IonPage, 
  IonRow, 
  IonTextarea, 
  IonToast 
} from "@ionic/react";
import { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import TextEditor from "../components/TextEditor/TextEditor";
import axios from '../config/axios';
import { GET_MY_POSTS } from "../config/urls";
import { AuthContext } from "../context/AuthContext";
import { EditorState, convertFromRaw, RawDraftContentState } from 'draft-js';

const UpdatePost: React.FC = () => {
  const [showLoading, setShowLoading] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [contents, setContents] = useState<string>('');
  const [editor, setEditor] = useState<EditorState | null>(null);
  const [steps, setSteps] = useState<string>('');
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);
  const auth = useContext(AuthContext);
  if (!auth) {
    throw new Error("AuthContext is not provided");
  }
  const { jwt } = auth;

  // Extract postId safely as string (you may want to validate this)
  const postId: string | undefined = window.location.pathname.split('/')[3];

  useEffect(() => {
    if (postId) {
      getPost();
    }
  }, [postId]);

  const validator = () => {
    if (title && contents && steps) {
      setShowAlert(true);
    } else {
      setShowToast(true);
    }
  };

  const getPost = async (): Promise<void> => {
    if (!postId) return;
    setShowLoading(true);
    try {
      const res = await axios.get(GET_MY_POSTS + '/' + postId, {
        headers: {
          Authorization: jwt ?? ''
        }
      });
      setTitle(res.data.title);
      setContents(res.data.contents);
      // Parse steps content safely
      try {
        const rawContent: RawDraftContentState = JSON.parse(res.data.steps);
        const contentState = convertFromRaw(rawContent);
        const editorState = EditorState.createWithContent(contentState);
        setEditor(editorState);
      } catch (e) {
        // fallback in case parsing fails
        setEditor(EditorState.createEmpty());
      }
    } catch (e: any) {
      console.error(e.response ?? e);
    } finally {
      setShowLoading(false);
    }
  };

  const onSubmit = async (): Promise<void> => {
    if (!postId) return;
    const postForm = {
      title,
      contents,
      steps
    };
    try {
      const res = await axios.put(GET_MY_POSTS + '/' + postId + '/update', postForm, {
        headers: {
          Authorization: jwt ?? ''
        }
      });
      console.log(res);
    } catch (e: any) {
      console.error(e.response ?? e);
    }
  };

  return (
    <IonPage>
      {showLoading ? (
        <IonLoading isOpen={showLoading} />
      ) : editor ? (
        <>
          <IonAlert
            isOpen={showAlert}
            onDidDismiss={() => setShowAlert(false)}
            header={"تنبيه!"}
            subHeader={'تعديل البيانات'}
            message={'أنت على وشك تعديل المنشور، هل تريد بالفعل تعديل المنشور'}
            buttons={[
              {
                text: "نعم",
                handler: () => {
                  onSubmit();
                }
              },
              {
                text: "إلغاء",
                role: "cancel"
              }
            ]}
          />
          <Header headerTitle="تعديل المنشور" />
          <IonContent className="ion-padding">
            <IonGrid>
              <IonRow>
                <IonCol size-md="7" offset-md="1">
                  <IonList>
                    <IonItem>
                      <IonLabel position="floating" color="warning">العنوان</IonLabel>
                      <IonInput
                        value={title}
                        onIonChange={e => setTitle(e.detail.value ?? '')}
                      />
                    </IonItem>
                    <IonItem className="ion-margin-bottom">
                      <IonLabel position="floating" color="warning">المكونات</IonLabel>
                      <IonTextarea
                        value={contents}
                        onIonChange={e => setContents(e.detail.value ?? '')}
                      />
                    </IonItem>
                    <IonLabel className="ion-margin">خطوات التحضير</IonLabel>
                    <IonItem lines="none" className="ion-margin-top">
                      <TextEditor editorState={editor} sendToParent={setSteps} />
                    </IonItem>
                    <div className="btn">
                      <IonButton expand="block" onClick={validator}>تعديل المنشور</IonButton>
                    </div>
                  </IonList>
                  <IonToast
                    isOpen={showToast}
                    onDidDismiss={() => setShowToast(false)}
                    message="يجب عليك إدخال جميع الحقول"
                    duration={1500}
                    color="danger"
                  />
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonContent>
        </>
      ) : null}
    </IonPage>
  );
};

export default UpdatePost;
