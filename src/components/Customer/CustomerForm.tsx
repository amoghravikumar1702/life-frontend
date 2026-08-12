"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Building2, Save } from "lucide-react";

import Input from "@/components/ui/input";
import Textarea from "@/components/ui/Textarea";
import PhoneInput from "@/components/ui/PhoneInput";

function parsePhoneNumber(
  value: string | null | undefined
) {
  if (!value) {
    return { countryCode: "+91", phone: "" };
  }

  const normalized = value.trim();
  if (!normalized.startsWith("+")) {
    return {
      countryCode: "+91",
      phone: normalized.replace(/\D/g, ""),
    };
  }

  const digits = normalized.replace(/[^\d+]/g, "");
  const match =
    digits.match(/^\+(\d{1,3})(\d{4,})$/) ||
    digits.match(/^\+(\d{1,3})(\d{1,})$/);

  if (match) {
    return {
      countryCode: `+${match[1]}`,
      phone: match[2],
    };
  }

  return {
    countryCode: "+91",
    phone: digits.replace(/\D/g, ""),
  };
}

function formatPhoneNumber(
  countryCode: string,
  phone: string
) {
  const cleanedPhone = phone.replace(/\D/g, "");
  const cleanedCode = countryCode.trim().startsWith("+")
    ? countryCode.trim()
    : `+${countryCode.trim()}`;

  if (!cleanedPhone) {
    return cleanedCode;
  }

  return `${cleanedCode}${cleanedPhone}`;
}

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

  const [customerName, setCustomerName] =
    useState("");

  const [businessName, setBusinessName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [countryCode, setCountryCode] =
    useState("+91");

  const [phone, setPhone] =
    useState("");

  const [gstNumber, setGstNumber] =
    useState("");

  const [address, setAddress] =
    useState("");

  const [saving, setSaving] =
    useState(false);
      useEffect(() => {
    if (!isEdit || customerId == null) {
      return;
    }

    async function loadCustomer() {
      try {
        const id = customerId as number;

        const customer = await getCustomerById(id);

        setCustomerName(
          customer.customer_name ?? ""
        );

        setBusinessName(
          customer.business_name ?? ""
        );

        setEmail(
          customer.email ?? ""
        );

        const parsed =
          parsePhoneNumber(
            customer.phone
          );

        setCountryCode(
          parsed.countryCode
        );

        setPhone(
          parsed.phone
        );

        setGstNumber(
          customer.gst_number ?? ""
        );

        setAddress(
          customer.address ?? ""
        );
      } catch (error) {
        console.error(
          "LOAD CUSTOMER ERROR:",
          error
        );

        alert(
          "Failed to load customer."
        );
      }
    }

    loadCustomer();
  }, [customerId, isEdit]);

  async function handleSaveCustomer() {
    try {
      setSaving(true);

      const payload = {
        customer_name:
          customerName.trim(),

        business_name:
          businessName.trim(),

        email: email.trim(),

        phone:
          formatPhoneNumber(
            countryCode,
            phone
          ),

        gst_number:
          gstNumber.trim(),

        address:
          address.trim(),
      };
            if (isEdit && customerId) {
        await updateCustomer(
          customerId,
          payload
        );
      } else {
        await createCustomerAction(
          payload
        );
      }

      alert(
        isEdit
          ? "Customer updated successfully."
          : "Customer created successfully."
      );

      if (!isEdit) {
        setCustomerName("");
        setBusinessName("");
        setEmail("");

        setCountryCode("+91");
        setPhone("");

        setGstNumber("");
        setAddress("");
      }
    } catch (error: unknown) {
      console.error(error);

      const message =
        error instanceof Error
          ? error.message
          : "Failed to save customer.";

      alert(message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 16,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.25,
      }}
      className="mx-auto mt-10 max-w-5xl"
    >
      <div className="mb-10 flex items-start justify-between gap-6">

        <div>

          <Link
            href="/customers"
            className="mb-5 inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
          >
            <ArrowLeft
              size={16}
            />

            Back to Customers
          </Link>

          <h1 className="text-4xl font-semibold tracking-tight text-white">
            {isEdit
              ? "Edit Customer"
              : "New Customer"}
          </h1>

          <p className="mt-3 max-w-2xl text-zinc-400">
            {isEdit
              ? "Update your client's information."
              : "Add a client to your executive portfolio."}
          </p>

        </div>

      </div>

      <div className="rounded-[28px] border border-white/[0.06] bg-[#101214] p-8 md:p-10">
              {/* ----------------------------- */}
        {/* Basic Information */}
        {/* ----------------------------- */}

        <div>

          <div className="mb-8 flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/[0.06] bg-[#14171B]">

              <Building2
                size={18}
                className="text-[#D4AF37]"
              />

            </div>

            <div>

              <h2 className="text-lg font-semibold text-white">
                Basic Information
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Primary details used across invoices and customer records.
              </p>

            </div>

          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

            <Input
              label="Customer Name"
              required
              placeholder="John Smith"
              value={customerName}
              onChange={(e) =>
                setCustomerName(
                  e.target.value
                )
              }
            />

            <Input
              label="Business Name"
              placeholder="Acme Technologies"
              helper="Optional"
              value={businessName}
              onChange={(e) =>
                setBusinessName(
                  e.target.value
                )
              }
            />

          </div>

        </div>

        <div className="my-10 h-px bg-white/[0.06]" />

        {/* ----------------------------- */}
        {/* Contact Information */}
        {/* ----------------------------- */}

        <div>

          <div className="mb-8">

            <h2 className="text-lg font-semibold text-white">
              Contact Information
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Used for invoices, payment reminders and WhatsApp communication.
            </p>

          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <Input
              label="Email Address"
              type="email"
              placeholder="john@company.com"
              helper="Optional. Used for invoices and payment reminders."
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
            />

            <PhoneInput
              label="Phone Number"
              required
              countryCode={
                countryCode
              }
              phone={phone}
              onCountryCodeChange={
                setCountryCode
              }
              onPhoneChange={
                setPhone
              }
              helper="Stored in international format for WhatsApp and future SMS support."
            />

          </div>

        </div>

        <div className="my-10 h-px bg-white/[0.06]" />

        {/* ----------------------------- */}
        {/* Business Information */}
        {/* ----------------------------- */}

        <div>

          <div className="mb-8">

            <h2 className="text-lg font-semibold text-white">
              Business Information
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Optional details for taxation and billing.
            </p>

          </div>

          <div className="grid grid-cols-1 gap-6">
                        <Input
              label="GST Number"
              placeholder="29ABCDE1234F1Z5"
              helper="Optional. Used on invoices where applicable."
              value={gstNumber}
              onChange={(e) =>
                setGstNumber(
                  e.target.value.toUpperCase()
                )
              }
            />

            <Textarea
              label="Business Address"
              placeholder="Enter the customer's billing address..."
              rows={5}
              helper="Optional. Appears on invoices when provided."
              value={address}
              onChange={(e) =>
                setAddress(
                  e.target.value
                )
              }
            />

          </div>

        </div>

        <div className="mt-10 rounded-2xl border border-white/[0.06] bg-[#14171B]/60 p-5">

          <div className="flex flex-col gap-2">

            <h3 className="text-sm font-semibold text-white">
              Before you continue
            </h3>

            <p className="text-sm leading-6 text-zinc-400">
              Customer information will be used across invoices,
              payment reminders and future communication. You can
              update these details at any time.
            </p>

          </div>

        </div>

        <div className="my-10 h-px bg-white/[0.06]" />

        {/* ----------------------------- */}
        {/* Actions */}
        {/* ----------------------------- */}

        <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <Link
            href="/customers"
            className="inline-flex h-12 items-center justify-center rounded-2xl border border-white/[0.06] bg-[#101214] px-6 text-sm font-medium text-zinc-300 transition-all duration-200 hover:border-white/10 hover:bg-[#14171B] hover:text-white"
          >
            Cancel
          </Link>

          <button
            type="button"
            onClick={handleSaveCustomer}
            disabled={
              saving ||
              customerName.trim() === ""
            }
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#D4AF37] px-8 text-sm font-semibold text-[#090909] transition-all duration-200 hover:scale-[1.01] hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save size={18} />

            {saving
              ? isEdit
                ? "Updating..."
                : "Creating..."
              : isEdit
              ? "Update Customer"
              : "Create Customer"}
          </button>

        </div>
              </div>
    </motion.section>
  );
}