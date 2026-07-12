export interface Invoice {
  id?: number;

  customer: string;
  customer_email?: string;
  customer_phone?: string;

  invoice_number: string;

  invoice_date: string;
  due_date: string;

  subtotal: number;
  tax: number;
  discount: number;
  total: number;

  currency: string;

  payment_terms?: string;
  notes?: string;

  status: string;

  created_at?: string;
}