"use client";
import { useEffect, useState } from "react";
import Comment from "./comment";
import { FaHeart } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { useRouter } from "next/navigation";

function ItemDetails({ id, session }) {
  const baseURL = process.env.NEXTAUTH_URL || "";
  const [item, setItem] = useState(null);
  const [comments, setComments] = useState(null);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(
    session
      ? session.reactions.find((reactionId) => reactionId == id)
        ? true
        : false
      : false
  );
  const [reactionsCount, setReactionsCount] = useState(0);
  const [loadingMain, setLoadingMain] = useState(true);
  const router = useRouter();

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
    if (!session) {
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
        setComments((prevComments) => [data, ...prevComments]);
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
      if (!session) {
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
      if (!session) {
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
    <section className="w-[600px] bg-[var(--element-color)] rounded-2xl p-4 flex flex-col h-full">
      {item && (
        <div>
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
                  <div
                    key={index}
                    className="flex gap-x-1 pb-1 border-b border-[var(--border-color)] mb-1"
                  >
                    <span className="flex flex-col">Tags:</span>
                    <span>{item[field]}</span>
                  </div>
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
      <span className="self-center w-fit font-bold text-xl mb-4 pb-1 border border-[var(--border-color)] rounded-2xl px-2 py-1">
        Comments
      </span>
      <form onSubmit={createComment} className="flex flex-col gap-x-4 w-full">
        <div className="flex w-full items-center mb-4 gap-x-4">
          <textarea
            rows={1}
            name="content"
            id="content"
            placeholder="Write your comments..."
            className="grow"
          ></textarea>
          <button className="disabled:opacity-50 flex justify-center">
            {loading ? <div className="loader"></div> : "Send"}
          </button>
        </div>
        <span className="mx-10 text-red-500 text-sm text-center">{error}</span>
      </form>
      {comments && (
        <div className="h-full overflow-y-auto">
          {comments.map((comment, index) => (
            <div key={index} className="mb-4 w-full">
              <Comment
                id={comment._id}
                userId={comment.user}
                onDelete={deleteComment}
                comment={comment}
                session={session}
              ></Comment>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default ItemDetails;
