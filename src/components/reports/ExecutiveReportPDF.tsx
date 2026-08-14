import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

interface Report {
  id: string;
  title: string;
  report_type: string;
  period_start: string;
  period_end: string;
  status: string;
  metadata: Record<string, unknown> | null;
  report_data: Record<string, unknown> | null;
  created_at: string;
}

interface ExecutiveReportPDFProps {
  report: Report;
}

/* =========================================================
   ARKENONE DESIGN SYSTEM
========================================================= */

const gold = "#D4AF37";
const dark = "#0B0D0F";
const darkCard = "#121518";
const text = "#E8E8E8";
const muted = "#8A8F98";
const green = "#4ADE80";
const red = "#F87171";
const amber = "#E8B84A";

const styles = StyleSheet.create({
  page: {
    backgroundColor: dark,
    color: text,
    paddingTop: 42,
    paddingBottom: 48,
    paddingHorizontal: 44,
    fontFamily: "Helvetica",
  },

  header: {
    borderBottomWidth: 1,
    borderBottomColor: "#272B30",
    paddingBottom: 24,
    marginBottom: 28,
  },

  brandRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  brand: {
    fontSize: 22,
    fontWeight: "bold",
    color: gold,
    letterSpacing: 1.5,
  },

  brandSubtext: {
    marginTop: 5,
    fontSize: 7,
    color: muted,
    letterSpacing: 2,
  },

  confidential: {
    fontSize: 7,
    color: muted,
    letterSpacing: 1.5,
  },

  reportLabel: {
    fontSize: 7,
    color: gold,
    letterSpacing: 2.5,
    marginTop: 28,
    textTransform: "uppercase",
  },

  title: {
    marginTop: 8,
    fontSize: 27,
    fontWeight: "bold",
    color: "#FFFFFF",
  },

  period: {
    marginTop: 8,
    fontSize: 9,
    color: muted,
  },

  section: {
    marginBottom: 25,
  },

  sectionLabel: {
    fontSize: 7,
    color: gold,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 7,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 12,
  },

  summary: {
    backgroundColor: "#15130C",
    borderWidth: 1,
    borderColor: "#3A321B",
    borderRadius: 10,
    padding: 18,
  },

  summaryAccent: {
    width: 3,
    height: 38,
    backgroundColor: gold,
    marginBottom: 12,
  },

  summaryText: {
    fontSize: 10,
    lineHeight: 1.7,
    color: "#D4D4D4",
  },

  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  metric: {
    width: "48%",
    backgroundColor: darkCard,
    borderWidth: 1,
    borderColor: "#24282D",
    borderRadius: 10,
    padding: 15,
  },

  metricLabel: {
    fontSize: 7,
    color: muted,
    letterSpacing: 1,
    textTransform: "uppercase",
  },

  metricValue: {
    marginTop: 8,
    fontSize: 19,
    fontWeight: "bold",
    color: "#FFFFFF",
  },

  revenueValue: {
    color: "#FFFFFF",
  },

  expenseValue: {
    color: red,
  },

  profitValue: {
    color: green,
  },

  marginValue: {
    color: gold,
  },

  receivableBox: {
    backgroundColor: darkCard,
    borderWidth: 1,
    borderColor: "#24282D",
    borderRadius: 10,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  receivableValue: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#FFFFFF",
  },

  breakdown: {
    backgroundColor: darkCard,
    borderWidth: 1,
    borderColor: "#24282D",
    borderRadius: 10,
    overflow: "hidden",
  },

  breakdownHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#171B1F",
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#24282D",
  },

  breakdownHeaderText: {
    fontSize: 7,
    color: muted,
    letterSpacing: 1,
    textTransform: "uppercase",
  },

  breakdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#202428",
  },

  breakdownLabel: {
    fontSize: 9,
    color: "#D4D4D4",
  },

  breakdownValue: {
    fontSize: 9,
    color: "#FFFFFF",
    fontWeight: "bold",
  },

  intelligenceGrid: {
    flexDirection: "row",
    gap: 10,
  },

  intelligenceCard: {
    flex: 1,
    backgroundColor: darkCard,
    borderWidth: 1,
    borderColor: "#24282D",
    borderRadius: 10,
    padding: 14,
  },

  strengthCard: {
    borderColor: "#21482D",
  },

  riskCard: {
    borderColor: "#4A2424",
  },

  recommendationCard: {
    borderColor: "#493E1C",
  },

  intelligenceTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
  },

  intelligenceItem: {
    fontSize: 8.5,
    lineHeight: 1.55,
    color: "#BFC3C8",
    marginBottom: 6,
  },

  signalBox: {
    backgroundColor: "#15130C",
    borderWidth: 1,
    borderColor: "#3A321B",
    borderRadius: 10,
    padding: 18,
  },

  signalTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },

  signalText: {
    fontSize: 9,
    lineHeight: 1.6,
    color: "#AEB3BA",
  },

  footer: {
    marginTop: "auto",
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#272B30",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  footerText: {
    fontSize: 7,
    color: "#666B73",
    letterSpacing: 1,
  },

  pageNumber: {
    fontSize: 7,
    color: "#666B73",
  },
});

