"use client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

function LoginForm({ errorMessage }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const [error, setError] = useState(errorMessage);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (res.error) {
      setError(res.error);
    } else {
      window.location.reload()
      //router.refresh();
    }
    setLoading(false);
  });

  const email_error = t("email_error");
  const password_error = t("password_error");

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col px-8 py-4 bg-[var(--element-color)] rounded-2xl"
    >
      <span className="self-center text-3xl font-bold mt-4 mb-8">
        {t("title")}
      </span>
      {error && (
        <span className="bg-red-500 text-white text-sm rounded-2xl flex justify-center items-center mb-4 px-2 py-1">
          {error}
        </span>
      )}
      <div className="mb-4 flex flex-col">
        <input
          type="email"
          placeholder={t("email_placeholder")}
          {...register("email", {
            required: { value: true, message: email_error },
          })}
          className="px-3 py-2 rounded-2xl bg-[var(--bg-color)] shadow-[0_1px_2px_1px_rgba(0,0,0,0.15)]"
        />
        {errors.email && (
          <span className="text-red-500 text-sm ml-2 mt-1">
            {errors.email.message}
          </span>
        )}
      </div>
      <div className="mb-8 flex flex-col">
        <input
          type="password"
          placeholder={t("password_placeholder")}
          {...register("password", {
            required: { value: true, message: password_error },
          })}
          className="px-3 py-2 rounded-2xl bg-[var(--bg-color)] shadow-[0_1px_2px_1px_rgba(0,0,0,0.15)]"
        />
        {errors.password && (
          <span className="text-red-500 text-sm ml-2 mt-1">
            {errors.password.message}
          </span>
        )}
      </div>
      <button
        className="w-32 rounded-2xl px-4 py-2 self-center mb-6 shadow-[0_1px_2px_1px_rgba(0,0,0,0.15)] flex justify-center disabled:opacity-40"
        disabled={loading}
      >
        {loading ? <div className="loader"></div> : t("login_button")}
      </button>
      <span className="text-sm flex gap-x-2">
        {t("note")}
        <Link
          className="text-[var(--accent-color)] hover:underline"
          href="/register"
        >
          {t("note_1")}
        </Link>
      </span>
    </form>
  );
}

export default LoginForm;
