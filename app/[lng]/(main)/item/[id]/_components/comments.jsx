"use client";
import { pusherClient } from "@/libs/pusher";
import Comment from "./comment";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { sendMessage, deleteMessage } from "@/app/[lng]/actions/message.action";
import { useRouter } from "next/navigation";

function Comments({ session, id }) {
  const baseURL = process.env.NEXTAUTH_URL || "";
  const [loading, setLoading] = useState(null);
  const [loadingMain, setLoadingMain] = useState(true);
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);
  const { t } = useTranslation();
  const router = useRouter();

  useEffect(() => {
    pusherClient.subscribe(`comments_${id}`);
    pusherClient.bind("upcoming-message", (data) => {
      setComments((prevComments) => [...prevComments, data.message]);
    });
    pusherClient.bind("removing-message", (data) => {
      setComments((prevComments) => {
        return prevComments.filter(
          (comment) => comment._id !== data.message
        );
      });
    });

    async function fetchData() {
      setLoadingMain(true);
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
    return () => pusherClient.unsubscribe("comments");
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
        // setComments((prevComments) => [...prevComments, data]);
        setError(null);
        await sendMessage(data, `comments_${id}`);
      } else {
        const data = await res.json();
        setError(data.error);
      }
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  }

  async function deleteComment(commentId) {
    await deleteMessage(commentId, `comments_${id}`);
    // setComments((prevComments) => {
    //   return prevComments.filter((comment) => comment._id !== id);
    // });
  }

  const uniqueComments = comments.filter(
    (value, index, self) => self.indexOf(value) === index
  );

  if (loadingMain) {
    return (
      <div className="w-20 h-20 self-center justify-self-center flex justify-center items-center">
        <div className="loader_1"></div>
      </div>
    );
  }

  return (
    <>
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
          <button
            className="disabled:opacity-40 flex justify-center"
            disabled={loading}
          >
            {loading ? <div className="loader"></div> : t("send_button")}
          </button>
        </div>
        <span className="mx-10 text-red-500 text-sm text-center">{error}</span>
      </form>
      {comments && (
        <div className="h-full overflow-y-auto flex flex-col gap-y-4">
          {uniqueComments.map((comment, index) => (
            <div key={index} className="w-full">
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
    </>
  );
}

export default Comments;
