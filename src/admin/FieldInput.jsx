import { useId, useRef, useState } from "react";
import {
  Bold,
  Code,
  Eye,
  Italic,
  Link2,
  List,
  ListOrdered,
  Pencil,
  Quote,
  Strikethrough,
  UploadCloud,
  X,
} from "lucide-react";
import Input from "../components/ui/Input";
import Textarea from "../components/ui/Textarea";
import ArticleContent from "../components/blog/ArticleContent";
import { cn } from "../lib/utils";

const selectClass =
  "h-10 w-full rounded-md border border-border bg-card px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

function Help({ text }) {
  return text ? (
    <p className="mt-1 text-xs text-muted-foreground">{text}</p>
  ) : null;
}

function ErrorText({ text }) {
  return text ? (
    <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{text}</p>
  ) : null;
}

/* ---------- Markdown editing helpers ---------- */

const BULLET = /^[-*]\s+/;
const NUMBER = /^\d+[.)]\s+/;
const QUOTE = /^>\s?/;
const ANY_MARKER = /^([-*]|\d+[.)])\s+/;

function wrapSelection(value, start, end, before, after, placeholder) {
  const selected = value.slice(start, end) || placeholder;
  return {
    text: value.slice(0, start) + before + selected + after + value.slice(end),
    from: start + before.length,
    to: start + before.length + selected.length,
  };
}

function toggleLinePrefix(value, start, end, makePrefix, matcher, strip) {
  const lineStart = start === 0 ? 0 : value.lastIndexOf("\n", start - 1) + 1;
  let lineEnd = value.indexOf("\n", end);
  if (lineEnd === -1) lineEnd = value.length;

  const lines = value.slice(lineStart, lineEnd).split("\n");
  const allPrefixed = lines.every((line) => matcher.test(line));
  const next = lines
    .map((line, index) =>
      allPrefixed
        ? line.replace(matcher, "")
        : makePrefix(index) + line.replace(strip, "")
    )
    .join("\n");

  return {
    text: value.slice(0, lineStart) + next + value.slice(lineEnd),
    from: lineStart,
    to: lineStart + next.length,
  };
}

const ACTIONS = {
  bold: (v, s, e) => wrapSelection(v, s, e, "**", "**", "bold text"),
  italic: (v, s, e) => wrapSelection(v, s, e, "*", "*", "italic text"),
  strike: (v, s, e) => wrapSelection(v, s, e, "~~", "~~", "text"),
  code: (v, s, e) =>
    v.slice(s, e).includes("\n")
      ? wrapSelection(v, s, e, "```\n", "\n```", "code")
      : wrapSelection(v, s, e, "`", "`", "code"),
  link: (v, s, e) => {
    const selected = v.slice(s, e) || "link text";
    const urlStart = s + selected.length + 3; // "[" + text + "]("
    return {
      text: v.slice(0, s) + `[${selected}](https://)` + v.slice(e),
      from: urlStart,
      to: urlStart + "https://".length,
    };
  },
  bullets: (v, s, e) => toggleLinePrefix(v, s, e, () => "- ", BULLET, ANY_MARKER),
  numbers: (v, s, e) =>
    toggleLinePrefix(v, s, e, (i) => `${i + 1}. `, NUMBER, ANY_MARKER),
  quote: (v, s, e) => toggleLinePrefix(v, s, e, () => "> ", QUOTE, QUOTE),
};

/** One-item-per-line boxes preview as the real list visitors will see. */
function linesToMarkdown(text) {
  const lines = text.split("\n").map((line) => line.trim()).filter(Boolean);
  const numbered = lines.length > 0 && lines.every((line) => NUMBER.test(line));
  return lines
    .map((line) =>
      numbered ? line : ANY_MARKER.test(line) ? line.replace(ANY_MARKER, "- ") : `- ${line}`
    )
    .join("\n");
}

const buttonClass =
  "inline-flex h-8 w-8 items-center justify-center rounded text-muted-foreground transition-colors duration-150 " +
  "hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

