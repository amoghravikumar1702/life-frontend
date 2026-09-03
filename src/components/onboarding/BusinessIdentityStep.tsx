// src/components/onboarding/BusinessIdentityStep.tsx

"use client";

import { useState } from "react";
import {
  ArrowRight,
  Building2,
  UserRound,
  Phone,
  Users,
  CalendarDays,
  ShieldCheck,
} from "lucide-react";

interface BusinessIdentity {
  companyName: string;
  ownerName: string;
  phone: string;
  businessModel: string;
  yearsInBusiness: number;
  employees: number;
}

interface BusinessIdentityStepProps {
  initialData?: BusinessIdentity;
  onContinue: (
    data: BusinessIdentity
  ) => void;
}

const businessModels = [
  "Product / Retail",
  "Service Business",
  "Subscription",
  "Marketplace",
  "Agency",
  "Manufacturing",
  "Other",
];

function normalizePhone(
  value: string
): string {
  const digits = value.replace(/\D/g, "");

  if (!digits) {
    return "";
  }

  if (
    digits.startsWith("91") &&
    digits.length === 12
  ) {
    return `+${digits}`;
  }

  if (digits.length === 10) {
    return `+91${digits}`;
  }

  return value.startsWith("+")
    ? `+${digits}`
    : `+91${digits}`;
}

