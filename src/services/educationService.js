import { COLLECTIONS, getPublishedDocs } from "../firebase/firestore";
import { bySortOrder } from "../lib/utils";

export async function getEducation() {
  return (await getPublishedDocs(COLLECTIONS.education)).sort(bySortOrder);
}