interface Props {
  summary?: string;
}

export default function ExecutiveSummary({
  summary,
}: Props) {
  return (
    <section className="rounded-[34px] border border-white/[0.08] bg-[#101214] px-10 py-10">

      <div className="max-w-4xl">

        <p className="text-[11px] uppercase tracking-[0.35em] text-[#D4AF37]">
          Executive Summary
        </p>

        <h2 className="mt-4 text-[32px] font-semibold tracking-[-0.03em] text-white">
          Financial Overview
        </h2>

        <div className="mt-8 space-y-6">

          <p className="text-[17px] leading-9 text-zinc-300">
            {summary ??
              "This report provides a comprehensive overview of business performance during the selected reporting period. Financial metrics, operational trends and executive insights are presented below to support strategic decision making."}
          </p>

        </div>

      </div>

    </section>
  );
}