import {
  Download,
  FileSpreadsheet,
  FileText,
  Printer,
  Share2,
} from "lucide-react";

interface Props {
  onPdf?: () => void;
  onExcel?: () => void;
  onCsv?: () => void;
  onPrint?: () => void;
  onShare?: () => void;
}

function ToolbarButton({
  icon,
  label,
  onClick,
  primary = false,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex items-center gap-2 rounded-2xl px-4 py-3
        text-sm font-medium transition-all duration-300
        ${
          primary
            ? "bg-[#D4AF37] text-black hover:brightness-105"
            : "border border-white/[0.08] bg-white/[0.03] text-white hover:bg-white/[0.06]"
        }
      `}
    >
      {icon}
      {label}
    </button>
  );
}

export default function Toolbar({
  onPdf,
  onExcel,
  onCsv,
  onPrint,
  onShare,
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3">

      <ToolbarButton
        icon={<FileText size={18} />}
        label="PDF"
        onClick={onPdf}
        primary
      />

      <ToolbarButton
        icon={<FileSpreadsheet size={18} />}
        label="Excel"
        onClick={onExcel}
      />

      <ToolbarButton
        icon={<Download size={18} />}
        label="CSV"
        onClick={onCsv}
      />

      <ToolbarButton
        icon={<Printer size={18} />}
        label="Print"
        onClick={onPrint}
      />

      <ToolbarButton
        icon={<Share2 size={18} />}
        label="Share"
        onClick={onShare}
      />

    </div>
  );
}