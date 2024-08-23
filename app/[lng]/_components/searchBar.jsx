"use client";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useTranslation } from "react-i18next";

function SearchBar() {
  const baseURL = process.env.NEXTAUTH_URL || "";
  const [items, setItems] = useState([]);
  const router = useRouter();
  const input = useRef(null);
  const { t } = useTranslation();

  // async function search(event) {
  //   const query = event.currentTarget.value;
  //   if (query == "") {
  //     setItems([]);
  //     return;
  //   }
  //   const res = await fetch(`${baseURL}/api/tags/${query}`);
  //   if (res.ok) {
  //     const data = await res.json();
  //     setItems(data);
  //   }
  // }

  async function search(event) {
    if (event.key == "Enter") {
      const search = event.currentTarget.value;
      if (search == "") return;
      event.preventDefault();
      event.currentTarget.value = "";
      router.push(`${baseURL}/search/${search}`);
    }
  }

  async function searchClick() {
    const search = input.current.value;
    if (search == "") return;
    input.current.value = "";
    router.push(`${baseURL}/search/${search}`);
  }

  return (
    <div className="bg-[var(--bg-color)] flex items-center rounded-2xl gap-x-1 h-full relative">
      <input
        ref={input}
        type="text"
        placeholder={t("search_placeholder")}
        className="h-full shadow-none rounded-l-2xl rounded-r-none"
        onKeyDown={search}
      />
      <button
        type="button"
        onClick={searchClick}
        className="w-10 h-full flex justify-center items-center m-0 p-0 rounded-l-none rounded-r-2xl shadow-none"
      >
        <FaSearch></FaSearch>
      </button>
      {/* <div className="absolute top-full bg-[var(--element-secondary-color)] w-full rounded-2xl p-2 z-10 flex flex-col">
        {items && items.map((item, index) => <a href="/#">h</a>)}
      </div> */}
    </div>
  );
}

export default SearchBar;
