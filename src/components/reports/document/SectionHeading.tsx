interface Props {
  eyebrow: string;
  title: string;
  description?: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
}: Props) {
  return (
    <header className="mb-10">

      <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-[#D4AF37]">
        {eyebrow}
      </p>

      <h2 className="mt-4 text-[34px] font-semibold tracking-[-0.04em] text-white">
        {title}
      </h2>

      {description && (
        <p className="mt-4 max-w-3xl text-[16px] leading-8 text-zinc-400">
          {description}
        </p>
      )}

    </header>
  );
}