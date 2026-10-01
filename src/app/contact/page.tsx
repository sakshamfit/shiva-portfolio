import type { Metadata } from "next";
import { ContactSection } from "@/components/sections/contact/ContactSection";
import { NextPage } from "@/components/layout/NextPage";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Shiva about drone photography, aerial film, mapping and site documentation in Gorakhpur.",
};

export default function ContactPage() {
  return (
    <main id="main">
      <ContactSection />
      <NextPage label="Resume" href="/resume" description="The one current version of my resume, ready to download." />
    </main>
  );
}
