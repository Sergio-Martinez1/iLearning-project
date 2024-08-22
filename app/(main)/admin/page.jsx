import AdminPanel from "./_components/adminPanel";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import { redirect } from "next/navigation";

async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if (session && session.role == "user") redirect("/dashboard");
  return (
    <main className="p-4 w-full h-screen grow overflow-y-auto">
      <AdminPanel></AdminPanel>
    </main>
  );
}

export default AdminPage;
