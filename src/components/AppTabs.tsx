import { Redirect, Route } from 'react-router-dom';
import {
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs
} from '@ionic/react';

import GetAllPosts from '../pages/getAllPosts';
import GetPost from '../pages/getPost';
import CreatePost from '../pages/createPost';
import MyPosts from '../pages/myPosts';
import UpdatePost from '../pages/updatePost';
import Profile from '../pages/profile';
import NotFound from '../pages/notFound';

import { addCircle, home } from 'ionicons/icons';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const AppTabs: React.FC = () => {
  const auth = useContext(AuthContext);

  if (!auth) {
    throw new Error("AuthContext is not provided");
  } 
  const { loggedIn } = auth;

  if (!loggedIn) {
    return <Redirect to="/account/login" />;
  }

  return (
    <IonTabs>
      <IonRouterOutlet id="menu">
        <Route exact path="/my-recipe/account/profile" component={Profile} />
        <Route exact path="/my-recipe/all-posts" component={GetAllPosts} />
        <Route exact path="/my-recipe/all-posts/:id" component={GetPost} />
        <Route exact path="/my-recipe/my-posts" component={MyPosts} />
        <Route exact path="/my-recipe/my-posts/:id" component={UpdatePost} />
        <Route exact path="/my-recipe/create-post" component={CreatePost} />
        <Route component={NotFound} />
      </IonRouterOutlet>

      <IonTabBar slot="bottom">
        <IonTabButton tab="create-post" href="/my-recipe/create-post">
          <IonIcon icon={addCircle} />
          <IonLabel>نشر</IonLabel>
        </IonTabButton>
        <IonTabButton tab="all-posts" href="/my-recipe/all-posts">
          <IonIcon icon={home} />
          <IonLabel>المنشورات</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default AppTabs;
