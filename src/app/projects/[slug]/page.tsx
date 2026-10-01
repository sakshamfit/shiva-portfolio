import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projectBySlug, projects } from "@/content/projects";
import { caseStudyBySlug } from "@/components/sections/cases/CaseStudies";
import { NextPage } from "@/components/layout/NextPage";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return projects.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const p = projectBySlug[slug];
  if (!p) return {};
  return { title: p.shortTitle, description: p.oneLiner };
}

export default async function CaseStudyPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const Case = caseStudyBySlug[slug as keyof typeof caseStudyBySlug];
  if (!Case) notFound();
  const isLast = slug === projects[projects.length - 1].slug;
  return (
    <main id="main">
      <Case />
      {isLast ? (
        <NextPage
          label="Skills"
          href="/skills"
          description="The capabilities behind this work, the gear I shoot with and my certifications."
        />
      ) : null}
    </main>
  );
}
