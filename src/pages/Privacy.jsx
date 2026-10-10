import Container from "../components/layout/Container";
import { SITE } from "../lib/constants";

function Section({ title, children }) {
  return (
    <section className="mt-10">
      <h2 className="mb-3 text-xl font-semibold tracking-tight">{title}</h2>
      <div className="space-y-3 leading-relaxed text-muted-foreground">{children}</div>
    </section>
  );
}

export default function Privacy() {
  return (
    <Container  className="py-16">
      <h1 className="text-4xl font-semibold tracking-tight">Privacy</h1>
      <p className="mt-3 text-muted-foreground">
        This page explains what this website does with information. It is written to
        match how the site currently works.
      </p>

      <Section title="Contact form">
        <p>
          If you use the contact form, the name, email address, subject, and message you
          enter are sent to and stored in Google Firebase (Cloud Firestore) so that{" "}
          {SITE.name} can read and reply to them. Only the site owner can access
          submitted messages. They are not shown publicly.
        </p>
      </Section>

      <Section title="Data retention">
        <p>
          Messages are kept until the site owner deletes them. To request deletion of a
          message you sent, contact {SITE.email}.
        </p>
      </Section>

      <Section title="Theme preference">
        <p>
          Your light, dark, or system theme choice is saved in your browser's local
          storage on your own device. It is never sent to a server.
        </p>
      </Section>

      <Section title="Cookies and analytics">
        <p>
          This site does not currently use advertising cookies or analytics. If that
          changes, this page will be updated.
        </p>
      </Section>

      <Section title="Third-party services">
        <p>
          The site is built on Google Firebase, which provides the database, file
          storage, and hosting. Firebase processes data under Google's own terms and
          privacy policy. Links to external sites (such as GitHub or LinkedIn) are
          governed by those sites' policies.
        </p>
      </Section>

      <Section title="Contact">
        <p>Questions about this page can be sent to {SITE.email}.</p>
      </Section>
    </Container>
  );
}