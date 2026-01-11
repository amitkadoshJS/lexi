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

export const listSubcollection = async (path: string[]) => {
  const colRef = collection(db, ...path);
  const snapshot = await getDocs(colRef);
  return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...(docSnap.data() as GenericRecord) }));
};

export const createSubcollectionDoc = async (path: string[], payload: GenericRecord) => {
  const colRef = collection(db, ...path);
  const docRef = await addDoc(colRef, payload);
  return docRef.id;
};

export const updateSubcollectionDoc = async (
  path: string[],
  id: string,
  payload: GenericRecord
) => {
  await updateDoc(doc(db, ...path, id), payload);
};

export const deleteSubcollectionDoc = async (path: string[], id: string) => {
  await deleteDoc(doc(db, ...path, id));
};

export const getSubcollectionDoc = async (path: string[], id: string) => {
  const snapshot = await getDoc(doc(db, ...path, id));
  return snapshot.exists() ? ({ id: snapshot.id, ...(snapshot.data() as GenericRecord) } as GenericRecord) : null;
};
