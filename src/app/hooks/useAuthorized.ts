import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../lib/firebase/firebase";
import { useAuth } from "./useAuth";

export const useAuthorized = () => {
  const { user } = useAuth();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthorization = async () => {
      if (!user?.email) {
        setAuthorized(false);
        setLoading(false);
        return;
      }
      const adminDoc = doc(db, "config", "admins", user.email);
      const snapshot = await getDoc(adminDoc);
      setAuthorized(snapshot.exists());
      setLoading(false);
    };

    checkAuthorization();
  }, [user?.email]);

  return { authorized, loading };
};
