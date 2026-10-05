import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { db } from "../firebase/config";
import { COLLECTIONS, getPublishedDocs, mapDoc } from "../firebase/firestore";
import { byDateDesc } from "../lib/utils";

export async function getPublishedProjects() {
  const items = await getPublishedDocs(COLLECTIONS.projects);
  return items.sort(byDateDesc((p) => p.createdAt));
}

export async function getFeaturedProjects(max = 6) {
  const items = await getPublishedProjects();
  return items.filter((p) => p.featured).slice(0, max);
}

export async function getProjectBySlug(slug) {
  const q = query(
    collection(db, COLLECTIONS.projects),
    where("slug", "==", slug),
    where("published", "==", true),
    limit(1)
  );
  const snapshot = await getDocs(q);
  return snapshot.empty ? null : mapDoc(snapshot.docs[0]);
}