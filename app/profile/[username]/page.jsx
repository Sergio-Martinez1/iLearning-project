import CollectionsList from "./_components/collections-list";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

async function ProfilePage({ params }) {
  const session = await getServerSession(authOptions);
  return (
    <section className="relative h-screen flex flex-col grow overflow-y-auto mb-[80px]">
      <header className="flex flex-col">
        <h1 className="self-center mb-4 text-xl font-bold mt-4 bg-[var(--element-color)] rounded-2xl px-4 py-2 shadow-sm">
          {session ? "My collections" : `${params.username}'s collections`}
        </h1>
      </header>
      <CollectionsList
        user={params.username}
        author={session ? params.username == session.user.name : false}
      ></CollectionsList>
    </section>
  );
}

export default ProfilePage;
