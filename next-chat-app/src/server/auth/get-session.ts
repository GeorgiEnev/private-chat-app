import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function getSession() {
  const session = auth.api.getSession({
    headers: await headers(),
  });

  return session;
}
