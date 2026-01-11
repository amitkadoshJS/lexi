import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  FirestoreDataConverter,
  Timestamp
} from "firebase/firestore";
import { db } from "../firebase/firebase";

export interface Category {
  id?: string;
  name: string;
  img: string;
  created_at: Timestamp;
}

const categoriesConverter: FirestoreDataConverter<Category> = {
  toFirestore: (data) => ({
    name: data.name,
    img: data.img,
    created_at: data.created_at ?? serverTimestamp()
  }),
  fromFirestore: (snapshot) => {
    const data = snapshot.data();
    return {
      id: snapshot.id,
      name: data.name,
      img: data.img,
      created_at: data.created_at
    } as Category;
  }
};

const categoriesCollection = collection(db, "categories").withConverter(categoriesConverter);

export const categoriesRepo = {
  list: async () => {
    const q = query(categoriesCollection, orderBy("created_at", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => docSnap.data());
  },
  create: async (payload: Omit<Category, "id" | "created_at">) => {
    const docRef = await addDoc(categoriesCollection, {
      ...payload,
      created_at: serverTimestamp() as Timestamp
    } as Category);
    return docRef.id;
  },
  update: async (id: string, payload: Partial<Category>) => {
    const docRef = doc(db, "categories", id);
    await updateDoc(docRef, payload);
  },
  remove: async (id: string) => {
    const docRef = doc(db, "categories", id);
    await deleteDoc(docRef);
  }
};
