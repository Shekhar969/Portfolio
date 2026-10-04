import { useState } from "react";
import Container from "../components/layout/Container";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import Tabs, { TabPanel } from "../components/ui/Tabs";
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";
import EmptyState from "../components/ui/EmptyState";

export default function Home() {
  const [tab, setTab] = useState("work");

  return (
    <Container className="space-y-10 py-16">
      <div className="flex flex-wrap gap-3">
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link" href="https://github.com/Shekhar969">GitHub</Button>
        <Button variant="secondary" to="/projects">Projects</Button>
      </div>

      <div className="flex gap-2">
        <Badge>React</Badge>
        <Badge variant="accent">Featured</Badge>
        <Badge variant="outline">2026</Badge>
      </div>

      <Tabs
        tabs={[
          { id: "work", label: "Work" },
          { id: "education", label: "Education" },
        ]}
        value={tab}
        onChange={setTab}
        label="Experience and education"
      >
        <TabPanel id="work">Work content</TabPanel>
        <TabPanel id="education">Education content</TabPanel>
      </Tabs>

      <LoadingState />
      <ErrorState onRetry={() => alert("retry")} />
      <EmptyState title="No projects found." actionLabel="Clear filters" onAction={() => alert("clear")} />
    </Container>
  );
}