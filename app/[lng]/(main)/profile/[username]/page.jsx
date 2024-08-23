import CollectionsList from "./_components/collections-list";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import initTranslations from "../../../i18n";
import TranslationsProvider from "@/app/[lng]/_components/translationsProvider";

const i18nNameSpaces = ["profile", "common"];

async function ProfilePage({ params }) {
  const session = await getServerSession(authOptions);
  const { t, resources } = await initTranslations(params.lng, i18nNameSpaces);
  const username = params.username;

  return (
    <TranslationsProvider
      resources={resources}
      locale={params.lng}
      namespaces={i18nNameSpaces}
    >
      <section className="relative h-screen flex flex-col grow overflow-y-auto mb-[80px] items-center">
        <header className="flex flex-col">
          <h1 className="self-center mb-4 text-xl font-bold mt-4 bg-[var(--element-color)] rounded-2xl px-4 py-2 shadow-sm">
            {session ? t("header") : t("header_with_name", { username })}
          </h1>
        </header>
        <CollectionsList
          user={params.username}
          author={session ? params.username == session.user.name : false}
        ></CollectionsList>
      </section>
    </TranslationsProvider>
  );
}

export default ProfilePage;
