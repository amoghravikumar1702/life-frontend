// src/app/dashboard/ai-cfo/page.tsx

import Image from "next/image";

import PageContainer from "@/components/ui/PageContainer";
import WorkforceManagement from "@/components/AI-CFO/WorkforceManagement";
import AskYourCFO from "@/components/AI-CFO/AskYourCFO";

import { buildExecutiveReport } from "@/lib/cfo/report";
import { generateProtectedAICFOBrief } from "@/lib/ai/openaiCFO";

export const dynamic = "force-dynamic";

function getGreeting() {
  const hour = Number(
    new Intl.DateTimeFormat("en-IN", {
      hour: "numeric",
      hour12: false,
      timeZone: "Asia/Kolkata",
    }).format(new Date())
  );

  if (hour < 12) {
    return "Good morning";
  }

  if (hour < 17) {
    return "Good afternoon";
  }

  return "Good evening";
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function getMetricStatus(
  type:
    | "revenue"
    | "expenses"
    | "profit"
    | "receivables",
  value: number
) {
  if (type === "revenue") {
    return value > 0
      ? "Strong activity"
      : "No revenue yet";
  }

  if (type === "expenses") {
    return value === 0
      ? "No expenses recorded"
      : "Under review";
  }

  if (type === "profit") {
    if (value > 0) return "Positive";
    if (value < 0) return "Needs attention";
    return "Break-even";
  }

  return value > 0
    ? "Needs attention"
    : "Clear";
}

export default async function AICFOPage() {
  const report = await buildExecutiveReport();

  const aiBrief = await generateProtectedAICFOBrief(
    report
  );

  const greeting = getGreeting();

  const revenue = Number(
    report.finance.revenue ?? 0
  );

  const expenses = Number(
    report.finance.expenses ?? 0
  );

  const profit = Number(
    report.finance.profit ?? 0
  );

  const receivables = Number(
    report.finance.outstandingReceivables ?? 0
  );

  return (
    <PageContainer>
      <div className="mx-auto w-full max-w-7xl">

        {/* =====================================================
            DHAAR / AI CFO EXECUTIVE HERO
        ====================================================== */}

        <section
          className="
            relative
            isolate
            overflow-hidden
            rounded-[32px]
            border
            border-[#D4AF37]/20
            bg-[#0B0E13]
            px-6
            py-7
            sm:px-8
            sm:py-9
            lg:px-10
            lg:py-10
          "
        >

          {/* Subtle gold atmosphere */}
          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              right-[-120px]
              top-[-160px]
              h-[520px]
              w-[520px]
              rounded-full
              bg-[#D4AF37]/[0.045]
              blur-[150px]
            "
          />

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              bottom-[-180px]
              right-[18%]
              h-[360px]
              w-[360px]
              rounded-full
              bg-[#D4AF37]/[0.018]
              blur-[130px]
            "
          />

          {/* =================================================
              DHAAR
          ================================================== */}

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              right-[-35px]
              top-[-25px]
              hidden
              h-[430px]
              w-[430px]
              sm:block
              lg:right-[-5px]
              lg:top-[-45px]
              lg:h-[485px]
              lg:w-[485px]
              xl:right-[5px]
              xl:top-[-55px]
              xl:h-[515px]
              xl:w-[515px]
            "
          >
            <Image
              src="/images/dhaar/dhaar-mascot.png"
              alt=""
              fill
              priority
              sizes="515px"
              className="
                object-contain
                object-center
                mix-blend-screen
              "
            />
          </div>

          {/* =================================================
              HERO CONTENT
          ================================================== */}

          <div
            className="
              relative
              z-10
              max-w-4xl
              lg:pr-[330px]
              xl:pr-[390px]
            "
          >

            {/* Dhaar identity */}
            <div className="flex items-center gap-4">

              <div
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-[#D4AF37]/20
                  bg-[#D4AF37]/[0.06]
                "
              >
                <span
                  className="
                    text-[11px]
                    font-semibold
                    tracking-[0.12em]
                    text-[#D4AF37]
                  "
                >
                  AI
                </span>
              </div>

              <div>
                <p
                  className="
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.38em]
                    text-[#D4AF37]
                  "
                >
                  DHAAR / AI CFO
                </p>

                <p className="mt-1 text-xs text-zinc-500">
                  Executive intelligence
                </p>
              </div>

            </div>

            {/* Greeting */}
            <div className="mt-8">

              <h1
                className="
                  text-3xl
                  font-medium
                  tracking-[-0.025em]
                  text-white
                  sm:text-4xl
                  lg:text-[44px]
                  lg:leading-[1.1]
                "
              >
                {greeting},{" "}
                <span className="text-[#D4AF37]">
                  {report.company.name}
                </span>
              </h1>

              <p
                className="
                  mt-5
                  max-w-2xl
                  text-[15px]
                  leading-7
                  text-zinc-400
                  sm:text-base
                  sm:leading-8
                "
              >
                {aiBrief.executiveBrief}
              </p>

            </div>

            {/* =================================================
                FINANCIAL METRICS
            ================================================== */}

            <div
              className="
                mt-8
                grid
                grid-cols-2
                gap-3
                sm:grid-cols-4
              "
            >

              <div
                className="
                  rounded-2xl
                  border
                  border-white/[0.07]
                  bg-white/[0.025]
                  px-4
                  py-4
                "
              >
                <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-600">
                  Revenue
                </p>

                <p className="mt-2 text-sm font-medium text-zinc-200">
                  {formatCurrency(revenue)}
                </p>

                <p className="mt-2 text-[10px] text-zinc-500">
                  {getMetricStatus(
                    "revenue",
                    revenue
                  )}
                </p>
              </div>

              <div
                className="
                  rounded-2xl
                  border
                  border-white/[0.07]
                  bg-white/[0.025]
                  px-4
                  py-4
                "
              >
                <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-600">
                  Expenses
                </p>

                <p className="mt-2 text-sm font-medium text-zinc-200">
                  {formatCurrency(expenses)}
                </p>

                <p className="mt-2 text-[10px] text-zinc-500">
                  {getMetricStatus(
                    "expenses",
                    expenses
                  )}
                </p>
              </div>

              <div
                className="
                  rounded-2xl
                  border
                  border-white/[0.07]
                  bg-white/[0.025]
                  px-4
                  py-4
                "
              >
                <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-600">
                  Profit
                </p>

                <p className="mt-2 text-sm font-medium text-zinc-200">
                  {formatCurrency(profit)}
                </p>

                <p className="mt-2 text-[10px] text-zinc-500">
                  {getMetricStatus(
                    "profit",
                    profit
                  )}
                </p>
              </div>

              <div
                className="
                  rounded-2xl
                  border
                  border-white/[0.07]
                  bg-white/[0.025]
                  px-4
                  py-4
                "
              >
                <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-600">
                  Receivables
                </p>

                <p className="mt-2 text-sm font-medium text-zinc-200">
                  {formatCurrency(receivables)}
                </p>

                <p className="mt-2 text-[10px] text-zinc-500">
                  {getMetricStatus(
                    "receivables",
                    receivables
                  )}
                </p>
              </div>

            </div>

          </div>

          {/* Mobile Dhaar */}
          <div
            aria-hidden="true"
            className="
              relative
              mx-auto
              mt-5
              h-[260px]
              w-full
              max-w-[330px]
              sm:hidden
            "
          >
            <Image
              src="/images/dhaar/dhaar-mascot.png"
              alt=""
              fill
              sizes="330px"
              className="
                object-contain
                mix-blend-screen
              "
            />
          </div>

        </section>

        {/* =====================================================
            ASK YOUR CFO
        ====================================================== */}

        <div className="mt-8 sm:mt-10">
          <AskYourCFO />
        </div>

        {/* =====================================================
            WORKFORCE
        ====================================================== */}

        <div className="mt-8 sm:mt-10">
          <WorkforceManagement
            initialEmployees={
              report.workforce.currentEmployees
            }
            recommendation={
              aiBrief.workforce?.recommendation ??
              "Maintain the current workforce until more financial evidence is available."
            }
            status={
              aiBrief.workforce?.status ??
              "CFO Workforce Assessment"
            }
          />
        </div>

        {/* =====================================================
            FOOTER
        ====================================================== */}

        <footer
          className="
            mx-auto
            mt-12
            flex
            max-w-7xl
            flex-col
            items-center
            justify-center
            gap-3
            border-t
            border-white/[0.06]
            pt-10
            pb-6
          "
        >
          <div
            className="
              h-px
              w-24
              rounded-full
              bg-[#D4AF37]/40
            "
          />

          <p
            className="
              text-[11px]
              uppercase
              tracking-[0.42em]
              text-[#D4AF37]
            "
          >
            DhanarkOS EXECUTIVE INTELLIGENCE
          </p>

          <p
            className="
              max-w-2xl
              text-center
              text-sm
              leading-7
              text-zinc-500
            "
          >
            Recommendations are generated from
            the business&apos;s available financial
            and operational data.
          </p>
        </footer>

      </div>
    </PageContainer>
  );
}