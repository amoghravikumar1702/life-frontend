// src/app/onboarding/actions.ts

"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type PaymentMethod =
  | "razorpay"
  | "upi"
  | "bank_transfer";

export type OnboardingData = {
  companyName: string;
  ownerName: string;
  phone: string;
  businessModel: string;
  yearsInBusiness: number;
  employees: number;
  industry: string;
  startingRevenue: number | null;

  paymentMethod: PaymentMethod;
  paymentDisplayName: string;
  paymentPhone: string;

  paymentUpiId: string;

  paymentBankName: string;
  paymentBankAccountName: string;
  paymentBankAccountNumber: string;
  paymentBankIfsc: string;

  paymentRazorpayAccountId: string;
};

function cleanString(value: unknown): string {
  return typeof value === "string"
    ? value.trim()
    : "";
}

function cleanNumber(
  value: unknown,
  fallback = 0
): number {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return fallback;
  }

  return Math.max(
    0,
    Math.floor(number)
  );
}

function cleanRevenue(
  value: unknown
): number {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return 0;
  }

  const number = Number(value);

  if (!Number.isFinite(number)) {
    return 0;
  }

  return Math.max(0, number);
}

export async function saveOnboardingData(
  data: OnboardingData
) {
  const supabase =
    await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    console.error(
      "[Onboarding] Auth error:",
      authError
    );

    throw new Error(
      "Unable to verify your account."
    );
  }

  if (!user) {
    redirect("/login");
  }

  const companyName =
    cleanString(data.companyName);

  const ownerName =
    cleanString(data.ownerName);

  const phone =
    cleanString(data.phone);

  const businessModel =
    cleanString(data.businessModel);

  const industry =
    cleanString(data.industry);

  const yearsInBusiness =
    cleanNumber(
      data.yearsInBusiness
    );

  const employees =
    cleanNumber(data.employees);

  const startingRevenue =
    cleanRevenue(
      data.startingRevenue
    );

  const paymentMethod =
    cleanString(
      data.paymentMethod
    ) as PaymentMethod;

  const paymentDisplayName =
    cleanString(
      data.paymentDisplayName
    );

  const paymentPhone =
    cleanString(
      data.paymentPhone
    );

  const paymentUpiId =
    cleanString(
      data.paymentUpiId
    );

  const paymentBankName =
    cleanString(
      data.paymentBankName
    );

  const paymentBankAccountName =
    cleanString(
      data.paymentBankAccountName
    );

  const paymentBankAccountNumber =
    cleanString(
      data.paymentBankAccountNumber
    );

  const paymentBankIfsc =
    cleanString(
      data.paymentBankIfsc
    );

  const paymentRazorpayAccountId =
    cleanString(
      data.paymentRazorpayAccountId
    );

  if (!companyName) {
    throw new Error(
      "Please enter your business name."
    );
  }

  if (!ownerName) {
    throw new Error(
      "Please enter your name."
    );
  }

  if (!industry) {
    throw new Error(
      "Please select your business industry."
    );
  }

  if (!businessModel) {
    throw new Error(
      "Please select your business model."
    );
  }

  if (yearsInBusiness < 0) {
    throw new Error(
      "Please enter a valid number of years in business."
    );
  }

  if (employees < 0) {
    throw new Error(
      "Please enter a valid employee count."
    );
  }

  if (startingRevenue < 0) {
    throw new Error(
      "Please enter a valid starting revenue."
    );
  }

  const validPaymentMethods = [
    "razorpay",
    "upi",
    "bank_transfer",
  ];

  if (
    !validPaymentMethods.includes(
      paymentMethod
    )
  ) {
    throw new Error(
      "Please select how you want to collect payments."
    );
  }

  if (!paymentDisplayName) {
    throw new Error(
      "Please enter the name customers should see when paying."
    );
  }

  if (!paymentPhone) {
    throw new Error(
      "Please enter the phone number associated with payments."
    );
  }

  if (
    paymentMethod === "upi" &&
    !paymentUpiId
  ) {
    throw new Error(
      "Please enter your UPI ID."
    );
  }

  if (
    paymentMethod === "bank_transfer" &&
    (!paymentBankName ||
      !paymentBankAccountName ||
      !paymentBankAccountNumber ||
      !paymentBankIfsc)
  ) {
    throw new Error(
      "Please enter all required bank details."
    );
  }

  if (
    paymentMethod === "razorpay" &&
    !paymentRazorpayAccountId
  ) {
    throw new Error(
      "Please connect or provide your Razorpay account."
    );
  }

  const {
    data: existingCompany,
    error: lookupError,
  } = await supabase
    .from("companies")
    .select("id")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (lookupError) {
    console.error(
      "[Onboarding] Company lookup failed:",
      lookupError
    );

    throw new Error(
      `Unable to find your business profile. [${lookupError.code}] ${lookupError.message}`
    );
  }

  const companyData = {
    company_name:
      companyName,

    owner_name:
      ownerName,

    email:
      user.email ?? "",

    phone:
      phone,

    industry:
      industry,

    employee_count:
      employees,

    starting_revenue:
      startingRevenue,

    business_model:
      businessModel,

    years_in_business:
      yearsInBusiness,

    payment_method:
      paymentMethod,

    payment_display_name:
      paymentDisplayName,

    payment_phone:
      paymentPhone,

    payment_upi_id:
      paymentMethod === "upi"
        ? paymentUpiId
        : "",

    payment_bank_name:
      paymentMethod === "bank_transfer"
        ? paymentBankName
        : "",

    payment_bank_account_name:
      paymentMethod === "bank_transfer"
        ? paymentBankAccountName
        : "",

    payment_bank_account_number:
      paymentMethod === "bank_transfer"
        ? paymentBankAccountNumber
        : "",

    payment_bank_ifsc:
      paymentMethod === "bank_transfer"
        ? paymentBankIfsc
        : "",

    payment_razorpay_account_id:
      paymentMethod === "razorpay"
        ? paymentRazorpayAccountId
        : "",

    onboarding_completed_at:
      new Date().toISOString(),
  };

  if (existingCompany) {
    console.log(
      "[Onboarding] Updating company:",
      existingCompany.id
    );

    const {
      error: updateError,
    } = await supabase
      .from("companies")
      .update(companyData)
      .eq(
        "id",
        existingCompany.id
      )
      .eq(
        "owner_id",
        user.id
      );

    if (updateError) {
      console.error(
        "[Onboarding] Company update failed:",
        updateError
      );

      throw new Error(
        `Unable to save your business information. [${updateError.code}] ${updateError.message}`
      );
    }

    console.log(
      "[Onboarding] Company updated successfully."
    );

    redirect("/dashboard");
  }

  console.log(
    "[Onboarding] Creating company for:",
    user.id
  );

  const {
    error: insertError,
  } = await supabase
    .from("companies")
    .insert({
      owner_id:
        user.id,

      company_name:
        companyName,

      owner_name:
        ownerName,

      email:
        user.email ?? "",

      phone:
        phone,

      website:
        "",

      address:
        "",

      gst_number:
        "",

      bank_name:
        "",

      account_number:
        "",

      ifsc_code:
        "",

      upi_id:
        "",

      logo_url:
        "",

      industry:
        industry,

      employee_count:
        employees,

      starting_revenue:
        startingRevenue,

      business_model:
        businessModel,

      years_in_business:
        yearsInBusiness,

      payment_method:
        paymentMethod,

      payment_display_name:
        paymentDisplayName,

      payment_phone:
        paymentPhone,

      payment_upi_id:
        paymentMethod === "upi"
          ? paymentUpiId
          : "",

      payment_bank_name:
        paymentMethod === "bank_transfer"
          ? paymentBankName
          : "",

      payment_bank_account_name:
        paymentMethod === "bank_transfer"
          ? paymentBankAccountName
          : "",

      payment_bank_account_number:
        paymentMethod === "bank_transfer"
          ? paymentBankAccountNumber
          : "",

      payment_bank_ifsc:
        paymentMethod === "bank_transfer"
          ? paymentBankIfsc
          : "",

      payment_razorpay_account_id:
        paymentMethod === "razorpay"
          ? paymentRazorpayAccountId
          : "",

      onboarding_completed_at:
        new Date().toISOString(),
    });

  if (insertError) {
    console.error(
      "[Onboarding] Company creation failed:",
      insertError
    );

    throw new Error(
      `Unable to create your business profile. [${insertError.code}] ${insertError.message}`
    );
  }

  console.log(
    "[Onboarding] Company created successfully."
  );

  redirect("/dashboard");
}

