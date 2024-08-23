import ItemDetails from "./_components/item";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import initTranslations from "../../../i18n";
import TranslationsProvider from "@/app/[lng]/_components/translationsProvider";
import SessionWrapper from "@/app/[lng]/_components/sessionWrapper";

const i18nNameSpaces = ["item", "common"];

async function ItemPage({ params }) {
  const session = await getServerSession(authOptions);
  const { t, resources } = await initTranslations(params.lng, i18nNameSpaces);

  return (
    <SessionWrapper>
      <TranslationsProvider
        resources={resources}
        locale={params.lng}
        namespaces={i18nNameSpaces}
      >
        <main className="p-4 w-full justify-center relative h-screen flex flex-col grow overflow-y-auto items-center">
          <ItemDetails id={params.id} session={session}></ItemDetails>
        </main>
      </TranslationsProvider>
    </SessionWrapper>
  );
}

export default ItemPage;
