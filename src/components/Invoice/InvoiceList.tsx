
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Invoice } from "@/types/invoice";

import {
  getInvoiceById,
  getInvoiceItems,
} from "@/services/invoiceService";

import { useInvoices } from "./queries/invoiceQueries";

import { useDeleteInvoice } from "./mutations/invoiceMutations";

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
  const router = useRouter();

  const {
    data: invoices = [],
    isLoading,
  } = useInvoices();

  const deleteMutation = useDeleteInvoice();

  const [search, setSearch] = useState("");

  const [selectedInvoice, setSelectedInvoice] =
    useState<Invoice | null>(null);

  const [selectedItems, setSelectedItems] =
    useState<InvoiceItemRow[]>([]);

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this invoice?")) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(id);

      alert("Invoice deleted successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to delete invoice.");
    }
  }

  async function handleView(id: number) {
    try {
      const invoice = await getInvoiceById(id);
      const items = await getInvoiceItems(id);

      setSelectedInvoice(invoice);
      setSelectedItems(items ?? []);
    } catch (error) {
      console.error(error);
      alert("Failed to load invoice.");
    }
  }

  function handleEdit(id: number) {
    router.push(`/invoices/edit/${id}`);
  }

  async function handlePDF(id: number) {
    try {
      const invoice = await getInvoiceById(id);
      const items = await getInvoiceItems(id);

      generateInvoicePDF({
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
      <section
        className="
          w-full
          overflow-hidden
          rounded-[24px]
          border
          border-white/[0.06]
          bg-[#101214]
          shadow-[0_20px_60px_rgba(0,0,0,0.45)]
          sm:rounded-[30px]
        "
      >
        {/* HEADER */}

        <div
          className="
            flex
            flex-col
            gap-6
            border-b
            border-white/[0.06]
            p-4
            sm:gap-8
            sm:p-6
            lg:flex-row
            lg:items-center
            lg:justify-between
            lg:p-10
          "
        >
          <div className="min-w-0">
            <p
              className="
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.22em]
                text-[#D4AF37]
                sm:text-xs
              "
            >
              DhanarkOS
            </p>

            <h1
              className="
                mt-2
                bg-gradient-to-r
                from-[#FFF4C8]
                via-[#D4AF37]
                to-[#B8860B]
                bg-clip-text
                text-3xl
                font-semibold
                tracking-tight
                text-transparent
                sm:mt-3
                sm:text-4xl
              "
            >
              Invoices
            </h1>

            <p
              className="
                mt-3
                max-w-xl
                text-sm
                leading-6
                text-zinc-500
                sm:mt-4
                sm:text-[15px]
                sm:leading-7
              "
            >
              Create, track and collect invoice payments
              with your executive finance workspace.
            </p>
          </div>

          <Link
            href="/invoices/new"
            className="
              inline-flex
              h-12
              w-full
              shrink-0
              items-center
              justify-center
              rounded-2xl
              bg-[#D4AF37]
              px-6
              text-sm
              font-semibold
              text-[#090909]
              transition-all
              duration-200
              hover:scale-[1.02]
              hover:brightness-105
              sm:w-auto
              sm:px-7
            "
          >
            + New Invoice
          </Link>
        </div>

        {/* SEARCH */}

        <div
          className="
            border-b
            border-white/[0.06]
            px-4
            py-5
            sm:px-6
            sm:py-6
            lg:px-10
            lg:py-8
          "
        >
          <InvoiceSearch
            value={search}
            onChange={setSearch}
          />
        </div>

        {/* SUMMARY */}

        <div
          className="
            grid
            grid-cols-1
            gap-4
            border-b
            border-white/[0.06]
            p-4
            sm:grid-cols-2
            sm:gap-5
            sm:p-6
            xl:grid-cols-4
            lg:p-10
          "
        >
          <div
            className="
              min-w-0
              rounded-2xl
              border
              border-white/[0.06]
              bg-[#14171B]
              p-5
              sm:rounded-3xl
              sm:p-6
            "
          >
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
              Total Invoices
            </p>

            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              {filteredInvoices.length}
            </h2>
          </div>

          <div
            className="
              min-w-0
              rounded-2xl
              border
              border-white/[0.06]
              bg-[#14171B]
              p-5
              sm:rounded-3xl
              sm:p-6
            "
          >
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
              Outstanding
            </p>

            <h2
              className="
                mt-3
                break-words
                text-2xl
                font-bold
                text-[#D4AF37]
                sm:text-4xl
              "
            >
              {formatCurrency(
                filteredInvoices
                  .filter((i) => i.status !== "Paid")
                  .reduce(
                    (sum, i) => sum + i.balance_due,
                    0
                  )
              )}
            </h2>
          </div>

          <div
            className="
              min-w-0
              rounded-2xl
              border
              border-white/[0.06]
              bg-[#14171B]
              p-5
              sm:rounded-3xl
              sm:p-6
            "
          >
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
              Paid
            </p>

            <h2 className="mt-3 text-3xl font-bold text-emerald-400 sm:text-4xl">
              {
                filteredInvoices.filter(
                  (i) => i.status === "Paid"
                ).length
              }
            </h2>
          </div>

          <div
            className="
              min-w-0
              rounded-2xl
              border
              border-white/[0.06]
              bg-[#14171B]
              p-5
              sm:rounded-3xl
              sm:p-6
            "
          >
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
              Pending
            </p>

            <h2 className="mt-3 text-3xl font-bold text-amber-400 sm:text-4xl">
              {
                filteredInvoices.filter(
                  (i) => i.status === "Pending"
                ).length
              }
            </h2>
          </div>
        </div>

        {/* INVOICE LIST */}

        {isLoading ? (
          <div className="py-16 text-center text-gray-400 sm:py-20">
            Loading invoices...
          </div>
        ) : (
          <div
            className="
              min-w-0
              p-4
              sm:p-6
              lg:p-10
            "
          >
            <InvoiceTable
              invoices={filteredInvoices}
              formatCurrency={formatCurrency}
              onView={handleView}
              onPDF={handlePDF}
              onPrint={handlePrint}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
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

