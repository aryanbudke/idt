import React from "react";
import { getClassrooms } from "./actions";
import { ClassroomsClient } from "./classrooms-client";

interface PageProps { searchParams: Promise<{ search?: string; page?: string }> }

export default async function ClassroomsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const search = params.search || "";
  const page = parseInt(params.page || "1", 10);
  const { classrooms, totalPages, totalCount } = await getClassrooms(search, page, 5);

  const classroomCount = classrooms.filter((c: { roomType: string }) => c.roomType === "CLASSROOM").length;
  const labCount = classrooms.filter((c: { roomType: string }) => c.roomType === "LAB").length;

  return (
    <ClassroomsClient
      initialClassrooms={classrooms as Parameters<typeof ClassroomsClient>[0]["initialClassrooms"]}
      totalPages={totalPages} totalCount={totalCount}
      initialSearch={search} initialPage={page}
      classroomCount={classroomCount} labCount={labCount}
    />
  );
}
