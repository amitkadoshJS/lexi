import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc
} from "firebase/firestore";
import { db } from "../firebase/firebase";

export type GenericRecord = Record<string, any> & { id?: string };

const langsCollection = collection(db, "langs");

export const langsRepo = {
  list: async () => {
    const snapshot = await getDocs(langsCollection);
    return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...(docSnap.data() as GenericRecord) }));
  },
  create: async (payload: GenericRecord) => {
    const docRef = await addDoc(langsCollection, payload);
    return docRef.id;
  },
  update: async (id: string, payload: GenericRecord) => {
    await updateDoc(doc(db, "langs", id), payload);
  },
  remove: async (id: string) => {
    await deleteDoc(doc(db, "langs", id));
  },
  get: async (id: string) => {
    const snapshot = await getDoc(doc(db, "langs", id));
    return snapshot.exists() ? ({ id: snapshot.id, ...(snapshot.data() as GenericRecord) } as GenericRecord) : null;
  }
};
