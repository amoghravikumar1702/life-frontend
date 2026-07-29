export type AttentionStatus = "critical" | "warning" | "success";

export interface AttentionItem {
  title: string;
  description: string;
  status: AttentionStatus;
  href: string;
}