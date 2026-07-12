"use client";

import { useEffect } from "react";

import { getCustomers } from "@/services/customerService";
import {
  getInvoiceById,
  getInvoiceItems,
} from "@/services/invoiceService";

import { Customer } from "@/types/customer";

type InvoiceItem = {
  id: number;
  name: string;
  quantity: number;
  price: number;
};

type Props = {
  isEdit: boolean;
  invoiceId?: number;

  setCustomers: React.Dispatch<
    React.SetStateAction<Customer[]>
  >;

  setCustomer: React.Dispatch<
    React.SetStateAction<string>
  >;

  setInvoiceNumber: React.Dispatch<
    React.SetStateAction<string>
  >;

  setInvoiceDate: React.Dispatch<
    React.SetStateAction<string>
  >;

  setDueDate: React.Dispatch<
    React.SetStateAction<string>
  >;

  setItems: React.Dispatch<
    React.SetStateAction<InvoiceItem[]>
  >;
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
      } catch (error) {
        console.error(error);
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