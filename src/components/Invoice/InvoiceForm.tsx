"use client";

import { useState } from "react";
import { CalendarDays } from "lucide-react";
import Link from "next/link";

import { motion } from "framer-motion";

import {
  ArrowLeft,
  FileText,
  Receipt,
  Save,
  Copy,
} from "lucide-react";

import Input from "@/components/ui/input";
import Select from "@/components/ui/Select";

import { Customer } from "@/types/customer";

import {
  useCreateInvoice,
  useUpdateInvoice,
} from "./mutations/invoiceMutations";

import { useInvoiceForm } from "./hooks/useInvoiceForm";

import { useInvoiceLoader } from "./hooks/useInvoiceLoader";

import { formatCurrency } from "./utils/invoiceCalculations";

type InvoiceFormProps = {
  mode?: "create" | "edit";
  invoiceId?: number;
};

export default function InvoiceForm({
  mode = "create",
  invoiceId,
}: InvoiceFormProps) {
  const isEdit =
    mode === "edit";

  const createMutation =
    useCreateInvoice();

  const updateMutation =
    useUpdateInvoice();

  const [customers, setCustomers] =
    useState<Customer[]>([]);

  const {
    customer,
    setCustomer,

    invoiceNumber,
    setInvoiceNumber,

    invoiceDate,
    setInvoiceDate,

    dueDate,
    setDueDate,

    items,
    setItems,

    updateItem,
    addItem,

    subtotal,
    tax,
    total,

    resetForm,
  } = useInvoiceForm();

  useInvoiceLoader({
    isEdit,
    invoiceId,

    setCustomers,

    setCustomer,
    setInvoiceNumber,
    setInvoiceDate,
    setDueDate,
    setItems,
  });

  return (

    <motion.section
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.25,
      }}
      className="mx-auto mt-10 max-w-7xl"
    >

      <div className="mb-10">

        <Link
          href="/invoices"
          className="mb-5 inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
        >

          <ArrowLeft size={16} />

          Back to Invoices

        </Link>

        <h1 className="bg-gradient-to-r from-[#FFF3C4] via-[#E6C15A] to-[#C99A1A] bg-clip-text text-5xl font-semibold tracking-tight text-transparent drop-shadow-[0_0_18px_rgba(212,175,55,0.16)]">

          {isEdit
            ? "Edit Invoice"
            : "New Invoice"}

        </h1>

        <p className="mt-4 max-w-2xl text-[15px] leading-7 text-zinc-500">

          Create and send a professional invoice with ArkenOne.

        </p>

     </div>

      <div className="space-y-10">

    <section className="rounded-[28px] border border-white/[0.06] bg-[#101214] p-8 md:p-10">
              {/* -------------------------------- */}
        {/* Bill To */}
        {/* -------------------------------- */}

        <div>

          <div className="mb-8 flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/[0.06] bg-[#14171B]">

              <Receipt
                size={18}
                className="text-[#D4AF37]"
              />

            </div>

            <div>

              <h2 className="bg-gradient-to-r from-[#FFF2BE] via-[#D4AF37] to-[#B8860B] bg-clip-text text-xl font-semibold tracking-tight text-transparent">
                Bill To
              </h2>

              <p className="mt-2 text-sm leading-6 text-zinc-500">
                Select the customer receiving this invoice.
              </p>

            </div>

          </div>

          <Select
            label="Customer"
            required
            value={customer}
            onChange={(e) =>
              setCustomer(
                e.target.value
              )
            }
          >

            <option value="">
              Select Customer
            </option>

            {customers.map((customer) => (

              <option
                key={customer.id}
                value={customer.customer_name}
              >
                {customer.customer_name}
                {customer.business_name
                  ? ` • ${customer.business_name}`
                  : ""}
              </option>

            ))}

          </Select>

        </div>

        <div className="my-10 h-px bg-white/[0.06]" />

        {/* -------------------------------- */}
        {/* Invoice Details */}
        {/* -------------------------------- */}

        <div>

          <div className="mb-8 flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/[0.06] bg-[#14171B]">

              <FileText
                size={18}
                className="text-[#D4AF37]"
              />

            </div>

            <div>

              <h2 className="bg-gradient-to-r from-[#FFF2BE] via-[#D4AF37] to-[#B8860B] bg-clip-text text-xl font-semibold tracking-tight text-transparent">
                Invoice Details
              </h2>

              <p className="mt-2 text-sm leading-6 text-zinc-500">
                Invoice information and payment dates.
              </p>

            </div>

          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">

           <div className="lg:col-span-4">

  <div className="rounded-3xl border border-[#D4AF37]/15 bg-gradient-to-br from-[#101214] to-[#0B0D10] p-6 transition duration-300 hover:border-[#D4AF37]/30">

    <div className="flex items-start justify-between">

      <div>

        <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#D4AF37]/70">
          Invoice Number
        </p>

        <h3 className="mt-3 font-mono text-3xl font-semibold tracking-wider text-[#F4D675]">
          {invoiceNumber || "INV-2026-01"}
        </h3>

      </div>

      <button
        type="button"
        onClick={() =>
          navigator.clipboard.writeText(
            invoiceNumber || "INV-2026-01"
          )
        }
        className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-2 transition hover:border-[#D4AF37]/20 hover:bg-[#D4AF37]/10"
        title="Copy Invoice Number"
      >
        <Copy size={16} className="text-[#D4AF37]" />
      </button>

    </div>

    <div className="mt-5 h-px bg-gradient-to-r from-[#D4AF37]/20 via-white/10 to-transparent" />

    <p className="mt-4 text-sm leading-6 text-zinc-500">
      Automatically generated and unique for every invoice.
    </p>

  </div>

</div>

           <div className="lg:col-span-4">

  <div className="mb-3 flex items-center gap-2">

    <CalendarDays
      size={16}
      className="text-[#D4AF37]"
    />

    <span className="text-sm font-medium text-zinc-200">
      Invoice Date
    </span>

  </div>

  <Input
    label=""
    type="date"
    required
    value={invoiceDate}
    onChange={(e) => {
      const value = e.target.value;

      setInvoiceDate(value);

      const date = new Date(value);

      date.setDate(date.getDate() + 30);

      setDueDate(
        date.toISOString().split("T")[0]
      );
    }}
  />

</div>

<div className="lg:col-span-4">

  <div className="mb-3 flex items-center gap-2">

    <CalendarDays
      size={16}
      className="text-[#D4AF37]"
    />

    <span className="text-sm font-medium text-zinc-200">
      Due Date
    </span>

  </div>

  <Input
    label=""
    type="date"
    required
    value={dueDate}
    onChange={(e) =>
      setDueDate(e.target.value)
    }
  />

</div>

          </div>

        </div>

        <div className="my-10 h-px bg-white/[0.06]" />
                {/* -------------------------------- */}
        {/* Invoice Items */}
        {/* -------------------------------- */}

        <div>

          <div className="mb-8 flex items-center justify-between">

            <div>

              <h2 className="bg-gradient-to-r from-[#FFF2BE] via-[#D4AF37] to-[#B8860B] bg-clip-text text-xl font-semibold tracking-tight text-transparent">
                Invoice Items
              </h2>

              <p className="mt-2 text-sm leading-6 text-zinc-500">
                Add products or services included in this invoice.
              </p>

            </div>

            <button
              type="button"
              onClick={addItem}
              className="rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/10 px-5 py-3 text-sm font-semibold text-[#D4AF37] transition-all duration-200 hover:bg-[#D4AF37]/20"
            >
              + Add Line Item
            </button>

          </div>

          <div className="space-y-5">

            {items.map((item) => (

              <motion.div
                key={item.id}
                layout
                className="rounded-3xl border border-white/[0.06] bg-[#14171B] p-6"
              >

                <div className="grid grid-cols-1 gap-5 lg:grid-cols-4">

                  <Input
                    label="Item / Service"
                    placeholder="Website Design"
                    value={item.name}
                    onChange={(e) =>
                      updateItem(
                        item.id,
                        "name",
                        e.target.value
                      )
                    }
                  />

                  <Input
                    label="Quantity"
                    type="number"
                    placeholder="1"
                    value={
                      item.quantity === 0
                        ? ""
                        : String(item.quantity)
                    }
                    onChange={(e) =>
                      updateItem(
                        item.id,
                        "quantity",
                        e.target.value === ""
                          ? 0
                          : Number(e.target.value)
                      )
                    }
                  />

                  <Input
                    label="Unit Price"
                    type="number"
                    placeholder="0.00"
                    value={
                      item.price === 0
                        ? ""
                        : String(item.price)
                    }
                    onChange={(e) =>
                      updateItem(
                        item.id,
                        "price",
                        e.target.value === ""
                          ? 0
                          : Number(e.target.value)
                      )
                    }
                  />

                  <div>

                    <label className="mb-2 flex text-sm font-medium text-zinc-200">
                      Line Total
                    </label>

                    <div className="flex h-14 items-center rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/10 px-5">

                      <span className="text-base font-semibold text-[#D4AF37]">

                        {formatCurrency(
                          item.quantity *
                            item.price
                        )}

                      </span>

                    </div>

                  </div>

                </div>

              </motion.div>

            ))}

          </div>

        </div>

        <div className="my-10 h-px bg-white/[0.06]" />
                {/* -------------------------------- */}
        {/* Financial Summary */}
        {/* -------------------------------- */}

        <div>

          <div className="mb-8 flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/[0.06] bg-[#14171B]">

              <Save
                size={18}
                className="text-[#D4AF37]"
              />

            </div>

            <div>

              <h2 className="bg-gradient-to-r from-[#FFF2BE] via-[#D4AF37] to-[#B8860B] bg-clip-text text-xl font-semibold tracking-tight text-transparent">
                Financial Summary
              </h2>

              <p className="mt-2 text-sm leading-6 text-zinc-500">
                Review the totals before creating the invoice.
              </p>

            </div>

          </div>

          <div className="rounded-3xl border border-white/[0.06] bg-[#14171B] p-7">

            <div className="flex items-center justify-between py-3">

              <span className="text-zinc-400">
                Subtotal
              </span>

              <span className="font-medium text-white">
                {formatCurrency(subtotal)}
              </span>

            </div>

            <div className="flex items-center justify-between py-3">

              <span className="text-zinc-400">
                GST (18%)
              </span>

              <span className="font-medium text-white">
                {formatCurrency(tax)}
              </span>

            </div>

            <div className="my-5 h-px bg-white/[0.06]" />

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-zinc-500">
                  Grand Total
                </p>

                <p className="mt-1 text-xs text-zinc-600">
                  Total amount payable
                </p>

              </div>

              <div className="text-right">

                <p className="text-4xl font-bold tracking-tight text-[#D4AF37]">

                  {formatCurrency(total)}

                </p>

              </div>

            </div>

          </div>

        </div>

        <div className="my-10 h-px bg-white/[0.06]" />
                {/* -------------------------------- */}
        {/* Actions */}
        {/* -------------------------------- */}

        <div className="rounded-3xl border border-white/[0.06] bg-[#14171B] p-6">

          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <h3 className="text-lg font-semibold text-white">
                Ready to create your invoice?
              </h3>

              <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-500">
                ArkenOne will save your invoice, calculate totals,
                and prepare it for payment collection.
              </p>

            </div>

            <div className="flex items-center gap-4">

              <Link
                href="/invoices"
                className="inline-flex h-12 items-center justify-center rounded-2xl border border-white/[0.06] bg-[#101214] px-6 text-sm font-medium text-zinc-300 transition hover:border-white/10 hover:bg-[#181B1F] hover:text-white"
              >
                Cancel
              </Link>

              <button
                type="button"
                disabled={
                  createMutation.isPending ||
                  updateMutation.isPending ||
                  !customer ||
                  !invoiceDate ||
                  !dueDate ||
                  total <= 0
                }
                onClick={async () => {
                  try {

                    const selectedCustomer =
                      customers.find(
                        (c) =>
                          c.customer_name === customer
                      );

                    if (
                      !selectedCustomer ||
                      !selectedCustomer.id
                    ) {
                      alert(
                        "Please select a customer."
                      );
                      return;
                    }

                    const invoice = {
                      customer_id:
                        selectedCustomer.id,

                      customer,

                      customer_phone:
                        selectedCustomer.phone ??
                        null,

                      customer_email:
                        selectedCustomer.email ??
                        null,

                      invoice_number:
                        invoiceNumber,

                      invoice_date:
                        invoiceDate,

                      due_date:
                        dueDate,

                      total,

                      amount_paid: 0,

                      balance_due: total,

                      status: "Pending",
                    };

                    const invoiceItems =
                      items.map((item) => ({
                        name: item.name,
                        quantity: item.quantity,
                        price: item.price,
                      }));

                    if (
                      isEdit &&
                      invoiceId
                    ) {

                      await updateMutation.mutateAsync({
                        id: invoiceId,
                        invoice,
                        items: invoiceItems,
                      });

                    } else {

                      await createMutation.mutateAsync({
                        invoice,
                        items: invoiceItems,
                      });

                    }

                    alert(
                      isEdit
                        ? "Invoice updated successfully."
                        : "Invoice created successfully."
                    );

                    resetForm();

                  } catch (error) {

                    console.error(error);

                    alert(
                      "Failed to save invoice."
                    );

                  }
                }}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#D4AF37] px-8 text-sm font-semibold text-[#090909] transition hover:scale-[1.02] hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
              >

                <Save size={18} />

                {createMutation.isPending ||
                updateMutation.isPending
                  ? "Saving..."
                  : isEdit
                  ? "Update Invoice"
                  : "Save Invoice"}

              </button>

            </div>

          </div>

        </div>

    </section>

      </div>
    </motion.section>
  );
}