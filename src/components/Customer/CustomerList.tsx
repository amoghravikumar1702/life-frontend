"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { Customer } from "@/types/customer";

import {
  getCustomers,
  deleteCustomer,
} from "@/services/customerService";
import { section } from "framer-motion/m";

export default function CustomerList() {

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  async function loadCustomers() {

    try {

      setLoading(true);

      const data = await getCustomers();

      setCustomers(data ?? []);

    } catch (error) {

      console.error(error);

      alert("Failed to load customers.");

    } finally {

      setLoading(false);

    }

  }

  useEffect(() => {

    loadCustomers();

  }, []);

  async function handleDelete(id: number) {

    if (!window.confirm("Delete this customer?"))
      return;

    try {

      await deleteCustomer(id);

      setCustomers((prev) =>
        prev.filter(
          (customer) => customer.id !== id
        )
      );

    } catch (error) {

      console.error(error);

      alert("Failed to delete customer.");

    }

  }

  const filteredCustomers = useMemo(() => {

    const query = search.toLowerCase();

    return customers.filter((customer) =>
      customer.customer_name
        .toLowerCase()
        .includes(query) ||

      (customer.business_name ?? "")
        .toLowerCase()
        .includes(query)
    );

  }, [customers, search]);
    return (
    <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#111827] to-[#0B1220] p-8 shadow-2xl">

      <div className="mb-8 flex items-center justify-between">

        <div>

          <h2 className="text-3xl font-bold">
            Customers
          </h2>

          <p className="mt-2 text-gray-400">
            Manage all your customers.
          </p>

        </div>

        <Link
          href="/customers/new"
          className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-black transition hover:bg-cyan-400"
        >
          + New Customer
        </Link>

      </div>

      <input
        type="text"
        placeholder="Search customer..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-8 w-full rounded-xl border border-white/10 bg-[#0B1220] p-4 outline-none focus:border-cyan-400"
      />

      {loading ? (

        <div className="py-20 text-center text-gray-400">
          Loading customers...
        </div>

      ) : (

        <div className="overflow-x-auto rounded-2xl border border-white/10">

          <table className="w-full">

            <thead className="bg-white/5">

              <tr>

                <th className="p-4 text-left">
                  Customer
                </th>

                <th className="p-4 text-left">
                  Business
                </th>

                <th className="p-4 text-left">
                  Phone
                </th>

                <th className="p-4 text-left">
                  Email
                </th>

                <th className="p-4 text-center">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredCustomers.map((customer) => (

                <tr
                  key={customer.id}
                  className="border-t border-white/10"
                >

                  <td className="p-4">
                    {customer.customer_name}
                  </td>

                  <td className="p-4">
                    {customer.business_name || "-"}
                  </td>

                  <td className="p-4">
                    {customer.phone || "-"}
                  </td>

                  <td className="p-4">
                    {customer.email || "-"}
                  </td>

                  <td className="p-4">
  <div className="flex justify-center gap-3">

    <Link
      href={`/customers/edit/${customer.id}`}
      className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-400"
    >
      Edit
    </Link>

    <button
      onClick={() => handleDelete(customer.id!)}
      className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-400"
    >
      Delete
    </button>

  </div>
</td>

                </tr>

              ))}

              {!loading &&
                filteredCustomers.length === 0 && (

                  <tr>

                    <td
                      colSpan={5}
                      className="py-16 text-center text-gray-400"
                    >
                      No customers found.
                    </td>

                  </tr>

                )}

            </tbody>

          </table>

        </div>

      )}

    </section>
  );
}