import {
  Phone,
  FileText,
  Boxes,
  Users,
  ArrowRight,
} from "lucide-react";

const tasks = [
  {
    title: "Call ABC Ltd",
    priority: "High",
    icon: Phone,
    color: "text-red-400",
    bg: "bg-red-500/10",
  },
  {
    title: "Send Invoice",
    priority: "Medium",
    icon: FileText,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },
  {
    title: "Inventory Running Low",
    priority: "Low",
    icon: Boxes,
    color: "text-orange-400",
    bg: "bg-orange-500/10",
  },
  {
    title: "Follow Up Customer",
    priority: "Medium",
    icon: Users,
    color: "text-green-400",
    bg: "bg-green-500/10",
  },
];

export default function ActionCenter() {
  return (
    <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#111827] to-[#0B1220] p-6 shadow-2xl">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            Today's Tasks
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            Your Priorities
          </h2>
        </div>

        <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-sm text-cyan-300">
          4 Tasks
        </span>

      </div>

      <div className="mt-6 space-y-4">

        {tasks.map((task) => {
          const Icon = task.icon;

          return (
            <button
              key={task.title}
              className="group flex w-full items-center justify-between rounded-2xl border border-white/5 bg-white/5 p-4 text-left transition-all hover:border-cyan-400/30 hover:bg-white/10"
            >
              <div className="flex items-center gap-4">

                <div
                  className={`rounded-xl p-3 ${task.bg}`}
                >
                  <Icon
                    size={20}
                    className={task.color}
                  />
                </div>

                <div>

                  <h3 className="font-semibold">
                    {task.title}
                  </h3>

                  <p className="text-sm text-gray-400">
                    {task.priority} Priority
                  </p>

                </div>

              </div>

              <ArrowRight
                size={18}
                className="text-gray-500 transition group-hover:translate-x-1 group-hover:text-cyan-400"
              />

            </button>
          );
        })}

      </div>

    </section>
  );
}