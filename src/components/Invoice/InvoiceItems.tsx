type InvoiceItem = {
  id: number;
  name: string;
  quantity: number;
  price: number;
};

type Props = {
  items: InvoiceItem[];
  updateItem: (
    id: number,
    field: keyof InvoiceItem,
    value: string | number
  ) => void;
  addItem: () => void;
  removeItem: (id: number) => void;
  formatCurrency: (amount: number) => string;
};

export default function InvoiceItems({
  items,
  updateItem,
  addItem,
  removeItem,
  formatCurrency,
}: Props) {
  return (
    <div className="mt-10">

      <h2 className="mb-6 text-2xl font-bold">
        Invoice Items
      </h2>

      {items.map((item) => (

        <div
          key={item.id}
          className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-5"
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

          <div className="flex items-center rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-6 font-semibold text-cyan-300">
            {formatCurrency(item.quantity * item.price)}
          </div>

          <button
            onClick={() => removeItem(item.id)}
            className="rounded-xl bg-red-500 px-4 py-3 font-semibold text-white transition hover:bg-red-400"
          >
            Remove
          </button>

        </div>

      ))}

      <button
        onClick={addItem}
        className="mt-4 rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-black transition hover:bg-cyan-400"
      >
        + Add Item
      </button>

    </div>
  );
}