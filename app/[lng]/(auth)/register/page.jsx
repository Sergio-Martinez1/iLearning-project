import RegisterForm from "./_components/registerForm";
import initTranslations from "@/app/[lng]/i18n";
import TranslationsProvider from "../../_components/translationsProvider";

const i18nNameSpaces = ["register"];

async function RegisterPage({ params: { lng } }) {
  const { t, resources } = await initTranslations(lng, i18nNameSpaces);

  return (
    <TranslationsProvider
      resources={resources}
      locale={lng}
      namespaces={i18nNameSpaces}
    >
      <main className="w-full h-screen flex justify-center items-center grow px-6">
        <RegisterForm></RegisterForm>
      </main>
    </TranslationsProvider>
  );
}

export default RegisterPage;
