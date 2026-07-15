import React from "react";
import { getSubjects, getSemestersList } from "./actions";
import { SubjectsClient } from "./subjects-client";

interface PageProps { searchParams: Promise<{ search?: string; page?: string }> }

export default async function SubjectsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const search = params.search || "";
  const page = parseInt(params.page || "1", 10);
  const { subjects, totalPages, totalCount } = await getSubjects(search, page, 5);
  const semesters = await getSemestersList();
  const activeCount = subjects.filter((s: { status: string }) => s.status === "ACTIVE").length;

  return (
    <SubjectsClient
      initialSubjects={subjects as Parameters<typeof SubjectsClient>[0]["initialSubjects"]}
      semesters={semesters as Parameters<typeof SubjectsClient>[0]["semesters"]}
      totalPages={totalPages} totalCount={totalCount}
      initialSearch={search} initialPage={page}
      activeCount={activeCount}
    />
  );
}
