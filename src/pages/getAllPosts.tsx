import {
  IonAlert,
  IonAvatar,
  IonCard,
  IonCardContent,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonImg,
  IonLoading,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonRow,
  IonText,
  useIonRouter,
} from "@ionic/react";
import Header from "../components/Header";
import noImage from "./assets/images/no_image.png";
import avatar from "./assets/images/avatar.png";
import "./styles/getAllPosts.css";
import axios from "../config/axios";
import { GET_ALL_POSTS, API_URL } from "../config/urls";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import moment from "moment";
import "moment/locale/ar";
import { useHistory } from "react-router";
import { Storage } from "@capacitor/storage";

moment.locale("ar");

interface User {
  id: number;
  name: string;
  img_uri?: string;
}

interface PostImage {
  img_uri: string;
}

interface Post {
  id: number;
  title: string;
  contents: string;
  createdAt: string;
  User: User;
  Post_Images: PostImage[];
}

const GetAllPosts: React.FC = () => {
  const [showLoading, setShowLoading] = useState<boolean>(false);
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [showAlert, setShowAlert] = useState<boolean>(false);
const auth = useContext(AuthContext);
if (!auth) {
    throw new Error("AuthContext is not provided");   
}
  const { jwt, setLoggedIn } = auth
  const ionRouter = useIonRouter();
  const history = useHistory();

  useEffect(() => {
    getPosts();
  }, []);

  useEffect(() => {
    const handleBack = (ev: any) => {
      ev.detail.register(10, () => {
        if (ionRouter.routeInfo.lastPathname === "/account/login") {
          setShowAlert(true);
        } else {
            history.push(ionRouter.routeInfo.lastPathname ?? "/");        }
      });
    }; 

    document.addEventListener("ionBackButton", handleBack);
    return () => document.removeEventListener("ionBackButton", handleBack);
  }, [ionRouter, history]);

  const getPosts = async () => {
    setShowLoading(true);
    try {
      const res = await axios.get(GET_ALL_POSTS, {
        headers: {
          Authorization: jwt ?? "",
        },
      });
      setPosts(res.data);
    } catch (e: any) {
      console.log(e.response);
    } finally {
      setShowLoading(false);
    }
  };

  const logOut = async () => {
    await Storage.remove({ key: "accessToken" });
    setLoggedIn(false);
    history.push("/account/login");
  };

  const doRefresh = (event: CustomEvent) => {
    setTimeout(() => {
      getPosts();
      event.detail.complete();
    }, 1000);
  };

  return (
    <IonPage>
      {showLoading ? (
        <IonLoading isOpen={showLoading} />
      ) : (
        posts && (
          <>
            <IonAlert
              isOpen={showAlert}
              header={"تنبيه!"}
              subHeader={"أنت على وشك تسجيل الخروج"}
              message={"هل تريد تسجيل الخروج بالفعل؟"}
              buttons={[
                {
                  text: "موافق",
                  handler: () => {
                    logOut();
                  },
                },
                {
                  text: "إلغاء",
                  role: "cancel",
                },
              ]}
            />
            <Header headerTitle="وصفاتي" disabledBackButton={true}/>
            <IonContent className="ion-padding">
              <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
                <IonRefresherContent></IonRefresherContent>
              </IonRefresher>
              <IonGrid>
                <IonRow>
                  {posts.length > 0 ? (
                    posts
                      .slice()
                      .reverse()
                      .map((post) => (
                        <IonCol size-md="6" size="12" key={post.id}>
                          <IonCard routerLink={`/my-recipe/all-posts/${post.id}`}>
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
                                <IonRow>
                                  <IonAvatar className="post-avatar">
                                    <IonImg
                                      src={
                                        post.User.img_uri
                                          ? API_URL + post.User.img_uri
                                          : avatar
                                      }
                                    />
                                  </IonAvatar>
                                  <IonCol>
                                    <IonText className="post-user">{post.User.name}</IonText>
                                    <IonText className="post-moment" color="warning">
                                      {moment(post.createdAt).fromNow()}
                                    </IonText>
                                  </IonCol>
                                </IonRow>
                                <IonCardTitle className="post-title" color="primary">
                                  {post.title}
                                </IonCardTitle>
                                <IonCardSubtitle className="post-contents">
                                  {post.contents}
                                </IonCardSubtitle>
                              </IonGrid>
                            </IonCardContent>
                          </IonCard>
                        </IonCol>
                      ))
                  ) : (
                    <IonCol size-md="6" offset-md="3">
                      <IonCard className="ion-padding ion-text-center">
                        <IonCardTitle color="primary">
                          لايوجد منشورات لعرضها
                        </IonCardTitle>
                      </IonCard>
                    </IonCol>
                  )}
                </IonRow>
              </IonGrid>
            </IonContent>
          </>
        )
      )}
    </IonPage>
  );
};

export default GetAllPosts;
