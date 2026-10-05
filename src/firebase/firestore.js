import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./config";

export const COLLECTIONS = {
  settings: "siteSettings",
  projects: "projects",
  posts: "blogPosts",
  experience: "experience",
  education: "education",
  messages: "contactMessages",
};

/** Convert a snapshot into a plain object with its id. */
export function mapDoc(snap) {
  return { id: snap.id, ...snap.data() };
}

/**
 * Read all published docs of a collection. The where("published") filter is
 * required: it's what lets the security rules allow the query for visitors.
 * Sorting happens in the browser, which avoids needing composite indexes.
 */
export async function getPublishedDocs(name, ...extraFilters) {
  const q = query(
    collection(db, name),
    where("published", "==", true),
    ...extraFilters
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(mapDoc);
}