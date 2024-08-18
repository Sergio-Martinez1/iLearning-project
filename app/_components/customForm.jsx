import { forwardRef, useState } from "react";

const CustomForm = forwardRef(function CustomForm(props, ref) {
  const { title, buttonTitle, children, url, onSubmit, method } = props;
  const [loading, setLoading] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [error, setError] = useState(null);

  async function submit(event) {
    const form = event.currentTarget;
    setLoading(true);
    try {
      event.preventDefault();
      const formData = new FormData(form);
      const res = await fetch(url, { method: method, body: formData });
      if (res.ok) {
        const data = await res.json();
        onSubmit(data);
        form.reset();
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

  return (
    <dialog ref={ref} className="rounded-2xl bg-[var(--element-color)]">
      <form className="rounded-2xl pb-4 flex flex-col w-80" onSubmit={submit}>
        <h1 className="text-2xl font-bold px-4 pt-4 pb-2 w-full flex justify-between sticky top-0 bg-[var(--element-color)] rounded-b-2xl">
          <span className="flex justify-self-center self-center">{title}</span>
          <button
            className="flex justify-self-end w-fit h-fit text-[12px] py-1 px-4"
            type="button"
            onClick={() => {
              setError(null);
              ref.current.close();
            }}
          >
            X
          </button>
        </h1>
        <div className="flex gap-x-2 mb-4 px-6 flex-wrap gap-y-2 justify-center">
          {children}
        </div>
        <button className="disabled:opacity-50 flex justify-center mx-6 mb-2">
          {loading ? <div className="loader"></div> : buttonTitle}
        </button>
        <span className="mx-10 text-red-500 text-sm text-center">{error}</span>
      </form>
    </dialog>
  );
});

export default CustomForm;
