import Hero from "../components/home/Hero";
import ExperienceSwitcher from "../components/home/ExperienceSwitcher";
import FeaturedProjects from "../components/home/FeaturedProjects";
import RecentPosts from "../components/home/RecentPosts";
import {
  sampleEducation,
  sampleExperience,
  sampleProjects,
  samplePosts,
} from "../data/sampleData";

export default function Home() {
  // Phase 9: replace the sample data with the service layer / hooks.
  return (
    <>
      <Hero />
      <ExperienceSwitcher experience={sampleExperience} education={sampleEducation} />
      <FeaturedProjects projects={sampleProjects} />
      <RecentPosts posts={samplePosts} />
    </>
  );
}