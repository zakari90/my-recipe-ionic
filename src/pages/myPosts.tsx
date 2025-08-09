import {
  IonAlert,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonImg,
  IonLoading,
  IonPage,
  IonRow,
  useIonActionSheet
} from "@ionic/react";
import { ellipsisVertical } from 'ionicons/icons';
import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import Header from '../components/Header';
import axios from '../config/axios';
import { API_URL, DELETE_POST, GET_MY_POSTS } from "../config/urls";
import { AuthContext } from "../context/AuthContext";
import noImage from './assets/images/no_image.png';
import './styles/getAllPosts.css';
import './styles/getMyPosts.css';

interface PostImage {
  img_uri: string;
}

interface Post {
  id: number;
  title: string;
  contents: string;
  Post_Images: PostImage[];
}

const MyPosts: React.FC = () => {
  const [showLoading, setShowLoading] = useState<boolean>(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [postId, setPostId] = useState<number | null>(null);
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const [present, dismiss] = useIonActionSheet();

  const history = useHistory();
const auth = useContext(AuthContext);
    if (!auth) {
        throw new Error("AuthContext is not provided");
    }
  const { jwt } = auth;

  useEffect(() => {
    getPosts();
  }, []);

  const getPosts = async () => {
    setShowLoading(true);
    try {
      const res = await axios.get<Post[]>(GET_MY_POSTS, {
        headers: {
          Authorization: jwt ?? ""
        }
      });
      setPosts(res.data);
    } catch (e: any) {
      console.error(e.response ?? e);
    } finally {
      setShowLoading(false);
    }
  };

  const deletePost = async () => {
    if (!postId) return;
    setShowLoading(true);
    try {
      await axios.delete(DELETE_POST, {
        data: {
          postId
        },
        headers: {
          Authorization: jwt ?? ""
        }
      });
      await getPosts();
    } catch (e: any) {
      console.error(e.response ?? e);
    } finally {
      setShowLoading(false);
      setShowAlert(false);
    }
  };

  return (
    <IonPage>
      {showLoading && <IonLoading isOpen={showLoading} />}
      {!showLoading && (
        <>
          <IonAlert
            isOpen={showAlert}
            onDidDismiss={() => setShowAlert(false)}
            header={'تنبيه!'}
            message={'هل تود بالفعل حذف المنشور'}
            buttons={[
              {
                text: "نعم",
                handler: () => {
                  deletePost();
                }
              },
              {
                text: "إلغاء",
                role: "cancel"
              }
            ]}
          />
          <Header headerTitle="منشوراتي" />
          <IonContent className="ion-padding">
            <IonGrid>
              <IonRow>
                {posts.length > 0 ? (
                  posts.slice().reverse().map((post) => (
                    <IonCol size-md="6" size="12" key={post.id}>
                      <IonCard>
                        <IonImg
                          src={
                            post.Post_Images.length > 0
                              ? API_URL + post.Post_Images[0].img_uri
                              : noImage
                          }
                          className="post-image"
                        />
                        <IonCardContent>
                          <IonGrid>
                            <IonRow className="ion-justify-content-between">
                              <IonCardTitle className="post-title" color="primary">
                                {post.title}
                              </IonCardTitle>
                              <IonButtons
                                onClick={() => {
                                  present(
                                    [
                                      {
                                        text: "تعديل المنشور",
                                        handler: () => {
                                          history.push(`/my-recipe/my-posts/${post.id}`);
                                        }
                                      },
                                      {
                                        text: "الانتقال للمنشور",
                                        handler: () => {
                                          history.push(`/my-recipe/all-posts/${post.id}`);
                                        }
                                      },
                                      {
                                        text: "حذف المنشور",
                                        handler: () => {
                                          setPostId(post.id);
                                          setShowAlert(true);
                                        }
                                      },
                                      {
                                        text: "إلغاء",
                                        role: "cancel"
                                      }
                                    ],
                                    'تفاصيل المنشور'
                                  );
                                }}
                              >
                                <IonIcon icon={ellipsisVertical} className="post-icon" />
                              </IonButtons>
                            </IonRow>
                            <IonCardSubtitle className="post-contents">{post.contents}</IonCardSubtitle>
                          </IonGrid>
                        </IonCardContent>
                      </IonCard>
                    </IonCol>
                  ))
                ) : (
                  <IonCol size-md="6" offset-md="3">
                    <IonCard className="ion-padding ion-text-center">
                      <IonCardTitle color="primary">لايوجد منشورات لعرضها</IonCardTitle>
                    </IonCard>
                  </IonCol>
                )}
              </IonRow>
            </IonGrid>
          </IonContent>
        </>
      )}
    </IonPage>
  );
};

export default MyPosts;
