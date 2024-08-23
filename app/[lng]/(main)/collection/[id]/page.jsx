import CollectionDetail from "./_components/collection-detail";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import initTranslations from "../../../i18n";
import TranslationsProvider from "@/app/[lng]/_components/translationsProvider";

const i18nNameSpaces = ["collection", "common"];

async function CollectionPage({ params }) {
  const { t, resources } = await initTranslations(params.lng, i18nNameSpaces);
  const session = await getServerSession(authOptions);
  return (
    <TranslationsProvider
      resources={resources}
      locale={params.lng}
      namespaces={i18nNameSpaces}
    >
      <main className="p-4 relative h-screen flex flex-col grow overflow-y-auto ">
        <CollectionDetail id={params.id} session={session}></CollectionDetail>
      </main>
    </TranslationsProvider>
  );
}

export default CollectionPage;
