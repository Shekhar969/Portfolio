import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { db } from "../firebase/config";
import { COLLECTIONS, getPublishedDocs, mapDoc } from "../firebase/firestore";
import { byDateDesc } from "../lib/utils";

export async function getPublishedPosts() {
  const items = await getPublishedDocs(COLLECTIONS.posts);
  return items.sort(byDateDesc((p) => p.publishedAt));
}

export async function getPostBySlug(slug) {
  const q = query(
    collection(db, COLLECTIONS.posts),
    where("slug", "==", slug),
    where("published", "==", true),
    limit(1)
  );
  const snapshot = await getDocs(q);
  return snapshot.empty ? null : mapDoc(snapshot.docs[0]);
}