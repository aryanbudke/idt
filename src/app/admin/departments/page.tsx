import React from "react";
import { getDepartments, getFacultyList } from "./actions";
import { DepartmentClient } from "@/app/admin/departments/department-client";

interface PageProps {
  searchParams: Promise<{
    search?: string;
    page?: string;
  }>;
}

export default async function DepartmentsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const search = params.search || "";
  const page = parseInt(params.page || "1", 10);

  const { departments, totalPages, totalCount } = await getDepartments(
    search,
    page,
    5
  );
  const faculties = await getFacultyList();

  return (
    <DepartmentClient
      initialDepartments={departments}
      faculties={faculties}
      totalPages={totalPages}
      totalCount={totalCount}
      initialSearch={search}
      initialPage={page}
    />
  );
}
