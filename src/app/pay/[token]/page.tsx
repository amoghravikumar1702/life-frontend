import { supabaseAdmin } from "@/lib/server/supabase";
import PayButton from "@/components/PaymentPortal/PayButton";

interface PaymentPageProps {
  params: Promise<{
    token: string;
  }>;
}

export default async function PaymentPage({
  params,
}: PaymentPageProps) {
  const { token } = await params;

  const { data: invoice, error } = await supabaseAdmin
    .from("invoices")
    .select("*")
    .eq("payment_token", token)
    .single();

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
            This payment link is invalid or no longer available.
          </p>
        </div>
      </main>
    );
  }

  if (
    invoice.payment_token_expires_at &&
    new Date(invoice.payment_token_expires_at) < new Date()
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
          <h1 className="text-2xl font-bold text-amber-600">
            Payment Link Expired
          </h1>

          <p className="mt-4 text-gray-600">
            This payment link has expired. Please request a new payment link
            from the business.
          </p>
        </div>
      </main>
    );
  }

  if (Number(invoice.balance_due) <= 0 || invoice.status === "Paid") {
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
            This invoice has already been paid successfully.
          </p>

          <div className="mt-8 rounded-xl bg-green-50 p-4">
            <p className="text-sm text-gray-500">Invoice</p>

            <p className="mt-1 font-semibold">
              {invoice.invoice_number}
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-10">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900">
            FINZURA Pay
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Secure Invoice Payment
          </p>
        </div>

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
              Amount Due
            </p>

            <h1 className="mt-1 text-4xl font-bold text-cyan-600">
              ₹
              {Number(invoice.balance_due).toLocaleString(
                "en-IN"
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
              ).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </h3>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Status
            </p>

            <div className="mt-2">
              <span className="rounded-full bg-yellow-100 px-4 py-2 text-sm font-semibold text-yellow-800">
                {invoice.status}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <PayButton
            invoiceId={invoice.id}
            amount={Number(invoice.balance_due)}
            customerName={invoice.customer}
            customerEmail={invoice.customer_email}
            customerPhone={invoice.customer_phone}
          />
        </div>
      </div>
    </main>
  );
}