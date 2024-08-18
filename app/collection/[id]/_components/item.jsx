"use client";

import CustomForm from "@/app/_components/customForm";
import DeleteDialog from "@/app/_components/deleteDialog";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

function Item({ item, onDelete }) {
  const baseURL = process.env.NEXTAUTH_URL || "";
  const editItemDialog = useRef(null);
  const deleteDialog = useRef(null);
  const [data, setData] = useState(item);
  const router = useRouter();

  useEffect(() => {
    setData(item);
  }, [item]);

  function getInputOfType(type, name, value) {
    switch (type) {
      case "Integer":
        return (
          <input
            className="w-full"
            type="number"
            name={name}
            id={name}
            defaultValue={value}
          />
        );
      case "String":
        return (
          <input
            className="w-full"
            type="text"
            name={name}
            id={name}
            defaultValue={value}
          />
        );
      case "Multiline text":
        return (
          <textarea className="w-full" name={name} id={name}>
            {value}
          </textarea>
        );
      case "Boolean":
        return (
          <select className="w-full" name={name} id={name} defaultValue={value}>
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        );
      case "Date":
        return (
          <input
            className="w-full"
            type="date"
            name={name}
            id={name}
            defaultValue={value}
          />
        );
    }
  }

  return (
    <div className="bg-[var(--element-color)] mb-4 rounded-2xl p-4">
      <button
        onClick={() => {
          editItemDialog.current.showModal();
        }}
      >
        Edit
      </button>
      <button
        onClick={() => {
          deleteDialog.current.showModal();
        }}
      >
        Delete
      </button>
      {Object.keys(data).map((field, index) => {
        if (field == "_id") return;
        if (field == "name" || field == "tags") {
          return (
            <span key={index} className="flex gap-x-4">
              <span>{field}</span>
              <span>{data[field]}</span>
            </span>
          );
        } else {
          return (
            <span key={index} className="flex gap-x-4">
              <span>{field}</span>
              <span>{data[field].value}</span>
            </span>
          );
        }
      })}
      <button onClick={() => router.push(`/item/${data._id}`)}>
        View
      </button>
      <CustomForm
        title={"Edit item"}
        buttonTitle={"Edit"}
        url={`${baseURL}/api/items/${data._id}`}
        method={"PUT"}
        ref={editItemDialog}
        onSubmit={(res) => {
          editItemDialog.current.close();
          setData(res);
        }}
      >
        {Object.keys(data).map((field, index) => {
          if (field == "_id") return;
          if (field == "name" || field == "tags") {
            return (
              <span key={index} className="flex flex-col w-full">
                <label htmlFor={field} className="mb-1">
                  {field}:
                </label>
                <div className="w-full">
                  {getInputOfType("String", field, data[field])}
                </div>
              </span>
            );
          } else {
            return (
              <span key={index} className="flex flex-col w-full">
                <label htmlFor={field} className="mb-1">
                  {field}:
                </label>
                <div className="w-full">
                  {getInputOfType(data[field].type, field, data[field].value)}
                </div>
              </span>
            );
          }
        })}
      </CustomForm>
      <DeleteDialog
        buttonTitle={"Delete"}
        url={`${baseURL}/api/items/${data._id}`}
        onSubmit={() => {
          onDelete(data._id);
          deleteDialog.current.close();
        }}
        ref={deleteDialog}
      >
        <span className="text-[var(--text-color)] text-center mb-6">
          Are you sure you want to delete this item?
        </span>
      </DeleteDialog>
    </div>
  );
}

export default Item;
