"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function TestPage() {
  const [status, setStatus] = useState("Testing connection...");

  useEffect(() => {
    async function testConnection() {
      const { error } = await supabase
        .from("invoices")
        .select("*")
        .limit(1);

      if (error) {
        setStatus("❌ Connection Failed: " + error.message);
      } else {
        setStatus("✅ Connected to Supabase Successfully!");
      }
    }

    testConnection();
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#030712] text-white">
      <div className="rounded-2xl border border-white/10 bg-[#111827] p-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Nexora Database Test</h1>
        <p className="text-lg">{status}</p>
      </div>
    </main>
  );
}