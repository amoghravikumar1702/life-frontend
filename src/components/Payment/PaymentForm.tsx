"use client";

import { useEffect, useState } from "react";

import { Invoice } from "@/types/invoice";
import { getInvoices } from "@/services/invoiceService";
import { recordPayment } from "@/services/paymentService";
import { useRouter } from "next/navigation";
export default function PaymentForm() {
  // Invoice List
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  // Selected Invoice
  const [selectedInvoice, setSelectedInvoice] = useState("");

  const [selectedInvoiceData, setSelectedInvoiceData] =
    useState<Invoice | null>(null);

  // Payment Form
  const [amount, setAmount] = useState("");

  const [paymentMethod, setPaymentMethod] =
    useState("Cash");

  const [referenceNumber, setReferenceNumber] =
    useState("");
const router = useRouter();
  const [notes, setNotes] = useState("");
const [saving, setSaving] = useState(false);
  // Load Invoices
  useEffect(() => {
    async function loadInvoices() {
      try {
        const data = await getInvoices();

        setInvoices(data ?? []);
      } catch (error) {
        console.error("Failed to load invoices:", error);
      }
    }

    loadInvoices();
  }, []);

  // Handle Invoice Selection
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

    // Autofill outstanding balance
    setAmount(String(invoice.balance_due));
  }
async function handleRecordPayment() {
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

    await recordPayment({
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
router.push("/invoices");
  } catch (error) {
    console.error(error);
    alert("Failed to record payment.");
  } finally {
    setSaving(false);
  }
}
  return (
    <section className="mt-10 rounded-3xl border border-white/10 bg-gradient-to-br from-[#111827] to-[#0B1220] p-8 shadow-2xl">

      <h2 className="mb-8 text-3xl font-bold">
        Record Payment
      </h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

        {/* Invoice */}

        <select
          value={selectedInvoice}
          onChange={handleInvoiceChange}
          className="rounded-xl border border-white/10 bg-[#0B1220] p-4 outline-none focus:border-cyan-400"
        >
          <option value="">
            Select Invoice
          </option>

          {invoices
            .filter(
              (invoice) =>
                Number(invoice.balance_due) > 0
            )
            .map((invoice) => (
              <option
                key={invoice.id}
                value={invoice.id}
              >
                {invoice.invoice_number} • {invoice.customer} • Balance INR{" "}
                {Number(invoice.balance_due).toLocaleString(
                  "en-IN"
                )}
              </option>
            ))}
        </select>

        {/* Amount */}

        <input
          type="number"
          value={amount}
          onChange={(e) =>
            setAmount(e.target.value)
          }
          placeholder="Amount Received"
          className="rounded-xl border border-white/10 bg-[#0B1220] p-4 outline-none focus:border-cyan-400"
        />

        {/* Payment Method */}

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

        {/* Reference */}

        <input
          value={referenceNumber}
          onChange={(e) =>
            setReferenceNumber(e.target.value)
          }
          placeholder="Reference Number (Optional)"
          className="rounded-xl border border-white/10 bg-[#0B1220] p-4 outline-none focus:border-cyan-400"
        />

        {/* Notes */}

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
  onClick={handleRecordPayment}
  disabled={saving}
  className="rounded-xl bg-emerald-500 px-8 py-4 text-lg font-semibold text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
>
  {saving
    ? "Recording..."
    : "💰 Record Payment"}
</button>

      </div>

    </section>
  );
}