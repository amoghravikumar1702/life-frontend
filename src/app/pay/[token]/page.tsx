// src/app/pay/[token]/page.tsx

import { supabaseAdmin } from "@/lib/server/supabase";
import PayButton from "@/components/PaymentPortal/PayButton";
import DirectUPIPayment from "@/components/PaymentPortal/DirectUPIPayment";

interface PaymentPageProps {
  params: Promise<{
    token: string;
  }>;
}

export default async function PaymentPage({
  params,
}: PaymentPageProps) {
  const { token } = await params;

  /*
   * =========================================================
   * LOAD INVOICE
   * =========================================================
   */

  const {
    data: invoice,
    error,
  } = await supabaseAdmin
    .from("invoices")
    .select("*")
    .eq("payment_token", token)
    .single();

  /*
   * =========================================================
   * INVALID LINK
   * =========================================================
   */

  if (
    error ||
    !invoice ||
    !invoice.payment_token ||
    invoice.payment_token !== token
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
          <h1 className="text-2xl font-bold text-red-600">
            Invalid Payment Link
          </h1>

          <p className="mt-4 text-gray-600">
            This payment link is invalid or no longer
            available.
          </p>
        </div>
      </main>
    );
  }

  /*
   * =========================================================
   * EXPIRED LINK
   * =========================================================
   */

  if (
    invoice.payment_token_expires_at &&
    new Date(
      invoice.payment_token_expires_at
    ) < new Date()
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
          <h1 className="text-2xl font-bold text-amber-600">
            Payment Link Expired
          </h1>

          <p className="mt-4 text-gray-600">
            This payment link has expired. Please
            request a new payment link from the
            business.
          </p>
        </div>
      </main>
    );
  }

  const balanceDue =
    Number(invoice.balance_due ?? 0);

  /*
   * =========================================================
   * FULLY PAID
   * =========================================================
   */

  if (
    balanceDue <= 0 ||
    invoice.status === "Paid"
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-8 w-8 text-green-600"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="mt-6 text-2xl font-bold text-green-700">
            Invoice Already Paid
          </h1>

          <p className="mt-3 text-gray-600">
            This invoice has already been paid
            successfully.
          </p>

          <div className="mt-8 rounded-xl bg-green-50 p-4">
            <p className="text-sm text-gray-500">
              Invoice
            </p>

            <p className="mt-1 font-semibold">
              {invoice.invoice_number}
            </p>
          </div>
        </div>
      </main>
    );
  }

  /*
   * =========================================================
   * LOAD BUSINESS PAYMENT SETTINGS
   * =========================================================
   */

  const {
    data: company,
    error: companyError,
  } = await supabaseAdmin
    .from("companies")
    .select(`
      company_name,
      payment_method,
      payment_display_name,
      payment_phone,
      payment_upi_id,
      payment_bank_name,
      payment_bank_account_name,
      payment_bank_account_number,
      payment_bank_ifsc,
      payment_razorpay_account_id
    `)
    .eq(
      "owner_id",
      invoice.owner_id
    )
    .maybeSingle();

  if (companyError) {
    console.error(
      "[Payment Page] Company lookup failed:",
      companyError
    );
  }

  /*
   * =========================================================
   * PAYMENT CONFIG
   * =========================================================
   */

  const paymentMethod =
    company?.payment_method ??
    "razorpay";

  const paymentDisplayName =
    company?.payment_display_name ||
    company?.company_name ||
    "Business";

  /*
   * =========================================================
   * PAGE
   * =========================================================
   */

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-10">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">

        {/* BRAND */}

        <div className="text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#B08D22]">
            ARKENONE
          </p>

          <h1 className="mt-3 text-3xl font-bold text-slate-900">
            Secure Payment
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            {paymentDisplayName}
          </p>
        </div>

        {/* INVOICE */}

        <div className="mt-8 space-y-6">

          <div>
            <p className="text-sm text-gray-500">
              Invoice Number
            </p>

            <h2 className="mt-1 text-xl font-bold text-slate-900">
              {invoice.invoice_number}
            </h2>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Customer
            </p>

            <h3 className="mt-1 text-lg font-semibold text-slate-800">
              {invoice.customer}
            </h3>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Outstanding Balance
            </p>

            <h1 className="mt-1 text-4xl font-bold text-[#B08D22]">
              ₹
              {balanceDue.toLocaleString(
                "en-IN",
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }
              )}
            </h1>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Due Date
            </p>

            <h3 className="mt-1 text-lg font-semibold text-slate-800">
              {new Date(
                invoice.due_date
              ).toLocaleDateString(
                "en-IN",
                {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }
              )}
            </h3>
          </div>

        </div>

        {/* PAYMENT METHOD */}

        {paymentMethod === "upi" &&
        company?.payment_upi_id ? (
          <DirectUPIPayment
  invoiceId={invoice.id}
  invoiceNumber={invoice.invoice_number}
  amount={balanceDue}
  businessName={paymentDisplayName}
  upiId={company.payment_upi_id}
  paymentToken={token}
/>
        ) : paymentMethod === "razorpay" ? (
          <PayButton
            invoiceId={invoice.id}
            amount={balanceDue}
            customerName={
              invoice.customer
            }
            customerEmail={
              invoice.customer_email
            }
            customerPhone={
              invoice.customer_phone
            }
          />
        ) : (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="font-semibold text-slate-900">
              Bank Transfer
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Please transfer the amount using
              the bank details provided by the
              business.
            </p>

            {company?.payment_bank_name && (
              <div className="mt-5 space-y-3 text-sm">

                <div>
                  <p className="text-slate-400">
                    Bank
                  </p>

                  <p className="font-semibold">
                    {
                      company.payment_bank_name
                    }
                  </p>
                </div>

                <div>
                  <p className="text-slate-400">
                    Account Holder
                  </p>

                  <p className="font-semibold">
                    {
                      company.payment_bank_account_name
                    }
                  </p>
                </div>

                <div>
                  <p className="text-slate-400">
                    Account Number
                  </p>

                  <p className="font-semibold">
                    {
                      company.payment_bank_account_number
                    }
                  </p>
                </div>

                <div>
                  <p className="text-slate-400">
                    IFSC
                  </p>

                  <p className="font-semibold">
                    {
                      company.payment_bank_ifsc
                    }
                  </p>
                </div>

              </div>
            )}
          </div>
        )}

      </div>
    </main>
  );
}