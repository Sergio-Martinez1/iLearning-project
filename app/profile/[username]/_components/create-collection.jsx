"use client";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";

function CreateCollection({ user, onCreateCollection }) {
  let createCollectionDialog = useRef(null);
  const [loading, setLoading] = useState(false);
  const baseURL = process.env.NEXTAUTH_URL || "";
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();

  function showAddCollectionDialog() {
    createCollectionDialog.current.showModal();
  }

  function closeDialog() {
    reset();
    createCollectionDialog.current.close("exit");
  }

  const createCollection = handleSubmit(async (data) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("topic", data.topic);
    if (data.thumbnail[0]) {
      formData.append("thumbnail", data.thumbnail[0]);
    }
    const res = await fetch(`${baseURL}/api/collections/user/${user}`, {
      method: "POST",
      body: formData,
    });
    if (res.ok) {
      const data = await res.json();
      reset();
      onCreateCollection(data);
      createCollectionDialog.current.close("succes");
    }
    setLoading(false);
  });
  return (
    <footer className="fixed py-4 bottom-0 left-1/2 translate-x-[-50%] w-full flex justify-center bg-[var(--element-color)]">
      <button onClick={showAddCollectionDialog} className="text-sm w-64 h-12">
        Add new collection
      </button>
      <dialog
        className="bg-[var(--element-color)] w-[320px] h-fit border-[var(--border-color)] border rounded-2xl z-10 p-6"
        ref={createCollectionDialog}
      >
        <div className="flex flex-col w-full h-full">
          <h1 className="text-2xl font-bold mb-4 w-full flex justify-between">
            <span className="flex justify-self-center self-center">
              New collection
            </span>
            <button
              className="flex justify-self-end w-fit h-fit text-[12px] py-1 px-4"
              onClick={closeDialog}
            >
              X
            </button>
          </h1>
          <form onSubmit={createCollection} className="flex flex-col">
            <div className="flex flex-col mb-4">
              <label htmlFor="name" className="mb-2 font-bold">
                Name:
              </label>
              <input
                type="text"
                className="h-8"
                {...register("name", {
                  required: { value: true, message: "Name is required" },
                })}
              />
              {errors.name && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </span>
              )}
            </div>
            <div className="flex flex-col mb-4">
              <label htmlFor="description" className="mb-2 font-bold">
                Description:
              </label>
              <textarea
                id="description"
                rows={5}
                cols={33}
                {...register("description", {
                  required: { value: true, message: "Description is required" },
                })}
              ></textarea>
              {errors.description && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.description.message}
                </span>
              )}
            </div>
            <div className="flex flex-col">
              <label htmlFor="topic" className="mb-2 font-bold">
                Topic/Category:
              </label>
              <select
                id="topic"
                className="h-8 w-32 px-2 mb-4"
                {...register("topic", {
                  required: { value: true, message: "Topic is required" },
                })}
              >
                <option value="Books">Books</option>
                <option value="Signs">Signs</option>
                <option value="Silverware">Silverware</option>
                <option value="Other">Other</option>
              </select>
              {errors.topic && (
                <span className="text-red-500 text-sm ml-2 mt-1">
                  {errors.topic.message}
                </span>
              )}
            </div>
            <div className="flex flex-col">
              <label htmlFor="thumbnail" className="mb-2 font-bold">
                Image:
              </label>
              <input
                type="file"
                accept=".png, .jpeg, .jpg"
                className="text-sm"
                {...register("thumbnail")}
              />
            </div>
            <button
              type="submit"
              className="mt-7 w-40 self-center flex justify-center"
            >
              {loading ? <div className="loader"></div> : "Create"}
            </button>
          </form>
        </div>
      </dialog>
    </footer>
  );
}

export default CreateCollection;
