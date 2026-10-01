import type { Metadata } from "next";
import { SkillsLandscape } from "@/components/sections/skills/SkillsLandscape";
import { CapabilitySection } from "@/components/sections/capabilities/CapabilitySection";
import { CredentialsSection } from "@/components/sections/credentials/CredentialsSection";
import { NextPage } from "@/components/layout/NextPage";

export const metadata: Metadata = {
  title: "Skills",
  description:
    "Drone flying, cameras and lenses, cinematography, editing and colour, and studio craft: tools, methods and where each was used.",
};

export default function SkillsPage() {
  return (
    <main id="main">
      <SkillsLandscape />
      <CapabilitySection />
      <CredentialsSection />
      <NextPage
        label="Education"
        href="/education"
        description="Remote pilot training, photography study and the years of practice that keep both current."
      />
    </main>
  );
}
