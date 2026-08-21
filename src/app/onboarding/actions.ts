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

function cleanString(
  value: unknown
): string {
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

function normalizePhone(
  value: string
): string {
  const digits = value.replace(
    /\D/g,
    ""
  );

  if (
    digits.startsWith("91") &&
    digits.length === 12
  ) {
    return `+${digits}`;
  }

  if (digits.length === 10) {
    return `+91${digits}`;
  }

  throw new Error(
    "Please enter a valid Indian mobile number."
  );
}

export async function sendPhoneVerification(
  phone: string
) {
  const supabase =
    await createClient();

  const {
    data: { user },
    error: authError,
  } =
    await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  const normalizedPhone =
    normalizePhone(
      cleanString(phone)
    );

  const {
    data: existingTrial,
    error: trialLookupError,
  } =
    await supabase
      .from("arkenone_trials")
      .select("id")
      .eq(
        "phone_e164",
        normalizedPhone
      )
      .maybeSingle();

  if (trialLookupError) {
    console.error(
      "[Trial] Phone eligibility lookup failed:",
      trialLookupError
    );

    throw new Error(
      "Unable to check trial eligibility. Please try again."
    );
  }

  if (existingTrial) {
    throw new Error(
      "This phone number has already been used for an ArkenOne trial. Please continue with a paid plan."
    );
  }

  const {
    error: updateError,
  } =
    await supabase.auth.updateUser({
      phone: normalizedPhone,
    });

  if (updateError) {
    console.error(
      "[Trial] Phone verification request failed:",
      updateError
    );

    throw new Error(
      updateError.message
    );
  }

  return {
    success: true,
    phone: normalizedPhone,
  };
}

export async function verifyPhone(
  phone: string,
  token: string
) {
  const supabase =
    await createClient();

  const {
    data: { user },
    error: authError,
  } =
    await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  const normalizedPhone =
    normalizePhone(
      cleanString(phone)
    );

  const cleanToken =
    cleanString(token);

  if (!/^\d{6}$/.test(cleanToken)) {
    throw new Error(
      "Please enter the 6-digit verification code."
    );
  }

  const {
    data: existingTrial,
    error: trialLookupError,
  } =
    await supabase
      .from("arkenone_trials")
      .select("id")
      .eq(
        "phone_e164",
        normalizedPhone
      )
      .maybeSingle();

  if (trialLookupError) {
    throw new Error(
      "Unable to check trial eligibility."
    );
  }

  if (existingTrial) {
    throw new Error(
      "This phone number has already been used for an ArkenOne trial."
    );
  }

  const {
    error: verifyError,
  } =
    await supabase.auth.verifyOtp({
      phone: normalizedPhone,
      token: cleanToken,
      type: "phone_change",
    });

  if (verifyError) {
    console.error(
      "[Trial] Phone verification failed:",
      verifyError
    );

    throw new Error(
      verifyError.message
    );
  }

  return {
    success: true,
    phone: normalizedPhone,
  };
}

export async function saveOnboardingData(
  data: OnboardingData
) {
  const supabase =
    await createClient();

  const {
    data: { user },
    error: authError,
  } =
    await supabase.auth.getUser();

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
    normalizePhone(
      cleanString(data.phone)
    );

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

  if (!phone) {
    throw new Error(
      "Please verify your phone number."
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

  /*
   * ============================================================
   * PHONE VERIFICATION CHECK
   * ============================================================
   */

  const {
    data: verifiedUser,
    error: verifiedUserError,
  } =
    await supabase.auth.getUser();

  if (
    verifiedUserError ||
    !verifiedUser.user
  ) {
    redirect("/login");
  }

  const verifiedPhone =
    verifiedUser.user.phone;

  if (
    !verifiedPhone ||
    verifiedPhone !== phone
  ) {
    throw new Error(
      "Please verify the phone number before completing onboarding."
    );
  }

  /*
   * ============================================================
   * TRIAL ELIGIBILITY
   * ============================================================
   */

  const {
    data: existingTrial,
    error: trialLookupError,
  } =
    await supabase
      .from("arkenone_trials")
      .select(
        "id, user_id, company_id, trial_status"
      )
      .eq(
        "phone_e164",
        phone
      )
      .maybeSingle();

  if (trialLookupError) {
    console.error(
      "[Trial] Eligibility lookup failed:",
      trialLookupError
    );

    throw new Error(
      "Unable to verify trial eligibility."
    );
  }

  if (
    existingTrial &&
    existingTrial.user_id !== user.id
  ) {
    throw new Error(
      "This phone number has already been used for an ArkenOne trial. Please choose a paid plan."
    );
  }

  /*
   * ============================================================
   * COMPANY LOOKUP
   * ============================================================
   */

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

  let companyId: string;

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

    companyId =
      existingCompany.id;
  } else {
    console.log(
      "[Onboarding] Creating company for:",
      user.id
    );

    const {
      data: createdCompany,
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
          paymentMethod ===
          "bank_transfer"
            ? paymentBankName
            : "",

        payment_bank_account_name:
          paymentMethod ===
          "bank_transfer"
            ? paymentBankAccountName
            : "",

        payment_bank_account_number:
          paymentMethod ===
          "bank_transfer"
            ? paymentBankAccountNumber
            : "",

        payment_bank_ifsc:
          paymentMethod ===
          "bank_transfer"
            ? paymentBankIfsc
            : "",

        payment_razorpay_account_id:
          paymentMethod ===
          "razorpay"
            ? paymentRazorpayAccountId
            : "",

        onboarding_completed_at:
          new Date().toISOString(),
      })
      .select("id")
      .single();

    if (insertError) {
      console.error(
        "[Onboarding] Company creation failed:",
        insertError
      );

      throw new Error(
        `Unable to create your business profile. [${insertError.code}] ${insertError.message}`
      );
    }

    companyId =
      createdCompany.id;
  }

  /*
   * ============================================================
   * CREATE ONE-TIME TRIAL
   * ============================================================
   *
   * IMPORTANT:
   * The unique phone index makes the protection database-level.
   * A second email cannot create another trial using the same
   * verified phone number.
   *
   * Trial length:
   * 14 days.
   *
   * Change TRIAL_LENGTH_DAYS when the final commercial trial
   * duration is locked.
   */

  const TRIAL_LENGTH_DAYS = 14;

  const trialStartedAt =
    new Date();

  const trialEndsAt =
    new Date(
      trialStartedAt.getTime() +
        TRIAL_LENGTH_DAYS *
          24 *
          60 *
          60 *
          1000
    );

  if (!existingTrial) {
    const {
      error: trialInsertError,
    } =
      await supabase
        .from("arkenone_trials")
        .insert({
          user_id:
            user.id,

          company_id:
            companyId,

          phone_e164:
            phone,

          trial_status:
            "trialing",

          trial_started_at:
            trialStartedAt.toISOString(),

          trial_ends_at:
            trialEndsAt.toISOString(),

          subscription_status:
            "none",
        });

    if (trialInsertError) {
      console.error(
        "[Trial] Trial creation failed:",
        trialInsertError
      );

      throw new Error(
        `Unable to activate your ArkenOne trial. [${trialInsertError.code}] ${trialInsertError.message}`
      );
    }

    console.log(
      "[Trial] Trial activated:",
      {
        userId: user.id,
        companyId,
        trialEndsAt:
          trialEndsAt.toISOString(),
      }
    );
  }

  console.log(
    "[Onboarding] Onboarding completed successfully."
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