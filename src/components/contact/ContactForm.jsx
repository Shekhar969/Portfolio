import { useRef, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Textarea from "../ui/Textarea";
import { submitContactMessage } from "../../services/contactService";
import { validateContact } from "../../lib/validation";
import { FORM_STATUS, LIMITS } from "../../lib/constants";

const EMPTY = { name: "", email: "", subject: "", message: "" };

export default function ContactForm() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(FORM_STATUS.idle);
  const formRef = useRef(null);

  const submitting = status === FORM_STATUS.submitting;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
    if (status === FORM_STATUS.error) setStatus(FORM_STATUS.idle);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;

    const found = validateContact(values);
    setErrors(found);

    const firstInvalid = Object.keys(found)[0];
    if (firstInvalid) {
      formRef.current?.elements[firstInvalid]?.focus();
      return;
    }

    setStatus(FORM_STATUS.submitting);
    try {
      await submitContactMessage(values);
      setValues(EMPTY);
      setStatus(FORM_STATUS.success);
    } catch {
      setStatus(FORM_STATUS.error);
    }
  };

  if (status === FORM_STATUS.success) {
    return (
      <div role="status" className="rounded-md border border-border bg-muted px-4 py-8 text-center">
        <CheckCircle2 size={24} aria-hidden="true" className="mx-auto text-accent" />
        <p className="mt-3 font-medium">Message sent successfully.</p>
        <Button
          variant="secondary"
          size="sm"
          className="mt-4"
          onClick={() => setStatus(FORM_STATUS.idle)}
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="Name"
          name="name"
          autoComplete="name"
          maxLength={LIMITS.name}
          value={values.name}
          onChange={handleChange}
          error={errors.name}
          disabled={submitting}
        />
        <Input
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          maxLength={LIMITS.email}
          value={values.email}
          onChange={handleChange}
          error={errors.email}
          disabled={submitting}
        />
      </div>
      <Input
        label="Subject"
        name="subject"
        maxLength={LIMITS.subject}
        value={values.subject}
        onChange={handleChange}
        error={errors.subject}
        disabled={submitting}
      />
      <Textarea
        label="Message"
        name="message"
        maxLength={LIMITS.message}
        value={values.message}
        onChange={handleChange}
        error={errors.message}
        disabled={submitting}
      />

      {status === FORM_STATUS.error && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          Something went wrong. Please try again.
        </p>
      )}

      <Button type="submit" disabled={submitting}>
        {submitting ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}