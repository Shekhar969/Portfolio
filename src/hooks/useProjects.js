import { useAsyncData } from "./useAsyncData";
import {
  getFeaturedProjects,
  getProjectBySlug,
  getPublishedProjects,
} from "../services/projectService";

export const useProjects = () => useAsyncData(getPublishedProjects);
export const useFeaturedProjects = () => useAsyncData(getFeaturedProjects);
export const useProject = (slug) =>
  useAsyncData(() => getProjectBySlug(slug), [slug]);