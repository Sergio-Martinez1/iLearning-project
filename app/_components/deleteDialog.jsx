import { forwardRef, useState } from "react";

const DeleteDialog = forwardRef(function DeleteDialog(props, ref) {
  const { buttonTitle, children, url, onSubmit, body } = props;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function onDelete() {
    setLoading(true);
    try {
      const res = await fetch(url, { method: "DELETE", body: JSON.stringify(body || {}) });
      if (res.ok) {
        const data = await res.json();
        onSubmit(data);
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
    <dialog
      ref={ref}
      className="bg-[var(--element-color)] w-[320px] h-fit border-[var(--border-color)] border rounded-2xl z-10 p-6"
    >
      <div className="flex flex-col">
        {children}
        <div className="w-full flex justify-evenly mb-4">
          <button
            onClick={() => {
              ref.current.close();
            }}
          >
            Cancel
          </button>
          <button
            className="bg-[var(--warning-color)] hover:bg-[var(--hover-warning-color)] active:bg-[var(--warning-color)] flex justify-center"
            onClick={onDelete}
          >
            {loading ? <div className="loader"></div> : buttonTitle}
          </button>
        </div>
        <span className="mx-10 text-red-500 text-sm text-center ">{error}</span>
      </div>
    </dialog>
  );
});

export default DeleteDialog;
