"use client";
import { useRef } from "react";
import CustomForm from "@/app/[lng]/_components/customForm";
import { useTranslation } from "react-i18next";

function CreateCollection({ user, onCreateCollection }) {
  let createCollectionDialog = useRef(null);
  const baseURL = process.env.NEXTAUTH_URL || "";
  const { t } = useTranslation();

  return (
    <footer className="fixed py-4 bottom-0 left-1/2 translate-x-[-50%] w-full flex justify-center bg-[var(--element-color)]">
      <button
        onClick={() => {
          createCollectionDialog.current.showModal();
        }}
        className="text-sm w-64 h-12"
      >
        {t("add_button")}
      </button>
      <CustomForm
        title={t("new_dialog_title")}
        buttonTitle={t("create_button")}
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
              {t("edit_dialog_label_1")}
            </label>
            <input name="name" id="name" type="text" className="h-8" />
          </div>
          <div className="flex flex-col mb-4">
            <label htmlFor="description" className="mb-2 font-bold">
              {t("edit_dialog_label_2")}
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
              {t("edit_dialog_label_3")}
            </label>
            <select id="topic" name="topic" className="h-8 w-32 px-2 mb-4">
              <option value="Books">{t("edit_dialog_label_3_option_1")}</option>
              <option value="Signs">{t("edit_dialog_label_3_option_2")}</option>
              <option value="Silverware">{t("edit_dialog_label_3_option_3")}</option>
              <option value="Other">{t("edit_dialog_label_3_option_4")}</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label htmlFor="thumbnail" className="mb-2 font-bold">
              {t("new_dialog_label_4")}:
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
