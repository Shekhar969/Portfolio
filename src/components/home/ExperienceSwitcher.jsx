import { useState } from "react";
import Container from "../layout/Container";
import Tabs, { TabPanel } from "../ui/Tabs";
import EmptyState from "../ui/EmptyState";
import Experience from "./Experience";
import Education from "./Education";

const TABS = [
  { id: "work", label: "Work" },
  { id: "education", label: "Education" },
];

export default function ExperienceSwitcher({ experience = [], education = [] }) {
  const [tab, setTab] = useState("work");

  return (
    <section aria-label="Work and education" className="py-8 sm:py-10">
      <Container>
        <Tabs tabs={TABS} value={tab} onChange={setTab} label="Work and education">
          <TabPanel id="work">
            {experience.length ? (
              <Experience items={experience} />
            ) : (
              <EmptyState title="No experience added yet." />
            )}
          </TabPanel>
          <TabPanel id="education">
            {education.length ? (
              <Education items={education} />
            ) : (
              <EmptyState title="No education added yet." />
            )}
          </TabPanel>
        </Tabs>
      </Container>
    </section>
  );
}