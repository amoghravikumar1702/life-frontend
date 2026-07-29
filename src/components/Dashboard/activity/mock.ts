import { ActivityItem } from "./types";

export const mockActivities: ActivityItem[] = [
  {
    id: "1",
    type: "payment",
    title: "Payment Received",
    description: "₹25,000 received from ABC Traders.",
    timestamp: new Date().toISOString(),
  },
  {
    id: "2",
    type: "invoice",
    title: "Invoice INV-104 Created",
    description: "Invoice created for XYZ Industries.",
    timestamp: new Date().toISOString(),
  },
  {
    id: "3",
    type: "customer",
    title: "New Customer Added",
    description: "Pioneer Technologies was added.",
    timestamp: new Date(Date.now() - 86400000).toISOString(),
  },
];

export function formatActivityDate(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();

  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const activityDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  if (activityDate.getTime() === today.getTime()) {
    return "Today";
  }

  if (activityDate.getTime() === yesterday.getTime()) {
    return "Yesterday";
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatActivityTime(dateString: string) {
  return new Date(dateString).toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  });
}