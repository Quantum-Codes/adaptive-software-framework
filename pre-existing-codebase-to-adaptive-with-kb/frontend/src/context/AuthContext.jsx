import { createContext, useContext, useEffect, useState } from "react";
import getUser from "../services/getUser";
import { buildDefaultAdaptiveSchema } from "../adaptive/defaultSchema";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

const loggedIn = JSON.parse(localStorage.getItem("loggedUser"));

const authState = {
  headers: null,
  isAuth: false,
  loggedUser: {
    bio: null,
    email: "",
    image: null,
    token: "",
    username: "",
    adaptiveSchema: buildDefaultAdaptiveSchema("guest"),
  },
};

function AuthProvider({ children }) {
  const [{ headers, isAuth, loggedUser }, setAuthState] = useState(
    loggedIn || authState,
  );

  useEffect(() => {
    if (!headers) return;

    getUser({ headers })
      .then((loggedUser) => setAuthState((prev) => ({ ...prev, loggedUser })))
      .catch(console.error);
  }, [headers, setAuthState]);

  return (
    <AuthContext.Provider value={{ headers, isAuth, loggedUser, setAuthState }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
