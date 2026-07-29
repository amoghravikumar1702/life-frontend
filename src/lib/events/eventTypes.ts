export type EventType =
  | "payment_received"
  | "invoice_created"
  | "invoice_viewed"
  | "invoice_paid"
  | "customer_created"
  | "reminder_sent"
  | "payment_failed"
  | "gst_due"
  | "system";