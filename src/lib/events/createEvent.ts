import { createClient } from "@/lib/supabase/server";
import { EventType } from "./types";

interface CreateEventParams {
  ownerId: string;

  type: EventType;

  title: string;

  description?: string;

  entityType?: string;

  entityId?: string;

  metadata?: Record<string, unknown>;

  severity?: "info" | "success" | "warning" | "error";
}

export async function createEvent({
  ownerId,
  type,
  title,
  description,
  entityType,
  entityId,
  metadata = {},
  severity = "info",
}: CreateEventParams) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("events")
    .insert({
      owner_id: ownerId,
      type,
      title,
      description,
      entity_type: entityType,
      entity_id: entityId,
      metadata,
      severity,
    });

  if (error) {
    console.error("Failed to create event", error);

    throw error;
  }
}