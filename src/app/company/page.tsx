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
            description="Configure your business once. ArkenOne will automatically use these details everywhere."
          />

          <Link
            href="/invoices"
            className="rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-black hover:bg-cyan-400"
          >
            ← Back
          </Link>

        </div>

        <CompanyForm />

      </div>
    </main>
  );
}