import { useEffect, useState } from "react";
import Button from "../components/ui/Button";
import ErrorState from "../components/ui/ErrorState";
import LoadingState from "../components/ui/LoadingState";
import FieldInput from "./FieldInput";
import { fromForm, toForm, validate } from "./formUtils";
import { getPublicProfile, saveProfile } from "../services/profileService";
import { getFirebaseErrorMessage } from "../lib/utils";

const FIELDS = [
  { name: "name", label: "Name", type: "text", required: true },
  { name: "role", label: "Role", type: "text", required: true },
  { name: "location", label: "Location", type: "text" },
  {
    name: "shortBio",
    label: "Short bio (home page)",
    type: "textarea",
    rows: 3,
    required: true,
  },
  {
    name: "about",
    label: "About (longer, optional)",
    type: "textarea",
    rich: true,
    rows: 8,
    help: "Use the toolbar or shortcuts (Ctrl/Cmd+B bold, I italic, K link). Click Preview to see how it will look.",
  },
  {
    name: "email",
    label: "Public email",
    type: "text",
    email: true,
    help: "Leave empty to hide the Email link.",
  },
  {
    name: "profileImages",
    label: "Profile photos",
    type: "lines",
    rows: 4,
    pathOrUrl: true,
    maxItems: 6,
    help: "One image per line, up to 6. Use a path like /images/me-1.webp (files in public/images) or an https:// link. The first photo is on top, and visitors swipe through the rest. Leave empty for none.",
  },
  {
    name: "resumeUrl",
    label: "Resume link",
    type: "text",
    pathOrUrl: true,
    help: "e.g. /resume.pdf (file in public/). Leave empty to hide.",
  },
  {
    name: "githubUrl",
    label: "GitHub link",
    type: "text",
    url: true,
    placeholder: "https://github.com/…",
  },
  {
    name: "linkedinUrl",
    label: "LinkedIn link",
    type: "text",
    url: true,
    placeholder: "https://www.linkedin.com/in/…",
  },
  {
    name: "additionalLinks",
    label: "Other links",
    type: "links",
    rows: 3,
    help: "One per line: Label | https://…   (for example X, YouTube)",
  },
];

export default function SettingsManager() {
  const [values, setValues] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [saveError, setSaveError] = useState("");

  const load = async () => {
    setLoadError(null);
    setValues(null);
    try {
      const data = await getPublicProfile();
      const source = data ?? {};
      setValues(
        toForm(FIELDS, {
          ...source,
          // Older saves stored a single `profileImage`; show it as one line.
          profileImages: Array.isArray(source.profileImages)
            ? source.profileImages
            : source.profileImage
              ? [source.profileImage]
              : [],
        })
      );
    } catch (error) {
      setLoadError(error);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const setField = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setNotice("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (saving) return;

    const found = validate(FIELDS, values);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      event.currentTarget.elements[first]?.focus();
      return;
    }

    setSaving(true);
    setSaveError("");
    try {
      // profileImage: "" clears the old single-image field.
      await saveProfile({ ...fromForm(FIELDS, values), profileImage: "" });
      setNotice("Settings saved.");
    } catch (error) {
      setSaveError(getFirebaseErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Your public details: name, bio, photos, and links.
      </p>

      <div className="mt-6">
        {loadError && (
          <ErrorState
            message={getFirebaseErrorMessage(loadError)}
            onRetry={load}
          />
        )}
        {!loadError && !values && <LoadingState />}
        {values && (
          <form
            onSubmit={handleSubmit}
            noValidate
            className="max-w-2xl space-y-6"
          >
            {FIELDS.map((field) => (
              <FieldInput
                key={field.name}
                field={field}
                value={values[field.name]}
                onChange={(next) => setField(field.name, next)}
                error={errors[field.name]}
              />
            ))}

            {saveError && (
              <p
                role="alert"
                className="text-sm text-red-600 dark:text-red-400"
              >
                {saveError}
              </p>
            )}
            {notice && (
              <p role="status" className="text-sm text-accent">
                {notice}
              </p>
            )}

            <Button type="submit" disabled={saving}>
              {saving ? "Saving…" : "Save settings"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}