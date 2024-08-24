"use client";
import { useEffect, useRef, useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { RiEdit2Line } from "react-icons/ri";
import { useRouter } from "next/navigation";
import { MdOutlineImageNotSupported } from "react-icons/md";
import { useTranslation } from "react-i18next";
import CustomForm from "@/app/[lng]/_components/customForm";

function Collection({
  collectionData,
  onDeleteCollection,
  onEditCollection,
  author,
}) {
  const baseURL = process.env.NEXTAUTH_URL || "";
  const router = useRouter();
  const deleteDialog = useRef(null);
  const editDialog = useRef(null);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const inputName = useRef(null);
  const inputDescription = useRef(null);
  const inputTopic = useRef(null);
  const [collection, setCollection] = useState(collectionData);

  useEffect(() => {
    setCollection(collectionData);
    inputName.current.value = collectionData.name
    inputDescription.current.value = collectionData.description
    inputTopic.current.value = collectionData.topic
  }, [collectionData]);

  function displayDeleteDialog() {
    deleteDialog.current.showModal();
  }

  function displayEditDialog() {
    editDialog.current.showModal();
  }

  function closeEditDialog() {
    inputName.current.value = collectionData.name;
    inputDescription.current.value = collectionData.description;
    inputTopic.current.value = collectionData.topic;
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

      <CustomForm
        title={t("edit_dialog_title")}
        buttonTitle={t("edit_dialog_submit_button")}
        url={`${baseURL}/api/collections/${collection._id}`}
        method={"PUT"}
        ref={editDialog}
        onClose={closeEditDialog}
        onSubmit={(data) => {
          onEditCollection(data);
          editDialog.current.close("success");
        }}
      >
        <div className="w-full">
          <div className="flex flex-col mb-4">
            <label htmlFor="name" className="mb-2 font-bold">
              {t("edit_dialog_label_1")}:
            </label>
            <input
              ref={inputName}
              name="name"
              id="name"
              type="text"
              className="h-8"
            />
          </div>
          <div className="flex flex-col mb-4">
            <label htmlFor="description" className="mb-2 font-bold">
              {t("edit_dialog_label_2")}
            </label>
            <textarea
              ref={inputDescription}
              name="description"
              id="description"
              rows={5}
              cols={33}
            ></textarea>
          </div>
          <div className="flex flex-col">
            <label htmlFor="topic" className="mb-2 font-bold">
              {t("edit_dialog_label_3")}
            </label>
            <select
              name="topic"
              ref={inputTopic}
              id="topic"
              className="h-8 w-32 px-2 mb-4"
            >
              <option value="Books">{t("edit_dialog_label_3_option_1")}</option>
              <option value="Signs">{t("edit_dialog_label_3_option_2")}</option>
              <option value="Silverware">
                {t("edit_dialog_label_3_option_3")}
              </option>
              <option value="Other">{t("edit_dialog_label_3_option_4")}</option>
            </select>
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
              type="hidden"
              name="thumbnail_url"
              value={collection.thumbnail_url || ""}
            />
            <input
              name="thumbnail"
              type="file"
              accept=".png, .jpeg, .jpg"
              className="text-sm"
            />
          </div>
        </div>
      </CustomForm>
    </section>
  );
}

export default Collection;