function ToolbarButton({ label, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={buttonClass}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span aria-hidden="true" className="mx-1 h-5 w-px bg-border" />;
}

/* ---------- Text box with the full formatting toolbar ---------- */

function RichTextField({ field, value, onChange, error }) {
  const id = useId();
  const ref = useRef(null);
  const [preview, setPreview] = useState(false);

  const run = (action) => {
    const el = ref.current;
    if (!el) return;
    const result = action(value, el.selectionStart, el.selectionEnd);
    onChange(result.text);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(result.from, result.to);
    });
  };

  const onKeyDown = (event) => {
    if (!(event.metaKey || event.ctrlKey)) return;
    const shortcuts = { b: ACTIONS.bold, i: ACTIONS.italic, k: ACTIONS.link };
    const action = shortcuts[event.key.toLowerCase()];
    if (action) {
      event.preventDefault();
      run(action);
    }
  };

  const previewSource = field.type === "lines" ? linesToMarkdown(value) : value;

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {field.label}
      </label>

      <div className="flex flex-wrap items-center gap-0.5 rounded-t-md border border-b-0 border-border bg-muted px-1.5 py-1">
        {!preview && (
          <>
            <ToolbarButton label="Bold (Ctrl/Cmd+B)" onClick={() => run(ACTIONS.bold)}>
              <Bold size={16} aria-hidden="true" />
            </ToolbarButton>
            <ToolbarButton label="Italic (Ctrl/Cmd+I)" onClick={() => run(ACTIONS.italic)}>
              <Italic size={16} aria-hidden="true" />
            </ToolbarButton>
            <ToolbarButton label="Strikethrough" onClick={() => run(ACTIONS.strike)}>
              <Strikethrough size={16} aria-hidden="true" />
            </ToolbarButton>
            <Divider />
            <ToolbarButton label="Bullet list" onClick={() => run(ACTIONS.bullets)}>
              <List size={16} aria-hidden="true" />
            </ToolbarButton>
            <ToolbarButton label="Numbered list" onClick={() => run(ACTIONS.numbers)}>
              <ListOrdered size={16} aria-hidden="true" />
            </ToolbarButton>
            <ToolbarButton label="Quote" onClick={() => run(ACTIONS.quote)}>
              <Quote size={16} aria-hidden="true" />
            </ToolbarButton>
            <Divider />
            <ToolbarButton label="Link (Ctrl/Cmd+K)" onClick={() => run(ACTIONS.link)}>
              <Link2 size={16} aria-hidden="true" />
            </ToolbarButton>
            <ToolbarButton label="Code" onClick={() => run(ACTIONS.code)}>
              <Code size={16} aria-hidden="true" />
            </ToolbarButton>
          </>
        )}

        <button
          type="button"
          onClick={() => setPreview((prev) => !prev)}
          aria-pressed={preview}
          className="ml-auto inline-flex h-8 items-center gap-1.5 rounded px-2 text-xs text-muted-foreground hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          {preview ? (
            <Pencil size={14} aria-hidden="true" />
          ) : (
            <Eye size={14} aria-hidden="true" />
          )}
          {preview ? "Edit" : "Preview"}
        </button>
      </div>

      {preview ? (
        <div className="min-h-[8rem] rounded-b-md border border-border bg-card p-4">
          {previewSource.trim() ? (
            <ArticleContent content={previewSource} />
          ) : (
            <p className="text-sm text-muted-foreground">Nothing to preview yet.</p>
          )}
        </div>
      ) : (
        <Textarea
          id={id}
          ref={ref}
          name={field.name}
          rows={field.rows ?? 6}
          value={value}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          error={error}
        />
      )}

      <Help text={field.help} />
    </div>
  );
}

/* ---------- Drag-and-drop upload (works with `yarn dev` only) ---------- */

const FOLDER_OPTIONS = [
  { value: "images", label: "public/images" },
  { value: "images/logos", label: "public/images/logos" },
  { value: "videos", label: "public/videos" },
  { value: "files", label: "public/files" },
  { value: "root", label: "public (top level)" },
  { value: "custom", label: "Custom folder…" },
];

