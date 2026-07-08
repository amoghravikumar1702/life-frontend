export interface Invoice {
  id?: number;

  customer: string;

  invoice_number: string;

  invoice_date: string;

  due_date: string;

  total: number;

  status: string;

  created_at?: string;
}