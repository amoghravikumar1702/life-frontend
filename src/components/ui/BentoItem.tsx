import { ReactNode } from "react";
import clsx from "clsx";

interface Props {
  children: ReactNode;
  span?: number;
  className?: string;
}

export default function BentoItem({
  children,
  span = 4,
  className,
}: Props) {
  return (
    <div
      className={clsx(
        `lg:col-span-${span}`,
        className
      )}
    >
      {children}
    </div>
  );
}