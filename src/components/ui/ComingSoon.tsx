import { ArrowRight } from "lucide-react";

interface ComingSoonProps {
  title: string;
  description: string;
}

export default function ComingSoon({
  title,
  description,
}: ComingSoonProps) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-[#111111] p-10 text-center">

        <p className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]">
          Intelligence
        </p>

        <h1 className="mt-4 text-4xl font-semibold text-white">
          {title}
        </h1>

        <p className="mt-5 leading-8 text-zinc-400">
          {description}
        </p>

        <div className="mt-10 inline-flex items-center gap-3 rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/10 px-5 py-3 text-[#D4AF37]">
          <ArrowRight size={18} />
          <span>Coming in the next sprint</span>
        </div>

      </div>
    </div>
  );
}