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

/* ---------- Text box with a formatting toolbar ---------- */

function RichTextField({ field, value, onChange, error }) {
  const id = useId();
  const ref = useRef(null);
  const [preview, setPreview] = useState(false);
  const full = Boolean(field.rich);

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
    const shortcuts = {
      b: ACTIONS.bold,
      i: ACTIONS.italic,
      k: ACTIONS.link,
    };
    const action = shortcuts[event.key.toLowerCase()];
    if (action) {
      event.preventDefault();
      run(action);
    }
  };

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

            {full && (
              <>
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
              </>
            )}

            <Divider />
            <ToolbarButton label="Link (Ctrl/Cmd+K)" onClick={() => run(ACTIONS.link)}>
              <Link2 size={16} aria-hidden="true" />
            </ToolbarButton>
            <ToolbarButton label="Code" onClick={() => run(ACTIONS.code)}>
              <Code size={16} aria-hidden="true" />
            </ToolbarButton>
          </>
        )}

        {full && (
          <button
            type="button"
            onClick={() => setPreview((prev) => !prev)}
            aria-pressed={preview}
            className={cn(
              "ml-auto inline-flex h-8 items-center gap-1.5 rounded px-2 text-xs text-muted-foreground",
              "hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            )}
          >
            {preview ? (
              <Pencil size={14} aria-hidden="true" />
            ) : (
              <Eye size={14} aria-hidden="true" />
            )}
            {preview ? "Edit" : "Preview"}
          </button>
        )}
      </div>

      {preview ? (
        <div className="min-h-[8rem] rounded-b-md border border-border bg-card p-4">
          {value.trim() ? (
            <ArticleContent content={value} />
          ) : (
            <p className="text-sm text-muted-foreground">Nothing to preview yet.</p>
          )}
        </div>
      ) : (
        <Textarea
          id={id}
          ref={ref}
          name={field.name}
          rows={field.rows ?? (full ? 6 : 5)}
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

/* ---------- The field switcher ---------- */

export default function FieldInput({ field, value, onChange, error }) {
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

  if ((type === "textarea" && field.rich) || (type === "lines" && field.inline)) {
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