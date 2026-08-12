import { createClient } from "@/lib/supabase/client";
import type {
  Expense,
  CreateExpenseInput,
  UpdateExpenseInput,
} from "@/types/expense";

const supabase = createClient();

/**
 * Get all expenses for the current user.
 */
export async function getExpenses(): Promise<Expense[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .eq("owner_id", user.id)
    .order("expense_date", { ascending: false });

  if (error) {
    console.error("[ExpenseService] Failed to fetch expenses:", error);
    throw error;
  }

  return (data ?? []) as Expense[];
}

/**
 * Get a single expense.
 */
export async function getExpense(
  id: string
): Promise<Expense | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .eq("id", id)
    .eq("owner_id", user.id)
    .maybeSingle();

  if (error) {
    console.error("[ExpenseService] Failed to fetch expense:", error);
    throw error;
  }

  return data as Expense | null;
}

/**
 * Create a new expense.
 */
export async function createExpense(
  input: CreateExpenseInput
): Promise<Expense> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  if (!input.amount || Number(input.amount) <= 0) {
    throw new Error("Expense amount must be greater than zero.");
  }

  if (!input.category?.trim()) {
    throw new Error("Expense category is required.");
  }

  const { data, error } = await supabase
    .from("expenses")
    .insert({
      owner_id: user.id,
      amount: Number(input.amount),
      category: input.category.trim(),
      description: input.description?.trim() || null,
      vendor: input.vendor?.trim() || null,
      expense_date:
        input.expense_date ||
        new Date().toISOString().split("T")[0],
      is_recurring: input.is_recurring ?? false,
    })
    .select()
    .single();

  if (error) {
    console.error("[ExpenseService] Failed to create expense:", error);
    throw error;
  }

  return data as Expense;
}

/**
 * Update an existing expense.
 */
export async function updateExpense(
  id: string,
  input: UpdateExpenseInput
): Promise<Expense> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const updateData: Record<string, unknown> = {};

  if (input.amount !== undefined) {
    if (Number(input.amount) <= 0) {
      throw new Error("Expense amount must be greater than zero.");
    }

    updateData.amount = Number(input.amount);
  }

  if (input.category !== undefined) {
    if (!input.category.trim()) {
      throw new Error("Expense category is required.");
    }

    updateData.category = input.category.trim();
  }

  if (input.description !== undefined) {
    updateData.description =
      input.description.trim() || null;
  }

  if (input.vendor !== undefined) {
    updateData.vendor =
      input.vendor.trim() || null;
  }

  if (input.expense_date !== undefined) {
    updateData.expense_date = input.expense_date;
  }

  if (input.is_recurring !== undefined) {
    updateData.is_recurring = input.is_recurring;
  }

  const { data, error } = await supabase
    .from("expenses")
    .update(updateData)
    .eq("id", id)
    .eq("owner_id", user.id)
    .select()
    .single();

  if (error) {
    console.error("[ExpenseService] Failed to update expense:", error);
    throw error;
  }

  return data as Expense;
}

/**
 * Delete an expense.
 */
export async function deleteExpense(
  id: string
): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("expenses")
    .delete()
    .eq("id", id)
    .eq("owner_id", user.id);

  if (error) {
    console.error("[ExpenseService] Failed to delete expense:", error);
    throw error;
  }
}