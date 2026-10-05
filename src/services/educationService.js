import { COLLECTIONS, getPublishedDocs } from "../firebase/firestore";
import { bySortOrder } from "../lib/utils";

export async function getEducation() {
  const items = await getPublishedDocs(COLLECTIONS.education);
  return items.sort(bySortOrder);
}