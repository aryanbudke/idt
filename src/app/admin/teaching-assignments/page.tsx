import React from "react";
import {
  getTeachingAssignments,
  getFacultyList,
  getSubjectList,
  getSemesterList,
  getSectionList,
} from "./actions";
import { TeachingAssignmentsClient } from "./teaching-assignments-client";

interface PageProps {
  searchParams: Promise<{ search?: string; page?: string }>;
}

export default async function TeachingAssignmentsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const search = params.search || "";
  const page = parseInt(params.page || "1", 10);

  const { assignments, totalPages, totalCount } = await getTeachingAssignments(search, page, 5);

  const [faculties, subjects, semesters, sections] = await Promise.all([
    getFacultyList(),
    getSubjectList(),
    getSemesterList(),
    getSectionList(),
  ]);

  return (
    <TeachingAssignmentsClient
      initialAssignments={assignments as unknown as Parameters<typeof TeachingAssignmentsClient>[0]["initialAssignments"]}
      faculties={faculties}
      subjects={subjects}
      semesters={semesters as unknown as Parameters<typeof TeachingAssignmentsClient>[0]["semesters"]}
      sections={sections as unknown as Parameters<typeof TeachingAssignmentsClient>[0]["sections"]}
      totalPages={totalPages}
      totalCount={totalCount}
      initialSearch={search}
      initialPage={page}
    />
  );
}
