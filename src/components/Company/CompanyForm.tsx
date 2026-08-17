"use client";

import { useEffect, useState } from "react";
import CompanyCard from "./CompanyCard";
import CompanyInput from "./CompanyInput";

import {
  createCompany,
  getCompany,
  updateCompany,
} from "@/services/companyService";

type PaymentMethod =
  | "razorpay"
  | "upi"
  | "bank_transfer";

type CompanyFormData = {
  company_name: string;
  owner_name: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  gst_number: string;
  bank_name: string;
  account_number: string;
  ifsc_code: string;
  upi_id: string;
  logo_url: string;

  payment_method: PaymentMethod;
  payment_display_name: string;
  payment_phone: string;
  payment_upi_id: string;
  payment_bank_name: string;
  payment_bank_account_name: string;
  payment_bank_account_number: string;
  payment_bank_ifsc: string;
  payment_razorpay_account_id: string;
};

const initialForm: CompanyFormData = {
  company_name: "",
  owner_name: "",
  email: "",
  phone: "",
  website: "",
  address: "",
  gst_number: "",
  bank_name: "",
  account_number: "",
  ifsc_code: "",
  upi_id: "",
  logo_url: "",

  payment_method: "upi",
  payment_display_name: "",
  payment_phone: "",
  payment_upi_id: "",
  payment_bank_name: "",
  payment_bank_account_name: "",
  payment_bank_account_number: "",
  payment_bank_ifsc: "",
  payment_razorpay_account_id: "",
};

