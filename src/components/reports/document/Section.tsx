import { ReactNode } from "react";
import clsx from "clsx";

interface Props {
  children: ReactNode;
  className?: string;
}

export default function Section({
  children,
  className,
}: Props) {
  return (
    <section
      className={clsx(
        `
          relative
          rounded-[34px]
          border
          border-white/[0.06]
          bg-[#101418]
          px-10
          py-10
          transition-all
          duration-300
        `,
        className
      )}
    >
      {children}
    </section>
  );
}