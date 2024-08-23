"use client";
import { useEffect, useState } from "react";
import Comment from "./comment";
import { FaHeart } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useSession } from "next-auth/react";

function ItemDetails({ id, session }) {
  const { data } = useSession();
  const baseURL = process.env.NEXTAUTH_URL || "";
  const [item, setItem] = useState(null);
  const [comments, setComments] = useState(null);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [reactionsCount, setReactionsCount] = useState(0);
  const [loadingMain, setLoadingMain] = useState(true);
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    setIsLiked(
      data
        ? data.reactions.find((reactionId) => reactionId == id)
          ? true
          : false
        : false
    );
  }, [data]);

  useEffect(() => {
    async function fetchData() {
      setLoadingMain(true);
      const resItem = await fetch(`${baseURL}/api/items/${id}`);
      if (resItem.ok) {
        const data = await resItem.json();
        setItem(data);
        setReactionsCount(data.reactions);
      } else {
        console.log(resItem.statusText);
      }
      const resCo = await fetch(`${baseURL}/api/comments/item/${id}`);
      if (resCo.ok) {
        const data = await resCo.json();
        setComments(data);
      } else {
        console.log(resCo.statusText);
      }
      setLoadingMain(false);
    }
    fetchData();
  }, []);

  async function createComment(event) {
    const form = event.currentTarget;
    event.preventDefault();
    if (!data) {
      router.push("/login");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData(form);
      const res = await fetch(`${baseURL}/api/comments/item/${id}`, {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        form.reset();
        setComments((prevComments) => [...prevComments, data]);
        setError(null);
      } else {
        const data = await res.json();
        setError(data.error);
      }
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  }

  async function deleteComment(id) {
    setComments((prevComments) => {
      return prevComments.filter((comment) => comment._id !== id);
    });
  }

  async function addReaction() {
    try {
      if (!data) {
        router.push("/login");
        return;
      }
      setIsLiked(true);
      setReactionsCount((count) => count + 1);
      const res = await fetch(`${baseURL}/api/reactions/item/${id}`, {
        method: "POST",
      });
      if (!res.ok) {
        setIsLiked(false);
        setReactionsCount((count) => count - 1);
      }
    } catch (error) {
      setIsLiked(false);
      setReactionsCount((count) => count - 1);
    }
  }

  async function removeReaction() {
    try {
      if (!data) {
        router.push("/login");
        return;
      }
      setIsLiked(false);
      setReactionsCount((count) => count - 1);
      const res = await fetch(`${baseURL}/api/reactions/item/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        setIsLiked(true);
        setReactionsCount((count) => count + 1);
      }
    } catch (error) {
      setIsLiked(true);
      setReactionsCount((count) => count + 1);
    }
  }

  if (loadingMain) {
    return (
      <section className="w-[600px] rounded-2xl p-4 flex justify-center items-center h-full">
        <div className="loader_1"></div>
      </section>
    );
  }

  return (
    <section className="w-full max-w-[600px] flex flex-col h-full ">
      <div className="bg-[var(--element-color)] p-4 rounded-2xl mb-8">
        {item && (
          <div className="grow">
            <div className="flex gap-x-4 items-center mb-2">
              <span className="font-bold text-2xl">{item["name"]}</span>
              <button
                onClick={() => {
                  if (isLiked) {
                    removeReaction();
                  } else {
                    addReaction();
                  }
                }}
                className={`${
                  isLiked ? "bg-red-600 hover:bg-red-600 active:bg-red-600" : ""
                } flex items-center gap-x-2`}
              >
                {reactionsCount}
                {isLiked ? <FaHeart /> : <FaRegHeart />}
              </button>
            </div>
            <div className="flex flex-col w-full mb-4 px-2">
              {Object.keys(item).map((field, index) => {
                if (
                  field == "reactions" ||
                  field == "_id" ||
                  field == "user" ||
                  field == "name"
                ) {
                  return;
                } else if (field == "tags") {
                  return (
                    <span
                      key={index}
                      className="flex flex-wrap gap-y-1 gap-x-1 pb-2 border-b border-[var(--border-color)]"
                    >
                      <span>{t("item_tags_label")}:</span>
                      {item[field] &&
                        item[field].map((tag, index) => (
                          <span
                            key={index}
                            id={tag}
                            className={`text-[var(--text-color)] text-sm flex border-[var(--border-color)] border rounded-2xl items-center w-fit h-fit py-0.5 px-2 gap-x-1 mr-1 transition-colors`}
                          >
                            {tag}
                          </span>
                        ))}
                    </span>
                  );
                } else {
                  return (
                    <div
                      key={index}
                      className="flex gap-x-1 pb-1 border-b border-[var(--border-color)] mb-1"
                    >
                      <span className="flex flex-col">{field}:</span>
                      <span>{item[field].value}</span>
                    </div>
                  );
                }
              })}
            </div>
          </div>
        )}
      </div>
      <div className="bg-[var(--element-color)] p-4 rounded-2xl flex flex-col mb-4">
        <span className="self-center w-fit font-bold text-xl mb-4 pb-1 border border-[var(--border-color)] rounded-2xl px-2 py-1">
          {t("comment_title")}
        </span>
        <form
          onSubmit={createComment}
          className="flex flex-col gap-x-4 md:px-8 w-full"
        >
          <div className="flex w-full items-center mb-4 gap-x-2 md:gap-x-4">
            <textarea
              rows={1}
              name="content"
              id="content"
              placeholder={t("create_placeholder")}
              className="grow"
            ></textarea>
            <button className="disabled:opacity-50 flex justify-center">
              {loading ? <div className="loader"></div> : t("send_button")}
            </button>
          </div>
          <span className="mx-10 text-red-500 text-sm text-center">
            {error}
          </span>
        </form>
        {comments && (
          <div className="h-full overflow-y-auto flex flex-col gap-y-4">
            {comments.map((comment, index) => (
              <div key={index} className="w-full">
                <Comment
                  id={comment._id}
                  userId={comment.user}
                  onDelete={deleteComment}
                  comment={comment}
                  session={data}
                ></Comment>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default ItemDetails;
