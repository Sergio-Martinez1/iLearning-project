"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { calculate_posted_time } from "@/libs/calculate_posted_time";

function SearchPage({ params }) {
  const baseURL = process.env.NEXTAUTH_URL || "";
  const [items, setItems] = useState([]);
  const [collections, setCollections] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getData() {
      setLoading(true);
      const res = await fetch(`${baseURL}/api/search/${params.query}`);
      if (res.ok) {
        const data = await res.json();
        setItems(data.items);
        setCollections(data.collections);
        setComments(data.comments);
        console.log(data.comments);
      }
      setLoading(false);
    }
    getData();
  }, []);

  return (
    <main className="relative h-screen flex flex-col grow overflow-y-auto items-center">
      <section className="max-w-[1000px] w-full h-full p-4 relative flex flex-col">
        <span className="text-3xl sticky top-4 bg-[var(--bg-color)]">
          Results for <b>{params.query}</b>:
        </span>
        {loading ? (
          <div className="px-12 pt-6 flex justify-center items-center h-full w-full">
            <div className="loader_1"></div>
          </div>
        ) : (
          <div className="px-12 pt-6 flex flex-col gap-y-4">
            {items &&
              items.map((item, index) => (
                <Link
                  href={`/item/${item._id}`}
                  key={index}
                  className="flex flex-col md:flex-row bg-[var(--element-color)] rounded-2xl px-4 py-2 gap-x-4 items-center"
                >
                  <span className="w-32 text-2xl font-bold">Item</span>
                  <div>
                    <div className="flex gap-x-2 opacity-70">
                      <span className="text-sm">{item.user.username} -</span>
                      <span className="text-sm">
                        {calculate_posted_time(item.createdAt)} ago
                      </span>
                    </div>
                    <div className="grid grid-cols-[1fr_2fr] w-fit gap-x-2">
                      <span className="justify-self-en w-fit">Name:</span>
                      <span>{item.name}</span>
                      <span className="justify-self-en w-fit">Collection:</span>
                      <span>{item.group.name}</span>
                    </div>
                  </div>
                </Link>
              ))}
            {collections &&
              collections.map((collection, index) => (
                <Link
                  href={`/collection/${collection._id}`}
                  key={index}
                  className="flex flex-col md:flex-row bg-[var(--element-color)] rounded-2xl px-4 py-2 gap-x-4 items-center"
                >
                  <span className="w-32 text-2xl font-bold">Collection</span>
                  <div>
                    <div className="grid grid-cols-[1fr_2fr] w-fit gap-x-2 gap-y-1">
                      <span className="w-fit">Name:</span>
                      <span>{collection.name}</span>
                      <span className="w-fit">Description:</span>
                      <span>{collection.description}</span>
                      <span className="w-fit">Topic:</span>
                      <span className="text-sm border border-[var(--border-color)] w-fit rounded-2xl px-2">
                        {collection.topic}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            {comments &&
              comments.map((comment, index) => (
                <Link
                  href={`/item/${comment.item._id}`}
                  key={index}
                  className="flex flex-col md:flex-row bg-[var(--element-color)] rounded-2xl px-4 py-2 gap-x-4 items-center"
                >
                  <span className="w-32 text-2xl font-bold">Comment</span>
                  <div>
                    <div className="grid grid-cols-[1fr_2fr] w-fit gap-x-2 gap-y-1">
                      <span className="w-fit">User:</span>
                      <span>{comment.user.username}</span>
                      <span className="w-fit">Collection:</span>
                      <span>
                        {comment.item.name}
                      </span>
                      <span className="w-fit">Content:</span>
                      <span>{comment.content}</span>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default SearchPage;
