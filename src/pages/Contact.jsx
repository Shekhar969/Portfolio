import Container from "../components/layout/Container";
import ContactForm from "../components/contact/ContactForm";
import { SOCIAL_LINKS } from "../lib/constants";

export default function Contact() {
  const links = SOCIAL_LINKS.filter((item) => item.href);

  return (
    <Container className="py-16">
      <h1 className="text-4xl font-semibold tracking-tight">Get in touch.</h1>
      <p className="mt-3 text-muted-foreground">
        Have a question, an opportunity, or an idea to discuss? Send a message below
        {links.length > 0 ? " or reach out directly." : "."}
      </p>

      {links.length > 0 && (
        <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
          {links.map((item) => (
            <li key={item.id}>
              <a
                href={item.href}
                {...(item.href.startsWith("mailto:")
                  ? {}
                  : { target: "_blank", rel: "noopener noreferrer" })}
                className="rounded text-sm text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-10">
        <ContactForm />
      </div>
    </Container>
  );
}