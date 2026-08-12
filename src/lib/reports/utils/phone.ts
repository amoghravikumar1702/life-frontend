export interface ParsedPhoneNumber {
  countryCode: string;
  phone: string;
}

const DEFAULT_COUNTRY_CODE = "+91";

const COUNTRY_CODES = [
  "+91",
  "+1",
  "+44",
  "+61",
  "+971",
  "+65",
  "+81",
  "+49",
];

export function parsePhoneNumber(
  value?: string | null
): ParsedPhoneNumber {
  if (!value) {
    return {
      countryCode: DEFAULT_COUNTRY_CODE,
      phone: "",
    };
  }

  const phone = value.trim();

  const matchedCode = COUNTRY_CODES
    .sort((a, b) => b.length - a.length)
    .find((code) => phone.startsWith(code));

  if (!matchedCode) {
    return {
      countryCode: DEFAULT_COUNTRY_CODE,
      phone: phone.replace(/\D/g, ""),
    };
  }

  return {
    countryCode: matchedCode,
    phone: phone
      .slice(matchedCode.length)
      .replace(/\D/g, ""),
  };
}

export function formatPhoneNumber(
  countryCode: string,
  phone: string
) {
  const digits = phone.replace(/\D/g, "");

  if (!digits) return "";

  return `${countryCode}${digits}`;
}