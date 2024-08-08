"use client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useState } from "react";

function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const [error, setError] = useState(null);

  const onSubmit = handleSubmit(async (data) => {
    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (res.error) {
      setError(res.error);
    } else {
      router.push("/dasboard");
    }
  });

  return (
    <main className="w-full h-screen flex justify-center items-center">
      <form
        onSubmit={onSubmit}
        className="flex flex-col px-8 py-4 bg-[var(--element-color)] w-96 rounded-2xl"
      >
        <span className="self-center text-3xl font-bold mt-4 mb-8">
          Login In
        </span>
        {error && (
          <span className="bg-red-500 text-white text-sm rounded-2xl flex justify-center items-center mb-4 px-2 py-1">
            {error}
          </span>
        )}
        <div className="mb-4 flex flex-col">
          <input
            type="email"
            placeholder="Email"
            {...register("email", {
              required: { value: true, message: "Email is required" },
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
            placeholder="Password"
            {...register("password", {
              required: { value: true, message: "Password is required" },
            })}
            className="px-3 py-2 rounded-2xl bg-[var(--bg-color)] shadow-[0_1px_2px_1px_rgba(0,0,0,0.15)]"
          />
          {errors.password && (
            <span className="text-red-500 text-sm ml-2 mt-1">
              {errors.password.message}
            </span>
          )}
        </div>
        <button className="w-32 rounded-2xl px-4 py-2 self-center mb-4 shadow-[0_1px_2px_1px_rgba(0,0,0,0.15)]">
          Login
        </button>
      </form>
    </main>
  );
}

export default LoginPage;
