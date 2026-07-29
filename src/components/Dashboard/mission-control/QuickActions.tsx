import Link from "next/link";

import {
  UserPlus,
  FileText,
  CreditCard,
  ArrowRight,
} from "lucide-react";

const actions = [
  {
    title: "Create Invoice",
    description:
      "Generate and send a new invoice to your customer.",
    href: "/invoices/new",
    icon: FileText,
  },
  {
    title: "Add Customer",
    description:
      "Create a new customer profile for your business.",
    href: "/customers/new",
    icon: UserPlus,
  },
  {
    title: "Collect Payments",
    description:
      "Generate secure payment links and collect customer payments.",
    href: "/invoices",
    icon: CreditCard,
  },
];

export default function QuickActions() {
  return (
    <section className="rounded-[32px] border border-white/10 bg-[#111111] p-8">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
          Quick Actions
        </p>

        <h2 className="mt-2 text-3xl font-semibold text-white">
          Get Things Done
        </h2>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.title}
              href={action.href}
              className="group rounded-3xl border border-white/10 bg-white/[0.02] p-6 transition-all duration-300 hover:border-[#D4AF37]/40 hover:bg-white/[0.04]"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D4AF37]/10">
                  <Icon
                    size={20}
                    className="text-[#D4AF37]"
                  />
                </div>

                <ArrowRight
                  size={18}
                  className="text-zinc-600 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[#D4AF37]"
                />
              </div>

              <h3 className="mt-6 text-xl font-semibold text-white">
                {action.title}
              </h3>

              <p className="mt-3 leading-7 text-zinc-400">
                {action.description}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}