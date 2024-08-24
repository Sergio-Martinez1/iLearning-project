"use client";
import { Suspense, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

function LatestItems() {
  const baseURL = process.env.NEXTAUTH_URL || "";
  const [items, setItems] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    async function getData() {
      setLoading(true);
      const res = await fetch(`${baseURL}/api/dashboard/latest_items`);
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
      setLoading(false);
    }
    getData();
  }, []);

  function calculate_posted_time(publication_date) {
    if (publication_date) {
      let publication_date_parse = Date.parse(publication_date);
      let time_now = Date.now();
      let diference = time_now - publication_date_parse;

      diference = Math.floor(diference / 1000);
      if (diference < 0) diference = 0;
      let output = `${diference} s`;

      if (diference > 60) {
        diference = Math.floor(diference / 60);
        output = `${diference} min`;
        if (diference > 60) {
          diference = Math.floor(diference / 60);
          output = `${diference} hrs`;
          if (diference > 24) {
            diference = Math.floor(diference / 24);
            output = `${diference} d`;
            if (diference > 365) {
              diference = Math.floor(diference / 365);
              output = `${diference} y`;
            }
          }
        }
      }
      return output;
    } else return "no date";
  }

  if (loading) {
    return (
      <section className="bg-[var(--element-color)] rounded-2xl p-4 relative flex flex-col min-h-40 md:w-full md:h-full">
        <span className="text-2xl font-bold flex mb-2 bg-[var(--element-color)]">
          {t("lastest_items_title")}
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
        {t("lastest_items_title")}
      </span>
      <div className="grid lg:grid-cols-2 gap-x-4 gap-y-4 h-full overflow-y-auto rounded-2xl">
        <Suspense fallback={<div className="loader"></div>}>
          {items &&
            items.map((item, index) => (
              <a
                href={`/item/${item._id}`}
                key={index}
                className="bg-[var(--element-secondary-color)] rounded-2xl p-2 "
              >
                <div className="flex gap-x-2 opacity-70">
                  <span className="text-sm">{item.user.username} -</span>
                  <span className="text-sm">
                    {calculate_posted_time(item.createdAt)}{" "}
                    {t("lastest_items_time_ago")}
                  </span>
                </div>
                <div className="grid grid-cols-[1fr_2fr] w-fit gap-x-2">
                  <span className="justify-self-en w-fit">
                    {t("lastest_items_text_1")}:
                  </span>
                  <span>{item.name}</span>
                  <span className="justify-self-en w-fit">
                    {t("lastest_items_text_2")}:
                  </span>
                  <span>{item.group.name}</span>
                </div>
              </a>
            ))}
        </Suspense>
      </div>
    </section>
  );
}

export default LatestItems;
