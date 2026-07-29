"use client";

import { useEffect, useState } from "react";
import CompanyCard from "./CompanyCard";
import CompanyInput from "./CompanyInput";
import {
  createCompany,
  getCompany,
  updateCompany,
} from "@/services/companyService";
export default function CompanyForm() {
  const [form, setForm] = useState({
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
  });
const [companyId, setCompanyId] = useState<number | null>(null);
const [loading, setLoading] = useState(true);
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

 async function handleSubmit(
  e: React.FormEvent
) {
  e.preventDefault();

  try {
    if (companyId) {
      await updateCompany(companyId, form);

      alert("✅ Company updated successfully.");
    } else {
      const company = await createCompany(form);

if (company?.id) {
  setCompanyId(company.id);
}

      alert("✅ Company created successfully.");
    }
  } catch (error) {
    console.error(error);

    alert("❌ Failed to save company.");
  }
}
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
        company_name: company.company_name ?? "",
        owner_name: company.owner_name ?? "",
        email: company.email ?? "",
        phone: company.phone ?? "",
        website: company.website ?? "",
        address: company.address ?? "",
        gst_number: company.gst_number ?? "",
        bank_name: company.bank_name ?? "",
        account_number: company.account_number ?? "",
        ifsc_code: company.ifsc_code ?? "",
        upi_id: company.upi_id ?? "",
        logo_url: company.logo_url ?? "",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  loadCompany();
}, []);
if (loading) {
  return (
    <div className="py-20 text-center text-gray-400">
      Loading company...
    </div>
  );
}
  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8"
    >
      <CompanyCard title="Business Information">

        <div className="grid grid-cols-2 gap-6">

          <CompanyInput
            label="Company Name"
            name="company_name"
            value={form.company_name}
            onChange={handleChange}
            required
          />

          <CompanyInput
            label="Owner Name"
            name="owner_name"
            value={form.owner_name}
            onChange={handleChange}
            required
          />

          <CompanyInput
            label="Email"
            name="email"
            value={form.email}
            type="email"
            onChange={handleChange}
            required
          />

          <CompanyInput
            label="Phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
          />

          <CompanyInput
            label="Website"
            name="website"
            value={form.website}
            onChange={handleChange}
          />

          <CompanyInput
            label="GST Number"
            name="gst_number"
            value={form.gst_number}
            onChange={handleChange}
          />

        </div>

        <CompanyInput
          label="Address"
          name="address"
          value={form.address}
          onChange={handleChange}
          required
        />

      </CompanyCard>

      <CompanyCard title="Bank Information">

        <div className="grid grid-cols-2 gap-6">

          <CompanyInput
            label="Bank Name"
            name="bank_name"
            value={form.bank_name}
            onChange={handleChange}
          />

          <CompanyInput
            label="Account Number"
            name="account_number"
            value={form.account_number}
            onChange={handleChange}
          />

          <CompanyInput
            label="IFSC Code"
            name="ifsc_code"
            value={form.ifsc_code}
            onChange={handleChange}
          />

          <CompanyInput
            label="UPI ID"
            name="upi_id"
            value={form.upi_id}
            onChange={handleChange}
          />

        </div>

      </CompanyCard>

      <button
        type="submit"
        className="rounded-xl bg-cyan-500 px-8 py-3 font-semibold text-black hover:bg-cyan-400"
      >
        Save Company
      </button>

    </form>
  );
}