import LoginForm from "./_components/loginForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import { redirect } from "next/navigation";
import initTranslations from "@/app/[lng]/i18n";
import TranslationsProvider from "../../_components/translationsProvider";

const i18nNameSpaces = ["login"];

async function LoginPage({ params: { lng } }) {
  const { t, resources } = await initTranslations(lng, i18nNameSpaces);
  const session = await getServerSession(authOptions);

  let error = null;
  if (session && session.status === false) {
    redirect("/dashboard");
  } else if (session && session.status === true) {
    error = "User is blocked";
  }

  return (
    <TranslationsProvider
      resources={resources}
      locale={lng}
      namespaces={i18nNameSpaces}
    >
      <main className="w-full h-screen flex justify-center items-center px-2 grow">
        <LoginForm errorMessage={error}></LoginForm>
      </main>
    </TranslationsProvider>
  );
}

export default LoginPage;
