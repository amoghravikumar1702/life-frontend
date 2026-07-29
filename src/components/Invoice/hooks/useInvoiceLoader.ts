"use client";

import { Dispatch, SetStateAction, useEffect } from "react";

import { getCustomers } from "@/services/customerService";
import {
  getInvoiceById,
  getInvoiceItems,
} from "@/services/invoiceService";

import type { Customer } from "@/types/customer";

type InvoiceItem = {
  id: number;
  name: string;
  quantity: number;
  price: number;
};

type Props = {
  isEdit: boolean;
  invoiceId?: number;

  setCustomers: Dispatch<SetStateAction<Customer[]>>;
  setCustomer: Dispatch<SetStateAction<string>>;
  setInvoiceNumber: Dispatch<SetStateAction<string>>;
  setInvoiceDate: Dispatch<SetStateAction<string>>;
  setDueDate: Dispatch<SetStateAction<string>>;
  setItems: Dispatch<SetStateAction<InvoiceItem[]>>;
};

export function useInvoiceLoader({
  isEdit,
  invoiceId,

  setCustomers,
  setCustomer,
  setInvoiceNumber,
  setInvoiceDate,
  setDueDate,
  setItems,
}: Props) {
  useEffect(() => {
    let mounted = true;

    async function loadCustomers() {
      try {
        const data = await getCustomers();

        if (!mounted) return;

        setCustomers(data ?? []);
      } catch (error) {
        console.error(error);
      }
    }

    async function loadInvoice() {
      if (!isEdit || !invoiceId) return;

      try {
        const invoice =
          await getInvoiceById(invoiceId);

        const items =
          await getInvoiceItems(invoiceId);

        if (!mounted) return;

        setCustomer(invoice.customer ?? "");

        setInvoiceNumber(
          invoice.invoice_number ?? ""
        );

        setInvoiceDate(
          invoice.invoice_date ?? ""
        );

        setDueDate(
          invoice.due_date ?? ""
        );

        setItems(
          items && items.length
            ? items.map((item: any) => ({
                id: item.id,
                name: item.item_name,
                quantity: item.quantity,
                price: item.price,
              }))
            : [
                {
                  id: 1,
                  name: "",
                  quantity: 0,
                  price: 0,
                },
              ]
        );
      } catch (error: any) {
        console.error("loadInvoice failed:", {
          message: error?.message,
          code: error?.code,
          details: error?.details,
          hint: error?.hint,
          invoiceId,
        });
      }
    }

    loadCustomers();
    loadInvoice();

    return () => {
      mounted = false;
    };
  }, [
    isEdit,
    invoiceId,
    setCustomers,
    setCustomer,
    setInvoiceNumber,
    setInvoiceDate,
    setDueDate,
    setItems,
  ]);
}