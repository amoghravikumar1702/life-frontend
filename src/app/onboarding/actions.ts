"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/server/supabase";

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

/*
 * ============================================================
 * PHONE NORMALIZATION
 * ============================================================
 */

function normalizeIndianPhone(
  value: unknown
): string {
  const raw = cleanString(value);

  if (!raw) {
    throw new Error(
      "Please enter your phone number."
    );
  }

  const digits = raw.replace(
    /\D/g,
    ""
  );

  let normalized = "";

  if (digits.length === 10) {
    normalized = `+91${digits}`;
  } else if (
    digits.length === 12 &&
    digits.startsWith("91")
  ) {
    normalized = `+${digits}`;
  } else if (
    digits.length === 13 &&
    digits.startsWith("091")
  ) {
    normalized = `+${digits.slice(1)}`;
  } else {
    throw new Error(
      "Please enter a valid Indian mobile number."
    );
  }

  if (
    !/^\+91[6-9]\d{9}$/.test(
      normalized
    )
  ) {
    throw new Error(
      "Please enter a valid Indian mobile number."
    );
  }

  return normalized;
}

/*
 * ============================================================
 * CREATE TRIAL
 * ============================================================
 */

async function createTrialForUser({
  userId,
  companyId,
  phoneE164,
}: {
  userId: string;
  companyId: number;
  phoneE164: string;
}) {
  /*
   * Check whether this phone has already been used.
   */

  const {
    data: existingPhoneTrial,
    error: phoneLookupError,
  } =
    await supabaseAdmin
      .from("dhanarkos_trials")
      .select(
        `
          id,
          user_id,
          trial_status,
          subscription_status
        `
      )
      .eq(
        "phone_e164",
        phoneE164
      )
      .limit(1)
      .maybeSingle();

  if (phoneLookupError) {
    console.error(
      "[DhanarkOS Trial] Phone lookup failed:",
      {
        message:
          phoneLookupError.message,
        code:
          phoneLookupError.code,
        details:
          phoneLookupError.details,
        hint:
          phoneLookupError.hint,
      }
    );

    throw new Error(
      `Unable to verify trial eligibility. [${phoneLookupError.code}] ${phoneLookupError.message}`
    );
  }

  /*
   * Same user's existing trial.
   */

  if (existingPhoneTrial) {
    if (
      existingPhoneTrial.user_id ===
      userId
    ) {
      return;
    }

    throw new Error(
      "A DhanarkOS trial has already been used with this phone number. Please sign in to the existing account or choose a subscription."
    );
  }

  /*
   * ==========================================================
   * CREATE NEW 7-DAY TRIAL
   * ==========================================================
   */

  const startedAt =
    new Date();

  const endsAt =
    new Date(
      startedAt.getTime() +
        7 *
          24 *
          60 *
          60 *
          1000
    );

  const {
    error: trialInsertError,
  } =
    await supabaseAdmin
      .from("dhanarkos_trials")
      .insert({
        user_id:
          userId,

        company_id:
          companyId,

        phone_e164:
          phoneE164,

        trial_status:
          "trialing",

        trial_started_at:
          startedAt.toISOString(),

        trial_ends_at:
          endsAt.toISOString(),

        subscription_status:
          "none",

        trial_fingerprint:
          phoneE164,
      });

  if (trialInsertError) {
    console.error(
      "[DhanarkOS Trial] Trial creation failed:",
      {
        message:
          trialInsertError.message,
        code:
          trialInsertError.code,
        details:
          trialInsertError.details,
        hint:
          trialInsertError.hint,
      }
    );

    if (
      trialInsertError.code ===
      "23505"
    ) {
      throw new Error(
        "A DhanarkOS trial already exists for this account or phone number."
      );
    }

    throw new Error(
      `Unable to start your DhanarkOS trial. [${trialInsertError.code}] ${trialInsertError.message}`
    );
  }

  console.log(
    "[DhanarkOS Trial] Trial created successfully:",
    userId
  );
}

/*
 * ============================================================
 * SAVE ONBOARDING DATA
 * ============================================================
 */

