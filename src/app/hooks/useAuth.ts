import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import { onAuthChange, signInWithGoogle, signOut as signOutUser } from "../../lib/firebase/auth";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthChange((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const signIn = async () => {
    await signInWithGoogle();
  };

  const signOut = async () => {
    await signOutUser();
  };

  return { user, loading, signIn, signOut };
};
