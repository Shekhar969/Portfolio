import { useState } from "react";
import Button from "../components/ui/Button";
import { importStarterContent } from "../services/importService";
import { getFirebaseErrorMessage } from "../lib/utils";

export default function ImportContent() {
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const run = async () => {
    setBusy(true);
    setError("");
    try {
      setResult(await importStarterContent());
    } catch (err) {
      setError(getFirebaseErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="mt-10 rounded-md border border-border p-4">
      <h2 className="text-lg font-semibold tracking-tight">Import starter content</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Copies the experience, education, and projects from <code>content.js</code> into
        Firestore as <strong>drafts</strong>. Nothing becomes public until you review each
        item and publish it. Sections that already have items are skipped.
      </p>
      <Button variant="secondary" size="sm" className="mt-4" onClick={run} disabled={busy}>
        {busy ? "Importing…" : "Import from content.js"}
      </Button>
      {error && (
        <p role="alert" className="mt-3 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
      {result && (
        <ul role="status" className="mt-3 space-y-1 text-sm text-accent">
          {Object.entries(result).map(([name, text]) => (
            <li key={name}>
              {name}: {text}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}