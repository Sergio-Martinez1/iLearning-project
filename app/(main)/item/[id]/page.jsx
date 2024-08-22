import ItemDetails from "./_components/item";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";

async function ItemPage({ params }) {
  const session = await getServerSession(authOptions);
  return (
    <main className="p-4 w-full justify-center relative h-screen flex flex-col grow overflow-y-auto items-center">
      <ItemDetails id={params.id} session={session}></ItemDetails>
    </main>
  );
}

export default ItemPage;
