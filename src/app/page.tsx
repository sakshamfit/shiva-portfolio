import { AboutSection } from "@/components/sections/about/AboutSection";
import { WhyChooseMe } from "@/components/sections/about/WhyChooseMe";
import { NextPage } from "@/components/layout/NextPage";

/**
 * The profile opens on the About section: the portrait stage, what the work produces and
 * why to book it. There is no separate landing screen — the site starts with Shiva.
 */
export default function HomePage() {
  return (
    <main id="main">
      <AboutSection />
      <WhyChooseMe />
      <NextPage
        label="Experience"
        href="/experience"
        description="How the work is run, from Gorakhpur: the flight pipeline, camera craft and the years spent behind the counter."
      />
    </main>
  );
}