export async function saveOnboardingData(
  data: OnboardingData
) {
  const supabase =
    await createClient();

  /*
   * ==========================================================
   * AUTHENTICATION
   * ==========================================================
   */

  const {
    data: { user },
    error: authError,
  } =
    await supabase.auth.getUser();

  if (authError) {
    console.error(
      "[Onboarding] Auth error:",
      {
        message:
          authError.message,
        code:
          authError.code,
        status:
          authError.status,
      }
    );

    throw new Error(
      "Unable to verify your account."
    );
  }

  if (!user) {
    redirect("/login");
  }

  /*
   * ==========================================================
   * CLEAN INPUT
   * ==========================================================
   */

  const companyName =
    cleanString(
      data.companyName
    );

  const ownerName =
    cleanString(
      data.ownerName
    );

  const phone =
    cleanString(
      data.phone
    );

  const businessModel =
    cleanString(
      data.businessModel
    );

  const industry =
    cleanString(
      data.industry
    );

  const yearsInBusiness =
    cleanNumber(
      data.yearsInBusiness
    );

  const employees =
    cleanNumber(
      data.employees
    );

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

  /*
   * ==========================================================
   * VALIDATION
   * ==========================================================
   */

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
      "Please enter your phone number."
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
    paymentMethod ===
      "bank_transfer" &&
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
    paymentMethod ===
      "razorpay" &&
    !paymentRazorpayAccountId
  ) {
    throw new Error(
      "Please connect or provide your Razorpay account."
    );
  }

  /*
   * ==========================================================
   * NORMALIZE PHONE
   * ==========================================================
   */

  const phoneE164 =
    normalizeIndianPhone(
      phone
    );

  /*
   * ==========================================================
   * FIND COMPANY
   * ==========================================================
   */

  const {
    data: existingCompany,
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
    console.error(
      "[Onboarding] Company lookup failed:",
      {
        message:
          lookupError.message,
        code:
          lookupError.code,
        details:
          lookupError.details,
        hint:
          lookupError.hint,
      }
    );

    throw new Error(
      `Unable to find your business profile. [${lookupError.code}] ${lookupError.message}`
    );
  }

  /*
   * ============================================================
   * COMPANY DATA
   * ============================================================
   */

  const companyData = {
    company_name:
      companyName,

    owner_name:
      ownerName,

    email:
      user.email ?? "",

    phone:
      phoneE164,

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
      paymentMethod ===
      "upi"
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
  };

  /*
   * ============================================================
   * UPDATE EXISTING COMPANY
   * ============================================================
   */

  if (existingCompany) {
    console.log(
      "[Onboarding] Updating company:",
      existingCompany.id
    );

    const {
      error: updateError,
    } =
      await supabase
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
        {
          message:
            updateError.message,
          code:
            updateError.code,
          details:
            updateError.details,
          hint:
            updateError.hint,
        }
      );

      throw new Error(
        `Unable to save your business information. [${updateError.code}] ${updateError.message}`
      );
    }

    /*
     * ==========================================================
     * FIND EXISTING TRIAL
     * ==========================================================
     *
     * Pricing may already have created the trial record before
     * onboarding.
     *
     * Therefore we MUST NOT blindly create another trial.
     */

    const {
      data: existingTrial,
      error: existingTrialError,
    } =
      await supabaseAdmin
        .from("dhanarkos_trials")
        .select(
          `
            id,
            user_id,
            company_id,
            phone_e164,
            trial_status,
            trial_ends_at,
            subscription_status,
            razorpay_subscription_id,
            selected_plan,
            subscription_plan_id,
            subscription_plan,
            subscription_billing_cycle
          `
        )
        .eq(
          "user_id",
          user.id
        )
        .maybeSingle();

    if (existingTrialError) {
      console.error(
        "[DhanarkOS Trial] Existing trial lookup failed:",
        {
          message:
            existingTrialError.message,
          code:
            existingTrialError.code,
          details:
            existingTrialError.details,
          hint:
            existingTrialError.hint,
        }
      );

      throw new Error(
        `Unable to verify your DhanarkOS trial. [${existingTrialError.code}] ${existingTrialError.message}`
      );
    }

    /*
     * ==========================================================
     * EXISTING TRIAL
     * ==========================================================
     *
     * This is the important part.
     *
     * If Pricing already created the trial:
     *
     *   user_id          → already exists
     *   razorpay_sub_id  → already exists if subscribed
     *   selected_plan    → already exists
     *
     * We now attach:
     *
     *   company_id
     *   phone_e164
     *   trial_fingerprint
     *
     * We preserve the existing trial dates and subscription data.
     */

    if (existingTrial) {
      console.log(
        "[DhanarkOS Trial] Existing trial found. Attaching onboarding data:",
        existingTrial.id
      );

      /*
       * Safety check:
       *
       * If this phone belongs to a different trial,
       * do not overwrite it.
       */

      const {
        data: phoneTrial,
        error: phoneTrialError,
      } =
        await supabaseAdmin
          .from("dhanarkos_trials")
          .select(
            `
              id,
              user_id
            `
          )
          .eq(
            "phone_e164",
            phoneE164
          )
          .neq(
            "id",
            existingTrial.id
          )
          .limit(1)
          .maybeSingle();

      if (phoneTrialError) {
        console.error(
          "[DhanarkOS Trial] Phone ownership check failed:",
          phoneTrialError
        );

        throw new Error(
          `Unable to verify phone ownership. [${phoneTrialError.code}] ${phoneTrialError.message}`
        );
      }

      if (phoneTrial) {
        throw new Error(
          "A DhanarkOS trial has already been used with this phone number. Please sign in to the existing account or choose a subscription."
        );
      }

      /*
       * Attach onboarding data to the existing trial.
       */

      const {
        error: trialUpdateError,
      } =
        await supabaseAdmin
          .from("dhanarkos_trials")
          .update({
            company_id:
              Number(
                existingCompany.id
              ),

            phone_e164:
              phoneE164,

            trial_fingerprint:
              phoneE164,

            updated_at:
              new Date().toISOString(),
          })
          .eq(
            "id",
            existingTrial.id
          )
          .eq(
            "user_id",
            user.id
          );

      if (trialUpdateError) {
        console.error(
          "[DhanarkOS Trial] Existing trial update failed:",
          {
            message:
              trialUpdateError.message,
            code:
              trialUpdateError.code,
            details:
              trialUpdateError.details,
            hint:
              trialUpdateError.hint,
          }
        );

        throw new Error(
          `Unable to complete your DhanarkOS trial setup. [${trialUpdateError.code}] ${trialUpdateError.message}`
        );
      }

      console.log(
        "[DhanarkOS Trial] Existing trial successfully attached to company."
      );
    } else {
      /*
       * ==========================================================
       * NO EXISTING TRIAL
       * ==========================================================
       *
       * This supports users who reached onboarding without going
       * through the pre-created trial flow.
       */

      console.log(
        "[DhanarkOS Trial] No existing trial found. Creating one."
      );

      await createTrialForUser({
        userId:
          user.id,

        companyId:
          Number(
            existingCompany.id
          ),

        phoneE164,
      });
    }

    console.log(
      "[Onboarding] Company and trial setup completed successfully."
    );

    redirect("/dashboard");
  }

  /*
   * ============================================================
   * CREATE COMPANY
   * ============================================================
   */

  console.log(
    "[Onboarding] Creating company for:",
    user.id
  );

  const {
    data: createdCompany,
    error: insertError,
  } =
    await supabase
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
          phoneE164,

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
          paymentMethod ===
          "upi"
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
      {
        message:
          insertError.message,
        code:
          insertError.code,
        details:
          insertError.details,
        hint:
          insertError.hint,
      }
    );

    throw new Error(
      `Unable to create your business profile. [${insertError.code}] ${insertError.message}`
    );
  }

  /*
   * ============================================================
   * CHECK FOR PRE-CREATED TRIAL
   * ============================================================
   *
   * Pricing may have already created a trial before onboarding.
   */

  const {
    data: existingTrial,
    error: existingTrialError,
  } =
    await supabaseAdmin
      .from("dhanarkos_trials")
      .select(
        `
          id,
          user_id,
          company_id,
          phone_e164,
          trial_status,
          trial_ends_at,
          subscription_status,
          razorpay_subscription_id,
          selected_plan,
          subscription_plan_id,
          subscription_plan,
          subscription_billing_cycle
        `
      )
      .eq(
        "user_id",
        user.id
      )
      .maybeSingle();

  if (existingTrialError) {
    console.error(
      "[DhanarkOS Trial] Trial lookup failed after company creation:",
      existingTrialError
    );

    throw new Error(
      `Unable to verify your DhanarkOS trial. [${existingTrialError.code}] ${existingTrialError.message}`
    );
  }

  /*
   * ============================================================
   * ATTACH EXISTING TRIAL
   * ============================================================
   */

  if (existingTrial) {
    console.log(
      "[DhanarkOS Trial] Existing trial found after company creation:",
      existingTrial.id
    );

    /*
     * Make sure this phone is not already attached to another
     * DhanarkOS account.
     */

    const {
      data: phoneTrial,
      error: phoneTrialError,
    } =
      await supabaseAdmin
        .from("dhanarkos_trials")
        .select(
          `
            id,
            user_id
          `
        )
        .eq(
          "phone_e164",
          phoneE164
        )
        .neq(
          "id",
          existingTrial.id
        )
        .limit(1)
        .maybeSingle();

    if (phoneTrialError) {
      console.error(
        "[DhanarkOS Trial] Phone ownership check failed:",
        phoneTrialError
      );

      throw new Error(
        `Unable to verify phone ownership. [${phoneTrialError.code}] ${phoneTrialError.message}`
      );
    }

    if (phoneTrial) {
      throw new Error(
        "A DhanarkOS trial has already been used with this phone number. Please sign in to the existing account or choose a subscription."
      );
    }

    /*
     * Attach the newly created company and phone.
     */

    const {
      error: trialUpdateError,
    } =
      await supabaseAdmin
        .from("dhanarkos_trials")
        .update({
          company_id:
            Number(
              createdCompany.id
            ),

          phone_e164:
            phoneE164,

          trial_fingerprint:
            phoneE164,

          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          existingTrial.id
        )
        .eq(
          "user_id",
          user.id
        );

    if (trialUpdateError) {
      console.error(
        "[DhanarkOS Trial] Trial attachment failed:",
        trialUpdateError
      );

      throw new Error(
        `Unable to complete your DhanarkOS trial setup. [${trialUpdateError.code}] ${trialUpdateError.message}`
      );
    }

    console.log(
      "[DhanarkOS Trial] Existing trial attached successfully."
    );
  } else {
    /*
     * ==========================================================
     * CREATE NEW TRIAL
     * ==========================================================
     */

    await createTrialForUser({
      userId:
        user.id,

      companyId:
        Number(
          createdCompany.id
        ),

      phoneE164,
    });
  }

  /*
   * ============================================================
   * COMPLETE
   * ============================================================
   */

  console.log(
    "[Onboarding] Company and trial created successfully."
  );

  redirect("/dashboard");
}

/*
 * ============================================================
 * SAVE INDUSTRY
 * ============================================================
 */

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