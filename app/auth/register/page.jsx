"use client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const onSubmit = handleSubmit(async (data) => {
    if (data.password !== data.confirmPassword) {
      return alert("Passwords do not match");
    }

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
      router.push("/auth/login");
    }
  });

  return (
    <main className="w-full h-screen flex justify-center items-center grow px-6">
      <form
        onSubmit={onSubmit}
        className="flex flex-col px-8 py-4 bg-[var(--element-color)] w-96 rounded-2xl"
      >
        <span className="self-center text-3xl font-bold mt-4 mb-8">
          Sign Up
        </span>
        <div className="mb-4 flex flex-col">
          <input
            type="text"
            placeholder="Username"
            {...register("username", {
              required: { value: true, message: "Username is required" },
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
        <div className="mb-4 flex flex-col">
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
        <div className="mb-8 flex flex-col">
          <input
            type="password"
            placeholder="Confirm password"
            {...register("confirmPassword", {
              required: {
                value: true,
                message: "Please confirm your password",
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
        <button className="w-32 rounded-2xl px-4 py-2 self-center mb-4 shadow-[0_1px_2px_1px_rgba(0,0,0,0.15)]">
          Signup
        </button>
      </form>
    </main>
  );
}

export default RegisterPage;
