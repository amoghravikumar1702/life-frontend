"use client";

import { useEffect, useState } from "react";

import {
  getCustomerById,
  updateCustomer,
} from "@/services/customerService";

import { createCustomerAction } from "@/actions/customer";

type Props = {
  mode?: "create" | "edit";
  customerId?: number;
};

export default function CustomerForm({
  mode = "create",
  customerId,
}: Props) {
  const isEdit = mode === "edit";

  const [customerName, setCustomerName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (!isEdit || customerId == null) return;

    async function loadCustomer() {
      try {
        if (customerId == null) return;

        const customer = await getCustomerById(customerId);

        setCustomerName(customer.customer_name ?? "");
        setBusinessName(customer.business_name ?? "");
        setEmail(customer.email ?? "");
        setPhone(customer.phone ?? "");
        setGstNumber(customer.gst_number ?? "");
        setAddress(customer.address ?? "");
      } catch (error) {
        console.error("LOAD CUSTOMER ERROR:", error);
      }
    }

    loadCustomer();
  }, [customerId, isEdit]);

  async function handleSaveCustomer() {
    try {
      const payload = {
        customer_name: customerName,
        business_name: businessName,
        email,
        phone,
        gst_number: gstNumber,
        address,
      };

      if (isEdit && customerId) {
        await updateCustomer(customerId, payload);
      } else {
        await createCustomerAction(payload);
      }

      alert(
        isEdit
          ? "Customer Updated Successfully!"
          : "Customer Created Successfully!"
      );

      if (!isEdit) {
        setCustomerName("");
        setBusinessName("");
        setEmail("");
        setPhone("");
        setGstNumber("");
        setAddress("");
      }
    } catch (error: any) {
      console.error(error);
      alert(error?.message ?? "Failed to save customer.");
    }
  }

  return (
    <section className="mt-10 rounded-3xl border border-white/10 bg-gradient-to-br from-[#111827] to-[#0B1220] p-8 shadow-2xl">
      <h2 className="mb-8 text-3xl font-bold">
        {isEdit ? "Edit Customer" : "Create Customer"}
      </h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <input
          placeholder="Customer Name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="rounded-xl border border-white/10 bg-[#0B1220] p-4 outline-none focus:border-cyan-400"
        />

        <input
          placeholder="Business Name"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          className="rounded-xl border border-white/10 bg-[#0B1220] p-4 outline-none focus:border-cyan-400"
        />

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-xl border border-white/10 bg-[#0B1220] p-4 outline-none focus:border-cyan-400"
        />

        <input
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="rounded-xl border border-white/10 bg-[#0B1220] p-4 outline-none focus:border-cyan-400"
        />

        <input
          placeholder="GST Number"
          value={gstNumber}
          onChange={(e) => setGstNumber(e.target.value)}
          className="rounded-xl border border-white/10 bg-[#0B1220] p-4 outline-none focus:border-cyan-400"
        />

        <textarea
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          rows={4}
          className="rounded-xl border border-white/10 bg-[#0B1220] p-4 outline-none focus:border-cyan-400 md:col-span-2"
        />
      </div>

      <div className="mt-8 flex justify-end">
        <button
          type="button"
          onClick={handleSaveCustomer}
          disabled={!customerName}
          className="rounded-xl bg-cyan-500 px-8 py-4 text-lg font-semibold text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          💾 {isEdit ? "Update Customer" : "Save Customer"}
        </button>
      </div>
    </section>
  );
}