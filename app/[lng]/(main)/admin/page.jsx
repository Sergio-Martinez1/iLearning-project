import AdminPanel from "./_components/adminPanel";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import { redirect } from "next/navigation";
import initTranslations from "../../i18n";
import TranslationsProvider from "../../_components/translationsProvider";

const i18nNameSpaces = ["admin", "common"];

async function AdminPage({ params: { lng } }) {
  const { t, resources } = await initTranslations(lng, i18nNameSpaces);
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if (session && session.role == "user") redirect("/dashboard");

  return (
    <TranslationsProvider
      resources={resources}
      locale={lng}
      namespaces={i18nNameSpaces}
    >
      <main className="p-4 w-full h-screen grow overflow-y-auto">
        <AdminPanel></AdminPanel>
      </main>
    </TranslationsProvider>
  );
}

export default AdminPage;
