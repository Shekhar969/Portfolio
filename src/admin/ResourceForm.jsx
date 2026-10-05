import { useState } from "react";
import Button from "../components/ui/Button";
import FieldInput from "./FieldInput";
import { fromForm, toForm, validate } from "./formUtils";
import { slugify } from "../lib/utils";

export default function ResourceForm({
  resource,
  item,
  items,
  saving,
  error,
  onSubmit,
  onCancel,
}) {
  const { fields, defaults, slugFrom } = resource;
  const [values, setValues] = useState(() =>
    toForm(fields, item ?? defaults(items))
  );
  const [errors, setErrors] = useState({});
  const [slugTouched, setSlugTouched] = useState(Boolean(item));

  const setField = (name, value) => {
    setValues((prev) => {
      const next = { ...prev, [name]: value };
      if (slugFrom && name === slugFrom && !slugTouched) {
        next.slug = slugify(value);
      }
      return next;
    });
    if (name === "slug") setSlugTouched(true);
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (saving) return;

    const found = validate(fields, values, {
      items,
      currentId: item?.id ?? null,
    });
    setErrors(found);

    const first = Object.keys(found)[0];
    if (first) {
      event.currentTarget.elements[first]?.focus();
      return;
    }
    onSubmit(fromForm(fields, values));
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-2xl space-y-6">
      {fields.map((field) => (
        <FieldInput
          key={field.name}
          field={field}
          value={values[field.name]}
          onChange={(next) => setField(field.name, next)}
          error={errors[field.name]}
        />
      ))}

      {error && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </Button>
        <Button variant="secondary" onClick={onCancel} disabled={saving}>
          Cancel
        </Button>
      </div>
    </form>
  );
}