import { ReactNode } from "react";
import clsx from "clsx";

type KPICardProps = {
  title: string;
  value: ReactNode;
  icon?: ReactNode;
  className?: string;
};

export default function KPICard({
  title,
  value,
  icon,
  className,
}: KPICardProps) {
  return (
    <div className={clsx("kpi-card", className)}>
      <div className="flex items-center justify-between">
        <span className="kpi-title">{title}</span>

        {icon && (
          <div className="text-[var(--primary)]">
            {icon}
          </div>
        )}
      </div>

      <div className="kpi-value">
        {value}
      </div>
    </div>
  );
}