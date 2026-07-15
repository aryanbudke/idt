import React from "react";
import { getEvents } from "./actions";
import { EventsClient } from "./events-client";

interface PageProps { searchParams: Promise<{ search?: string; page?: string }> }

export default async function EventsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const search = params.search || "";
  const page = parseInt(params.page || "1", 10);
  const { events, totalPages, totalCount } = await getEvents(search, page, 6);

  return (
    <EventsClient
      initialEvents={events as Parameters<typeof EventsClient>[0]["initialEvents"]}
      totalPages={totalPages} totalCount={totalCount}
      initialSearch={search} initialPage={page}
    />
  );
}
