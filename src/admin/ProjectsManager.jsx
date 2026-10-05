import ResourceManager from "./ResourceManager";
import { RESOURCES } from "./resources";

export default function ProjectsManager() {
  return <ResourceManager resource={RESOURCES.projects} />;
}