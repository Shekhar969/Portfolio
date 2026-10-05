import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { COLLECTIONS } from "../firebase/firestore";

const ref = () => doc(db, COLLECTIONS.settings, "public");

export async function getPublicProfile() {
  const snap = await getDoc(ref());
  return snap.exists() ? snap.data() : null;
}

export async function saveProfile(data) {
  await setDoc(ref(), { ...data, updatedAt: serverTimestamp() }, { merge: true });
}