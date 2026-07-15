import { redirect } from "next/navigation";

export default async function Home() {
  // Redirect root path directly to /admin for local development access
  redirect("/admin");
}
