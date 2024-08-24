"use client";
import { useRef, useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { RiEdit2Line } from "react-icons/ri";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { MdOutlineImageNotSupported } from "react-icons/md";
import { useTranslation } from "react-i18next";

function Collection({
  collection,
  onDeleteCollection,
  onEditCollection,
  author,
}) {
  const baseURL = process.env.NEXTAUTH_URL || "";
  const router = useRouter();
  const deleteDialog = useRef(null);
  const editDialog = useRef(null);
  const [loading, setLoading] = useState(false);
  const [nameValue, setNameValue] = useState(collection.name);
  const [descriptionValue, setDescriptionValue] = useState(
    collection.description
  );
  const [topicValue, setTopicValue] = useState(collection.topic);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { t } = useTranslation();

  function displayDeleteDialog() {
    deleteDialog.current.showModal();
  }

  function displayEditDialog() {
    editDialog.current.showModal();
  }

  function closeEditDialog() {
    setNameValue(collection.name);
    setDescriptionValue(collection.description);
    setTopicValue(collection.topic);
    editDialog.current.close("exit");
  }

  async function deleteCollection() {
    setLoading(true);
    let data = { id: collection._id };
    const res = await fetch(`${baseURL}/api/collections/${collection._id}`, {
      method: "DELETE",
      body: JSON.stringify(data),
    });
    if (res.ok) {
      onDeleteCollection(collection._id);
      deleteDialog.current.close("succes");
    }
    setLoading(false);
  }

  const editCollection = handleSubmit(async (data) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("topic", data.topic);
    formData.append("thumbnail_url", collection.thumbnail_url);
    if (data.thumbnail[0]) {
      formData.append("thumbnail", data.thumbnail[0]);
    }
    const res = await fetch(`${baseURL}/api/collections/${collection._id}`, {
      method: "PUT",
      body: formData,
    });
    if (res.ok) {
      const newCollection = await res.json();
      onEditCollection(newCollection);
      editDialog.current.close("success");
    }
    setLoading(false);
  });

  return (
    <section className="w-fit">
      <div className="flex flex-col mb-4 bg-[var(--element-color)] rounded-2xl max-w-96 md:w-96 px-4 py-4">
        <div className="flex gap-x-4 items-center font-bold text-xl flex-wrap">
          <span className="text-2xl w-full mb-1">{collection.name}</span>
          <div className="flex items-center gap-x-4 grow justify-between">
            <span className="border border-[var(--border-color)] h-fit w-fit rounded-2xl px-2 text-sm mb-1">
              {collection.topic}
            </span>
            {author && (
              <div className="flex gap-x-4">
                <button
                  className="h-fit self-start flex"
                  onClick={displayEditDialog}
                >
                  <RiEdit2Line />
                </button>
                <button
                  onClick={displayDeleteDialog}
                  className="h-fit self-start"
                >
                  <MdDeleteOutline />
                </button>
              </div>
            )}
          </div>
        </div>
        <span className="mb-2">{collection.description}</span>
        {collection.thumbnail_url ? (
          <img
            className="mb-4 rounded-2xl w-[320px] h-[200px] object-contain self-center"
            src={collection.thumbnail_url}
          />
        ) : (
          <div className="w-[320px] h-[200px] flex flex-col justify-center items-center border border-[var(--border-color)] mb-4 rounded-2xl self-center">
            <MdOutlineImageNotSupported size={40} />
            <span className="mt-2">{t("collection_no_image")}</span>
          </div>
        )}
        <button onClick={() => router.push(`/collection/${collection._id}`)}>
          {t("collection_view_button")}
        </button>
      </div>
      <dialog
        ref={deleteDialog}
        className="bg-[var(--element-color)] w-[320px] h-fit border-[var(--border-color)] border rounded-2xl z-10 p-6"
      >
        <div className="flex flex-col">
          <span className="text-[var(--text-color)] mb-4">
            {t("delete_confirmation_text")}
          </span>
          <div className="w-full flex justify-evenly">
            <button
              onClick={() => {
                deleteDialog.current.close();
              }}
            >
              {t("delete_cancel_button")}
            </button>
            <button
              className="bg-[var(--warning-color)] hover:bg-[var(--hover-warning-color)] active:bg-[var(--warning-color)] flex justify-center disabled:opacity-40"
              onClick={deleteCollection}
              disabled={loading}
            >
              {loading ? <div className="loader"></div> : t("delete_confirm")}
            </button>
          </div>
        </div>
      </dialog>
      <dialog
        ref={editDialog}
        className="rounded-2xl bg-[var(--element-color)]"
      >
        <form
          onSubmit={editCollection}
          className="rounded-2xl pb-4 flex flex-col w-80"
        >
          <h1 className="text-2xl font-bold px-4 pt-4 pb-2 w-full flex justify-between sticky top-0 bg-[var(--element-color)] rounded-b-2xl">
            <span className="flex justify-self-center self-center">
              {t("edit_dialog_title")}
            </span>
            <button
              type="button"
              className="flex justify-self-end w-fit h-fit text-[12px] py-1 px-4"
              onClick={closeEditDialog}
            >
              X
            </button>
          </h1>
          <div className="flex gap-x-2 mb-4 px-6 flex-wrap gap-y-2 justify-center">
            <div className="w-full">
              <div className="flex flex-col mb-4">
                <label htmlFor="name" className="mb-2 font-bold">
                  {t("edit_dialog_label_1")}:
                </label>
                <input
                  type="text"
                  className="h-8"
                  value={nameValue}
                  onInput={(event) => {
                    setNameValue(event.target.value);
                  }}
                  {...register("name", {
                    required: {
                      value: true,
                      message: t("edit_dialog_error_label_1"),
                    },
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
                  {t("edit_dialog_label_2")}
                </label>
                <textarea
                  id="description"
                  rows={5}
                  cols={33}
                  value={descriptionValue}
                  onInput={(event) => {
                    setDescriptionValue(event.target.value);
                  }}
                  {...register("description", {
                    required: {
                      value: true,
                      message: t("edit_dialog_error_label_2"),
                    },
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
                  {t("edit_dialog_label_3")}
                </label>
                <select
                  id="topic"
                  className="h-8 w-32 px-2 mb-4"
                  value={topicValue}
                  onInput={(event) => {
                    setTopicValue(event.target.value);
                  }}
                  {...register("topic", {
                    required: {
                      value: true,
                      message: t("edit_dialog_error_label_3"),
                    },
                  })}
                >
                  <option value="Books">
                    {t("edit_dialog_label_3_option_1")}
                  </option>
                  <option value="Signs">
                    {t("edit_dialog_label_3_option_2")}
                  </option>
                  <option value="Silverware">
                    {t("edit_dialog_label_3_option_3")}
                  </option>
                  <option value="Other">
                    {t("edit_dialog_label_3_option_4")}
                  </option>
                </select>
                {errors.topic && (
                  <span className="text-red-500 text-sm ml-2 mt-1">
                    {errors.topic.message}
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                {collection.thumbnail_url && (
                  <span className="font-bold text-[var(--text-color)] mb-2">
                    {t("edit_dialog_actual_image")}
                  </span>
                )}
                {collection.thumbnail_url && (
                  <img
                    className="mb-4 h-[200px] object-contain"
                    src={collection.thumbnail_url}
                  />
                )}
                <label htmlFor="thumbnail" className="mb-2 font-bold">
                  {t("edit_dialog_new_image")}
                </label>
                <input
                  type="file"
                  accept=".png, .jpeg, .jpg"
                  className="text-sm"
                  {...register("thumbnail")}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="mt-7 w-40 self-center flex justify-center disabled:opacity-40"
            disabled={loading}
          >
            {loading ? (
              <div className="loader"></div>
            ) : (
              t("edit_dialog_submit_button")
            )}
          </button>
        </form>
      </dialog>
    </section>
  );
}

export default Collection;
