import { ReactNode } from "react";

type Props = {
  title: string;
  children: ReactNode;
};

export default function CompanyCard({
  title,
  children,
}: Props) {
  return (
    <section className="rounded-3xl border border-white/[0.07] bg-white/[0.025] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur-xl sm:p-8">
      <div className="mb-7">
        <h2 className="text-lg font-semibold tracking-tight text-white">
          {title}
        </h2>

        <div className="mt-3 h-px w-full bg-white/[0.06]" />
      </div>

      <div className="space-y-6">
        {children}
      </div>
    </section>
  );
}