// src/app/dashboard/ai-cfo/page.tsx

import Image from "next/image";

import PageContainer from "@/components/ui/PageContainer";
import DailyCEOBrief from "@/components/AI-CFO/DailyCEOBrief";
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

export default async function AICFOPage() {
  const report = await buildExecutiveReport();

  const aiBrief = await generateProtectedAICFOBrief(
    report
  );

  const greeting = getGreeting();

  return (
    <PageContainer>
      <div className="mx-auto max-w-7xl">

        <DailyCEOBrief
          greeting={`${greeting}, ${report.company.name}`}
          executiveBrief={aiBrief.executiveBrief}
          recommendation={aiBrief.recommendation}
          finance={{
            revenue: report.finance.revenue ?? 0,
            expenses: report.finance.expenses ?? 0,
            profit: report.finance.profit ?? 0,
            outstandingReceivables:
              report.finance.outstandingReceivables ?? 0,
          }}
        />

        <div className="mt-10">
          <AskYourCFO />
        </div>

        <div className="mt-10">
          <section
            className="
              relative
              overflow-hidden
              rounded-[32px]
              border
              border-[#D4AF37]/12
              bg-[#101318]
              px-7
              py-8
              sm:px-9
              sm:py-10
              lg:px-11
              lg:py-11
            "
          >
            {/* Dhaar ambient presence */}
            <div
              className="
                pointer-events-none
                absolute
                right-[-90px]
                top-[-90px]
                h-[300px]
                w-[300px]
                rounded-full
                bg-[#D4AF37]/[0.018]
                blur-[110px]
              "
            />

            <div className="relative">

              {/* CFO Identity */}
              <div
                className="
                  flex
                  items-center
                  justify-between
                  gap-6
                "
              >
                <div className="flex items-center gap-4">

                  <div
                    className="
                      relative
                      flex
                      h-14
                      w-14
                      shrink-0
                      items-center
                      justify-center
                      overflow-hidden
                      rounded-2xl
                      border
                      border-[#D4AF37]/20
                      bg-[#0B0D10]
                    "
                  >
                    <Image
                      src="/images/dhaar/dhaar-mascot.png"
                      alt="Dhaar — Dhanark AI CFO"
                      width={56}
                      height={56}
                      priority
                      className="
                        h-full
                        w-full
                        object-cover
                      "
                    />
                  </div>

                  <div>
                    <p
                      className="
                        text-[10px]
                        font-medium
                        uppercase
                        tracking-[0.38em]
                        text-[#D4AF37]
                      "
                    >
                      DHAAR / AI CFO
                    </p>

                    <p className="mt-1 text-xs text-zinc-500">
                      Executive recommendation
                    </p>
                  </div>

                </div>

                <div
                  className="
                    hidden
                    text-right
                    sm:block
                  "
                >
                  <p
                    className="
                      text-[9px]
                      uppercase
                      tracking-[0.3em]
                      text-zinc-700
                    "
                  >
                    Dhanark Intelligence
                  </p>

                  <p className="mt-1 text-[10px] text-zinc-600">
                    CFO Decision Engine
                  </p>
                </div>
              </div>

              {/* Recommendation */}
              <div className="mt-8 max-w-4xl">
                <p
                  className="
                    text-[18px]
                    leading-9
                    text-zinc-200
                    sm:text-[19px]
                  "
                >
                  {aiBrief.recommendation}
                </p>
              </div>

              {/* Decision Framework */}
              <div
                className="
                  mt-9
                  border-t
                  border-white/[0.05]
                  pt-7
                "
              >
                <p
                  className="
                    text-[10px]
                    font-medium
                    uppercase
                    tracking-[0.35em]
                    text-zinc-500
                  "
                >
                  Decision Framework
                </p>

                <div className="mt-5 grid gap-5 md:grid-cols-3">

                  <div>
                    <p className="text-xs text-zinc-600">
                      Decision
                    </p>

                    <p className="mt-2 text-sm leading-6 text-zinc-300">
                      Based on current financial and operational evidence.
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-zinc-600">
                      Financial Impact
                    </p>

                    <p className="mt-2 text-sm leading-6 text-zinc-300">
                      Prioritizes profitability, cash generation, and sustainability.
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-zinc-600">
                      Growth Impact
                    </p>

                    <p className="mt-2 text-sm leading-6 text-zinc-300">
                      Designed to support sustainable business growth.
                    </p>
                  </div>

                </div>
              </div>

            </div>
          </section>
        </div>

        {/* Workforce */}
        <div className="mt-10">
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

        {/* Footer */}
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