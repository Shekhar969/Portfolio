import { COLLECTIONS } from "../firebase/firestore";
import { createItem, listAll } from "./adminService";
import { education, experience, projects } from "../data/content";

/**
 * Copies content.js into Firestore as DRAFTS. A collection that already has
 * documents is skipped, so running it twice can't create duplicates.
 */
export async function importStarterContent() {
  const sets = [
    [COLLECTIONS.experience, experience, true],
    [COLLECTIONS.education, education, true],
    [COLLECTIONS.projects, projects, false],
  ];
  const result = {};

  for (const [name, items, numbered] of sets) {
    const existing = await listAll(name);
    if (existing.length > 0) {
      result[name] = "skipped (already has items)";
      continue;
    }
    for (const [index, item] of items.entries()) {
      // eslint-disable-next-line no-unused-vars
      const { id, isPlaceholder, ...data } = item;
      await createItem(name, {
        ...data,
        ...(numbered ? { sortOrder: index + 1 } : {}),
        published: false,
      });
    }
    result[name] = `${items.length} imported`;
  }
  return result;
}