"use client";

import { useRouter } from "next/navigation";
import CustomerImportStep from "@/components/onboarding/CustomerImportStep";

export default function CustomerImportPage() {
  const router = useRouter();

  function handleComplete() {
    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen bg-[#0B0B0C] p-4 sm:p-6 md:p-8">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-5xl items-center justify-center">
        <CustomerImportStep
          onComplete={handleComplete}
        />
      </div>
    </main>
  );
}