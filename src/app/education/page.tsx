import type { Metadata } from "next";
import { EducationSection } from "@/components/sections/education/EducationSection";
import { NextPage } from "@/components/layout/NextPage";

export const metadata: Metadata = {
  title: "Education",
  description:
    "Remote Pilot Certificate training (DGCA rules) and a bachelor's degree, plus the practice flights that keep the flying current.",
};

export default function EducationPage() {
  return (
    <main id="main">
      <EducationSection />
      <NextPage label="Contact" href="/contact" description="Email, phone, social profiles, or send a message directly." />
    </main>
  );
}
