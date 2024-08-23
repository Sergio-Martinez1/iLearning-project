import SearchList from "./_components/searchList";
import initTranslations from "../../../i18n";
import TranslationsProvider from "@/app/[lng]/_components/translationsProvider";

const i18nNameSpaces = ["search", "common"];

async function SearchPage({ params }) {
  const { t, resources } = await initTranslations(params.lng, i18nNameSpaces);
  return (
    <TranslationsProvider
      resources={resources}
      locale={params.lng}
      namespaces={i18nNameSpaces}
    >
      <main className="relative h-screen flex flex-col grow overflow-y-auto items-center">
        <section className="max-w-[1000px] w-full h-full px-4 pb-5 relative flex flex-col">
          <span className="text-3xl sticky top-0 pt-4 z-10 bg-[var(--bg-color)]">
            {t("title")} <b>{params.query}</b>:
          </span>
          <SearchList query={params.query}></SearchList>
        </section>
      </main>
    </TranslationsProvider>
  );
}

export default SearchPage;
