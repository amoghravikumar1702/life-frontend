"use client";

import { useEffect } from "react";

type InvoiceItem = {
  item_name: string;
  quantity: number;
  price: number;
  total: number;
};

type Props = {
  invoice: {
    invoice_number: string;
    customer: string;
    invoice_date: string;
    due_date: string;
    status: string;
    total: number;
  };

  items: InvoiceItem[];
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);

export default function PrintInvoice({
  invoice,
  items,
}: Props) {

  useEffect(() => {
    setTimeout(() => {
      window.print();
    }, 500);
  }, []);

  const subtotal = items.reduce(
    (sum, item) => sum + item.total,
    0
  );

  const gst = subtotal * 0.18;

  return (
    <div className="min-h-screen bg-white p-12 text-black">

      <div className="mx-auto max-w-4xl">

        <div className="mb-10 flex justify-between">

          <div>

            <h1 className="text-4xl font-bold">
              NEXORA
            </h1>

            <p className="text-gray-500">
              AI Financial Operating System
            </p>

          </div>

          <div className="text-right">

            <h2 className="text-2xl font-bold">
              Invoice
            </h2>

            <p>{invoice.invoice_number}</p>

          </div>

        </div>

        <div className="mb-8 flex justify-between">

          <div>

            <h3 className="font-semibold">
              Bill To
            </h3>

            <p>{invoice.customer}</p>

          </div>

          <div className="text-right">

            <p>
              <strong>Date:</strong>{" "}
              {invoice.invoice_date}
            </p>

            <p>
              <strong>Due:</strong>{" "}
              {invoice.due_date}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {invoice.status}
            </p>

          </div>

        </div>

        <table className="mb-10 w-full border-collapse">

          <thead>

            <tr className="border-b-2">

              <th className="py-3 text-left">
                Item
              </th>

              <th>
                Qty
              </th>

              <th>
                Price
              </th>

              <th className="text-right">
                Total
              </th>

            </tr>

          </thead>

          <tbody>

            {items.map((item, index) => (

              <tr
                key={index}
                className="border-b"
              >

                <td className="py-4">
                  {item.item_name}
                </td>

                <td className="text-center">
                  {item.quantity}
                </td>

                <td className="text-center">
                  {formatCurrency(item.price)}
                </td>

                <td className="text-right">
                  {formatCurrency(item.total)}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

        <div className="ml-auto w-72">

          <div className="flex justify-between py-2">

            <span>Subtotal</span>

            <span>
              {formatCurrency(subtotal)}
            </span>

          </div>

          <div className="flex justify-between py-2">

            <span>GST (18%)</span>

            <span>
              {formatCurrency(gst)}
            </span>

          </div>

          <div className="mt-3 flex justify-between border-t-2 pt-3 text-xl font-bold">

            <span>Total</span>

            <span>
              {formatCurrency(invoice.total)}
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}