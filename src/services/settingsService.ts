export type UserSettings = {
  currency: string;
  date_format: string;

  payment_received: boolean;
  payment_pending: boolean;
  invoice_reminders: boolean;
  ai_cfo_insights: boolean;
  system_updates: boolean;
};

export async function getSettings(): Promise<UserSettings> {
  const response = await fetch(
    "/api/settings",
    {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    }
  );

  const body = await response.json();

  if (!response.ok) {
    throw new Error(
      body?.error ??
        "Unable to load settings."
    );
  }

  return body;
}

export async function updateSettings(
  updates: Partial<UserSettings>
): Promise<UserSettings> {
  const response = await fetch(
    "/api/settings",
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    }
  );

  const body = await response.json();

  if (!response.ok) {
    throw new Error(
      body?.error ??
        "Unable to save settings."
    );
  }

  return body;
}