import LatestItems from "./_components/latestItems";
import BiggestCollections from "./_components/biggestCollections";
import TagsCloud from "./_components/tagsCloud";
import initTranslations from "../../i18n";
import TranslationsProvider from "../../_components/translationsProvider";

const i18nNameSpaces = ["dashboard", "common"];

async function DashboardPage({ params: { lng } }) {
  const { t, resources } = await initTranslations(lng, i18nNameSpaces);

  return (
    <TranslationsProvider
      resources={resources}
      locale={lng}
      namespaces={i18nNameSpaces}
    >
      <main className="p-4 w-full relative h-screen grow overflow-y-auto flex flex-col md:grid md:grid-cols-2 md:grid-rows-2 gap-x-4 gap-y-4">
        <LatestItems></LatestItems>
        <span className="col-start-2 row-span-2">
          <BiggestCollections></BiggestCollections>
        </span>
        <TagsCloud></TagsCloud>
      </main>
    </TranslationsProvider>
  );
}

export default DashboardPage;
