import { useAsyncData } from "./useAsyncData";
import { getExperience } from "../services/experienceService";
import { getEducation } from "../services/educationService";

export const useExperience = () => useAsyncData(getExperience);
export const useEducation = () => useAsyncData(getEducation);