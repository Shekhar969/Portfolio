import { Timeline, groupConsecutive } from "./Experience";

export default function Education({ items }) {
  return (
    <Timeline
      groups={groupConsecutive(items, "institution")}
      subtitleOf={(item) => item.qualification}
    />
  );
}