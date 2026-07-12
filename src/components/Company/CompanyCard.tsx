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
    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#111827] to-[#0B1220] p-8 shadow-xl">

      <h2 className="mb-6 text-2xl font-bold">
        {title}
      </h2>

      <div className="space-y-6">
        {children}
      </div>

    </div>
  );
}