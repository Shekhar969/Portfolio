import { COLLECTIONS, getPublishedDocs } from "../firebase/firestore";
import { bySortOrder } from "../lib/utils";

export async function getExperience() {
  const items = await getPublishedDocs(COLLECTIONS.experience);
  return items.sort(bySortOrder);
}