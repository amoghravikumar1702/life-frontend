"use client";

import { useMemo, useState } from "react";

import {
  calculateSubtotal,
  calculateTax,
  calculateTotal,
} from "../utils/invoiceCalculations";

export type InvoiceItem = {
  id: number;
  name: string;
  quantity: number;
  price: number;
};

type Props = {
  initialInvoiceNumber?: string;
};

export function useInvoiceForm({
  initialInvoiceNumber = "",
}: Props = {}) {
  const [customer, setCustomer] = useState("");

  const [invoiceNumber, setInvoiceNumber] =
    useState(initialInvoiceNumber);

  const [invoiceDate, setInvoiceDate] =
    useState("");

  const [dueDate, setDueDate] =
    useState("");

  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: 1,
      name: "",
      quantity: 0,
      price: 0,
    },
  ]);

  function updateItem(
    id: number,
    field: keyof InvoiceItem,
    value: string | number
  ) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, [field]: value }
          : item
      )
    );
  }

  function addItem() {
    setItems((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: "",
        quantity: 0,
        price: 0,
      },
    ]);
  }

  function resetForm() {
    setCustomer("");

    setInvoiceNumber("");

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
  }

  const subtotal = useMemo(
    () => calculateSubtotal(items),
    [items]
  );

  const tax = useMemo(
    () => calculateTax(subtotal),
    [subtotal]
  );

  const total = useMemo(
    () => calculateTotal(subtotal, tax),
    [subtotal, tax]
  );

  return {
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
  };
}