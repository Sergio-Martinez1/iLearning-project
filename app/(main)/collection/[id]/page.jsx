import CollectionDetail from "./_components/collection-detail";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";

async function CollectionPage({ params }) {
  const session = await getServerSession(authOptions);
  return (
    <main className="p-4 relative h-screen flex flex-col grow overflow-y-auto ">
      <CollectionDetail id={params.id} session={session}></CollectionDetail>
    </main>
  );
}

export default CollectionPage;
