import {
  REPORT_GENERATORS,
} from "./registry";

import {
  ReportResult,
  ReportType,
} from "./types";

interface GenerateReportOptions {
  type: ReportType;

  ownerId: string;

  start: Date;

  end: Date;
}

export async function generateReport({
  type,
  ownerId,
  start,
  end,
}: GenerateReportOptions): Promise<ReportResult> {
  const generator =
    REPORT_GENERATORS[type];

  if (!generator) {
    throw new Error(
      `Report "${type}" is not implemented yet.`
    );
  }

  return generator({
    ownerId,
    start,
    end,
  });
}