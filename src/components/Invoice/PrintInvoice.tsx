"use client";

import { useEffect } from "react";
import { Company } from "@/types/company";

type InvoiceItem = {
  item_name: string;
  quantity: number;
  price: number;
  total: number;
};

type Props = {
  company: Company | null;

  invoice: {
    invoice_number: string;
    customer: string;
    invoice_date: string;
    due_date: string;
    status: string;
    total: number;
  };

  items: InvoiceItem[];
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);

export default function PrintInvoice({
  company,
  invoice,
  items,
}: Props) {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.print();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const subtotal = items.reduce(
    (sum, item) => sum + item.total,
    0
  );

  const gst = subtotal * 0.18;

  return (
    <div className="min-h-screen bg-white p-12 text-black">

      <div className="mx-auto max-w-5xl rounded-xl border border-gray-300 p-10">

        {/* ---------- HEADER ---------- */}

        <div className="flex items-start justify-between border-b pb-8">

          <div>

            <h1 className="text-4xl font-bold tracking-wide">
              {company?.company_name || "FINZURA"}
            </h1>

            <p className="mt-1 text-gray-500">
              Financial Operating System
            </p>

            <div className="mt-6 space-y-1 text-sm text-gray-700">

              <p>
                <strong>Owner:</strong>{" "}
                {company?.owner_name || "-"}
              </p>

              <p>
                <strong>GST:</strong>{" "}
                {company?.gst_number || "-"}
              </p>

              <p>
                <strong>Phone:</strong>{" "}
                {company?.phone || "-"}
              </p>

              <p>
                <strong>Email:</strong>{" "}
                {company?.email || "-"}
              </p>

              <p>
                <strong>Website:</strong>{" "}
                {company?.website || "-"}
              </p>

              <p className="max-w-md">
                <strong>Address:</strong>{" "}
                {company?.address || "-"}
              </p>

            </div>

          </div>

          <div className="text-right">

            <h2 className="text-3xl font-bold uppercase">
              Invoice
            </h2>

            <div className="mt-6 space-y-2 text-sm">

              <p>
                <strong>Invoice #</strong>
                <br />
                {invoice.invoice_number}
              </p>

              <p>
                <strong>Status</strong>
                <br />
                {invoice.status}
              </p>

            </div>

          </div>

        </div>

        {/* ---------- BILL TO ---------- */}

        <div className="mt-10 grid grid-cols-2 gap-10">

          <div>

            <h3 className="mb-3 text-lg font-semibold uppercase tracking-wide text-gray-500">
              Bill To
            </h3>

            <p className="text-xl font-semibold">
              {invoice.customer}
            </p>

          </div>

          <div className="text-right">

            <p>
              <strong>Invoice Date</strong>
            </p>

            <p>{invoice.invoice_date}</p>

            <div className="mt-4">

              <p>
                <strong>Due Date</strong>
              </p>

              <p>{invoice.due_date}</p>

            </div>

          </div>

        </div>
                {/* ---------- ITEMS TABLE ---------- */}

        <div className="mt-12">

          <table className="w-full border-collapse">

            <thead>

              <tr className="border-b-2 border-gray-300 bg-gray-100">

                <th className="px-4 py-3 text-left text-sm font-semibold uppercase">
                  Item
                </th>

                <th className="px-4 py-3 text-center text-sm font-semibold uppercase">
                  Qty
                </th>

                <th className="px-4 py-3 text-center text-sm font-semibold uppercase">
                  Price
                </th>

                <th className="px-4 py-3 text-right text-sm font-semibold uppercase">
                  Total
                </th>

              </tr>

            </thead>

            <tbody>

              {items.map((item, index) => (

                <tr
                  key={index}
                  className="border-b border-gray-200"
                >

                  <td className="px-4 py-4">
                    {item.item_name}
                  </td>

                  <td className="px-4 py-4 text-center">
                    {item.quantity}
                  </td>

                  <td className="px-4 py-4 text-center">
                    {formatCurrency(item.price)}
                  </td>

                  <td className="px-4 py-4 text-right font-medium">
                    {formatCurrency(item.total)}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

        {/* ---------- TOTALS ---------- */}

        <div className="mt-10 flex justify-end">

          <div className="w-96 rounded-lg border border-gray-300 p-6">

            <div className="flex justify-between py-2">

              <span className="text-gray-600">
                Subtotal
              </span>

              <span>
                {formatCurrency(subtotal)}
              </span>

            </div>

            <div className="flex justify-between py-2">

              <span className="text-gray-600">
                GST (18%)
              </span>

              <span>
                {formatCurrency(gst)}
              </span>

            </div>

            <div className="mt-4 flex justify-between border-t-2 border-gray-300 pt-4 text-xl font-bold">

              <span>
                Grand Total
              </span>

              <span>
                {formatCurrency(invoice.total)}
              </span>

            </div>

          </div>

        </div>
                {/* ---------- PAYMENT INFORMATION ---------- */}

        <div className="mt-14 grid grid-cols-2 gap-12 border-t border-gray-300 pt-10">

          <div>

            <h3 className="mb-4 text-lg font-semibold uppercase tracking-wide text-gray-600">
              Payment Information
            </h3>

            <div className="space-y-3 text-sm">

              <p>
                <strong>Bank Name:</strong>{" "}
                {company?.bank_name || "-"}
              </p>

              <p>
                <strong>Account Number:</strong>{" "}
                {company?.account_number || "-"}
              </p>

              <p>
                <strong>IFSC Code:</strong>{" "}
                {company?.ifsc_code || "-"}
              </p>

              <p>
                <strong>UPI ID:</strong>{" "}
                {company?.upi_id || "-"}
              </p>

            </div>

          </div>

          <div className="text-right">

            <h3 className="mb-4 text-lg font-semibold uppercase tracking-wide text-gray-600">
              Payment Terms
            </h3>

            <p className="text-sm leading-7 text-gray-700">

              Kindly complete payment before the due date
              mentioned above.

              Late payments may be subject to additional
              charges as per agreed business terms.

            </p>

          </div>

        </div>

        {/* ---------- FOOTER ---------- */}

        <div className="mt-16 border-t border-gray-300 pt-8">

          <div className="flex items-end justify-between">

            <div>

              <h3 className="text-lg font-semibold">
                Thank you for your business.
              </h3>

              <p className="mt-2 max-w-lg text-sm leading-6 text-gray-600">

                We appreciate your trust in our services.

                If you have any questions regarding this invoice,
                please feel free to contact us.

              </p>

            </div>

            <div className="text-right">

              <div className="mb-12 h-px w-56 bg-gray-400"></div>

              <p className="text-sm font-medium">
                Authorized Signature
              </p>

            </div>

          </div>

        </div>
                {/* ---------- SYSTEM FOOTER ---------- */}

        <div className="mt-12 flex items-center justify-between border-t border-gray-200 pt-6 text-xs text-gray-500">

          <p>
            Generated by FINZURA
          </p>

          <p>
            Financial Operating System
          </p>

        </div>

      </div>
    </div>
  );
}