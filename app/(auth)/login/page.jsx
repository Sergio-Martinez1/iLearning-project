import LoginForm from "./_components/loginForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import { redirect } from "next/navigation";

async function LoginPage() {
  const session = await getServerSession(authOptions);
  console.log(session)
  let error = null;
  if (session && session.status === false) {
    redirect("/dashboard");
  } else if (session && session.status === true) {
    error = "User is blocked";
    console.log('asdasdasdasda')
  }
  return (
    <main className="w-full h-screen flex justify-center items-center px-2 grow">
      <LoginForm errorMessage={error}></LoginForm>
    </main>
  );
}

export default LoginPage;
