type InvoiceItem = {
  name: string;
  quantity: number;
  price: number;
};

type Props = {
  invoiceNumber: string;
  customer: string;
  invoiceDate: string;
  dueDate: string;
  status: string;
  items: InvoiceItem[];
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);

export default function InvoiceTemplate({
  invoiceNumber,
  customer,
  invoiceDate,
  dueDate,
  status,
  items,
}: Props) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  const gst = subtotal * 0.18;
  const total = subtotal + gst;

  return (
    <div className="bg-white text-black p-10 max-w-4xl mx-auto">

      <div className="flex justify-between items-start mb-10">

        <div>
          <h1 className="text-4xl font-bold">
            NEXORA
          </h1>

          <p className="text-gray-500 mt-2">
            AI Financial Operating System
          </p>
        </div>

        <div className="text-right">

          <h2 className="text-3xl font-semibold">
            Invoice
          </h2>

          <p>{invoiceNumber}</p>

        </div>

      </div>

      <div className="grid grid-cols-2 gap-10 mb-10">

        <div>

          <h3 className="font-semibold mb-2">
            Bill To
          </h3>

          <p>{customer}</p>

        </div>

        <div className="text-right">

          <p>
            <strong>Invoice Date:</strong> {invoiceDate}
          </p>

          <p>
            <strong>Due Date:</strong> {dueDate}
          </p>

          <p>
            <strong>Status:</strong> {status}
          </p>

        </div>

      </div>

      <table className="w-full border-collapse">

        <thead>

          <tr className="border-b-2">

            <th className="text-left py-3">
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
                {item.name}
              </td>

              <td className="text-center">
                {item.quantity}
              </td>

              <td className="text-center">
                {formatCurrency(item.price)}
              </td>

              <td className="text-right">
                {formatCurrency(item.quantity * item.price)}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

      <div className="mt-10 ml-auto w-72">

        <div className="flex justify-between py-2">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>

        <div className="flex justify-between py-2">
          <span>GST (18%)</span>
          <span>{formatCurrency(gst)}</span>
        </div>

        <div className="flex justify-between py-3 border-t-2 mt-3 text-xl font-bold">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>

      </div>

      <div className="mt-16 border-t pt-6 text-center text-gray-500">

        Thank you for choosing Nexora.

      </div>

    </div>
  );
}