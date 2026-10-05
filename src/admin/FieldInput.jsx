import { useId } from "react";
import Input from "../components/ui/Input";
import Textarea from "../components/ui/Textarea";

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

  if (type === "textarea" || type === "lines" || type === "gallery") {
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