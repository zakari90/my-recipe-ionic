import React, {
  createContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Storage } from "@capacitor/storage";
import { IonLoading } from "@ionic/react";

// ✅ Define reusable types

interface AuthContextType {
  loggedIn: boolean;
  setLoggedIn: (value: boolean) => void;
  jwt: string | undefined;
  setJwt: (value: string | undefined) => void; //React.Dispatch<React.SetStateAction<string | undefined>>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthContextProviderProps {
  children: ReactNode;
}

const AuthContextProvider: React.FC<AuthContextProviderProps> = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [jwt, setJwt] = useState<string | undefined>();

  useEffect(() => {
    getAuthenticated();
  }, []);

  const getAuthenticated = async () => {
    setShowLoading(true);
    const accessToken = await Storage.get({ key: "accessToken" });
    if (accessToken.value) {
      setLoggedIn(true);
      setJwt(accessToken.value);
    } else {
      setLoggedIn(false);
      setJwt(undefined);
    }
    setShowLoading(false);
  };

  return (
    <>
      {showLoading ? (
        <IonLoading isOpen={showLoading} />
      ) : (
        <AuthContext.Provider value={{ loggedIn, setLoggedIn, jwt, setJwt }}>
          {children}
        </AuthContext.Provider>
      )}
    </>
  );
};

export default AuthContextProvider;
