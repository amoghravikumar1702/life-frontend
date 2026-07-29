import {
  Forecast,
} from "@/lib/cfo/types";

export function forecastPrompt(
  forecast: Forecast
) {
  return `
You are analysing
future financial performance.

Use ONLY supplied forecast.

Forecast

${JSON.stringify(forecast, null, 2)}

Return JSON.

{
  "forecastSummary":"",

  "confidence":"",

  "next30Days":"",

  "recommendation":""
}
`;
}