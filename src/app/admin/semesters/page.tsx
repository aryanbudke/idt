import React from "react";
import { getSemesters, getProgramsList } from "./actions";
import { SemestersClient } from "./semesters-client";

interface PageProps { searchParams: Promise<{ search?: string; page?: string }> }

export default async function SemestersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const search = params.search || "";
  const page = parseInt(params.page || "1", 10);
  const { semesters, totalPages, totalCount } = await getSemesters(search, page, 5);
  const programs = await getProgramsList();
  const activeCount = semesters.filter((s: { status: string }) => s.status === "ACTIVE").length;

  return (
    <SemestersClient
      initialSemesters={semesters as Parameters<typeof SemestersClient>[0]["initialSemesters"]}
      programs={programs}
      totalPages={totalPages} totalCount={totalCount}
      initialSearch={search} initialPage={page}
      activeCount={activeCount}
    />
  );
}
