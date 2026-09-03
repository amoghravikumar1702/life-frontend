// src/app/dashboard/ai-cfo/page.tsx

import PageContainer from "@/components/ui/PageContainer";
import DailyCEOBrief from "@/components/AI-CFO/DailyCEOBrief";
import WorkforceManagement from "@/components/AI-CFO/WorkforceManagement";
import AskYourCFO from "@/components/AI-CFO/AskYourCFO";

import { buildExecutiveReport } from "@/lib/cfo/report";
import { generateProtectedAICFOBrief } from "@/lib/ai/openaiCFO";

export const dynamic = "force-dynamic";

export default async function AICFOPage() {
  const report = await buildExecutiveReport();

  const aiBrief = await generateProtectedAICFOBrief(
    report
  );

  return (
    <PageContainer>
      <div className="mx-auto max-w-7xl">

        <DailyCEOBrief
          greeting={`Good day, ${report.company.name}`}
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
              bg-[#111419]
              px-7
              py-8
              sm:px-9
              sm:py-10
              lg:px-11
              lg:py-11
            "
          >
            <div
              className="
                pointer-events-none
                absolute
                bottom-[-180px]
                right-[-100px]
                h-[340px]
                w-[340px]
                rounded-full
                bg-[#D4AF37]/[0.025]
                blur-[110px]
              "
            />

            <div className="relative">

              <div className="flex items-center gap-3">
                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-[#D4AF37]/15
                    bg-[#D4AF37]/[0.07]
                  "
                >
                  <span
                    className="
                      text-sm
                      font-semibold
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
                      font-medium
                      uppercase
                      tracking-[0.38em]
                      text-[#D4AF37]
                    "
                  >
                    CFO Decision
                  </p>

                  <p className="mt-1 text-xs text-zinc-500">
                    Executive recommendation
                  </p>
                </div>
              </div>

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