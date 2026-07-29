import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export async function recordReminder(
  invoiceId: number,
  channel: "whatsapp" | "email" | "sms"
) {
  // Get current reminder count
  const { data: invoice, error: fetchError } = await supabase
    .from("invoices")
    .select("reminder_count")
    .eq("id", invoiceId)
    .single();

  if (fetchError) {
    throw fetchError;
  }

  const { error: updateError } = await supabase
    .from("invoices")
    .update({
      reminder_count: (invoice?.reminder_count ?? 0) + 1,
      last_reminder_sent_at: new Date().toISOString(),
      last_reminder_channel: channel,
    })
    .eq("id", invoiceId);

  if (updateError) {
    throw updateError;
  }
}