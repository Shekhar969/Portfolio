import { useAsyncData } from "./useAsyncData";
import { getPublishedPosts } from "../services/blogService";

export const usePosts = () => useAsyncData(getPublishedPosts);