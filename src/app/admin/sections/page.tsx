import React from "react";
import { getSections, getSemestersForSection } from "./actions";
import { SectionsClient } from "./sections-client";

interface PageProps { searchParams: Promise<{ search?: string; page?: string }> }

export default async function SectionsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const search = params.search || "";
  const page = parseInt(params.page || "1", 10);
  const { sections, totalPages, totalCount } = await getSections(search, page, 5);
  const semesters = await getSemestersForSection();

  return (
    <SectionsClient
      initialSections={sections as Parameters<typeof SectionsClient>[0]["initialSections"]}
      semesters={semesters as Parameters<typeof SectionsClient>[0]["semesters"]}
      totalPages={totalPages} totalCount={totalCount}
      initialSearch={search} initialPage={page}
    />
  );
}
