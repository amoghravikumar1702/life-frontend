"use client";

import { useState } from "react";

import { Invoice } from "@/types/invoice";

import { usePendingInvoices } from "./queries/paymentQueries";
import { useRecordPayment } from "./mutations/paymentMutations";

export default function PaymentForm() {
  const {
    data: invoices = [],
    isLoading,
  } = usePendingInvoices();

  const paymentMutation = useRecordPayment();

  const [selectedInvoice, setSelectedInvoice] =
    useState("");

  const [selectedInvoiceData, setSelectedInvoiceData] =
    useState<Invoice | null>(null);

  const [amount, setAmount] = useState("");

  const [paymentMethod, setPaymentMethod] =
    useState("Cash");

  const [referenceNumber, setReferenceNumber] =
    useState("");

  const [notes, setNotes] = useState("");

  const [saving, setSaving] =
    useState(false);
      function handleInvoiceChange(
    e: React.ChangeEvent<HTMLSelectElement>
  ) {
    const id = Number(e.target.value);

    setSelectedInvoice(e.target.value);

    const invoice = invoices.find(
      (inv) => inv.id === id
    );

    if (!invoice) {
      setSelectedInvoiceData(null);
      setAmount("");
      return;
    }

    setSelectedInvoiceData(invoice);

    setAmount(String(invoice.balance_due));
  }

  return (
    <section className="mt-10 rounded-3xl border border-white/10 bg-gradient-to-br from-[#111827] to-[#0B1220] p-8 shadow-2xl">

      <h2 className="mb-8 text-3xl font-bold">
        Record Payment
      </h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

        <select
          value={selectedInvoice}
          onChange={handleInvoiceChange}
          disabled={isLoading}
          className="rounded-xl border border-white/10 bg-[#0B1220] p-4 outline-none focus:border-cyan-400"
        >

          <option value="">
            {isLoading
              ? "Loading invoices..."
              : "Select Invoice"}
          </option>

          {invoices.map((invoice) => (

            <option
              key={invoice.id}
              value={invoice.id}
            >
              {invoice.invoice_number} • {invoice.customer}
              {" • "}
              Balance INR{" "}
              {Number(invoice.balance_due).toLocaleString(
                "en-IN"
              )}
            </option>

          ))}

        </select>

        <input
          type="number"
          value={amount}
          onChange={(e) =>
            setAmount(e.target.value)
          }
          placeholder="Amount Received"
          className="rounded-xl border border-white/10 bg-[#0B1220] p-4 outline-none focus:border-cyan-400"
        />

        <select
          value={paymentMethod}
          onChange={(e) =>
            setPaymentMethod(e.target.value)
          }
          className="rounded-xl border border-white/10 bg-[#0B1220] p-4 outline-none focus:border-cyan-400"
        >

          <option>Cash</option>
          <option>UPI</option>
          <option>Bank Transfer</option>
          <option>Cheque</option>
          <option>Card</option>

        </select>

        <input
          value={referenceNumber}
          onChange={(e) =>
            setReferenceNumber(e.target.value)
          }
          placeholder="Reference Number (Optional)"
          className="rounded-xl border border-white/10 bg-[#0B1220] p-4 outline-none focus:border-cyan-400"
        />

        <textarea
          rows={4}
          value={notes}
          onChange={(e) =>
            setNotes(e.target.value)
          }
          placeholder="Notes (Optional)"
          className="rounded-xl border border-white/10 bg-[#0B1220] p-4 outline-none focus:border-cyan-400 md:col-span-2"
        />

      </div>
            {selectedInvoiceData && (
        <div className="mt-8 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-6">

          <h3 className="mb-4 text-lg font-semibold text-cyan-400">
            Invoice Summary
          </h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

            <div>
              <p className="text-sm text-gray-400">
                Invoice Total
              </p>

              <p className="mt-1 text-xl font-semibold">
                INR{" "}
                {Number(
                  selectedInvoiceData.total
                ).toLocaleString("en-IN")}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-400">
                Amount Paid
              </p>

              <p className="mt-1 text-xl font-semibold text-green-400">
                INR{" "}
                {Number(
                  selectedInvoiceData.amount_paid
                ).toLocaleString("en-IN")}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-400">
                Balance Due
              </p>

              <p className="mt-1 text-xl font-semibold text-orange-400">
                INR{" "}
                {Number(
                  selectedInvoiceData.balance_due
                ).toLocaleString("en-IN")}
              </p>
            </div>

          </div>

        </div>
      )}

      <div className="mt-8 flex justify-end">

        <button
          onClick={async () => {
            if (!selectedInvoice) {
              alert("Please select an invoice.");
              return;
            }

            if (!amount || Number(amount) <= 0) {
              alert("Please enter a valid payment amount.");
              return;
            }

            try {
              setSaving(true);

              await paymentMutation.mutateAsync({
                invoice_id: Number(selectedInvoice),
                amount: Number(amount),
                payment_date: new Date()
                  .toISOString()
                  .split("T")[0],
                payment_method: paymentMethod,
                reference_number: referenceNumber,
                notes,
              });

              alert("✅ Payment recorded successfully!");

              setSelectedInvoice("");
              setSelectedInvoiceData(null);
              setAmount("");
              setPaymentMethod("Cash");
              setReferenceNumber("");
              setNotes("");

            } catch (error) {
              console.error(error);
              alert("Failed to record payment.");
            } finally {
              setSaving(false);
            }
          }}
          disabled={saving || paymentMutation.isPending}
          className="rounded-xl bg-emerald-500 px-8 py-4 text-lg font-semibold text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving || paymentMutation.isPending
            ? "Recording..."
            : "💰 Record Payment"}
        </button>

      </div>
          </section>
  );
}