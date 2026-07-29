export type EventType =
  | "customer_created"
  | "customer_updated"

  | "invoice_created"
  | "invoice_updated"
  | "invoice_sent"
  | "invoice_paid"
  | "invoice_overdue"

  | "payment_received"
  | "payment_failed"

  | "reminder_sent"

  | "company_updated"

  | "ai_recommendation"

  | "system";