import { COLLECTIONS, getPublishedDocs } from "../firebase/firestore";
import { bySortOrder } from "../lib/utils";

export async function getExperience() {
  return (await getPublishedDocs(COLLECTIONS.experience)).sort(bySortOrder);
}