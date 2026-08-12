export interface Expense {
  id: string;
  owner_id: string;
  company_id?: string | null;

  amount: number;

  category: string;
  description?: string | null;
  vendor?: string | null;

  expense_date: string;

  is_recurring: boolean;

  created_at: string;
  updated_at: string;
}

export interface CreateExpenseInput {
  amount: number;
  category: string;
  description?: string;
  vendor?: string;
  expense_date?: string;
  is_recurring?: boolean;
}

export interface UpdateExpenseInput {
  amount?: number;
  category?: string;
  description?: string;
  vendor?: string;
  expense_date?: string;
  is_recurring?: boolean;
}