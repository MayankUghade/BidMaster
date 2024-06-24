import Dashboard from "@/components/Dashboard/Dashboard";
import LandingPage from "@/components/Landing-page";
import { auth } from "@/utils/auth";
import { useSession } from "next-auth/react";

export default async function Home() {
  const session = await auth();
  return <div>{session ? <Dashboard /> : <LandingPage />}</div>;
}
