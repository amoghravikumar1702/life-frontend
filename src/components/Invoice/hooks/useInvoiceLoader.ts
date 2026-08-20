"use client";

import {
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";

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

  setCustomers: Dispatch<
    SetStateAction<Customer[]>
  >;

  setCustomer: Dispatch<
    SetStateAction<string>
  >;

  setInvoiceNumber: Dispatch<
    SetStateAction<string>
  >;

  setInvoiceDate: Dispatch<
    SetStateAction<string>
  >;

  setDueDate: Dispatch<
    SetStateAction<string>
  >;

  setItems: Dispatch<
    SetStateAction<InvoiceItem[]>
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
        const data =
          await getCustomers();

        if (!mounted) {
          return;
        }

        setCustomers(
          Array.isArray(data)
            ? data
            : []
        );
      } catch (error: any) {
        console.error(
          "[InvoiceLoader] Customer load failed:",
          {
            message:
              error?.message,
            code:
              error?.code,
            details:
              error?.details,
            hint:
              error?.hint,
          }
        );

        if (mounted) {
          setCustomers([]);
        }
      }
    }

    async function loadInvoice() {
      if (
        !isEdit ||
        !invoiceId
      ) {
        return;
      }

      try {
        const [
          invoice,
          items,
        ] = await Promise.all([
          getInvoiceById(
            invoiceId
          ),
          getInvoiceItems(
            invoiceId
          ),
        ]);

        if (!mounted) {
          return;
        }

        /*
         * --------------------------------------------------------
         * CUSTOMER
         * --------------------------------------------------------
         *
         * InvoiceForm resolves this customer name against the
         * freshly loaded customer list and obtains the real ID.
         */

        setCustomer(
          invoice?.customer ??
            ""
        );

        /*
         * --------------------------------------------------------
         * INVOICE DETAILS
         * --------------------------------------------------------
         */

        setInvoiceNumber(
          invoice?.invoice_number ??
            ""
        );

        setInvoiceDate(
          invoice?.invoice_date ??
            ""
        );

        setDueDate(
          invoice?.due_date ??
            ""
        );

        /*
         * --------------------------------------------------------
         * INVOICE ITEMS
         * --------------------------------------------------------
         */

        if (
          Array.isArray(items) &&
          items.length > 0
        ) {
          setItems(
            items.map(
              (item: any) => ({
                id:
                  item.id ??
                  Date.now(),

                name:
                  item.item_name ??
                  item.name ??
                  "",

                quantity:
                  Number(
                    item.quantity ??
                      0
                  ),

                price:
                  Number(
                    item.price ??
                      0
                  ),
              })
            )
          );
        } else {
          setItems([
            {
              id: 1,
              name: "",
              quantity: 0,
              price: 0,
            },
          ]);
        }
      } catch (error: any) {
        console.error(
          "[InvoiceLoader] Invoice load failed:",
          {
            message:
              error?.message,
            code:
              error?.code,
            details:
              error?.details,
            hint:
              error?.hint,
            invoiceId,
          }
        );
      }
    }

    /*
     * Load both independently.
     *
     * Customers are needed by the invoice form for the
     * customer dropdown, while the invoice itself loads its
     * existing customer name in edit mode.
     */

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