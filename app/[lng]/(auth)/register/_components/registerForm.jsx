"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { t } = useTranslation();
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(null);

  const onSubmit = handleSubmit(async (data) => {
    if (data.password !== data.confirmPassword) {
      return alert("Passwords do not match");
    }

    setLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        username: data.username,
        email: data.email,
        password: data.password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.ok) {
      router.push("/login");
    } else {
      const error = await res.json();
      setError(error.error);
    }
    setLoading(false);
  });

  const username_error = t("username_error");
  const email_error = t("email_error");
  const password_error = t("password_error");
  const confirm_error = t("confirm_error");

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col px-8 py-4 bg-[var(--element-color)] w-96 rounded-2xl"
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
          type="text"
          placeholder={t("username_placeholder")}
          {...register("username", {
            required: { value: true, message: username_error },
          })}
          className="px-3 py-2 rounded-2xl bg-[var(--bg-color)] w-full shadow-[0_1px_2px_1px_rgba(0,0,0,0.15)]"
        />
        {errors.username && (
          <span className="text-red-500 text-sm ml-2 mt-1">
            {errors.username.message}
          </span>
        )}
      </div>
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
      <div className="mb-4 flex flex-col">
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
      <div className="mb-8 flex flex-col">
        <input
          type="password"
          placeholder={t("confirm_placeholder")}
          {...register("confirmPassword", {
            required: {
              value: true,
              message: confirm_error,
            },
          })}
          className="px-3 py-2 rounded-2xl bg-[var(--bg-color)] shadow-[0_1px_2px_1px_rgba(0,0,0,0.15)]"
        />
        {errors.confirmPassword && (
          <span className="text-red-500 text-sm ml-2 mt-1">
            {errors.confirmPassword.message}
          </span>
        )}
      </div>
      <button
        className="w-32 self-center mb-4 flex justify-center disabled:opacity-40"
        disabled={loading}
      >
        {loading ? <div className="loader"></div> : t("signup_button")}
      </button>
      <span className="text-sm flex gap-x-2 self-center">
        {t("note")}
        <Link
          className="text-[var(--accent-color)] hover:underline"
          href="/login"
        >
          {t("note_1")}
        </Link>
      </span>
    </form>
  );
}

export default RegisterForm;