/* =========================================================
   HELPERS
========================================================= */

function formatCurrency(value: unknown) {
  const amount = Number(value ?? 0);

  return `INR ${new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(amount)}`;
}

function getNumber(
  data: Record<string, unknown> | null,
  keys: string[]
) {
  if (!data) return 0;

  for (const key of keys) {
    const value = data[key];

    if (
      value !== undefined &&
      value !== null &&
      value !== ""
    ) {
      const number = Number(value);

      if (!Number.isNaN(number)) {
        return number;
      }
    }
  }

  return 0;
}

function getString(
  data: Record<string, unknown> | null,
  keys: string[]
) {
  if (!data) return "";

  for (const key of keys) {
    const value = data[key];

    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }

  return "";
}

function getStringArray(
  data: Record<string, unknown> | null,
  keys: string[]
) {
  if (!data) return [];

  for (const key of keys) {
    const value = data[key];

    if (Array.isArray(value)) {
      return value.filter(
        (item): item is string =>
          typeof item === "string" && item.trim().length > 0
      );
    }
  }

  return [];
}

function getMetricFromReport(
  reportData: Record<string, unknown> | null,
  key: string
) {
  if (!reportData) return 0;

  const metrics = reportData.metrics;

  if (!Array.isArray(metrics)) {
    return 0;
  }

  for (const metric of metrics) {
    if (
      typeof metric === "object" &&
      metric !== null &&
      "label" in metric &&
      "value" in metric
    ) {
      const record = metric as {
        label?: unknown;
        value?: unknown;
      };

      if (
        typeof record.label === "string" &&
        record.label.toLowerCase() === key.toLowerCase()
      ) {
        return Number(record.value ?? 0);
      }
    }
  }

  return 0;
}

/* =========================================================
   MAIN PDF
========================================================= */

