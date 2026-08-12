import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function DocumentContainer({
  children,
}: Props) {
  return (
    <main
  id="executive-report"
  className="mx-auto w-full max-w-[1700px]"
>

      <div
        className="
          rounded-[40px]
          border
          border-white/[0.06]
          bg-[#0C1015]
          shadow-[0_30px_120px_rgba(0,0,0,.45)]
          overflow-hidden
        "
      >

        <div className="px-14 py-14 lg:px-20 lg:py-20">

          <div className="mx-auto max-w-[1350px] space-y-16">

            {children}

          </div>

        </div>

      </div>

    </main>
  );
}