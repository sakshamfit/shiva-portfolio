import type { Metadata } from "next";
import { AboutSection } from "@/components/sections/about/AboutSection";
import { WhyChooseMe } from "@/components/sections/about/WhyChooseMe";
import { NextPage } from "@/components/layout/NextPage";

export const metadata: Metadata = {
  title: "About",
  description:
    "Siva is a drone photographer and camera specialist in Gorakhpur shooting aerial films, stills, mapping and site documentation.",
};

export default function AboutPage() {
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
