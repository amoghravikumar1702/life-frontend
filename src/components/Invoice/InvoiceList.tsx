"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { Invoice } from "@/types/invoice";
import {
  getInvoices,
  deleteInvoice,
} from "@/services/invoiceService";

import InvoiceSearch from "./InvoiceSearch";
import InvoiceTable from "./InvoiceTable";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);

export default function InvoiceList() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  async function loadInvoices() {
    try {
      setLoading(true);

      const data = await getInvoices();

      setInvoices(data ?? []);
    } catch (error) {
      console.error(error);
      alert("Failed to load invoices");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadInvoices();
  }, []);

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this invoice?")) return;

    try {
      await deleteInvoice(id);

      setInvoices((prev) =>
        prev.filter((invoice) => invoice.id !== id)
      );
    } catch (error) {
      console.error(error);
      alert("Failed to delete invoice");
    }
  }

  function handleView(id: number) {
    alert(`View Invoice ${id} (Coming Soon)`);
  }

  function handleEdit(id: number) {
    window.location.href = `/invoices/edit/${id}`;
  }

  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      const query = search.toLowerCase();

      return (
        invoice.customer.toLowerCase().includes(query) ||
        invoice.invoice_number.toLowerCase().includes(query)
      );
    });
  }, [invoices, search]);

  return (
    <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#111827] to-[#0B1220] p-8 shadow-2xl">

      <div className="mb-8 flex items-center justify-between">

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
          className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-black hover:bg-cyan-400"
        >
          + New Invoice
        </Link>

      </div>

      <InvoiceSearch
        value={search}
        onChange={setSearch}
      />

      {loading ? (
        <div className="py-20 text-center text-gray-400">
          Loading invoices...
        </div>
      ) : (
        <InvoiceTable
          invoices={filteredInvoices}
          formatCurrency={formatCurrency}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

    </section>
  );
}