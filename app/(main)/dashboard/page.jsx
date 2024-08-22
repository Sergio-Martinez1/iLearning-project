import LatestItems from "./_components/latestItems";
import BiggestCollections from "./_components/biggestCollections";
import TagsCloud from "./_components/tagsCloud";

function DashboardPage() {
  return (
    <main className="p-4 w-full relative h-screen grow overflow-y-auto flex flex-col md:grid md:grid-cols-2 md:grid-rows-2 gap-x-4 gap-y-4">
      <LatestItems></LatestItems>
      <span className="col-start-2 row-span-2">
        <BiggestCollections></BiggestCollections>
      </span>
      <TagsCloud></TagsCloud>
    </main>
  );
}

export default DashboardPage;