export default function CompanyForm() {
  const [form, setForm] =
    useState<CompanyFormData>(initialForm);

  const [companyId, setCompanyId] =
    useState<number | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const { name, value } = e.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handlePaymentMethodChange(
    method: PaymentMethod
  ) {
    setForm((current) => ({
      ...current,
      payment_method: method,
    }));
  }

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (saving) {
      return;
    }

    try {
      setSaving(true);

      /*
       * Only save payment fields that belong
       * to the selected payment method.
       */
      const dataToSave: CompanyFormData = {
        ...form,

        payment_upi_id:
          form.payment_method === "upi"
            ? form.payment_upi_id
            : "",

        payment_bank_name:
          form.payment_method === "bank_transfer"
            ? form.payment_bank_name
            : "",

        payment_bank_account_name:
          form.payment_method === "bank_transfer"
            ? form.payment_bank_account_name
            : "",

        payment_bank_account_number:
          form.payment_method === "bank_transfer"
            ? form.payment_bank_account_number
            : "",

        payment_bank_ifsc:
          form.payment_method === "bank_transfer"
            ? form.payment_bank_ifsc
            : "",

        payment_razorpay_account_id:
          form.payment_method === "razorpay"
            ? form.payment_razorpay_account_id
            : "",
      };

      if (companyId) {
        await updateCompany(
          companyId,
          dataToSave
        );

        setForm(dataToSave);

        alert(
          "Company profile updated successfully."
        );
      } else {
        const company =
          await createCompany(dataToSave);

        if (company?.id) {
          setCompanyId(company.id);
        }

        setForm(dataToSave);

        alert(
          "Company profile created successfully."
        );
      }
    } catch (error) {
      console.error(
        "[CompanyForm] Save error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to save company profile."
      );
    } finally {
      setSaving(false);
    }
  }

  /*
   * LOAD COMPANY
   */
  useEffect(() => {
    async function loadCompany() {
      try {
        const company = await getCompany();

        if (!company) {
          setLoading(false);
          return;
        }

        if (company.id != null) {
          setCompanyId(company.id);
        }

        setForm({
          company_name:
            company.company_name ?? "",

          owner_name:
            company.owner_name ?? "",

          email:
            company.email ?? "",

          phone:
            company.phone ?? "",

          website:
            company.website ?? "",

          address:
            company.address ?? "",

          gst_number:
            company.gst_number ?? "",

          bank_name:
            company.bank_name ?? "",

          account_number:
            company.account_number ?? "",

          ifsc_code:
            company.ifsc_code ?? "",

          upi_id:
            company.upi_id ?? "",

          logo_url:
            company.logo_url ?? "",

          /*
           * PAYMENT CONFIGURATION
           */

          payment_method:
            company.payment_method === "razorpay" ||
            company.payment_method === "bank_transfer"
              ? company.payment_method
              : "upi",

          payment_display_name:
            company.payment_display_name ??
            company.company_name ??
            "",

          payment_phone:
            company.payment_phone ??
            company.phone ??
            "",

          payment_upi_id:
            company.payment_upi_id ?? "",

          payment_bank_name:
            company.payment_bank_name ??
            company.bank_name ??
            "",

          payment_bank_account_name:
            company.payment_bank_account_name ??
            "",

          payment_bank_account_number:
            company.payment_bank_account_number ??
            company.account_number ??
            "",

          payment_bank_ifsc:
            company.payment_bank_ifsc ??
            company.ifsc_code ??
            "",

          payment_razorpay_account_id:
            company.payment_razorpay_account_id ??
            "",
        });
      } catch (error) {
        console.error(
          "[CompanyForm] Load error:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadCompany();
  }, []);

  /*
   * LOADING
   */

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-5 w-5 animate-spin rounded-full border-2 border-white/10 border-t-[#D4AF37]" />

          <p className="text-sm text-zinc-500">
            Loading company profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* =====================================================
          BUSINESS INFORMATION
      ====================================================== */}

      <CompanyCard title="Business Information">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <CompanyInput
            label="Company Name"
            name="company_name"
            value={form.company_name}
            placeholder="Your business name"
            onChange={handleChange}
            required
          />

          <CompanyInput
            label="Owner Name"
            name="owner_name"
            value={form.owner_name}
            placeholder="Business owner"
            onChange={handleChange}
            required
          />

          <CompanyInput
            label="Email"
            name="email"
            value={form.email}
            type="email"
            placeholder="business@example.com"
            onChange={handleChange}
            required
          />

          <CompanyInput
            label="Phone"
            name="phone"
            value={form.phone}
            type="tel"
            placeholder="+91 98765 43210"
            onChange={handleChange}
            required
          />

          <CompanyInput
            label="Website"
            name="website"
            value={form.website}
            type="url"
            placeholder="https://yourbusiness.com"
            onChange={handleChange}
          />

          <CompanyInput
            label="GST Number"
            name="gst_number"
            value={form.gst_number}
            placeholder="GSTIN"
            onChange={handleChange}
          />
        </div>

        <CompanyInput
          label="Business Address"
          name="address"
          value={form.address}
          placeholder="Registered business address"
          onChange={handleChange}
          required
        />
      </CompanyCard>

      {/* =====================================================
          PAYMENT SETTINGS
      ====================================================== */}

      <CompanyCard title="Payment Settings">
        <div className="space-y-7">

          {/* PAYMENT METHOD */}

          <div>
            <label className="block text-[13px] font-medium tracking-wide text-zinc-400">
              How customers pay
            </label>

            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">

              {/* UPI */}

              <button
                type="button"
                onClick={() =>
                  handlePaymentMethodChange("upi")
                }
                className={`rounded-2xl border p-4 text-left transition ${
                  form.payment_method === "upi"
                    ? "border-[#D4AF37]/70 bg-[#D4AF37]/[0.07] ring-1 ring-[#D4AF37]/30"
                    : "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.15]"
                }`}
              >
                <p
                  className={`text-sm font-semibold ${
                    form.payment_method === "upi"
                      ? "text-[#D4AF37]"
                      : "text-white"
                  }`}
                >
                  UPI
                </p>

                <p className="mt-1 text-xs text-zinc-500">
                  Accept payments through UPI
                </p>
              </button>

              {/* BANK TRANSFER */}

              <button
                type="button"
                onClick={() =>
                  handlePaymentMethodChange(
                    "bank_transfer"
                  )
                }
                className={`rounded-2xl border p-4 text-left transition ${
                  form.payment_method ===
                  "bank_transfer"
                    ? "border-[#D4AF37]/70 bg-[#D4AF37]/[0.07] ring-1 ring-[#D4AF37]/30"
                    : "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.15]"
                }`}
              >
                <p
                  className={`text-sm font-semibold ${
                    form.payment_method ===
                    "bank_transfer"
                      ? "text-[#D4AF37]"
                      : "text-white"
                  }`}
                >
                  Bank Transfer
                </p>

                <p className="mt-1 text-xs text-zinc-500">
                  Receive direct bank transfers
                </p>
              </button>

              {/* RAZORPAY */}

              <button
                type="button"
                onClick={() =>
                  handlePaymentMethodChange(
                    "razorpay"
                  )
                }
                className={`rounded-2xl border p-4 text-left transition ${
                  form.payment_method === "razorpay"
                    ? "border-[#D4AF37]/70 bg-[#D4AF37]/[0.07] ring-1 ring-[#D4AF37]/30"
                    : "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.15]"
                }`}
              >
                <p
                  className={`text-sm font-semibold ${
                    form.payment_method === "razorpay"
                      ? "text-[#D4AF37]"
                      : "text-white"
                  }`}
                >
                  Razorpay
                </p>

                <p className="mt-1 text-xs text-zinc-500">
                  Accept online payments
                </p>
              </button>

            </div>
          </div>

          {/* DISPLAY NAME + PHONE */}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <CompanyInput
              label="Payment Display Name"
              name="payment_display_name"
              value={form.payment_display_name}
              placeholder="Name customers see when paying"
              onChange={handleChange}
              required
            />

            <CompanyInput
              label="Payment Phone"
              name="payment_phone"
              value={form.payment_phone}
              type="tel"
              placeholder="+91 98765 43210"
              onChange={handleChange}
              required
            />
          </div>

          {/* =================================================
              UPI
          ================================================== */}

          {form.payment_method === "upi" && (
            <div className="rounded-2xl border border-white/[0.07] bg-[#0d0d0d] p-5">
              <div className="mb-5">
                <p className="text-sm font-semibold text-white">
                  UPI Details
                </p>

                <p className="mt-1 text-xs text-zinc-500">
                  Customers will use this UPI ID to make payments.
                </p>
              </div>

              <CompanyInput
                label="UPI ID"
                name="payment_upi_id"
                value={form.payment_upi_id}
                placeholder="business@upi"
                onChange={handleChange}
                required
              />
            </div>
          )}

          {/* =================================================
              BANK TRANSFER
          ================================================== */}

          {form.payment_method === "bank_transfer" && (
            <div className="rounded-2xl border border-white/[0.07] bg-[#0d0d0d] p-5">
              <div className="mb-5">
                <p className="text-sm font-semibold text-white">
                  Bank Details
                </p>

                <p className="mt-1 text-xs text-zinc-500">
                  These details will be shown to customers for bank transfers.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <CompanyInput
                  label="Bank Name"
                  name="payment_bank_name"
                  value={form.payment_bank_name}
                  placeholder="Bank name"
                  onChange={handleChange}
                  required
                />

                <CompanyInput
                  label="Account Holder Name"
                  name="payment_bank_account_name"
                  value={form.payment_bank_account_name}
                  placeholder="Account holder"
                  onChange={handleChange}
                  required
                />

                <CompanyInput
                  label="Account Number"
                  name="payment_bank_account_number"
                  value={form.payment_bank_account_number}
                  placeholder="Bank account number"
                  onChange={handleChange}
                  required
                />

                <CompanyInput
                  label="IFSC Code"
                  name="payment_bank_ifsc"
                  value={form.payment_bank_ifsc}
                  placeholder="e.g. HDFC0001234"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          )}

          {/* =================================================
              RAZORPAY
          ================================================== */}

          {form.payment_method === "razorpay" && (
            <div className="rounded-2xl border border-white/[0.07] bg-[#0d0d0d] p-5">
              <div className="mb-5">
                <p className="text-sm font-semibold text-white">
                  Razorpay Configuration
                </p>

                <p className="mt-1 text-xs text-zinc-500">
                  Connect the Razorpay account used to receive customer payments.
                </p>
              </div>

              <CompanyInput
                label="Razorpay Account ID"
                name="payment_razorpay_account_id"
                value={
                  form.payment_razorpay_account_id
                }
                placeholder="Razorpay account ID"
                onChange={handleChange}
                required
              />
            </div>
          )}

        </div>
      </CompanyCard>

      {/* =====================================================
          BUSINESS BANKING INFORMATION
      ====================================================== */}

      <CompanyCard title="Business Banking Information">
        <div className="mb-5 rounded-xl border border-white/[0.07] bg-[#0d0d0d] p-4">
          <p className="text-xs leading-5 text-zinc-500">
            These details are kept as part of your general
            business profile. Your customer payment settings
            above control what appears on payment links.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <CompanyInput
            label="Bank Name"
            name="bank_name"
            value={form.bank_name}
            placeholder="Bank name"
            onChange={handleChange}
          />

          <CompanyInput
            label="Account Number"
            name="account_number"
            value={form.account_number}
            placeholder="Bank account number"
            onChange={handleChange}
          />

          <CompanyInput
            label="IFSC Code"
            name="ifsc_code"
            value={form.ifsc_code}
            placeholder="e.g. HDFC0001234"
            onChange={handleChange}
          />

          <CompanyInput
            label="UPI ID"
            name="upi_id"
            value={form.upi_id}
            placeholder="business@upi"
            onChange={handleChange}
          />
        </div>
      </CompanyCard>

      {/* =====================================================
          SAVE
      ====================================================== */}

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={saving}
          className={`inline-flex min-w-[160px] items-center justify-center rounded-xl px-7 py-3.5 text-sm font-semibold transition ${
            saving
              ? "cursor-not-allowed bg-white/10 text-zinc-500"
              : "bg-[#D4AF37] text-[#090909] hover:brightness-105 active:scale-[0.98]"
          }`}
        >
          {saving ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black" />
              Saving...
            </span>
          ) : companyId ? (
            "Save Changes"
          ) : (
            "Save Company"
          )}
        </button>
      </div>
    </form>
  );
}