export default function ExecutiveReportPDF({
  report,
}: ExecutiveReportPDFProps) {
  const data: Record<string, unknown> =
    report.report_data ?? {};

  /*
   * -------------------------------------------------------
   * FINANCIAL DATA
   * -------------------------------------------------------
   */

  const revenue =
    getNumber(data, [
      "revenue",
      "totalRevenue",
    ]) ||
    getMetricFromReport(data, "Revenue");

  const collected =
    getNumber(data, [
      "collected",
      "totalCollected",
      "amountCollected",
    ]) ||
    getMetricFromReport(data, "Collected");

  const expenses =
    getNumber(data, [
      "expenses",
      "totalExpenses",
      "operatingExpenses",
      "operating_expenses",
      "expenseTotal",
    ]) ||
    getMetricFromReport(data, "Expenses") ||
    getMetricFromReport(data, "Operating Expenses");

  const outstandingReceivables =
    getNumber(data, [
      "outstanding",
      "receivables",
      "outstandingReceivables",
      "balanceDue",
      "totalOutstanding",
    ]) ||
    getMetricFromReport(data, "Outstanding");

  /*
   * Profit is calculated here instead of trusting
   * a potentially stale value.
   */

  const profit =
    revenue - expenses;

  const profitMargin =
    revenue > 0
      ? (profit / revenue) * 100
      : 0;

  const invoiceCount =
    getNumber(data, [
      "invoiceCount",
      "invoices",
      "totalInvoices",
    ]) ||
    getMetricFromReport(data, "Invoices");

  const paidInvoices =
    getNumber(data, [
      "paidInvoices",
      "paidInvoiceCount",
    ]) ||
    getMetricFromReport(data, "Paid Invoices");

  const pendingInvoices =
    getNumber(data, [
      "pendingInvoices",
      "pendingInvoiceCount",
    ]) ||
    getMetricFromReport(data, "Pending Invoices");

  const collectionRate =
    revenue > 0
      ? (collected / revenue) * 100
      : getNumber(data, [
          "collectionRate",
          "collectionEfficiency",
        ]);

  /*
   * -------------------------------------------------------
   * EXECUTIVE SUMMARY
   * -------------------------------------------------------
   */

  const storedSummary = getString(data, [
    "executiveSummary",
    "summary",
    "description",
  ]);

  const executiveSummary =
    storedSummary ||
    `Revenue for the selected period was ${formatCurrency(
      revenue
    )}. ${formatCurrency(
      outstandingReceivables
    )} remains outstanding across the business. ` +
      `The current net profit is ${formatCurrency(
        profit
      )}, representing a ${profitMargin.toFixed(
        1
      )}% profit margin.`;

  /*
   * -------------------------------------------------------
   * STRENGTHS
   * -------------------------------------------------------
   */

  let strengths = getStringArray(data, [
    "strengths",
    "financialStrengths",
  ]);

  if (strengths.length === 0) {
    strengths = [];

    if (collectionRate >= 90) {
      strengths.push(
        `Strong collection efficiency at ${collectionRate.toFixed(
          1
        )}%.`
      );
    }

    if (
      paidInvoices > 0 &&
      paidInvoices >= pendingInvoices
    ) {
      strengths.push(
        `${paidInvoices} invoice${
          paidInvoices === 1 ? "" : "s"
        } successfully collected during the period.`
      );
    }

    if (profit > 0) {
      strengths.push(
        `The business is generating positive net profit of ${formatCurrency(
          profit
        )}.`
      );
    }

    if (profitMargin >= 20) {
      strengths.push(
        `Healthy profit margin of ${profitMargin.toFixed(
          1
        )}%.`
      );
    }

    if (outstandingReceivables <= revenue * 0.15) {
      strengths.push(
        "Outstanding receivables remain within a manageable range."
      );
    }

    if (strengths.length === 0) {
      strengths.push(
        "Revenue activity is being recorded consistently."
      );
    }
  }

  /*
   * -------------------------------------------------------
   * RISKS
   * -------------------------------------------------------
   */

  let risks = getStringArray(data, [
    "risks",
    "financialRisks",
  ]);

  if (risks.length === 0) {
    risks = [];

    if (pendingInvoices > 0) {
      risks.push(
        `${pendingInvoices} pending invoice${
          pendingInvoices === 1 ? "" : "s"
        } require collection follow-up.`
      );
    }

    if (
      revenue > 0 &&
      outstandingReceivables > revenue * 0.15
    ) {
      risks.push(
        `Outstanding receivables represent ${(
          (outstandingReceivables / revenue) *
          100
        ).toFixed(
          1
        )}% of revenue, creating potential cash-flow pressure.`
      );
    }

    if (
      revenue > 0 &&
      collectionRate < 80
    ) {
      risks.push(
        `Collection efficiency is below 80% at ${collectionRate.toFixed(
          1
        )}%.`
      );
    }

    if (expenses > revenue && revenue > 0) {
      risks.push(
        "Operating expenses currently exceed recorded revenue."
      );
    }

    if (profit < 0) {
      risks.push(
        `The business is currently operating at a net loss of ${formatCurrency(
          Math.abs(profit)
        )}.`
      );
    }

    if (risks.length === 0) {
      risks.push(
        "No major financial risks detected from the available data."
      );
    }
  }

  /*
   * -------------------------------------------------------
   * RECOMMENDATIONS
   * -------------------------------------------------------
   */

  let recommendations = getStringArray(data, [
    "recommendations",
    "financialRecommendations",
  ]);

  if (recommendations.length === 0) {
    recommendations = [];

    if (pendingInvoices > 0) {
      recommendations.push(
        "Follow up on pending invoices to accelerate cash collection."
      );
    }

    if (
      revenue > 0 &&
      outstandingReceivables > revenue * 0.15
    ) {
      recommendations.push(
        "Prioritize receivables recovery to strengthen near-term liquidity."
      );
    }

    if (
      revenue > 0 &&
      profitMargin < 15
    ) {
      recommendations.push(
        "Review operating costs and pricing to improve profit margins."
      );
    }

    if (
      revenue > 0 &&
      collectionRate < 90
    ) {
      recommendations.push(
        "Tighten payment terms and collection follow-up processes."
      );
    }

    if (profit > 0) {
      recommendations.push(
        "Protect current profitability while increasing recurring revenue."
      );
    }

    if (recommendations.length === 0) {
      recommendations.push(
        "Continue monitoring revenue, profitability, and liquidity."
      );
    }
  }

  /*
   * -------------------------------------------------------
   * MANAGEMENT SIGNAL
   * -------------------------------------------------------
   */

  let managementSignal =
    "Continue monitoring revenue generation, operating expenditure, profitability, and outstanding receivables.";

  if (profit < 0) {
    managementSignal =
      "Immediate attention is required on profitability. Management should review expenses, pricing, and revenue generation.";
  } else if (
    revenue > 0 &&
    outstandingReceivables > revenue * 0.25
  ) {
    managementSignal =
      "The primary management priority should be converting outstanding receivables into cash and protecting working capital.";
  } else if (
    profitMargin >= 20 &&
    collectionRate >= 90
  ) {
    managementSignal =
      "The business is showing strong financial execution. Management should focus on maintaining margins while scaling revenue.";
  }

  /*
   * -------------------------------------------------------
   * PDF
   * -------------------------------------------------------
   */

  return (
    <Document
      title={report.title}
      author="ArkenOne"
      subject="Executive Financial Report"
      creator="ArkenOne"
    >
      <Page size="A4" style={styles.page}>

        {/* HEADER */}

        <View style={styles.header}>
          <View style={styles.brandRow}>
            <View>
              <Text style={styles.brand}>
                ARKENONE
              </Text>

              <Text style={styles.brandSubtext}>
                FINANCIAL INTELLIGENCE
              </Text>
            </View>

            <Text style={styles.confidential}>
              CONFIDENTIAL
            </Text>
          </View>

          <Text style={styles.reportLabel}>
            Executive Financial Report
          </Text>

          <Text style={styles.title}>
            {report.title}
          </Text>

          <Text style={styles.period}>
            Reporting period:{" "}
            {new Date(
              report.period_start
            ).toLocaleDateString("en-IN")}{" "}
            —{" "}
            {new Date(
              report.period_end
            ).toLocaleDateString("en-IN")}
          </Text>
        </View>

        {/* EXECUTIVE SUMMARY */}

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>
            Executive Summary
          </Text>

          <View style={styles.summary}>
            <View style={styles.summaryAccent} />

            <Text style={styles.summaryText}>
              {executiveSummary}
            </Text>
          </View>
        </View>

        {/* FINANCIAL OVERVIEW */}

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>
            Key Metrics
          </Text>

          <Text style={styles.sectionTitle}>
            Business Performance
          </Text>

          <View style={styles.metricsGrid}>

            <View style={styles.metric}>
              <Text style={styles.metricLabel}>
                Revenue
              </Text>

              <Text
                style={[
                  styles.metricValue,
                  styles.revenueValue,
                ]}
              >
                {formatCurrency(revenue)}
              </Text>
            </View>

            <View style={styles.metric}>
              <Text style={styles.metricLabel}>
                Expenses
              </Text>

              <Text
                style={[
                  styles.metricValue,
                  styles.expenseValue,
                ]}
              >
                {formatCurrency(expenses)}
              </Text>
            </View>

            <View style={styles.metric}>
              <Text style={styles.metricLabel}>
                Net Profit
              </Text>

              <Text
                style={[
                  styles.metricValue,
                  styles.profitValue,
                ]}
              >
                {formatCurrency(profit)}
              </Text>
            </View>

            <View style={styles.metric}>
              <Text style={styles.metricLabel}>
                Profit Margin
              </Text>

              <Text
                style={[
                  styles.metricValue,
                  styles.marginValue,
                ]}
              >
                {profitMargin.toFixed(1)}%
              </Text>
            </View>

          </View>
        </View>

        {/* FINANCIAL BREAKDOWN */}

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>
            Financial Breakdown
          </Text>

          <View style={styles.breakdown}>

            <View style={styles.breakdownHeader}>
              <Text style={styles.breakdownHeaderText}>
                Performance Metric
              </Text>

              <Text style={styles.breakdownHeaderText}>
                Amount
              </Text>
            </View>

            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>
                Revenue
              </Text>

              <Text style={styles.breakdownValue}>
                {formatCurrency(revenue)}
              </Text>
            </View>

            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>
                Operating Expenses
              </Text>

              <Text
                style={[
                  styles.breakdownValue,
                  { color: red },
                ]}
              >
                {formatCurrency(expenses)}
              </Text>
            </View>

            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>
                Net Profit
              </Text>

              <Text
                style={[
                  styles.breakdownValue,
                  { color: green },
                ]}
              >
                {formatCurrency(profit)}
              </Text>
            </View>

            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>
                Profit Margin
              </Text>

              <Text
                style={[
                  styles.breakdownValue,
                  { color: gold },
                ]}
              >
                {profitMargin.toFixed(1)}%
              </Text>
            </View>

            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>
                Collected Revenue
              </Text>

              <Text style={styles.breakdownValue}>
                {formatCurrency(collected)}
              </Text>
            </View>

            <View
              style={[
                styles.breakdownRow,
                { borderBottomWidth: 0 },
              ]}
            >
              <Text style={styles.breakdownLabel}>
                Collection Rate
              </Text>

              <Text style={styles.breakdownValue}>
                {collectionRate.toFixed(1)}%
              </Text>
            </View>

          </View>
        </View>

        {/* LIQUIDITY */}

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>
            Liquidity
          </Text>

          <Text style={styles.sectionTitle}>
            Outstanding Receivables
          </Text>

          <View style={styles.receivableBox}>
            <Text style={styles.metricLabel}>
              RECEIVABLES OUTSTANDING
            </Text>

            <Text style={styles.receivableValue}>
              {formatCurrency(
                outstandingReceivables
              )}
            </Text>
          </View>
        </View>

        {/* ARKENONE INTELLIGENCE */}

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>
            ArkenOne Intelligence
          </Text>

          <Text style={styles.sectionTitle}>
            Financial Signals
          </Text>

          <View style={styles.intelligenceGrid}>

            {/* STRENGTHS */}

            <View
              style={[
                styles.intelligenceCard,
                styles.strengthCard,
              ]}
            >
              <Text style={styles.intelligenceTitle}>
                Strengths
              </Text>

              {strengths.map(
                (item, index) => (
                  <Text
                    key={`strength-${index}`}
                    style={styles.intelligenceItem}
                  >
                    • {item}
                  </Text>
                )
              )}
            </View>

            {/* RISKS */}

            <View
              style={[
                styles.intelligenceCard,
                styles.riskCard,
              ]}
            >
              <Text style={styles.intelligenceTitle}>
                Risks
              </Text>

              {risks.map(
                (item, index) => (
                  <Text
                    key={`risk-${index}`}
                    style={styles.intelligenceItem}
                  >
                    • {item}
                  </Text>
                )
              )}
            </View>

            {/* RECOMMENDATIONS */}

            <View
              style={[
                styles.intelligenceCard,
                styles.recommendationCard,
              ]}
            >
              <Text style={styles.intelligenceTitle}>
                Recommendations
              </Text>

              {recommendations.map(
                (item, index) => (
                  <Text
                    key={`recommendation-${index}`}
                    style={styles.intelligenceItem}
                  >
                    • {item}
                  </Text>
                )
              )}
            </View>

          </View>
        </View>

        {/* MANAGEMENT SIGNAL */}

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>
            Management Signal
          </Text>

          <View style={styles.signalBox}>
            <Text style={styles.signalTitle}>
              What management should watch
            </Text>

            <Text style={styles.signalText}>
              {managementSignal}
            </Text>
          </View>
        </View>

        {/* FOOTER */}

        <View
          style={styles.footer}
          fixed
        >
          <Text style={styles.footerText}>
            ARKENONE · EXECUTIVE FINANCIAL INTELLIGENCE
          </Text>

          <Text
            style={styles.pageNumber}
            render={({
              pageNumber,
              totalPages,
            }) =>
              `PAGE ${pageNumber} / ${totalPages}`
            }
          />
        </View>

      </Page>
    </Document>
  );
}