"use client";

import { useEffect, useState } from "react";
import { MdOutlineImageNotSupported } from "react-icons/md";

function LatestItems() {
  const baseURL = process.env.NEXTAUTH_URL || "";
  const [collections, setCollections] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getData() {
      setLoading(true);
      const res = await fetch(`${baseURL}/api/dashboard/biggest_collections`);
      if (res.ok) {
        const data = await res.json();
        setCollections(data);
      }
      setLoading(false);
    }
    getData();
  }, []);

  if (loading) {
    return (
      <section className="bg-[var(--element-color)] rounded-2xl p-4 relative flex flex-col w-full h-full">
        <span className="text-2xl font-bold flex mb-2 bg-[var(--element-color)]">
          Biggest Collections
        </span>
        <div className="flex justify-center items-center h-full w-full rounded-2xl">
          <div className="loader_1"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[var(--element-color)] rounded-2xl p-4 relative flex flex-col w-full h-full">
      <span className="text-2xl font-bold flex mb-2 bg-[var(--element-color)]">
        Biggest Collections
      </span>
      <div className="grid lg:grid-cols-2 gap-x-4 gap-y-4 h-fit overflow-y-auto rounded-2xl">
        {collections &&
          collections.map((collection, index) => (
            <section className="w-full h-full" key={index}>
              <a
                href={`/collection/${collection.group._id}`}
                className="flex flex-col bg-[var(--element-secondary-color)] rounded-2xl px-4 py-4 w-full h-full"
              >
                <div className="flex gap-x-4 items-center font-bold text-xl flex-wrap">
                  <span className="text-2xl w-full mb-2">
                    {collection.group.name}
                  </span>
                  <div className="flex items-center gap-x-4 grow justify-between mb-2">
                    <span className="border border-[var(--border-color)] h-fit w-fit rounded-2xl px-2 text-sm">
                      {collection.group.topic}
                    </span>
                    <span className="text-sm">
                      Items: {collection.itemCount}
                    </span>
                  </div>
                </div>
                <span className="mb-2">{collection.group.description}</span>
                {collection.thumbnail_url ? (
                  <img
                    className="rounded-2xl object-contain"
                    src={collection.group.thumbnail_url}
                  />
                ) : (
                  <div className="flex flex-col mt-auto justify-center items-center border border-[var(--border-color)] rounded-2xl">
                    <MdOutlineImageNotSupported size={40} />
                    <span className="mt-2">No image</span>
                  </div>
                )}
              </a>
            </section>
          ))}
      </div>
    </section>
  );
}

export default LatestItems;
