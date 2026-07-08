import {
  FilePlus2,
  UserPlus,
  Receipt,
  CreditCard,
} from "lucide-react";

const actions = [
  {
    title: "Create Invoice",
    icon: FilePlus2,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },
  {
    title: "Add Customer",
    icon: UserPlus,
    color: "text-green-400",
    bg: "bg-green-500/10",
  },
  {
    title: "Add Expense",
    icon: Receipt,
    color: "text-orange-400",
    bg: "bg-orange-500/10",
  },
  {
    title: "Record Payment",
    icon: CreditCard,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
];

export default function QuickActions() {
  return (
    <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#111827] to-[#0B1220] p-8 shadow-2xl">

      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
        Quick Actions
      </p>

      <h2 className="mt-2 text-3xl font-bold">
        Get Things Done
      </h2>

      <div className="mt-8 grid grid-cols-2 gap-5">

        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.title}
              className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/40 hover:bg-white/10"
            >
              <div
                className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${action.bg}`}
              >
                <Icon
                  size={28}
                  className={action.color}
                />
              </div>

              <h3 className="text-left text-lg font-semibold">
                {action.title}
              </h3>

              <p className="mt-2 text-left text-sm text-gray-400">
                Open instantly
              </p>
            </button>
          );
        })}

      </div>

    </section>
  );
}