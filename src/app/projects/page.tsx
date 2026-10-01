import type { Metadata } from "next";
import { ProjectsLanding } from "@/components/sections/projects/ProjectsLanding";
import { NextPage } from "@/components/layout/NextPage";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Case studies in aerial film, mapping, kit planning and site documentation, with working demonstrations and clearly stated figures.",
};

export default function ProjectsPage() {
  return (
    <main id="main">
      <ProjectsLanding />
      <NextPage
        label="Case study 01"
        href="/projects/aerial-films"
        description="Start with the aerial film work: one crew covering air and ground, graded and delivered in-house."
      />
    </main>
  );
}
