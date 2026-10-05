import { Download, ExternalLink } from "lucide-react";
import Container from "../components/layout/Container";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import { RESUME_URL } from "../lib/constants";

export default function Resume() {
  return (
    <Container className="py-16">
      <h1 className="text-4xl font-semibold tracking-tight">Resume</h1>

      {RESUME_URL ? (
        <>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button variant="secondary" href={RESUME_URL}>
              <ExternalLink size={14} aria-hidden="true" /> View resume
            </Button>
            <Button href={RESUME_URL} download>
              <Download size={14} aria-hidden="true" /> Download
            </Button>
          </div>
          <iframe
            src={RESUME_URL}
            title="Resume"
            className="mt-8 hidden h-[80vh] w-full rounded-md border border-border md:block"
          />
        </>
      ) : (
        <EmptyState
          title="Resume not available yet."
          message="Check back soon."
          className="text-left"
        />
      )}
    </Container>
  );
}