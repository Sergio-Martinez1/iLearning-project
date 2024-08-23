"use client";
import DeleteDialog from "@/app/[lng]/_components/deleteDialog";
import { useRef } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { useTranslation } from "react-i18next";

function Comment({ id, onDelete, comment, session }) {
  const deleteDialog = useRef(null);
  const baseURL = process.env.NEXTAUTH_URL || "";
  const author = session ? comment.user.username == session.user.name : false;
  const { t } = useTranslation();

  return (
    <div className="bg-[var(--bg-color)] rounded-2xl px-4 py-3 flex justify-between items-center">
      <div className="flex flex-col">
        <span className="text-sm opacity-60 mb-1">{comment.user.username}</span>
        {comment.content}
      </div>
      {author && (
        <button
          className="p-1 self-start"
          onClick={() => {
            deleteDialog.current.showModal();
          }}
        >
          <MdDeleteOutline size={20}></MdDeleteOutline>
        </button>
      )}
      <DeleteDialog
        buttonTitle={t("delete_button")}
        url={`${baseURL}/api/comments/${id}`}
        onSubmit={() => {
          deleteDialog.current.close();
          onDelete(id);
        }}
        ref={deleteDialog}
      >
        <span className="text-[var(--text-color)] text-center mb-6">
          {t("delete_dialog_text")}
        </span>
      </DeleteDialog>
    </div>
  );
}

export default Comment;
