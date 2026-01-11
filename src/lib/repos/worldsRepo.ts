import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  FirestoreDataConverter
} from "firebase/firestore";
import { db } from "../firebase/firebase";

export interface World {
  id?: string;
  img: string;
  orderId: number;
  title_en: string;
  title_he: string;
}

const worldsConverter: FirestoreDataConverter<World> = {
  toFirestore: (data) => ({
    img: data.img,
    orderId: data.orderId,
    title_en: data.title_en,
    title_he: data.title_he
  }),
  fromFirestore: (snapshot) => {
    const data = snapshot.data();
    return {
      id: snapshot.id,
      img: data.img ?? "",
      orderId: data.orderId ?? 0,
      title_en: data.title_en ?? "",
      title_he: data.title_he ?? ""
    } as World;
  }
};

const worldsCollection = collection(db, "worlds").withConverter(worldsConverter);

export const worldsRepo = {
  list: async () => {
    const q = query(worldsCollection, orderBy("orderId", "asc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => docSnap.data());
  },
  create: async (payload: Omit<World, "id">) => {
    const docRef = await addDoc(worldsCollection, payload as World);
    return docRef.id;
  },
  update: async (id: string, payload: Partial<World>) => {
    await updateDoc(doc(db, "worlds", id), payload);
  },
  remove: async (id: string) => {
    await deleteDoc(doc(db, "worlds", id));
  },
  get: async (id: string) => {
    const snapshot = await getDoc(doc(worldsCollection, id));
    return snapshot.exists() ? snapshot.data() : null;
  }
};

export const worldGamesCollection = (worldId: string) =>
  collection(db, "worlds", worldId, "games");
