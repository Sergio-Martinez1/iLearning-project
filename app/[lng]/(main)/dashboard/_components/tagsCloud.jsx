"use client";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

function TagsCloud() {
  const baseURL = process.env.NEXTAUTH_URL || "";
  const [tags, setTags] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    async function getData() {
      setLoading(true);
      const res = await fetch(`${baseURL}/api/dashboard/tags_cloud`);
      if (res.ok) {
        const data = await res.json();
        setTags(data);
      }
      setLoading(false);
    }
    getData();
  }, []);

  function calculateSize() {
    const sizes = [20, 40, 25, 30, 35, 10, 18, 22, 45];
    const random = Math.floor(Math.random() * sizes.length);
    return `text-[${sizes[random]}px]`;
  }

  if (loading) {
    return (
      <section className="bg-[var(--element-color)] rounded-2xl p-4 relative flex flex-col min-h-40 md:w-full md:h-full">
        <span className="text-2xl font-bold flex mb-2 bg-[var(--element-color)]">
          {t("tags_cloud_title")}
        </span>
        <div className="flex justify-center items-center w-full h-20 md:h-full rounded-2xl">
          <div className="loader_1"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[var(--element-color)] rounded-2xl p-4 relative flex flex-col">
      <span className="text-2xl font-bold flex mb-2 bg-[var(--element-color)]">
        {t("tags_cloud_title")}
      </span>
      <div className="flex flex-wrap gap-x-1 h-fit overflow-y-auto rounded-2xl justify-center items-center max-w-80 mx-auto my-auto">
        {tags &&
          tags.map((tag, index) => (
            <a
              key={index}
              href={`/search/${tag.name}`}
              className={`${calculateSize()} w-fit h-fit hover:bg-[var(--accent-color)]`}
            >
              {tag.name}
            </a>
          ))}
      </div>
    </section>
  );
}

export default TagsCloud;
