"use client";
import { useEffect, useRef, useState } from "react";
import { IoIosClose } from "react-icons/io";
import CustomForm from "@/app/_components/customForm";
import Item from "./item";
import DeleteDialog from "@/app/_components/deleteDialog";
import { IoWarningOutline } from "react-icons/io5";
import { MdOutlineImageNotSupported } from "react-icons/md";
import { CiSettings } from "react-icons/ci";

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

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const resCol = await fetch(`${baseURL}/api/collections/${id}`);
      if (resCol.ok) {
        const data = await resCol.json();
        setCollection(data);
        setAuthor(session ? data.user.username == session.user.name : false);
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
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        );
      case "Date":
        return <input className="w-full" type="date" name={name} id={name} />;
    }
  }

  if (loading) {
    return (
      <section className="md:grid md:grid-cols-[1fr_2fr] md:gap-x-8 justify-center items-center w-full h-full">
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
    <section className="md:flex md:gap-x-8">
      {collection && (
        <div className="flex flex-col bg-[var(--element-color)] rounded-2xl p-4 mb-4 md:min-w-[400px] xl:w-[500px] h-fit sticky top-0">
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
              <span className="mt-2">No image</span>
            </div>
          )}
          {author && (
            <button
              onClick={() => {
                addItemDialog.current.showModal();
              }}
            >
              Add item
            </button>
          )}
          <CustomForm
            title={"Configuration"}
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
              Items fields:
            </span>
            <div className="flex gap-x-2 mb-4 flex-wrap gap-y-2 justify-center">
              <span className="text-[var(--text-color)] border border-[var(--border-color)] rounded-2xl px-2 flex justify-center items-center">
                id
              </span>
              <span className="text-[var(--text-color)] border border-[var(--border-color)] rounded-2xl px-2 flex justify-center items-center">
                name
              </span>
              <span className="text-[var(--text-color)] border border-[var(--border-color)] rounded-2xl px-2 flex justify-center items-center">
                tags
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
              Add more fields:
            </span>
            <div className="flex gap-x-4 mb-4">
              <input
                name="name"
                id="name"
                type="text"
                placeholder="Field name..."
                className="w-32"
              />
              <select name="type" id="type" className="w-32">
                <option value="Integer">Integer</option>
                <option value="String">String</option>
                <option value="Multiline text">Multiline text</option>
                <option value="Boolean">Boolean</option>
                <option value="Date">Date</option>
              </select>
            </div>
          </CustomForm>
          <CustomForm
            title={"New item"}
            buttonTitle={"Create"}
            url={`${baseURL}/api/items/collection/${id}`}
            method={"POST"}
            ref={addItemDialog}
            onSubmit={(data) => {
              addItemDialog.current.close();
              setItems((prevItems) => [...prevItems, data]);
            }}
          >
            <span>
              <label htmlFor="name" className="mb-1">
                Name:
              </label>
              <input className="w-full" type="text" name="name" id="name" />
            </span>
            <span>
              <label htmlFor="name" className="mb-1">
                Tags:
              </label>
              <input className="w-full" type="text" name="tags" id="tags" />
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
            buttonTitle={"Delete"}
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
                <b className="text-red-500">Caution</b>
              </span>
              <span className="flex text-center w-full">
                This field will be deleted from all your items and can not be
                recovered!!
              </span>
            </span>
          </DeleteDialog>
        </div>
      )}

      {items && (
        <div className="md:grow md:flex md:gap-x-4 md:flex-wrap h-fit">
          {items.map((item, index) => {
            return <Item item={item} key={index} onDelete={deleteItem} author={author}></Item>;
          })}
        </div>
      )}
    </section>
  );
}

export default CollectionDetail;
