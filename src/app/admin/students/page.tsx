import React from "react";
import { getStudents, getStudentDepartments } from "./actions";
import { StudentsClient } from "./students-client";

interface PageProps { searchParams: Promise<{ search?: string; dept?: string; page?: string }> }

export default async function StudentsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const search = params.search || "";
  const dept = params.dept || "";
  const page = parseInt(params.page || "1", 10);

  const { students, totalPages, totalCount } = await getStudents(search, dept, page, 10);
  const departments = await getStudentDepartments();

  const activeCount = students.filter((s: { status: string }) => s.status === "ACTIVE").length;
  const graduatedCount = students.filter((s: { status: string }) => s.status === "GRADUATED").length;

  return (
    <StudentsClient
      initialStudents={students as Parameters<typeof StudentsClient>[0]["initialStudents"]}
      departments={departments}
      totalPages={totalPages} totalCount={totalCount}
      initialSearch={search} initialDept={dept} initialPage={page}
      activeCount={activeCount} graduatedCount={graduatedCount}
    />
  );
}
