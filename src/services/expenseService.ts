import { createClient } from "@/lib/supabase/client";
import type {
  Expense,
  CreateExpenseInput,
  UpdateExpenseInput,
} from "@/types/expense";

const supabase = createClient();

/**
 * Convert Supabase errors into useful console output.
 */
function logSupabaseError(
  action: string,
  error: unknown
) {
  if (error && typeof error === "object") {
    const supabaseError = error as {
      message?: string;
      details?: string;
      hint?: string;
      code?: string;
    };

    console.error(
      `[ExpenseService] ${action}`,
      {
        message: supabaseError.message,
        details: supabaseError.details,
        hint: supabaseError.hint,
        code: supabaseError.code,
      }
    );

    return;
  }

  console.error(
    `[ExpenseService] ${action}`,
    error
  );
}

/**
 * Get all expenses for the current user.
 */
export async function getExpenses(): Promise<Expense[]> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    logSupabaseError(
      "Failed to get authenticated user:",
      authError
    );
    throw authError;
  }

  if (!user) {
    throw new Error("Unauthorized");
  }

  const {
    data,
    error,
  } = await supabase
    .from("expenses")
    .select("*")
    .eq("owner_id", user.id)
    .order("expense_date", {
      ascending: false,
    });

  if (error) {
    logSupabaseError(
      "Failed to fetch expenses:",
      error
    );
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
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    logSupabaseError(
      "Failed to get authenticated user:",
      authError
    );
    throw authError;
  }

  if (!user) {
    throw new Error("Unauthorized");
  }

  const {
    data,
    error,
  } = await supabase
    .from("expenses")
    .select("*")
    .eq("id", id)
    .eq("owner_id", user.id)
    .maybeSingle();

  if (error) {
    logSupabaseError(
      "Failed to fetch expense:",
      error
    );
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
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    logSupabaseError(
      "Failed to get authenticated user:",
      authError
    );
    throw authError;
  }

  if (!user) {
    throw new Error("Unauthorized");
  }

  const amount = Number(input.amount);

  if (
    !Number.isFinite(amount) ||
    amount <= 0
  ) {
    throw new Error(
      "Expense amount must be greater than zero."
    );
  }

  const category =
    input.category?.trim();

  if (!category) {
    throw new Error(
      "Expense category is required."
    );
  }

  const expenseDate =
    input.expense_date ||
    new Date()
      .toISOString()
      .split("T")[0];

  const insertData = {
    owner_id: user.id,
    amount,
    category,
    description:
      input.description?.trim() || null,
    vendor:
      input.vendor?.trim() || null,
    expense_date: expenseDate,
    is_recurring:
      input.is_recurring ?? false,
  };

  console.log(
    "[ExpenseService] Creating expense:",
    insertData
  );

  const {
    data,
    error,
  } = await supabase
    .from("expenses")
    .insert(insertData)
    .select()
    .single();

  if (error) {
    logSupabaseError(
      "Failed to create expense:",
      error
    );
    throw new Error(
      error.message ||
        "Failed to create expense."
    );
  }

  if (!data) {
    throw new Error(
      "Expense was created but no record was returned."
    );
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
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    logSupabaseError(
      "Failed to get authenticated user:",
      authError
    );
    throw authError;
  }

  if (!user) {
    throw new Error("Unauthorized");
  }

  const updateData: Record<
    string,
    unknown
  > = {};

  if (input.amount !== undefined) {
    const amount =
      Number(input.amount);

    if (
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      throw new Error(
        "Expense amount must be greater than zero."
      );
    }

    updateData.amount = amount;
  }

  if (input.category !== undefined) {
    const category =
      input.category.trim();

    if (!category) {
      throw new Error(
        "Expense category is required."
      );
    }

    updateData.category = category;
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
    updateData.expense_date =
      input.expense_date;
  }

  if (
    input.is_recurring !== undefined
  ) {
    updateData.is_recurring =
      input.is_recurring;
  }

  const {
    data,
    error,
  } = await supabase
    .from("expenses")
    .update(updateData)
    .eq("id", id)
    .eq("owner_id", user.id)
    .select()
    .single();

  if (error) {
    logSupabaseError(
      "Failed to update expense:",
      error
    );
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
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    logSupabaseError(
      "Failed to get authenticated user:",
      authError
    );
    throw authError;
  }

  if (!user) {
    throw new Error("Unauthorized");
  }

  const {
    error,
  } = await supabase
    .from("expenses")
    .delete()
    .eq("id", id)
    .eq("owner_id", user.id);

  if (error) {
    logSupabaseError(
      "Failed to delete expense:",
      error
    );
    throw error;
  }
}