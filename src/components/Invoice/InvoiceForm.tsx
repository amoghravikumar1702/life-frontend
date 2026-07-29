"use client";

import { useState } from "react";

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
  const isEdit = mode === "edit";

  const createMutation = useCreateInvoice();
  const updateMutation = useUpdateInvoice();

  const [customers, setCustomers] = useState<Customer[]>([]);

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
    <section className="mt-10 rounded-3xl border border-white/10 bg-gradient-to-br from-[#111827] to-[#0B1220] p-8 shadow-2xl">

      <h2 className="mb-8 text-2xl font-bold">
        {isEdit ? "Edit Invoice" : "Invoice Details"}
      </h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

        <select
          value={customer}
          onChange={(e) => setCustomer(e.target.value)}
          className="rounded-xl border border-white/10 bg-[#0B1220] p-4 outline-none focus:border-cyan-400"
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

        </select>

        <input
          value={invoiceNumber}
          onChange={(e) =>
            setInvoiceNumber(e.target.value)
          }
          className="rounded-xl border border-white/10 bg-[#0B1220] p-4 outline-none focus:border-cyan-400"
        />

        <input
          type="date"
          value={invoiceDate}
          onChange={(e) =>
            setInvoiceDate(e.target.value)
          }
          className="rounded-xl border border-white/10 bg-[#0B1220] p-4 outline-none focus:border-cyan-400"
        />

        <input
          type="date"
          value={dueDate}
          onChange={(e) =>
            setDueDate(e.target.value)
          }
          className="rounded-xl border border-white/10 bg-[#0B1220] p-4 outline-none focus:border-cyan-400"
        />

      </div>
            <div className="mt-10">

        <h2 className="mb-6 text-2xl font-bold">
          Invoice Items
        </h2>

        {items.map((item) => (

          <div
            key={item.id}
            className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-4"
          >

            <input
              placeholder="Item Name"
              value={item.name}
              onChange={(e) =>
                updateItem(
                  item.id,
                  "name",
                  e.target.value
                )
              }
              className="rounded-xl border border-white/10 bg-[#0B1220] p-4 outline-none focus:border-cyan-400"
            />

            <input
              type="number"
              placeholder="Qty"
              value={
                item.quantity === 0
                  ? ""
                  : item.quantity
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
              className="rounded-xl border border-white/10 bg-[#0B1220] p-4 outline-none focus:border-cyan-400"
            />

            <input
              type="number"
              placeholder="Price"
              value={
                item.price === 0
                  ? ""
                  : item.price
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
              className="rounded-xl border border-white/10 bg-[#0B1220] p-4 outline-none focus:border-cyan-400"
            />

            <div className="flex items-center rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-6 text-lg font-semibold text-cyan-300">
              {formatCurrency(
                item.quantity * item.price
              )}
            </div>

          </div>

        ))}

        <button
          onClick={addItem}
          className="mt-4 rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-black transition hover:bg-cyan-400"
        >
          + Add Item
        </button>

      </div>
            {/* Summary */}

      <div className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-6">

        <div className="flex justify-between py-2">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>

        <div className="flex justify-between py-2">
          <span>GST (18%)</span>
          <span>{formatCurrency(tax)}</span>
        </div>

        <div className="mt-4 flex justify-between border-t border-white/10 pt-4 text-2xl font-bold">

          <span>Grand Total</span>

          <span className="text-cyan-400">
            {formatCurrency(total)}
          </span>

        </div>

      </div>

      <div className="mt-8 flex justify-end">

        <button
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

              const selectedCustomer = customers.find(
  (c) => c.customer_name === customer
);

const invoice = {
  customer,
  customer_phone: selectedCustomer?.phone || null,
  customer_email: selectedCustomer?.email || null,
  invoice_number: invoiceNumber,
  invoice_date: invoiceDate,
  due_date: dueDate,
  total,
  amount_paid: 0,
  balance_due: total,
  status: "Pending",
};

              const invoiceItems = items.map((item) => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price,
              }));

              if (isEdit && invoiceId) {

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

              alert("✅ Invoice Saved Successfully!");

              resetForm();

            } catch (error) {

              console.error(error);

              alert("Failed to save invoice. Please try again.");

            }
          }}
          className="rounded-xl bg-emerald-500 px-8 py-4 text-lg font-semibold text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
        >

          {createMutation.isPending || updateMutation.isPending
            ? "Saving..."
            : "💾 Save Invoice"}

        </button>

      </div>
          </section>
  );
}