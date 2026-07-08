"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getInvoices } from "@/services/invoiceService";

type Invoice = {
  id: number;
  customer: string;
  invoice_number: string;
  invoice_date: string;
  due_date: string;
  total: number;
  status: string;
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);

export default function InvoiceList() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInvoices();
  }, []);

  async function loadInvoices() {
    try {
      const data = await getInvoices();

      if (data) {
        setInvoices(data as Invoice[]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) =>
      `${invoice.invoice_number} ${invoice.customer}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [invoices, search]);

  return (
    <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#111827] to-[#0B1220] p-8 shadow-2xl">

      {/* Header */}

      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>
          <h2 className="text-3xl font-bold">
            All Invoices
          </h2>

          <p className="mt-2 text-gray-400">
            Manage all your customer invoices.
          </p>
        </div>

        <Link
          href="/invoices/new"
          className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-black transition hover:bg-cyan-400"
        >
          + New Invoice
        </Link>

      </div>

      {/* Search */}

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search invoices..."
        className="mb-8 w-full rounded-xl border border-white/10 bg-[#0B1220] p-4 outline-none focus:border-cyan-400"
      />

      {/* Table */}

      <div className="overflow-x-auto rounded-2xl border border-white/10">

        <table className="w-full">

          <thead className="bg-white/5">

            <tr className="text-left text-gray-400">

              <th className="px-6 py-4">Invoice</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Actions</th>

            </tr>

          </thead>

          <tbody>

            {loading ? (

              <tr>

                <td
                  colSpan={5}
                  className="py-12 text-center text-gray-400"
                >
                  Loading invoices...
                </td>

              </tr>

            ) : filteredInvoices.length === 0 ? (

              <tr>

                <td
                  colSpan={5}
                  className="py-12 text-center text-gray-500"
                >
                  No invoices found.
                </td>

              </tr>

            ) : (

              filteredInvoices.map((invoice) => (

                <tr
                  key={invoice.id}
                  className="border-t border-white/10 hover:bg-white/5 transition"
                >

                  <td className="px-6 py-5 font-semibold">
                    {invoice.invoice_number}
                  </td>

                  <td className="px-6 py-5">
                    {invoice.customer}
                  </td>

                  <td className="px-6 py-5 text-cyan-300 font-semibold">
                    {formatCurrency(invoice.total)}
                  </td>

                  <td className="px-6 py-5">

                    <span
                      className={`rounded-full px-3 py-1 text-sm font-medium
                      ${
                        invoice.status === "Paid"
                          ? "bg-green-500/20 text-green-300"
                          : invoice.status === "Pending"
                          ? "bg-yellow-500/20 text-yellow-300"
                          : "bg-red-500/20 text-red-300"
                      }`}
                    >
                      {invoice.status}
                    </span>

                  </td>

                  <td className="px-6 py-5">

                    <div className="flex gap-4">

                      <button className="text-cyan-400 hover:text-cyan-300">
                        View
                      </button>

                      <button className="text-green-400 hover:text-green-300">
                        Edit
                      </button>

                      <button className="text-red-400 hover:text-red-300">
                        Delete
                      </button>

                    </div>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </section>
  );
}