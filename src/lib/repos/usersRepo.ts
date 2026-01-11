import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  startAfter,
  updateDoc,
  FirestoreDataConverter,
  Timestamp
} from "firebase/firestore";
import { db } from "../firebase/firebase";

export interface UserSettings {
  language: string;
  musicOnBG: boolean;
  notifications: boolean;
}

export interface UserRecord {
  id?: string;
  activeSubscription: boolean;
  createDate: Timestamp;
  isOpen: boolean;
  settings: UserSettings;
  subscriptionEndDate: Timestamp;
}

const usersConverter: FirestoreDataConverter<UserRecord> = {
  toFirestore: (data) => ({
    activeSubscription: data.activeSubscription,
    createDate: data.createDate,
    isOpen: data.isOpen,
    settings: data.settings,
    subscriptionEndDate: data.subscriptionEndDate
  }),
  fromFirestore: (snapshot) => {
    const data = snapshot.data();
    return {
      id: snapshot.id,
      activeSubscription: data.activeSubscription ?? false,
      createDate: data.createDate,
      isOpen: data.isOpen ?? false,
      settings: data.settings ?? { language: "", musicOnBG: false, notifications: false },
      subscriptionEndDate: data.subscriptionEndDate
    } as UserRecord;
  }
};

const usersCollection = collection(db, "users").withConverter(usersConverter);

export const usersRepo = {
  listPage: async (pageSize: number, cursor?: string) => {
    const baseQuery = query(usersCollection, orderBy("createDate", "desc"), limit(pageSize));
    if (!cursor) {
      const snapshot = await getDocs(baseQuery);
      return {
        items: snapshot.docs.map((docSnap) => docSnap.data()),
        lastId: snapshot.docs.at(-1)?.id
      };
    }

    const cursorDoc = await getDoc(doc(usersCollection, cursor));
    if (!cursorDoc.exists()) {
      return { items: [], lastId: undefined };
    }
    const pagedQuery = query(
      usersCollection,
      orderBy("createDate", "desc"),
      startAfter(cursorDoc),
      limit(pageSize)
    );
    const snapshot = await getDocs(pagedQuery);
    return {
      items: snapshot.docs.map((docSnap) => docSnap.data()),
      lastId: snapshot.docs.at(-1)?.id
    };
  },
  get: async (id: string) => {
    const snapshot = await getDoc(doc(usersCollection, id));
    return snapshot.exists() ? snapshot.data() : null;
  },
  upsert: async (id: string, payload: Partial<UserRecord>) => {
    await setDoc(doc(db, "users", id), payload, { merge: true });
  },
  update: async (id: string, payload: Partial<UserRecord>) => {
    await updateDoc(doc(db, "users", id), payload);
  },
  remove: async (id: string) => {
    await deleteDoc(doc(db, "users", id));
  }
};

export const userProfilesCollection = (userId: string) =>
  collection(db, "users", userId, "Profiles");
