"use client";

import { useState } from "react";
import IndustrySelection from "@/components/onboarding/IndustrySelection";
import FinancialSetupStep from "@/components/onboarding/FinancialSetupStep";
import { saveOnboardingData } from "./actions";

type OnboardingStep = "industry" | "financial";

export default function OnboardingPage() {
  const [step, setStep] =
    useState<OnboardingStep>("industry");

  const [industry, setIndustry] =
    useState("");

  const [isSaving, setIsSaving] =
    useState(false);

  async function handleFinancialContinue(
    revenue: number
  ) {
    if (isSaving) {
      return;
    }

    try {
      setIsSaving(true);

      await saveOnboardingData(
        industry,
        revenue
      );
    } catch (error) {
      console.error(
        "[Onboarding] Failed to complete onboarding:",
        error
      );

      setIsSaving(false);
    }
  }

  function handleIndustryContinue(
    selectedIndustry: string
  ) {
    setIndustry(selectedIndustry);
    setStep("financial");
  }

  return (
    <main className="min-h-screen bg-[#0B0B0C] p-6 sm:p-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-5xl items-center justify-center">
        {step === "industry" ? (
          <IndustrySelection
            onContinue={
              handleIndustryContinue
            }
          />
        ) : (
          <FinancialSetupStep
            initialRevenue={0}
            onContinue={
              handleFinancialContinue
            }
          />
        )}
      </div>

      {isSaving && (
        <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="rounded-2xl border border-[#D4AF37]/20 bg-[#101318] px-6 py-4">
            <p className="text-sm text-zinc-300">
              Setting up ArkenOne...
            </p>
          </div>
        </div>
      )}
    </main>
  );
}