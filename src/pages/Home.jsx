import Hero from "../components/home/Hero";
import ExperienceSwitcher from "../components/home/ExperienceSwitcher";
import FeaturedProjects from "../components/home/FeaturedProjects";
import RecentPosts from "../components/home/RecentPosts";
import { education, experience, posts, projects } from "../data/content";
import { FEATURES } from "../lib/constants";

export default function Home() {
  return (
    <>
      <Hero />
      <ExperienceSwitcher experience={experience} education={education} />
      <FeaturedProjects projects={projects} />
      {FEATURES.blog && <RecentPosts posts={posts} />}
    </>
  );
}