import { redirect } from "next/navigation";
import { getOwner } from "@/lib/admin/auth";
import { adminPath } from "@/lib/admin/paths";

/** Bare admin path goes to leads when signed in, otherwise to login. */
export default async function AdminIndex() {
  redirect(adminPath((await getOwner()) ? "leads" : "login"));
}
