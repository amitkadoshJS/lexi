import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut as fbSignOut, User } from "firebase/auth";
import { auth } from "./firebase";

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};

export const signOut = async () => {
  await fbSignOut(auth);
};

export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
