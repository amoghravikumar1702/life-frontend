"use client";

import Link from "next/link";
import CompanyHeader from "@/components/Company/CompanyHeader";
import CompanyForm from "@/components/Company/CompanyForm";

export default function CompanyPage() {
  return (
    <main className="min-h-screen bg-[#030712] px-8 py-10 text-white">
      <div className="mx-auto max-w-6xl">

        <div className="mb-8 flex items-center justify-between">

          <CompanyHeader
            title="Company Profile"
            description="Configure your business once. DhanarkOS will automatically use these details everywhere."
          />

          <Link
            href="/dashboard"
            className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
          >
            ← Back
          </Link>

        </div>

        <CompanyForm />

      </div>
    </main>
  );
}