export async function saveIndustry(
  industry: string
) {
  const supabase =
    await createClient();

  const {
    data: { user },
    error: authError,
  } =
    await supabase.auth.getUser();

  if (authError) {
    throw new Error(
      "Unable to verify your account."
    );
  }

  if (!user) {
    redirect("/login");
  }

  const cleanIndustry =
    industry.trim();

  if (!cleanIndustry) {
    throw new Error(
      "Please select your business industry."
    );
  }

  const {
    data: company,
    error: lookupError,
  } =
    await supabase
      .from("companies")
      .select("id")
      .eq(
        "owner_id",
        user.id
      )
      .maybeSingle();

  if (lookupError) {
    throw new Error(
      `Unable to find your business profile. [${lookupError.code}] ${lookupError.message}`
    );
  }

  if (!company) {
    throw new Error(
      "Company profile not found. Please complete business setup."
    );
  }

  const {
    error: updateError,
  } =
    await supabase
      .from("companies")
      .update({
        industry:
          cleanIndustry,
      })
      .eq(
        "id",
        company.id
      )
      .eq(
        "owner_id",
        user.id
      );

  if (updateError) {
    throw new Error(
      `Unable to save your business industry. [${updateError.code}] ${updateError.message}`
    );
  }

  redirect("/dashboard");
}