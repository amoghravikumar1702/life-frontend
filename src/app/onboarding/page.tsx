"use client";

import { useState } from "react";

import BusinessIdentityStep from "@/components/onboarding/BusinessIdentityStep";
import IndustrySelection from "@/components/onboarding/IndustrySelection";
import FinancialSetupStep from "@/components/onboarding/FinancialSetupStep";
import PaymentSetupStep from "@/components/onboarding/PaymentSetupStep";

import {
  saveOnboardingData,
  type OnboardingData,
} from "./actions";

type OnboardingStep =
  | "identity"
  | "industry"
  | "financial"
  | "payment";

type BusinessData = Pick<
  OnboardingData,
  | "companyName"
  | "ownerName"
  | "phone"
  | "businessModel"
  | "yearsInBusiness"
  | "employees"
>;

type PaymentData = Pick<
  OnboardingData,
  | "paymentMethod"
  | "paymentDisplayName"
  | "paymentPhone"
  | "paymentUpiId"
  | "paymentBankName"
  | "paymentBankAccountName"
  | "paymentBankAccountNumber"
  | "paymentBankIfsc"
  | "paymentRazorpayAccountId"
>;

const initialBusiness: BusinessData = {
  companyName: "",
  ownerName: "",
  phone: "",
  businessModel: "",
  yearsInBusiness: 0,
  employees: 0,
};

const initialPayment: PaymentData = {
  paymentMethod: "upi",
  paymentDisplayName: "",
  paymentPhone: "",
  paymentUpiId: "",
  paymentBankName: "",
  paymentBankAccountName: "",
  paymentBankAccountNumber: "",
  paymentBankIfsc: "",
  paymentRazorpayAccountId: "",
};

export default function OnboardingPage() {
  const [step, setStep] =
    useState<OnboardingStep>("identity");

  const [business, setBusiness] =
    useState<BusinessData>(
      initialBusiness
    );

  const [industry, setIndustry] =
    useState("");

  const [revenue, setRevenue] =
    useState<number | null>(null);

  const [payment, setPayment] =
    useState<PaymentData>(
      initialPayment
    );

  const [isSaving, setIsSaving] =
    useState(false);

  function handleIdentityContinue(
    identity: BusinessData
  ) {
    setBusiness(identity);
    setStep("industry");
  }

  function handleIndustryContinue(
    selectedIndustry: string
  ) {
    setIndustry(selectedIndustry);
    setStep("financial");
  }

  function handleFinancialContinue(
    startingRevenue: number | null
  ) {
    setRevenue(startingRevenue);
    setStep("payment");
  }

  async function handlePaymentContinue(
    paymentData: PaymentData
  ) {
    if (isSaving) {
      return;
    }

    try {
      setIsSaving(true);

      setPayment(paymentData);

      await saveOnboardingData({
        ...business,

        industry,

        startingRevenue:
          revenue,

        ...paymentData,
      });
    } catch (error) {
      console.error(
        "[Onboarding] Failed to complete onboarding:",
        error
      );

      setIsSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0B0B0C] p-4 sm:p-6 md:p-8">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-5xl items-center justify-center">
        {step === "identity" && (
          <BusinessIdentityStep
            initialData={business}
            onContinue={
              handleIdentityContinue
            }
          />
        )}

        {step === "industry" && (
          <IndustrySelection
            onContinue={
              handleIndustryContinue
            }
          />
        )}

        {step === "financial" && (
          <FinancialSetupStep
            initialRevenue={
              revenue
            }
            onContinue={
              handleFinancialContinue
            }
          />
        )}

        {step === "payment" && (
          <PaymentSetupStep
            initialData={payment}
            onContinue={
              handlePaymentContinue
            }
          />
        )}
      </div>

      {isSaving && (
        <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-[#D4AF37]/20 bg-[#101318] px-6 py-5 text-center shadow-2xl">
            <div className="mx-auto mb-3 h-5 w-5 animate-spin rounded-full border-2 border-[#D4AF37]/20 border-t-[#D4AF37]" />

            <p className="text-sm font-medium text-zinc-200">
              Setting up ArkenOne...
            </p>

            <p className="mt-1 text-xs text-zinc-600">
              Saving your business and payment setup.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}