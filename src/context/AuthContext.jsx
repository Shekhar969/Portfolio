import { createContext, useEffect, useMemo, useState } from "react";
import {
  ADMIN_UID,
  signIn,
  signOutAdmin,
  subscribeToAuth,
} from "../firebase/auth";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(
    () =>
      subscribeToAuth((nextUser) => {
        setUser(nextUser);
        setLoading(false);
      }),
    []
  );

  const isAdmin = Boolean(user && ADMIN_UID && user.uid === ADMIN_UID);

  const value = useMemo(
    () => ({ user, isAdmin, loading, signIn, signOut: signOutAdmin }),
    [user, isAdmin, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}