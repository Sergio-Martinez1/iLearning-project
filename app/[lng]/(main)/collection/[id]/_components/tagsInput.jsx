"use client";
import { useEffect, useRef, useState } from "react";

function TagsInputs({ itemTags }) {
  const baseURL = process.env.NEXTAUTH_URL || "";
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState(itemTags);
  const [highLightItem, setHighLightItem] = useState(null);
  const input = useRef(null);
  const inputOutput = useRef(null);

  useEffect(() => {
    setSelectedTags(itemTags);
  }, [itemTags]);

  useEffect(() => {
    inputOutput.current.value = JSON.stringify(selectedTags);
  }, [selectedTags]);

  async function searchTags(event) {
    const query = event.currentTarget.value;
    if (query == "") {
      setTags([]);
      return;
    }
    const res = await fetch(`${baseURL}/api/tags/${query}`);
    if (res.ok) {
      const data = await res.json();
      setTags(data);
    }
  }

  function selectTag(event) {
    if (event.key == "Enter") {
      event.preventDefault();
      const tag = input.current.value;
      const existTag = selectedTags.find((i) => i == tag);
      if (existTag) {
        setHighLight(tag);
        return;
      }
      setSelectedTags((prevTags) => [...prevTags, tag]);
      input.current.value = "";
      setTags([]);
    }
  }

  function deleteSelectedTag(currentTag) {
    setSelectedTags((prevTags) => {
      return prevTags.filter((tag) => tag !== currentTag);
    });
  }

  function setHighLight(value) {
    const index = selectedTags.indexOf(value);
    if (index !== -1) {
      setHighLightItem(index);
    }
    setTimeout(() => {
      setHighLightItem(null);
    }, 2000);
  }

  return (
    <div>
      <div className="flex w-full h-fit bg-[var(--bg-color)] rounded-2xl items-center p-2 flex-wrap gap-y-1">
        {selectedTags &&
          selectedTags.map((tag, index) => (
            <span
              key={index}
              id={tag}
              className={`${
                highLightItem == index
                  ? "animate-pulse bg-[var(--accent-color)] text-white"
                  : ""
              } text-[var(--text-color)] text-sm flex border-[var(--border-color)] border rounded-2xl items-center w-fit h-fit py-0.5 px-2 gap-x-1 mr-1 transition-colors`}
            >
              {tag}
              <button
                type="button"
                className="p-0 m-0 w-5 h-5 justify-center items-center text-sm"
                onClick={() => {
                  deleteSelectedTag(tag);
                }}
              >
                x
              </button>
            </span>
          ))}
        <div
          className={`${
            tags ? "bg-[var(--element-secondary-color)]" : ""
          } rounded-2xl p-1 flex flex-col gap-y-1 w-full grow`}
        >
          <input
            ref={input}
            className="grow outline-none p-0 pl-1 rounded-none shadow-none bg-transparent w-full"
            onInput={searchTags}
            onKeyDown={selectTag}
            type="text"
          />
          <div className="flex gap-y-1 gap-x-1">
            {tags &&
              tags.map((tag, index) => (
                <span
                  onClick={() => {
                    const existTag = selectedTags.find((i) => i == tag.name);
                    if (existTag) {
                      setHighLight(tag.name);
                      return;
                    }
                    setSelectedTags((prevTags) => [...prevTags, tag.name]);
                    input.current.value = "";
                    setTags([]);
                  }}
                  key={index}
                  className="text-[var(--text-color)] bg-[var(--element-color)] text-sm flex rounded-2xl items-center w-full h-fit py-0.5 px-2 gap-x-1 hover:bg-[var(--accent-color)] hover:text-white active:bg-[var(--element-color)]"
                >
                  {tag.name}
                </span>
              ))}
          </div>
        </div>
        <input name="tags" id="tags" type="hidden" ref={inputOutput} />
      </div>
    </div>
  );
}

export default TagsInputs;
