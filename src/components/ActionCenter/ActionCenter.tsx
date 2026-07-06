export default function ActionCenter() {
  const actions = [
    {
      id: 1,
      title: "Call ABC Ltd",
      priority: "High",
    },
    {
      id: 2,
      title: "Send invoice to Rahul",
      priority: "Medium",
    },
    {
      id: 3,
      title: "Inventory running low",
      priority: "Low",
    },
    {
      id: 4,
      title: "Follow up with XYZ Traders",
      priority: "Medium",
    },
  ];

  return (
    <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">⚡ Action Center</h2>
        <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-sm text-cyan-400">
          {actions.length} Tasks
        </span>
      </div>

      <p className="mt-2 text-gray-400">
        Your highest priority business actions for today.
      </p>

      <div className="mt-6 space-y-4">
        {actions.map((action) => (
          <div
            key={action.id}
            className="flex items-center justify-between rounded-xl border border-white/10 bg-[#111827] p-4 transition hover:border-cyan-400"
          >
            <span className="font-medium">{action.title}</span>

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                action.priority === "High"
                  ? "bg-red-500/20 text-red-400"
                  : action.priority === "Medium"
                  ? "bg-yellow-500/20 text-yellow-400"
                  : "bg-green-500/20 text-green-400"
              }`}
            >
              {action.priority}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}