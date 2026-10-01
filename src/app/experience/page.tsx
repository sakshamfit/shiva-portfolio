import type { Metadata } from "next";
import { ExperienceHero } from "@/components/sections/experience/ExperienceHero";
import { ExperienceSection } from "@/components/sections/experience/ExperienceSection";
import { NextPage } from "@/components/layout/NextPage";

export const metadata: Metadata = {
  title: "Experience",
  description:
    "Drone photography and aerial cinematography in Gorakhpur, plus three years as a camera specialist in sales, service and studio work.",
};

export default function ExperiencePage() {
  return (
    <main id="main">
      <ExperienceHero />
      <ExperienceSection />
      <NextPage
        label="Projects"
        href="/projects"
        description="Four case studies: aerial film work, mapping flights, the camera and drone kit plan, and monthly site documentation."
      />
    </main>
  );
}
