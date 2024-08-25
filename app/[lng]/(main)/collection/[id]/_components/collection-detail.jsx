"use client";
import { useEffect, useRef, useState } from "react";
import { IoIosClose } from "react-icons/io";
import CustomForm from "@/app/[lng]/_components/customForm";
import Item from "./item";
import DeleteDialog from "@/app/[lng]/_components/deleteDialog";
import { IoWarningOutline } from "react-icons/io5";
import { MdOutlineImageNotSupported } from "react-icons/md";
import { CiSettings } from "react-icons/ci";
import { useTranslation } from "react-i18next";
import TagsInput from "./tagsInput";
import { revalidatePath } from "next/cache";

function CollectionDetail({ id, session }) {
  const [collection, setCollection] = useState(null);
  const [items, setItems] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [deleteBody, setDeleteBody] = useState({});
  const itemsConfig = useRef(null);
  const addItemDialog = useRef(null);
  const deleteFieldDialog = useRef(null);
  const baseURL = process.env.NEXTAUTH_URL || "";
  const [loading, setLoading] = useState(true);
  const [author, setAuthor] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const resCol = await fetch(`${baseURL}/api/collections/${id}`);
      if (resCol.ok) {
        const data = await resCol.json();
        setCollection(data);
        if (session && session.role == "admin") {
          setAuthor(true);
        } else {
          setAuthor(session ? data.user.username == session.user.name : false);
        }
      } else {
        console.log(resCol.statusText);
      }
      const resIt = await fetch(`${baseURL}/api/items/collection/${id}`);
      if (resIt.ok) {
        const data = await resIt.json();
        setItems(data);
      } else {
        console.log(resIt.statusText);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  function deleteItem(id) {
    setItems((prevItems) => {
      return prevItems.filter((item) => item._id !== id);
    });
  }

  function getInputOfType(type, name) {
    switch (type) {
      case "Integer":
        return <input className="w-full" type="number" name={name} id={name} />;
      case "String":
        return <input className="w-full" type="text" name={name} id={name} />;
      case "Multiline text":
        return <textarea className="w-full" name={name} id={name}></textarea>;
      case "Boolean":
        return (
          <select className="w-full" name={name} id={name}>
            <option value="true">{t("item_field_boolean_1")}</option>
            <option value="false">{t("item_field_boolean_2")}</option>
          </select>
        );
      case "Date":
        return <input className="w-full" type="date" name={name} id={name} />;
    }
  }

  if (loading) {
    return (
      <section className="lg:grid lg:grid-cols-[1fr_2fr] lg:gap-x-8 justify-center items-center w-full h-full">
        <section className="px-4 w-full flex items-center justify-center h-full">
          <div className="loader_1"></div>
        </section>
        <section className="px-4 w-full flex items-center justify-center h-full">
          <div className="loader_1"></div>
        </section>
      </section>
    );
  }

  return (
    <section className="flex max-lg:flex-col lg:gap-x-8 max-lg:items-center max-w-[1600px] mx-auto relative">
      {collection && (
        <div className="flex flex-col bg-[var(--element-color)] rounded-2xl p-4 mb-4 max-lg:w-full max-w-[600px] lg:min-w-[400px] xl:w-[500px] h-fit lg:sticky top-0">
          <div className="flex flex-wrap items-center gap-x-2 mb-2">
            <span className="font-bold text-2xl w-full mb-2">
              {collection.name}
            </span>
            <div className="flex justify-between w-full items-center">
              <span className="border-[var(--border-color)] border rounded-2xl p-1 text-sm w-fit h-fit">
                {collection.topic}
              </span>
              {author && (
                <button
                  onClick={() => {
                    itemsConfig.current.showModal();
                  }}
                >
                  <CiSettings size={30} />
                </button>
              )}
            </div>
          </div>
          <span className="mb-2">{collection.description}</span>
          {collection.thumbnail_url ? (
            <img
              className="mb-4 rounded-2xl h-[300px] object-contain"
              src={collection.thumbnail_url}
            />
          ) : (
            <div className="h-[300px] flex flex-col justify-center items-center border border-[var(--border-color)] mb-4 rounded-2xl">
              <MdOutlineImageNotSupported size={40} />
              <span className="mt-2">{t("no_image_text")}</span>
            </div>
          )}
          {author && (
            <button
              onClick={() => {
                addItemDialog.current.showModal();
              }}
            >
              {t("add_item_button")}
            </button>
          )}
          <CustomForm
            title={t("fields_dialog_title")}
            buttonTitle={"+"}
            url={`${baseURL}/api/collections/config/${id}`}
            method={"PUT"}
            ref={itemsConfig}
            onSubmit={(data) => {
              setCollection(data.collection);
              setItems(data.items);
            }}
          >
            <span className="text-[var(--text-color)] flex font-bold self-end w-full justify-center mb-2">
              {t("fields_dialog_subtitle_1")}:
            </span>
            <div className="flex gap-x-2 mb-4 flex-wrap gap-y-2 justify-center">
              <span className="text-[var(--text-color)] border border-[var(--border-color)] rounded-2xl px-2 flex justify-center items-center">
                id
              </span>
              <span className="text-[var(--text-color)] border border-[var(--border-color)] rounded-2xl px-2 flex justify-center items-center">
                {t("field_1")}
              </span>
              <span className="text-[var(--text-color)] border border-[var(--border-color)] rounded-2xl px-2 flex justify-center items-center">
                {t("field_2")}
              </span>
              {Object.keys(collection.optionalFields).map((field, index) => (
                <span
                  className="text-[var(--text-color)] border border-[var(--border-color)] rounded-2xl px-2 py-1 flex justify-center items-center gap-x-2"
                  key={index}
                >
                  {collection.optionalFields[field].name}
                  <button
                    type="button"
                    className="p-0 m-0 w-6 h-6 flex justify-center items-center"
                    onClick={() => {
                      deleteFieldDialog.current.showModal();
                      setDeleteBody({
                        name: collection.optionalFields[field].name,
                      });
                    }}
                  >
                    <IoIosClose />
                  </button>
                </span>
              ))}
            </div>
            <span className="text-[var(--text-color)] font-bold mb-4">
              {t("fields_dialog_button")}
            </span>
            <div className="flex gap-x-4 mb-4">
              <input
                name="name"
                id="name"
                type="text"
                placeholder={t("field_placeholder")}
                className="w-32"
              />
              <select name="type" id="type" className="w-32">
                <option value="Integer">{t("fields_dialog_type_1")}</option>
                <option value="String">{t("fields_dialog_type_2")}</option>
                <option value="Multiline text">
                  {t("fields_dialog_type_3")}
                </option>
                <option value="Boolean">{t("fields_dialog_type_4")}</option>
                <option value="Date">{t("fields_dialog_type_5")}</option>
              </select>
            </div>
          </CustomForm>
          <CustomForm
            title={t("new_item_dialog_title")}
            buttonTitle={t("new_item_dialog_button_title")}
            url={`${baseURL}/api/items/collection/${id}`}
            method={"POST"}
            ref={addItemDialog}
            onSubmit={async (data) => {
              addItemDialog.current.close();
              setItems((prevItems) => [...prevItems, data]);
              await fetch(`${baseURL}/api/revalidate`);
            }}
          >
            <span>
              <label htmlFor="name" className="mb-1">
                {t("new_item_dialog_field_1")}:
              </label>
              <input className="w-full" type="text" name="name" id="name" />
            </span>
            <span className="flex flex-col w-full">
              <label htmlFor="tags" className="mb-1">
                {t("new_item_dialog_field_2")}:
              </label>
              <TagsInput itemTags={[]}></TagsInput>
            </span>
            {Object.keys(collection.optionalFields).map((field, index) => (
              <span key={index} className="flex flex-col w-full">
                <label
                  htmlFor={collection.optionalFields[field].name}
                  className="mb-1"
                >
                  {collection.optionalFields[field].name}:
                </label>
                <div className="w-full">
                  {getInputOfType(
                    collection.optionalFields[field].type,
                    collection.optionalFields[field].name
                  )}
                </div>
              </span>
            ))}
          </CustomForm>
          <DeleteDialog
            buttonTitle={t("delete_dialog_button_delete")}
            url={`${baseURL}/api/collections/config/${id}`}
            body={deleteBody}
            onSubmit={(data) => {
              deleteFieldDialog.current.close();
              setCollection(data.collection);
              setItems(data.items);
            }}
            ref={deleteFieldDialog}
          >
            <span className="text-[var(--text-color)] mb-6 text-xl">
              <span className="flex flex-col w-full justify-center items-center mb-2 gap-y-1">
                <IoWarningOutline className="text-yellow-300" />
                <b className="text-red-500">{t("delete_dialog_text_1")}</b>
              </span>
              <span className="flex text-center w-full">
                {t("delete_dialog_text_2")}
              </span>
            </span>
          </DeleteDialog>
        </div>
      )}

      <div className="flex flex-col max-lg:items-center w-full">
        <span className="font-bold text-4xl mb-4 flex w-full h-fit">
          {t("items_title")}:
        </span>
        {items.length > 0 ? (
          <div className="lg:grow flex gap-x-8 gap-y-8 flex-wrap h-full w-full justify-center">
            {items.map((item, index) => {
              return (
                <Item
                  item={item}
                  key={index}
                  onDelete={deleteItem}
                  author={author}
                ></Item>
              );
            })}
          </div>
        ) : (
          <span className="flex w-fit h-full items-center mx-auto self-center opacity-50">
            {t("no_content")}
          </span>
        )}
      </div>
    </section>
  );
}

export default CollectionDetail;
