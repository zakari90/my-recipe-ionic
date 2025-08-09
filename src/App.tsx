import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import AppTabs from './components/AppTabs';
import Menu from './components/Menu/Menu';
import AuthContextProvider from './context/AuthContext';
import Login from './pages/login';
import Register from './pages/register';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <AuthContextProvider>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/account/register">
            <Register />
          </Route>
          <Route exact path="/account/login">
            <Login />
          </Route>
          <Route path="/my-recipe">
            <Menu />
            <AppTabs />
          </Route>
          <Route exact path="/">
            <Redirect to="/my-recipe/all-posts" />
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </AuthContextProvider>
  </IonApp>
);

export default App;
