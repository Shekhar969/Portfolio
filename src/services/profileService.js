import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { COLLECTIONS } from "../firebase/firestore";

export async function getPublicProfile() {
  const snap = await getDoc(doc(db, COLLECTIONS.settings, "public"));
  return snap.exists() ? snap.data() : null;
}