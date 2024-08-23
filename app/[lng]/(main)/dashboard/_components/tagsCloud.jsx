"use client";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AdorableWordCloud } from "adorable-word-cloud";
import { useRouter } from "next/navigation";

function TagsCloud() {
  const baseURL = process.env.NEXTAUTH_URL || "";
  const [tags, setTags] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const router = useRouter();

  const options = {
    colors: ["#B0E650", "#ff7f0e", "#4DD5CB", "#568CEC", "#CE7DFF", "#4FD87D"],
    fontFamily: "JalnanGothic",
    fontSizeRange: [20, 80],
    rotationDivision: 0,
    enableRandomization: true,
  };

  const callbacks = {
    onWordClick: (word) => {
      router.push(`/search/${word.text}`);
    },
  };

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
    <section className="bg-[var(--element-color)] rounded-2xl p-4 flex flex-col h-full overflow-hidden min-h-80">
      <span className="text-2xl font-bold flex bg-[var(--element-color)] w-full h-fit">
        {t("tags_cloud_title")}
      </span>
      {tags && (
        <div className="h-full w-full grow">
          <AdorableWordCloud
            words={tags}
            options={options}
            callbacks={callbacks}
          />
        </div>
      )}
    </section>
  );
}

export default TagsCloud;
