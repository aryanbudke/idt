import React from "react";
import { getFaculty, getFacultyDepartments } from "./actions";
import { FacultyClient } from "./faculty-client";

interface PageProps { searchParams: Promise<{ search?: string; dept?: string; page?: string }> }

export default async function FacultyPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const search = params.search || "";
  const dept = params.dept || "";
  const page = parseInt(params.page || "1", 10);

  const { faculty, totalPages, totalCount } = await getFaculty(search, dept, page, 10);
  const departments = await getFacultyDepartments();

  const activeCount = faculty.filter((f: { status: string }) => f.status === "ACTIVE").length;
  const onLeaveCount = faculty.filter((f: { status: string }) => f.status === "ON_LEAVE").length;

  return (
    <FacultyClient
      initialFaculty={faculty as Parameters<typeof FacultyClient>[0]["initialFaculty"]}
      departments={departments}
      totalPages={totalPages} totalCount={totalCount}
      initialSearch={search} initialDept={dept} initialPage={page}
      activeCount={activeCount} onLeaveCount={onLeaveCount}
    />
  );
}
