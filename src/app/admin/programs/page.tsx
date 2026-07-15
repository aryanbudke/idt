import React from "react";
import { getPrograms, getDepartmentsList } from "./actions";
import { ProgramsClient } from "./programs-client";

interface PageProps { searchParams: Promise<{ search?: string; page?: string }> }

export default async function ProgramsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const search = params.search || "";
  const page = parseInt(params.page || "1", 10);

  const { programs, totalPages, totalCount } = await getPrograms(search, page, 5);
  const departments = await getDepartmentsList();

  const activeCount = programs.filter((p: { status: string }) => p.status === "ACTIVE").length;
  const inactiveCount = programs.filter((p: { status: string }) => p.status === "INACTIVE").length;

  return (
    <ProgramsClient
      initialPrograms={programs as Parameters<typeof ProgramsClient>[0]["initialPrograms"]}
      departments={departments}
      totalPages={totalPages} totalCount={totalCount}
      initialSearch={search} initialPage={page}
      activeCount={activeCount} inactiveCount={inactiveCount}
    />
  );
}
