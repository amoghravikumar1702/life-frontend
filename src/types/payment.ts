export interface Payment {
  id?: number;

  invoice_id: number;

  amount: number;

  payment_date: string;

  payment_method: string;

  reference_number?: string;

  notes?: string;

  created_at?: string;
}