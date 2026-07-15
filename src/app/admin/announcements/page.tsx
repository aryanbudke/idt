import React from "react";
import { getAnnouncements } from "./actions";
import { AnnouncementsClient } from "./announcements-client";

interface PageProps { searchParams: Promise<{ search?: string; page?: string }> }

export default async function AnnouncementsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const search = params.search || "";
  const page = parseInt(params.page || "1", 10);
  const { announcements, totalPages, totalCount } = await getAnnouncements(search, page, 5);

  return (
    <AnnouncementsClient
      initialAnnouncements={announcements as Parameters<typeof AnnouncementsClient>[0]["initialAnnouncements"]}
      totalPages={totalPages} totalCount={totalCount}
      initialSearch={search} initialPage={page}
    />
  );
}