export default function BusinessIdentityStep({
  initialData,
  onContinue,
}: BusinessIdentityStepProps) {
  const [companyName, setCompanyName] =
    useState(
      initialData?.companyName ?? ""
    );

  const [ownerName, setOwnerName] =
    useState(
      initialData?.ownerName ?? ""
    );

  const [phone, setPhone] =
    useState(
      initialData?.phone ?? ""
    );

  const [businessModel, setBusinessModel] =
    useState(
      initialData?.businessModel ?? ""
    );

  const [yearsInBusiness, setYearsInBusiness] =
    useState(
      initialData?.yearsInBusiness
        ? String(initialData.yearsInBusiness)
        : ""
    );

  const [employees, setEmployees] =
    useState(
      initialData?.employees
        ? String(initialData.employees)
        : ""
    );

  const valid =
    companyName.trim().length > 0 &&
    ownerName.trim().length > 0 &&
    phone.replace(/\D/g, "").length === 10 &&
    businessModel.length > 0 &&
    Number(yearsInBusiness) >= 0 &&
    Number(employees) >= 0;

  function handleContinue() {
    if (!valid) {
      return;
    }

    onContinue({
      companyName:
        companyName.trim(),

      ownerName:
        ownerName.trim(),

      phone:
        normalizePhone(phone),

      businessModel,

      yearsInBusiness:
        Math.max(
          0,
          Math.floor(
            Number(yearsInBusiness) || 0
          )
        ),

      employees:
        Math.max(
          0,
          Math.floor(
            Number(employees) || 0
          )
        ),
    });
  }

  return (
    <section
      className="
        relative
        mx-auto
        w-full
        max-w-3xl
        overflow-hidden
        rounded-[32px]
        border
        border-[#D4AF37]/15
        bg-[#101318]
        shadow-[0_30px_100px_rgba(0,0,0,0.28)]
      "
    >
      {/* ============================================================
          AMBIENT CARD GLOW
      ============================================================ */}

      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-[-180px]
          h-[360px]
          w-[600px]
          -translate-x-1/2
          rounded-full
          bg-[#D4AF37]/[0.045]
          blur-[120px]
        "
      />

      {/* ============================================================
          CONTENT
      ============================================================ */}

      <div
        className="
          relative
          px-5
          py-7
          sm:px-8
          sm:py-9
          md:px-10
          md:py-10
        "
      >
        {/* ==========================================================
            HEADER
        ========================================================== */}

        <div className="flex items-center gap-3">
          <div
            className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-2xl
              border
              border-[#D4AF37]/20
              bg-[#D4AF37]/[0.07]
            "
          >
            <Building2
              size={18}
              className="text-[#D4AF37]"
              strokeWidth={1.7}
            />
          </div>

          <div className="min-w-0">
            <p
              className="
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.3em]
                text-[#D4AF37]
              "
            >
              Business Identity
            </p>

            <p className="mt-1 text-sm text-zinc-500">
              Give DhanarkOS the basics
            </p>
          </div>
        </div>

        {/* ==========================================================
            INTRO
        ========================================================== */}

        <div className="mt-8">
          <h1
            className="
              text-2xl
              font-medium
              tracking-tight
              text-white
              sm:text-3xl
            "
          >
            Tell us about your business.
          </h1>

          <p
            className="
              mt-3
              max-w-xl
              text-sm
              leading-7
              text-zinc-500
            "
          >
            DhanarkOS uses this information to
            build your financial command center
            and give your AI CFO the right
            context.
          </p>
        </div>

        {/* ==========================================================
            BASIC DETAILS
        ========================================================== */}

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {/* BUSINESS NAME */}

          <div>
            <label
              htmlFor="company-name"
              className="
                mb-2.5
                block
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.2em]
                text-zinc-600
              "
            >
              Business Name
            </label>

            <div
              className="
                flex
                items-center
                rounded-xl
                border
                border-white/[0.07]
                bg-black/20
                px-4
                transition
                focus-within:border-[#D4AF37]/35
              "
            >
              <Building2
                size={17}
                className="mr-3 shrink-0 text-zinc-600"
                strokeWidth={1.7}
              />

              <input
                id="company-name"
                value={companyName}
                onChange={(event) =>
                  setCompanyName(
                    event.target.value
                  )
                }
                placeholder="Your company name"
                className="
                  h-14
                  w-full
                  bg-transparent
                  text-sm
                  text-white
                  outline-none
                  placeholder:text-zinc-700
                "
              />
            </div>
          </div>

          {/* OWNER NAME */}

          <div>
            <label
              htmlFor="owner-name"
              className="
                mb-2.5
                block
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.2em]
                text-zinc-600
              "
            >
              Your Name
            </label>

            <div
              className="
                flex
                items-center
                rounded-xl
                border
                border-white/[0.07]
                bg-black/20
                px-4
                transition
                focus-within:border-[#D4AF37]/35
              "
            >
              <UserRound
                size={17}
                className="mr-3 shrink-0 text-zinc-600"
                strokeWidth={1.7}
              />

              <input
                id="owner-name"
                value={ownerName}
                onChange={(event) =>
                  setOwnerName(
                    event.target.value
                  )
                }
                placeholder="Your full name"
                className="
                  h-14
                  w-full
                  bg-transparent
                  text-sm
                  text-white
                  outline-none
                  placeholder:text-zinc-700
                "
              />
            </div>
          </div>

          {/* PHONE */}

          <div>
            <label
              htmlFor="phone"
              className="
                mb-2.5
                block
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.2em]
                text-zinc-600
              "
            >
              Phone

              <span className="ml-2 normal-case tracking-normal text-[#D4AF37]/70">
                verification required
              </span>
            </label>

            <div
              className="
                flex
                items-center
                rounded-xl
                border
                border-white/[0.07]
                bg-black/20
                px-4
                transition
                focus-within:border-[#D4AF37]/35
              "
            >
              <Phone
                size={17}
                className="mr-3 shrink-0 text-zinc-600"
                strokeWidth={1.7}
              />

              <input
                id="phone"
                type="tel"
                inputMode="tel"
                value={phone}
                onChange={(event) =>
                  setPhone(
                    event.target.value
                  )
                }
                placeholder="+91 98765 43210"
                className="
                  h-14
                  w-full
                  bg-transparent
                  text-sm
                  text-white
                  outline-none
                  placeholder:text-zinc-700
                "
              />
            </div>

            <p className="mt-2 flex items-center gap-1.5 text-[10px] text-zinc-700">
              <ShieldCheck
                size={11}
                className="text-[#D4AF37]/70"
              />

              Used to protect your one-time
              trial.
            </p>
          </div>

          {/* YEARS */}

          <div>
            <label
              htmlFor="years"
              className="
                mb-2.5
                block
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.2em]
                text-zinc-600
              "
            >
              Years in Business
            </label>

            <div
              className="
                flex
                items-center
                rounded-xl
                border
                border-white/[0.07]
                bg-black/20
                px-4
                transition
                focus-within:border-[#D4AF37]/35
              "
            >
              <CalendarDays
                size={17}
                className="mr-3 shrink-0 text-zinc-600"
                strokeWidth={1.7}
              />

              <input
                id="years"
                type="number"
                min="0"
                value={yearsInBusiness}
                onChange={(event) =>
                  setYearsInBusiness(
                    event.target.value
                  )
                }
                placeholder="0"
                className="
                  h-14
                  w-full
                  bg-transparent
                  text-sm
                  text-white
                  outline-none
                  placeholder:text-zinc-700
                "
              />
            </div>
          </div>
        </div>

        {/* ==========================================================
            BUSINESS MODEL
        ========================================================== */}

        <div className="mt-6">
          <label
            className="
              mb-3
              block
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.2em]
              text-zinc-600
            "
          >
            Business Model
          </label>

          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {businessModels.map((model) => {
              const selected =
                businessModel === model;

              return (
                <button
                  key={model}
                  type="button"
                  onClick={() =>
                    setBusinessModel(model)
                  }
                  className={`
                    min-h-12
                    rounded-xl
                    border
                    px-3
                    text-left
                    text-xs
                    transition
                    ${
                      selected
                        ? "border-[#D4AF37]/45 bg-[#D4AF37]/[0.08] text-[#D4AF37]"
                        : "border-white/[0.06] bg-white/[0.015] text-zinc-500 hover:border-[#D4AF37]/20 hover:text-zinc-300"
                    }
                  `}
                >
                  {model}
                </button>
              );
            })}
          </div>
        </div>

        {/* ==========================================================
            EMPLOYEES
        ========================================================== */}

        <div className="mt-6">
          <label
            htmlFor="employees"
            className="
              mb-2.5
              block
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.2em]
              text-zinc-600
            "
          >
            Current Employees
          </label>

          <div
            className="
              flex
              max-w-sm
              items-center
              rounded-xl
              border
              border-white/[0.07]
              bg-black/20
              px-4
              transition
              focus-within:border-[#D4AF37]/35
            "
          >
            <Users
              size={17}
              className="mr-3 shrink-0 text-zinc-600"
              strokeWidth={1.7}
            />

            <input
              id="employees"
              type="number"
              min="0"
              value={employees}
              onChange={(event) =>
                setEmployees(
                  event.target.value
                )
              }
              placeholder="0"
              className="
                h-14
                w-full
                bg-transparent
                text-sm
                text-white
                outline-none
                placeholder:text-zinc-700
              "
            />
          </div>

          <p className="mt-2 text-[11px] text-zinc-700">
            Enter 0 if you currently run the
            business yourself.
          </p>
        </div>

        {/* ==========================================================
            SECURITY NOTE
        ========================================================== */}

        <div
          className="
            mt-8
            rounded-xl
            border
            border-[#D4AF37]/10
            bg-[#D4AF37]/[0.025]
            px-4
            py-3.5
          "
        >
          <div className="flex items-start gap-3">
            <ShieldCheck
              size={15}
              className="mt-0.5 shrink-0 text-[#D4AF37]"
            />

            <div>
              <p className="text-[11px] font-medium text-zinc-300">
                One verified phone. One DhanarkOS
                trial.
              </p>

              <p className="mt-1 text-[10px] leading-5 text-zinc-700">
                Your phone number is verified to
                help prevent repeated trials
                through multiple email addresses.
              </p>
            </div>
          </div>
        </div>

        {/* ==========================================================
            CONTINUE
        ========================================================== */}

        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={handleContinue}
            disabled={!valid}
            className="
              flex
              min-h-12
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-[#D4AF37]
              px-6
              text-sm
              font-semibold
              text-black
              transition
              hover:brightness-110
              disabled:cursor-not-allowed
              disabled:opacity-35
            "
          >
            Continue

            <ArrowRight
              size={17}
              strokeWidth={1.8}
            />
          </button>
        </div>
      </div>
    </section>
  );
}