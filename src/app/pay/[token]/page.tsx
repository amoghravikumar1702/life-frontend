import { supabase } from "@/lib/supabase";
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

  const { data: invoice, error } = await supabase
    .from("invoices")
    .select("*")
    .eq("payment_token", token)
    .single();

  if (error || !invoice) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="rounded-2xl bg-white p-8 shadow-lg text-center">
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

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">

        <h1 className="text-3xl font-bold text-slate-900">
          FINZURA Pay
        </h1>

        <p className="mt-6 text-gray-500">
          Invoice Number
        </p>

        <h2 className="text-2xl font-bold">
          {invoice.invoice_number}
        </h2>

        <p className="mt-6 text-gray-500">
          Customer
        </p>

        <h3 className="text-xl font-semibold text-slate-800">
          {invoice.customer}
        </h3>

        <p className="mt-8 text-gray-500">
          Amount Due
        </p>

        <h1 className="text-4xl font-bold text-cyan-600">
          ₹{Number(invoice.balance_due).toLocaleString("en-IN")}
        </h1>

        <p className="mt-8 text-gray-500">
          Due Date
        </p>

        <h3 className="text-xl font-semibold text-slate-800">
          {new Date(invoice.due_date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </h3>

        <p className="mt-8 text-gray-500">
          Status
        </p>

        <div className="mt-2">
          <span className="rounded-full bg-yellow-100 px-4 py-2 text-sm font-semibold text-yellow-800">
            {invoice.status}
          </span>
        </div>

        <PayButton
  invoiceId={invoice.id}
  amount={Number(invoice.balance_due)}
  customerName={invoice.customer}
  customerEmail={invoice.customer_email}
  customerPhone={invoice.customer_phone}
/>

      </div>
    </main>
  );
}