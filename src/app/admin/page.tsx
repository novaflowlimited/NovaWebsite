import { redirect } from "next/navigation";

/** `/admin` has no CMS screen; send visitors to the login entry. */
export default function AdminIndexPage() {
  redirect("/admin/login");
}
