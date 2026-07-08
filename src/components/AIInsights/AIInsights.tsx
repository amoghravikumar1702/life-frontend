export default function AIInsights() {
  const insights = [
    {
      id: 1,
      icon: "💰",
      title: "Collect ₹48,000 from ABC Ltd today.",
      description: "This improves your available cash by 19%.",
    },
    {
      id: 2,
      icon: "⚠️",
      title: "Bills worth ₹48,000 are due this week.",
      description: "Ensure your cash balance stays above ₹60,000.",
    },
    {
      id: 3,
      icon: "📈",
      title: "Revenue increased 12% this month.",
      description: "Your business is growing steadily.",
    },
    {
      id: 4,
      icon: "🟢",
      title: "Financial Health Score: 82/100",
      description: "Healthy cash flow with manageable liabilities.",
    },
  ];

  return (
    <div className="mt-10 rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-white/5 p-6">
      <h2 className="text-2xl font-bold text-cyan-400">
        💡 AI Insights
      </h2>

      <p className="mt-2 text-gray-400">
        Personalized recommendations for your business.
      </p>

      <div className="mt-6 space-y-4">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className="rounded-xl border border-white/10 bg-black/20 p-4"
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl">
                {insight.icon}
              </div>

              <div>
                <h3 className="font-semibold">
                  {insight.title}
                </h3>

                <p className="mt-1 text-sm text-gray-400">
                  {insight.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}