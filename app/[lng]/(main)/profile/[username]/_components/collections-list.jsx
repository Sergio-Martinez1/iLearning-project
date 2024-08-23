"use client";
import { useEffect, useState } from "react";
import Collection from "./collection";
import CreateColletion from "./create-collection";
import { useTranslation } from "react-i18next";

function CollectionsList({ user, author }) {
  const [collections, setCollections] = useState([]);
  const baseURL = process.env.NEXTAUTH_URL || "";
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const res = await fetch(`${baseURL}/api/collections/user/${user}`);
      if (res.ok) {
        const data = await res.json();
        setCollections(data);
      } else {
        console.log(res.statusText);
      }
      setLoading(false);
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

  if (loading) {
    return (
      <div className="grow">
        <section className="px-4 w-full flex items-center justify-center h-full">
          <div className="loader_1"></div>
        </section>
        {author && (
          <CreateColletion
            user={user}
            onCreateCollection={addCollection}
          ></CreateColletion>
        )}
      </div>
    );
  }

  return (
    <div className="grow">
      <section className="px-4 w-fit h-fit flex flex-col md:flex-row md:flex-wrap md:gap-x-4 items-center md:justify-center md:items-start">
        {collections.length == 0 && (
          <span className="flex w-fit h-full items-center mx-auto self-center opacity-50">
            {t("collection_list_no_content")}
          </span>
        )}
        {collections.map((collection, index) => (
          <div key={index} className="mb-4 w-fit md:w-96">
            <Collection
              collection={collection}
              onDeleteCollection={deleteCollection}
              onEditCollection={editCollection}
              author={author}
            ></Collection>
          </div>
        ))}
      </section>
      {author && (
        <CreateColletion
          user={user}
          onCreateCollection={addCollection}
        ></CreateColletion>
      )}
    </div>
  );
}

export default CollectionsList;
