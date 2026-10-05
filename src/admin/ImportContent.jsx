import { useEffect, useState } from "react";
import { doc, serverTimestamp, writeBatch } from "firebase/firestore";
import Button from "../components/ui/Button";
import { db } from "../firebase/config";
import { COLLECTIONS } from "../firebase/firestore";
import { listAll } from "../services/adminService";
import { education, experience, projects } from "../data/content";
import { getFirebaseErrorMessage } from "../lib/utils";

export default function ImportContent({ onDone }) {
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      listAll(COLLECTIONS.projects),
      listAll(COLLECTIONS.experience),
      listAll(COLLECTIONS.education),
    ])
      .then((lists) => setShow(lists.every((l) => l.length === 0)))
      .catch(() => setShow(false));
  }, []);

  const runImport = async () => {
    setBusy(true);
    setError("");
    try {
      const batch = writeBatch(db);
      const stamp = {
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        published: false,
      };
      projects.forEach(({ id, ...data }) =>
        batch.set(doc(db, COLLECTIONS.projects, id), { ...data, ...stamp })
      );
      experience.forEach(({ id, ...data }, i) =>
        batch.set(doc(db, COLLECTIONS.experience, id), { ...data, sortOrder: i + 1, ...stamp })
      );
      education.forEach(({ id, ...data }, i) =>
        batch.set(doc(db, COLLECTIONS.education, id), { ...data, sortOrder: i + 1, ...stamp })
      );
      await batch.commit();
      setShow(false);
      setMessage(
        "Imported as drafts. Review each item, then press Publish to show it on the site."
      );
      onDone?.();
    } catch (err) {
      setError(getFirebaseErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  if (message) {
    return (
      <p role="status" className="mt-4 text-sm text-accent">
        {message}
      </p>
    );
  }
  if (!show) return null;

  return (
    <div className="mt-6 rounded-md border border-border bg-muted p-4">
      <p className="font-medium">Import your existing content</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Copies the projects, experience, and education from <code>content.js</code>{" "}
        into Firestore as drafts. Nothing goes public until you publish it.
      </p>
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
      <Button className="mt-3" size="sm" onClick={runImport} disabled={busy}>
        {busy ? "Importing…" : "Import content"}
      </Button>
    </div>
  );
}