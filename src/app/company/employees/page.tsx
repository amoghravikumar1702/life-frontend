"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  Plus,
  Minus,
  Save,
  ArrowLeft,
  BriefcaseBusiness,
} from "lucide-react";

interface WorkforceManagementProps {
  initialEmployees: number;
}

export default function WorkforceManagement({
  initialEmployees,
}: WorkforceManagementProps) {
  const [employees, setEmployees] = useState(initialEmployees);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function updateEmployees(nextCount: number) {
    if (nextCount < 0) return;

    setEmployees(nextCount);
    setMessage("");
  }

  async function saveEmployees() {
    setSaving(true);
    setMessage("");

    try {
      const response = await fetch("/company/employees", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employeeCount: employees,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Unable to update employee count."
        );
      }

      setMessage("Employee count updated.");
    } catch (error) {
      console.error(error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to update employee count."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0B0C0F] px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        {/* Header */}

        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/10">
                <Users
                  size={19}
                  className="text-[#D4AF37]"
                />
              </div>

              <p className="text-[11px] uppercase tracking-[0.35em] text-[#D4AF37]">
                WORKFORCE
              </p>
            </div>

            <h1 className="text-4xl font-bold tracking-[-0.04em]">
              Employee Management
            </h1>

            <p className="mt-3 max-w-2xl text-zinc-500">
              Keep your workforce count updated so DhanarkOS can
              make better hiring and capacity recommendations.
            </p>
          </div>

          <Link
            href="/company"
            className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm font-medium text-zinc-300 transition hover:bg-white/[0.06] hover:text-white"
          >
            <ArrowLeft size={16} />
            Company Profile
          </Link>
        </div>

        {/* Workforce Card */}

        <section className="rounded-[32px] border border-white/[0.06] bg-[#101114] p-8 sm:p-10">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.03]">
              <BriefcaseBusiness
                size={20}
                className="text-zinc-300"
              />
            </div>

            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-500">
                CURRENT WORKFORCE
              </p>

              <h2 className="mt-2 text-2xl font-semibold text-white">
                How many employees do you have?
              </h2>
            </div>
          </div>

          {/* Counter */}

          <div className="mt-10 flex flex-col items-center justify-center rounded-[28px] border border-white/[0.06] bg-[#0D0F12] px-6 py-10">
            <p className="text-sm text-zinc-500">
              Current Employees
            </p>

            <div className="mt-7 flex items-center gap-6">
              <button
                type="button"
                onClick={() =>
                  updateEmployees(employees - 1)
                }
                disabled={employees <= 0}
                className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.03] text-zinc-300 transition hover:bg-white/[0.07] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                aria-label="Remove employee"
              >
                <Minus size={20} />
              </button>

              <div className="min-w-[120px] text-center">
                <span className="text-7xl font-bold tracking-[-0.06em] text-white">
                  {employees}
                </span>
              </div>

              <button
                type="button"
                onClick={() =>
                  updateEmployees(employees + 1)
                }
                className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/10 text-[#D4AF37] transition hover:bg-[#D4AF37]/20"
                aria-label="Add employee"
              >
                <Plus size={20} />
              </button>
            </div>

            <p className="mt-5 text-sm text-zinc-600">
              Add or remove employees as your team changes.
            </p>
          </div>

          {/* Save */}

          <div className="mt-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              {message && (
                <p
                  className={`text-sm ${
                    message.includes("updated")
                      ? "text-emerald-400"
                      : "text-red-400"
                  }`}
                >
                  {message}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={saveEmployees}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-[#D4AF37] px-6 py-3 font-semibold text-black transition hover:bg-[#E0BE4A] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save size={17} />

              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </section>

        {/* AI explanation */}

        <section className="mt-8 rounded-[28px] border border-[#D4AF37]/10 bg-[#D4AF37]/[0.03] p-7">
          <p className="text-[11px] uppercase tracking-[0.32em] text-[#D4AF37]">
            DhanarkOS AI CFO
          </p>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-400">
            Your employee count helps the AI CFO evaluate
            workforce capacity and determine whether the
            business may need additional hiring or should
            control workforce costs.
          </p>
        </section>
      </div>
    </main>
  );
}