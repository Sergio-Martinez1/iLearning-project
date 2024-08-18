import CollectionDetail from "@/app/collection/[id]/_components/collection-detail";

function CollectionPage({ params }) {
  return (
    <main className="p-4">
      <CollectionDetail id={params.id}></CollectionDetail>
    </main>
  );
}

export default CollectionPage;
