import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  updateDoc,
  FirestoreDataConverter,
  Timestamp
} from "firebase/firestore";
import { db } from "../firebase/firebase";

export interface Word {
  id?: string;
  category: string[];
  corr_img: string;
  img: string;
  test_order_id: number;
  title_en: string;
  title_he: string;
  voice_record_en: string;
  voice_record_he: string;
  created_at?: Timestamp;
}

const wordsConverter: FirestoreDataConverter<Word> = {
  toFirestore: (data) => ({
    category: data.category,
    corr_img: data.corr_img,
    img: data.img,
    test_order_id: data.test_order_id,
    title_en: data.title_en,
    title_he: data.title_he,
    voice_record_en: data.voice_record_en,
    voice_record_he: data.voice_record_he,
    created_at: data.created_at
  }),
  fromFirestore: (snapshot) => {
    const data = snapshot.data();
    return {
      id: snapshot.id,
      category: data.category ?? [],
      corr_img: data.corr_img ?? "",
      img: data.img ?? "",
      test_order_id: data.test_order_id ?? 0,
      title_en: data.title_en ?? "",
      title_he: data.title_he ?? "",
      voice_record_en: data.voice_record_en ?? "",
      voice_record_he: data.voice_record_he ?? "",
      created_at: data.created_at
    } as Word;
  }
};

const wordsCollection = collection(db, "words").withConverter(wordsConverter);

export const wordsRepo = {
  listPage: async (pageSize: number, cursor?: string) => {
    const baseQuery = query(wordsCollection, orderBy("title_en"), limit(pageSize));
    if (!cursor) {
      const snapshot = await getDocs(baseQuery);
      return {
        items: snapshot.docs.map((docSnap) => docSnap.data()),
        lastId: snapshot.docs.at(-1)?.id
      };
    }

    const cursorDoc = await getDoc(doc(wordsCollection, cursor));
    if (!cursorDoc.exists()) {
      return { items: [], lastId: undefined };
    }
    const pagedQuery = query(wordsCollection, orderBy("title_en"), startAfter(cursorDoc), limit(pageSize));
    const snapshot = await getDocs(pagedQuery);
    return {
      items: snapshot.docs.map((docSnap) => docSnap.data()),
      lastId: snapshot.docs.at(-1)?.id
    };
  },
  create: async (payload: Omit<Word, "id">) => {
    const docRef = await addDoc(wordsCollection, payload as Word);
    return docRef.id;
  },
  update: async (id: string, payload: Partial<Word>) => {
    const docRef = doc(db, "words", id);
    await updateDoc(docRef, payload);
  },
  remove: async (id: string) => {
    await deleteDoc(doc(db, "words", id));
  },
  get: async (id: string) => {
    const docRef = doc(wordsCollection, id);
    const snapshot = await getDoc(docRef);
    return snapshot.exists() ? snapshot.data() : null;
  }
};
