export interface Payment {
  id?: number;

  invoice_id: number;

  amount: number;

  payment_method: string;

  payment_reference?: string;

  payment_status?: string;

  paid_at?: string;

  razorpay_order_id?: string;

  owner_id?: string;

  created_at?: string;
}