export type ActivityType =
  | "customer"
  | "invoice"
  | "payment";

export interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
}