import { createClient } from "@/lib/supabase/server";

const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

export async function getCachedExecutiveReport(
  companyId: string
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("ai_reports")
    .select("*")
    .eq("company_id", companyId)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

export async function saveExecutiveReport(
  companyId: string,
  report: unknown
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("ai_reports")
    .upsert({
      company_id: companyId,
      report,
      generated_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

  if (error) {
    throw error;
  }
}

export function isReportExpired(
  generatedAt: string
) {
  const generated =
    new Date(generatedAt).getTime();

  return (
    Date.now() - generated >
    CACHE_DURATION
  );
}