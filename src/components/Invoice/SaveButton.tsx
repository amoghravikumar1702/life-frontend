type Props = {
  disabled: boolean;
  onClick: () => void;
};

export default function SaveButton({
  disabled,
  onClick,
}: Props) {
  return (
    <div className="mt-8 flex justify-end">

      <button
        onClick={onClick}
        disabled={disabled}
        className="rounded-xl bg-emerald-500 px-8 py-4 text-lg font-semibold text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
      >
        💾 Save Invoice
      </button>

    </div>
  );
}