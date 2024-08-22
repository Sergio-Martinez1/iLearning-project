"use client";
import { useRef } from "react";
import CustomForm from "@/app/_components/customForm";

function CreateCollection({ user, onCreateCollection }) {
  let createCollectionDialog = useRef(null);
  const baseURL = process.env.NEXTAUTH_URL || "";

  return (
    <footer className="fixed py-4 bottom-0 left-1/2 translate-x-[-50%] w-full flex justify-center bg-[var(--element-color)]">
      <button
        onClick={() => {
          createCollectionDialog.current.showModal();
        }}
        className="text-sm w-64 h-12"
      >
        Add new collection
      </button>
      <CustomForm
        title={"New collection"}
        buttonTitle={"Create"}
        url={`${baseURL}/api/collections/user/${user}`}
        method={"POST"}
        ref={createCollectionDialog}
        onSubmit={(data) => {
          onCreateCollection(data);
          createCollectionDialog.current.close();
        }}
      >
        <div className="w-full">
          <div className="flex flex-col mb-4">
            <label htmlFor="name" className="mb-2 font-bold">
              Name:
            </label>
            <input name="name" id="name" type="text" className="h-8" />
          </div>
          <div className="flex flex-col mb-4">
            <label htmlFor="description" className="mb-2 font-bold">
              Description:
            </label>
            <textarea
              id="description"
              name="description"
              rows={5}
              cols={33}
            ></textarea>
          </div>
          <div className="flex flex-col">
            <label htmlFor="topic" className="mb-2 font-bold">
              Topic/Category:
            </label>
            <select id="topic" name="topic" className="h-8 w-32 px-2 mb-4">
              <option value="Books">Books</option>
              <option value="Signs">Signs</option>
              <option value="Silverware">Silverware</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label htmlFor="thumbnail" className="mb-2 font-bold">
              Image:
            </label>
            <input
              name="thumbnail"
              type="file"
              accept=".png, .jpeg, .jpg"
              className="text-sm"
            />
          </div>
        </div>
      </CustomForm>
    </footer>
  );
}

export default CreateCollection;
