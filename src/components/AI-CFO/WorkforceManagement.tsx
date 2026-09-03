"use client";

import { useState } from "react";
import {
  Minus,
  Plus,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface WorkforceManagementProps {
  initialEmployees: number;
  recommendation: string;
  status: string;
}

export default function WorkforceManagement({
  initialEmployees,
  recommendation,
  status,
}: WorkforceManagementProps) {
  const router = useRouter();

  const [employees, setEmployees] =
    useState(
      Math.max(
        0,
        Math.floor(
          Number(initialEmployees) || 0
        )
      )
    );

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  async function updateEmployees(
    nextCount: number
  ) {
    if (
      nextCount < 0 ||
      saving
    ) {
      return;
    }

    setSaving(true);
    setError("");

    try {
      const response =
        await fetch(
          "/api/company/employees",
          {
            method: "PATCH",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              employeeCount:
                nextCount,
            }),
          }
        );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.error ||
            "Unable to update employee count."
        );
      }

      setEmployees(
        Math.max(
          0,
          Math.floor(
            Number(
              data.employeeCount
            ) || 0
          )
        )
      );

      /*
       * Refresh the server-rendered
       * AI CFO report.
       *
       * The AI CFO is the authority
       * for workforce recommendations.
       *
       * This employee count represents
       * the actual current team only.
       */
      router.refresh();
    } catch (error) {
      console.error(
        "[WorkforceManagement]",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to update employees."
      );
    } finally {
      setSaving(false);
    }
  }

  const currentEmployees =
    Math.max(
      0,
      Math.floor(
        Number(employees) || 0
      )
    );

  return (
    <section
      className="
        overflow-hidden
        rounded-[30px]
        border
        border-white/[0.06]
        bg-[#101318]
      "
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div
        className="
          flex
          flex-col
          gap-5
          border-b
          border-white/[0.05]
          px-7
          py-6
          sm:flex-row
          sm:items-start
          sm:justify-between
          sm:px-8
        "
      >
        <div className="flex items-start gap-4">

          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              border-white/[0.07]
              bg-white/[0.025]
            "
          >
            <Users
              size={17}
              strokeWidth={1.8}
              className="text-zinc-400"
            />
          </div>

          <div>
            <p
              className="
                text-[10px]
                font-medium
                uppercase
                tracking-[0.38em]
                text-zinc-500
              "
            >
              Workforce
            </p>

            <h2
              className="
                mt-2
                text-xl
                font-semibold
                tracking-[-0.02em]
                text-white
              "
            >
              Team Capacity
            </h2>

            <p className="mt-1 text-xs text-zinc-600">
              Manage your actual business workforce
            </p>
          </div>

        </div>

        {/* AI CFO STATUS */}

        <div
          className="
            inline-flex
            w-fit
            items-center
            gap-2
            rounded-full
            border
            border-[#D4AF37]/15
            bg-[#D4AF37]/[0.06]
            px-4
            py-2
            text-xs
            font-medium
            text-[#D4AF37]
          "
        >
          <span
            className="
              h-1.5
              w-1.5
              rounded-full
              bg-[#D4AF37]
            "
          />

          {status ||
            "CFO Workforce Assessment"}
        </div>
      </div>

      {/* =====================================================
          CURRENT WORKFORCE
      ===================================================== */}

      <div
        className="
          px-7
          py-8
          sm:px-8
        "
      >
        <p
          className="
            text-[10px]
            uppercase
            tracking-[0.3em]
            text-zinc-500
          "
        >
          Current Team
        </p>

        <div className="mt-4 flex items-end gap-3">

          <p
            className="
              text-5xl
              font-semibold
              tracking-[-0.05em]
              text-white
            "
          >
            {currentEmployees}
          </p>

          <p
            className="
              mb-1.5
              text-sm
              text-zinc-600
            "
          >
            {currentEmployees === 1
              ? "Employee"
              : "Employees"}
          </p>

        </div>

        <p
          className="
            mt-2
            max-w-xl
            text-xs
            leading-6
            text-zinc-600
          "
        >
          This is your actual current workforce.
          DhanarkOS does not automatically change this
          number based on AI recommendations.
        </p>
      </div>

      {/* =====================================================
          WORKFORCE CONTROLS
      ===================================================== */}

      <div
        className="
          border-t
          border-white/[0.05]
          px-7
          py-7
          sm:px-8
        "
      >
        <div
          className="
            flex
            flex-col
            gap-5
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <div>

            <p
              className="
                text-[10px]
                uppercase
                tracking-[0.3em]
                text-zinc-500
              "
            >
              Manage Workforce
            </p>

            <p className="mt-2 text-xs text-zinc-600">
              Update this when your actual team changes.
            </p>

          </div>

          <div className="flex items-center gap-3">

            {/* REMOVE */}

            <button
              type="button"
              onClick={() =>
                updateEmployees(
                  currentEmployees - 1
                )
              }
              disabled={
                currentEmployees === 0 ||
                saving
              }
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                border
                border-white/[0.08]
                bg-white/[0.03]
                text-zinc-300
                transition
                hover:bg-white/[0.07]
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
              aria-label="Remove employee"
              title="Remove employee"
            >
              <Minus size={17} />
            </button>

            {/* CURRENT COUNT */}

            <div
              className="
                flex
                min-w-[64px]
                items-center
                justify-center
                rounded-xl
                border
                border-white/[0.06]
                bg-white/[0.02]
                px-4
                py-2.5
              "
            >
              <span
                className="
                  text-sm
                  font-medium
                  text-white
                "
              >
                {currentEmployees}
              </span>
            </div>

            {/* ADD */}

            <button
              type="button"
              onClick={() =>
                updateEmployees(
                  currentEmployees + 1
                )
              }
              disabled={saving}
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                border
                border-[#D4AF37]/20
                bg-[#D4AF37]/10
                text-[#D4AF37]
                transition
                hover:bg-[#D4AF37]/15
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
              aria-label="Add employee"
              title="Add employee"
            >
              <Plus size={17} />
            </button>

          </div>
        </div>

        {saving && (
          <div className="mt-4 flex items-center gap-2">

            <span
              className="
                h-2
                w-2
                animate-pulse
                rounded-full
                bg-[#D4AF37]
              "
            />

            <p className="text-xs text-[#D4AF37]">
              Updating workforce intelligence...
            </p>

          </div>
        )}

        {error && (
          <p className="mt-4 text-xs text-red-400">
            {error}
          </p>
        )}
      </div>

      {/* =====================================================
          CFO WORKFORCE DECISION
      ===================================================== */}

      <div
        className="
          border-t
          border-white/[0.05]
          px-7
          py-7
          sm:px-8
        "
      >
        <p
          className="
            text-[10px]
            font-medium
            uppercase
            tracking-[0.35em]
            text-[#D4AF37]
          "
        >
          CFO Workforce Decision
        </p>

        <p
          className="
            mt-4
            max-w-4xl
            text-[15px]
            leading-8
            text-zinc-400
          "
        >
          {recommendation ||
            "There is currently insufficient data to make a reliable workforce decision."}
        </p>

      </div>
    </section>
  );
}