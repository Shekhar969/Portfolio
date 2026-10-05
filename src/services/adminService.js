import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { mapDoc } from "../firebase/firestore";

/** Every document in a collection, including drafts (admin only, per the rules). */
export async function listAll(name) {
  const snapshot = await getDocs(collection(db, name));
  return snapshot.docs.map(mapDoc);
}

export async function createItem(name, data) {
  const ref = await addDoc(collection(db, name), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateItem(name, id, data) {
  await updateDoc(doc(db, name, id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteItem(name, id) {
  await deleteDoc(doc(db, name, id));
}