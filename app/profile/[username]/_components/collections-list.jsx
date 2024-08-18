"use client";
import { useEffect, useState } from "react";
import Collection from "@/app/profile/[username]/_components/collection";
import CreateColletion from "./create-collection";

function CollectionsList({ user, author }) {
  const [collections, setCollections] = useState([]);
  const baseURL = process.env.NEXTAUTH_URL || "";

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(`${baseURL}/api/collections/user/${user}`);
      if (res.ok) {
        const data = await res.json();
        setCollections(data);
      } else {
        console.log(res.statusText);
      }
    }
    fetchData();
  }, []);

  const addCollection = (data) => {
    setCollections((prevCollections) => [data, ...prevCollections]);
  };

  const editCollection = (data) => {
    setCollections((prevCollections) => {
      return prevCollections.map((collection) => {
        if (collection._id == data._id) {
          return data;
        }
        return collection;
      });
    });
  };

  const deleteCollection = (id) => {
    setCollections((prevCollections) => {
      return prevCollections.filter((collection) => collection._id !== id);
    });
  };
  return (
    <div className="grow">
      <section className="px-4 h-fit flex flex-col items-center">
        {collections.length == 0 && (
          <span className="flex w-fit h-full items-center mx-auto self-center opacity-50">
            Nohing to show...
          </span>
        )}
        {collections.map((collection, index) => (
          <div key={index} className="mb-4 w-full">
            <Collection
              collection={collection}
              onDeleteCollection={deleteCollection}
              onEditCollection={editCollection}
              author={author}
            ></Collection>
          </div>
        ))}
      </section>
        <CreateColletion
          user={user}
          onCreateCollection={addCollection}
        ></CreateColletion>
    </div>
  );
}

export default CollectionsList;