const formatSize = (bytes) =>
  bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / 1024 / 1024).toFixed(1)} MB`;

/** PNG/JPG -> smaller WebP (max 1600px wide). Falls back to the original file. */
async function prepareFile(file, convert) {
  if (!convert || !/^image\/(png|jpeg)$/.test(file.type)) {
    return { blob: file, name: file.name };
  }
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, 1600 / bitmap.width);
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close?.();
    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/webp", 0.85)
    );
    if (blob && blob.type === "image/webp") {
      return { blob, name: file.name.replace(/\.[^.]+$/, "") + ".webp" };
    }
  } catch {
    // Fall back to the original file below.
  }
  return { blob: file, name: file.name };
}

function UploadZone({ field, value, onChange }) {
  const config = field.upload;
  const id = useId();
  const inputRef = useRef(null);
  const [pending, setPending] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [folder, setFolder] = useState(config.folder || "images");
  const [custom, setCustom] = useState("");
  const [convert, setConvert] = useState(true);
  const [replace, setReplace] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const single = field.type === "text";

  if (!import.meta.env.DEV) {
    return (
      <p className="mt-2 text-xs text-muted-foreground">
        Uploads work when you run <code>yarn dev</code> on your computer: they
        save into the <code>public</code> folder, which you then commit and push.
      </p>
    );
  }

  const folderPath =
    folder === "root"
      ? ""
      : folder === "custom"
        ? custom.trim().replace(/^\/+|\/+$/g, "")
        : folder;
  const locationLabel = `public${folderPath ? `/${folderPath}` : ""}`;

  const stage = (fileList) => {
    const files = Array.from(fileList || []);
    if (!files.length) return;
    setError("");
    setMessage("");
    setPending(single ? files.slice(0, 1) : files);
  };

  const apply = (items) => {
    if (single) {
      onChange(items[0].path);
      return;
    }
    const lines = items.map((item) =>
      field.type === "gallery" ? `${item.path} | ${item.label}` : item.path
    );
    onChange([value.trim(), ...lines].filter(Boolean).join("\n"));
  };

  const save = async () => {
    setBusy(true);
    setError("");
    setMessage("");
    const saved = [];
    try {
      for (const file of pending) {
        const { blob, name } = await prepareFile(file, convert);
        const query = new URLSearchParams({
          folder: folderPath,
          name,
          ...(replace ? { overwrite: "1" } : {}),
        });
        const response = await fetch(`/__dev/upload?${query}`, {
          method: "POST",
          headers: { "Content-Type": "application/octet-stream" },
          body: blob,
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.error || `Could not save ${file.name}.`);
        saved.push({
          path: data.path,
          label: data.path
            .split("/")
            .pop()
            .replace(/\.[^.]+$/, "")
            .replace(/[-_]+/g, " "),
        });
      }
      apply(saved);
      setPending([]);
      setMessage(
        `Saved ${saved.length} file${saved.length > 1 ? "s" : ""} to ${locationLabel} and added the path.`
      );
    } catch (err) {
      if (saved.length) apply(saved);
      setError(err.message || "Upload failed.");
    } finally {
      setBusy(false);
    }
  };

  const hasConvertible = pending.some((f) => /^image\/(png|jpeg)$/.test(f.type));
  const bigVideo = pending.some(
    (f) => f.type.startsWith("video/") && f.size > 2 * 1024 * 1024
  );

  return (
    <div className="mt-3">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          stage(e.dataTransfer.files);
        }}
        className={cn(
          "rounded-2xl border border-dashed p-5 text-center transition-colors duration-150",
          dragging ? "border-accent bg-muted" : "border-border"
        )}
      >
        <UploadCloud className="mx-auto h-6 w-6 text-muted-foreground" aria-hidden="true" />
        <p className="mt-2 font-medium">Drop files here</p>
        {config.hint && (
          <p className="mt-1 text-sm text-muted-foreground">{config.hint}</p>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={config.accept}
          multiple={!single}
          tabIndex={-1}
          className="sr-only"
          onChange={(e) => {
            stage(e.target.files);
            e.target.value = "";
          }}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-3 rounded-full border border-border px-4 py-1.5 text-sm font-medium transition-colors duration-150 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          Browse files
        </button>
      </div>

      {pending.length > 0 && (
        <div className="mt-3 space-y-3 rounded-md border border-border p-4 text-left">
          <ul className="space-y-1 text-sm">
            {pending.map((file, index) => (
              <li
                key={`${file.name}-${index}`}
                className="flex items-center justify-between gap-3"
              >
                <span className="truncate">{file.name}</span>
                <span className="flex shrink-0 items-center gap-2 font-mono text-xs text-muted-foreground">
                  {formatSize(file.size)}
                  <button
                    type="button"
                    aria-label={`Remove ${file.name}`}
                    onClick={() =>
                      setPending((prev) => prev.filter((_, i) => i !== index))
                    }
                    className="rounded p-0.5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    <X size={14} aria-hidden="true" />
                  </button>
                </span>
              </li>
            ))}
          </ul>

          <div>
            <label htmlFor={`${id}-folder`} className="mb-1.5 block text-sm font-medium">
              Save to
            </label>
            <select
              id={`${id}-folder`}
              value={folder}
              onChange={(e) => setFolder(e.target.value)}
              className={selectClass}
            >
              {FOLDER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {folder === "custom" && (
              <input
                type="text"
                aria-label="Custom folder inside public"
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
                placeholder="e.g. images/argus"
                className="mt-2 h-10 w-full rounded-md border border-border bg-card px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              />
            )}
          </div>

          {hasConvertible && (
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={convert}
                onChange={(e) => setConvert(e.target.checked)}
                className="h-4 w-4 rounded border-border accent-accent"
              />
              Convert PNG/JPG to smaller WebP
            </label>
          )}
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={replace}
              onChange={(e) => setReplace(e.target.checked)}
              className="h-4 w-4 rounded border-border accent-accent"
            />
            Replace a file with the same name
          </label>

          {bigVideo && (
            <p className="text-xs text-muted-foreground">
              This video is over 2 MB. Short silent loops under 2 MB load faster on hover.
            </p>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={save}
              disabled={busy}
              className="inline-flex h-9 items-center rounded-md bg-accent px-4 text-sm font-medium text-accent-foreground transition-opacity duration-150 hover:opacity-90 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {busy
                ? "Saving…"
                : `Save ${pending.length} file${pending.length > 1 ? "s" : ""} to ${locationLabel}`}
            </button>
            <button
              type="button"
              onClick={() => setPending([])}
              disabled={busy}
              className="inline-flex h-9 items-center rounded-md border border-border px-4 text-sm hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {message && (
        <p role="status" className="mt-2 text-sm text-accent">
          {message}
        </p>
      )}
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

/* ---------- The field switcher ---------- */

function FieldControl({ field, value, onChange, error }) {
  const id = useId();
  const { type, name, label, help, rows, options, placeholder } = field;

  if (type === "checkbox") {
    return (
      <div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name={name}
            checked={Boolean(value)}
            onChange={(e) => onChange(e.target.checked)}
            className="h-4 w-4 rounded border-border accent-accent"
          />
          {label}
        </label>
        <Help text={help} />
      </div>
    );
  }

  if (type === "multicheck") {
    return (
      <fieldset>
        <legend className="mb-1.5 text-sm font-medium">{label}</legend>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {options.map((option) => (
            <label key={option} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={value.includes(option)}
                onChange={(e) =>
                  onChange(
                    e.target.checked
                      ? [...value, option]
                      : value.filter((v) => v !== option)
                  )
                }
                className="h-4 w-4 rounded border-border accent-accent"
              />
              {option}
            </label>
          ))}
        </div>
        <ErrorText text={error} />
      </fieldset>
    );
  }

  if (type === "select") {
    return (
      <div>
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
          {label}
        </label>
        <select
          id={id}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={selectClass}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <Help text={help} />
      </div>
    );
  }

  if (type === "group") {
    return (
      <fieldset className="space-y-5 rounded-md border border-border p-4">
        <legend className="px-2 text-sm font-semibold">{label}</legend>
        {field.fields.map((sub) => (
          <FieldInput
            key={sub.name}
            field={sub}
            value={value[sub.name]}
            onChange={(next) => onChange({ ...value, [sub.name]: next })}
          />
        ))}
      </fieldset>
    );
  }

  if ((type === "textarea" || type === "lines") && (field.rich || field.inline)) {
    return (
      <RichTextField field={field} value={value} onChange={onChange} error={error} />
    );
  }

  if (type === "textarea" || type === "lines" || type === "gallery" || type === "links") {
    return (
      <div>
        <Textarea
          label={label}
          name={name}
          rows={rows ?? (type === "textarea" ? 4 : 5)}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          error={error}
        />
        <Help text={help} />
      </div>
    );
  }

  return (
    <div>
      <Input
        label={label}
        name={name}
        type={type === "number" ? "number" : "text"}
        value={value}
        placeholder={placeholder}
        autoComplete="off"
        onChange={(e) => onChange(e.target.value)}
        error={error}
      />
      <Help text={help} />
    </div>
  );
}

export default function FieldInput(props) {
  const { field, value, onChange } = props;
  return (
    <div>
      <FieldControl {...props} />
      {field.upload && (
        <UploadZone field={field} value={value} onChange={onChange} />
      )}
    </div>
  );
}