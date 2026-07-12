"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { Invoice } from "@/types/invoice";

import {
  getInvoiceById,
  getInvoiceItems,
} from "@/services/invoiceService";

import { getCompany } from "@/services/companyService";

import {
  useInvoices,
} from "./queries/invoiceQueries";

import {
  useDeleteInvoice,
} from "./mutations/invoiceMutations";

import InvoiceSearch from "./InvoiceSearch";
import InvoiceTable from "./InvoiceTable";
import InvoiceViewModal from "./InvoiceViewModal";

import { generateInvoicePDF } from "@/lib/pdf";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);

type InvoiceItemRow = {
  id?: number;
  invoice_id: number;
  item_name: string;
  quantity: number;
  price: number;
  total: number;
};

export default function InvoiceList() {

  const {
    data: invoices = [],
    isLoading,
  } = useInvoices();

  const deleteMutation =
    useDeleteInvoice();

  const [search, setSearch] =
    useState("");

  const [selectedInvoice, setSelectedInvoice] =
    useState<Invoice | null>(null);

  const [selectedItems, setSelectedItems] =
    useState<InvoiceItemRow[]>([]);

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


 async function handleDelete(id: number) {
  if (!window.confirm("Delete this invoice?")) return;

  try {
    await deleteMutation.mutateAsync(id);

    alert("✅ Invoice deleted successfully!");
  } catch (error) {
    console.error(error);
    alert("Failed to delete invoice.");
  }
}

  async function handleView(id: number) {
    try {
      const invoice = await getInvoiceById(id);
      const items = await getInvoiceItems(id);
const company = await getCompany();
      setSelectedInvoice(invoice);
      setSelectedItems(items ?? []);
    } catch (error) {
      console.error(error);
      alert("Failed to load invoice.");
    }
  }

  function handleEdit(id: number) {
    window.location.href = `/invoices/edit/${id}`;
  }

  async function handlePDF(id: number) {
  try {
    const invoice = await getInvoiceById(id);

    const items = await getInvoiceItems(id);

    const company = await getCompany();   // <-- THIS LINE

    generateInvoicePDF({
      company,

      invoiceNumber: invoice.invoice_number,
      customer: invoice.customer,
      invoiceDate: invoice.invoice_date,
      dueDate: invoice.due_date,
      status: invoice.status,

      items: (items ?? []).map((item: any) => ({
        name: item.item_name,
        quantity: item.quantity,
        price: item.price,
      })),
    });

  } catch (error) {
    console.error(error);
    alert("Failed to generate PDF.");
  }
}

  // ✅ THIS WAS MISSING
  function handlePrint(id: number) {
    window.open(`/invoices/print/${id}`, "_blank");
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
    <>
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

        {isLoading ? (
          <div className="py-20 text-center text-gray-400">
            Loading invoices...
          </div>
        ) : (
          <InvoiceTable
            invoices={filteredInvoices}
            formatCurrency={formatCurrency}
            onView={handleView}
            onPDF={handlePDF}
            onPrint={handlePrint}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </section>

      {selectedInvoice && (
        <InvoiceViewModal
          invoice={selectedInvoice}
          items={selectedItems}
          formatCurrency={formatCurrency}
          onClose={() => {
            setSelectedInvoice(null);
            setSelectedItems([]);
          }}
        />
      )}
    </>
  );
}