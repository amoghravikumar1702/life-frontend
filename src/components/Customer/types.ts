import { Customer } from "@/types/customer";

export interface CustomerMetrics {
  invoiceCount: number;

  revenue: number;

  collected: number;

  outstanding: number;

  collectionRate: number;

  health:
    | "Excellent"
    | "Good"
    | "Average"
    | "Attention";
}

export interface CustomerCardProps {
  customer: Customer;

  metrics: CustomerMetrics;

  onDelete(id: number): void;
}