import { LIMITS } from "./constants";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContact({ name = "", email = "", subject = "", message = "" }) {
  const errors = {};

  const n = name.trim();
  if (!n) errors.name = "Name is required.";
  else if (n.length > LIMITS.name) errors.name = `Name must be ${LIMITS.name} characters or fewer.`;

  const e = email.trim();
  if (!e) errors.email = "Email is required.";
  else if (e.length > LIMITS.email || !EMAIL_PATTERN.test(e))
    errors.email = "Enter a valid email address.";

  const s = subject.trim();
  if (!s) errors.subject = "Subject is required.";
  else if (s.length > LIMITS.subject)
    errors.subject = `Subject must be ${LIMITS.subject} characters or fewer.`;

  const m = message.trim();
  if (!m) errors.message = "Message is required.";
  else if (m.length > LIMITS.message)
    errors.message = `Message must be ${LIMITS.message} characters or fewer.`;

  return errors;
}