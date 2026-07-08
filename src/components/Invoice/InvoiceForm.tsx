"use client";

import { useState } from "react";
import { createInvoice } from "@/services/invoiceService";

type InvoiceItem = {
  id: number;
  name: string;
  quantity: number;
  price: number;
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);

export default function InvoiceForm() {
  const [customer, setCustomer] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("INV-1001");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: 1,
      name: "",
      quantity: 0,
      price: 0,
    },
  ]);

  const updateItem = (
    id: number,
    field: keyof InvoiceItem,
    value: string | number
  ) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: "",
        quantity: 0,
        price: 0,
      },
    ]);
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  const handleSaveInvoice = async () => {
    try {
      await createInvoice(
  {
    customer,
    invoice_number: invoiceNumber,
    invoice_date: invoiceDate,
    due_date: dueDate,
    total,
    status: "Pending",
  },
  items.map((item) => ({
    name: item.name,
    quantity: item.quantity,
    price: item.price,
  }))
);

      alert("✅ Invoice Saved Successfully!");

      setCustomer("");
      setInvoiceNumber(`INV-${Math.floor(Math.random() * 9000 + 1000)}`);
      setInvoiceDate("");
      setDueDate("");

      setItems([
        {
          id: 1,
          name: "",
          quantity: 0,
          price: 0,
        },
      ]);
    } catch (error) {
      console.error(error);
      alert("❌ Failed to save invoice.");
    }
  };

  return (
    <section className="mt-10 rounded-3xl border border-white/10 bg-gradient-to-br from-[#111827] to-[#0B1220] p-8 shadow-2xl">
      <h2 className="mb-8 text-2xl font-bold">
        Invoice Details
      </h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

        <input
          placeholder="Customer Name"
          value={customer}
          onChange={(e) => setCustomer(e.target.value)}
          className="rounded-xl border border-white/10 bg-[#0B1220] p-4 outline-none focus:border-cyan-400"
        />

        <input
          value={invoiceNumber}
          onChange={(e) => setInvoiceNumber(e.target.value)}
          className="rounded-xl border border-white/10 bg-[#0B1220] p-4 outline-none focus:border-cyan-400"
        />

        <input
          type="date"
          value={invoiceDate}
          onChange={(e) => setInvoiceDate(e.target.value)}
          className="rounded-xl border border-white/10 bg-[#0B1220] p-4 outline-none focus:border-cyan-400"
        />

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
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
                updateItem(item.id, "name", e.target.value)
              }
              className="rounded-xl border border-white/10 bg-[#0B1220] p-4 outline-none focus:border-cyan-400"
            />

            <input
              type="number"
              placeholder="Qty"
              value={item.quantity === 0 ? "" : item.quantity}
              onChange={(e) =>
                updateItem(
                  item.id,
                  "quantity",
                  e.target.value === "" ? 0 : Number(e.target.value)
                )
              }
              className="rounded-xl border border-white/10 bg-[#0B1220] p-4 outline-none focus:border-cyan-400"
            />

            <input
              type="number"
              placeholder="Price"
              value={item.price === 0 ? "" : item.price}
              onChange={(e) =>
                updateItem(
                  item.id,
                  "price",
                  e.target.value === "" ? 0 : Number(e.target.value)
                )
              }
              className="rounded-xl border border-white/10 bg-[#0B1220] p-4 outline-none focus:border-cyan-400"
            />

            <div className="flex items-center rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-6 text-lg font-semibold text-cyan-300">
              {formatCurrency(item.quantity * item.price)}
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

      {/* Save Button */}

      <div className="mt-8 flex justify-end">

        <button
          onClick={handleSaveInvoice}
          disabled={
            !customer ||
            !invoiceDate ||
            !dueDate ||
            total <= 0
          }
          className="rounded-xl bg-emerald-500 px-8 py-4 text-lg font-semibold text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          💾 Save Invoice
        </button>

      </div>

    </section>
  );
}