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
  /*
   * ============================================================
   * CUSTOMER
   * ============================================================
   *
   * Store the actual customer ID instead of the customer name.
   *
   * This prevents problems when two customers have the same name
   * and ensures invoices remain properly linked to customers.
   */

  const [customerId, setCustomerId] =
    useState<number | null>(null);

  const [customer, setCustomer] =
    useState("");

  const [invoiceNumber, setInvoiceNumber] =
    useState(initialInvoiceNumber);

  const [invoiceDate, setInvoiceDate] =
    useState("");

  const [dueDate, setDueDate] =
    useState("");

  const [items, setItems] =
    useState<InvoiceItem[]>([
      {
        id: 1,
        name: "",
        quantity: 0,
        price: 0,
      },
    ]);

  /*
   * ============================================================
   * UPDATE ITEM
   * ============================================================
   */

  function updateItem(
    id: number,
    field: keyof InvoiceItem,
    value: string | number
  ) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  }

  /*
   * ============================================================
   * ADD ITEM
   * ============================================================
   */

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

  /*
   * ============================================================
   * RESET FORM
   * ============================================================
   */

  function resetForm() {
    setCustomerId(null);

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

  /*
   * ============================================================
   * FINANCIAL CALCULATIONS
   * ============================================================
   */

  const subtotal = useMemo(
    () =>
      calculateSubtotal(items),
    [items]
  );

  const tax = useMemo(
    () =>
      calculateTax(subtotal),
    [subtotal]
  );

  const total = useMemo(
    () =>
      calculateTotal(
        subtotal,
        tax
      ),
    [subtotal, tax]
  );

  return {
    /*
     * Customer
     */
    customerId,
    setCustomerId,

    customer,
    setCustomer,

    /*
     * Invoice details
     */
    invoiceNumber,
    setInvoiceNumber,

    invoiceDate,
    setInvoiceDate,

    dueDate,
    setDueDate,

    /*
     * Items
     */
    items,
    setItems,

    updateItem,
    addItem,

    /*
     * Totals
     */
    subtotal,
    tax,
    total,

    /*
     * Reset
     */
    resetForm,
  };
}