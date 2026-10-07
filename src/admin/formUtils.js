import { slugify } from "../lib/utils";

const URL_PATTERN = /^https?:\/\/\S+$/i;
const IMAGE_PATTERN = /^(\/|https?:\/\/)\S+$/i;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const splitLines = (text) =>
  text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

const splitTags = (text) =>
  text
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

/** Stored data -> values the form inputs can show. */
export function toForm(fields, data = {}) {
  const out = {};
  for (const field of fields) {
    const value = data?.[field.name];
    switch (field.type) {
      case "checkbox":
        out[field.name] = Boolean(value);
        break;
      case "multicheck":
        out[field.name] = Array.isArray(value) ? value : [];
        break;
      case "lines":
        out[field.name] = Array.isArray(value) ? value.join("\n") : "";
        break;
      case "tags":
        out[field.name] = Array.isArray(value) ? value.join(", ") : "";
        break;
      case "gallery":
        out[field.name] = Array.isArray(value)
          ? value
              .map((img) => (img.alt ? `${img.url} | ${img.alt}` : img.url))
              .join("\n")
          : "";
        break;
      case "links":
        out[field.name] = Array.isArray(value)
          ? value.map((l) => `${l.label} | ${l.url}`).join("\n")
          : "";
        break;
      case "group":
        out[field.name] = toForm(field.fields, value || {});
        break;
      case "number":
        out[field.name] =
          value === undefined || value === null ? "" : String(value);
        break;
      default:
        out[field.name] = value ?? "";
    }
  }
  return out;
}

function isEmptyGroup(group) {
  return Object.values(group).every((v) =>
    Array.isArray(v) ? v.length === 0 : !v
  );
}

/** Form values -> clean data to store (no undefined values). */
export function fromForm(fields, values) {
  const out = {};
  for (const field of fields) {
    const value = values[field.name];
    switch (field.type) {
      case "checkbox":
        out[field.name] = Boolean(value);
        break;
      case "multicheck":
        out[field.name] = value;
        break;
      case "lines":
        out[field.name] = splitLines(value);
        break;
      case "tags":
        out[field.name] = splitTags(value);
        break;
      case "gallery":
        out[field.name] = splitLines(value).map((line) => {
          const [url, ...rest] = line.split("|");
          return { url: url.trim(), alt: rest.join("|").trim() };
        });
        break;
      case "links":
        out[field.name] = splitLines(value).map((line) => {
          const [label, ...rest] = line.split("|");
          return { label: label.trim(), url: rest.join("|").trim() };
        });
        break;
      case "number":
        out[field.name] = value === "" ? 0 : Number(value);
        break;
      case "group": {
        const group = fromForm(field.fields, value);
        out[field.name] = isEmptyGroup(group) ? null : group;
        break;
      }
      default:
        out[field.name] = String(value).trim();
    }
  }
  return out;
}

/** Returns { fieldName: "message" } for every invalid top-level field. */
export function validate(fields, values, { items = [], currentId = null } = {}) {
  const errors = {};
  for (const field of fields) {
    if (field.type === "group") continue;

    const value = values[field.name];
    const empty =
      typeof value === "string"
        ? !value.trim()
        : Array.isArray(value)
          ? value.length === 0
          : false;

    if (field.required && empty) {
      errors[field.name] = `${field.label} is required.`;
      continue;
    }
    if (empty) continue;

    if (field.url && !URL_PATTERN.test(value.trim())) {
      errors[field.name] = "Enter a full link starting with https://";
    }

    if (field.type === "number" && !Number.isFinite(Number(value))) {
      errors[field.name] = "Enter a number.";
    }

    if (field.type === "gallery") {
      const bad = splitLines(value).some(
        (line) => !IMAGE_PATTERN.test(line.split("|")[0].trim())
      );
      if (bad) {
        errors[field.name] =
          "Each line must start with an image path (/images/…) or an https:// link.";
      }
    }

    if (field.email && !EMAIL_PATTERN.test(value.trim())) {
      errors[field.name] = "Enter a valid email address.";
    }

    if (field.pathOrUrl) {
      const entries = field.type === "lines" ? splitLines(value) : [value.trim()];
      if (entries.some((entry) => !IMAGE_PATTERN.test(entry))) {
        errors[field.name] =
          field.type === "lines"
            ? "Each line must start with / or https://"
            : "Enter a path starting with / or a full https:// link.";
      }
    }
    if (
      field.maxItems &&
      field.type === "lines" &&
      splitLines(value).length > field.maxItems
    ) {
      errors[field.name] = `Add at most ${field.maxItems} items.`;
    }

    if (field.type === "links") {
      const bad = splitLines(value).some((line) => {
        const [label, ...rest] = line.split("|");
        return !label.trim() || !URL_PATTERN.test(rest.join("|").trim());
      });
      if (bad) {
        errors[field.name] = "Each line must look like: Label | https://…";
      }
    }

    if (field.slug) {
      const slug = value.trim();
      if (slug !== slugify(slug)) {
        errors[field.name] = "Use lowercase letters, numbers, and hyphens only.";
      } else if (
        items.some((i) => i.id !== currentId && i[field.name] === slug)
      ) {
        errors[field.name] = "Another item already uses this slug.";
      }
    }
  }
  return errors;
}