import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import crypto from "crypto";

import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/server/supabase";

type ImportedCustomer = {
  customer_name: string;
  business_name: string;
  email: string;
  phone: string;
  gst_number: string;
  address: string;
};

type ImportedInvoice = {
  customer: ImportedCustomer;
  invoiceNumber: string;
  invoiceDate: string | null;
  dueDate: string | null;
  total: number;
  amountPaid: number;
  paymentDate: string | null;
  paymentMethod: string;
  paymentReference: string;
  notes: string;
};

type ImportedRow = {
  customer: ImportedCustomer;
  revenue: number;
  invoice: ImportedInvoice | null;
};

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_ROWS = 5000;

const ALLOWED_PAYMENT_METHODS = [
  "upi",
  "bank_transfer",
  "cash",
  "other",
] as const;

function cleanString(value: unknown): string {
  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  return String(value).trim();
}

function normalizeHeader(value: unknown): string {
  return cleanString(value)
    .toLowerCase()
    .replace(/[\s_-]+/g, "")
    .replace(/[^\w]/g, "");
}

function findValue(
  row: Record<string, unknown>,
  possibleHeaders: string[]
): string {
  const targets =
    possibleHeaders.map(normalizeHeader);

  for (
    const [key, value] of Object.entries(row)
  ) {
    if (
      targets.includes(
        normalizeHeader(key)
      )
    ) {
      return cleanString(value);
    }
  }

  return "";
}

function findNumericValue(
  row: Record<string, unknown>,
  possibleHeaders: string[]
): number {
  const value = findValue(
    row,
    possibleHeaders
  );

  return parseAmount(value);
}

function parseAmount(
  value: unknown
): number {
  if (
    value === null ||
    value === undefined
  ) {
    return 0;
  }

  if (
    typeof value === "number" &&
    Number.isFinite(value)
  ) {
    return Math.max(
      Number(value),
      0
    );
  }

  const cleaned =
    String(value)
      .trim()
      .replace(/₹/g, "")
      .replace(/INR/gi, "")
      .replace(/Rs\.?/gi, "")
      .replace(/,/g, "")
      .replace(/\s/g, "");

  if (!cleaned) {
    return 0;
  }

  const parsed =
    Number(cleaned);

  if (
    !Number.isFinite(parsed)
  ) {
    return 0;
  }

  return Math.max(
    parsed,
    0
  );
}

function normalizePhone(
  value: string
): string {
  return value.replace(
    /\D/g,
    ""
  );
}

function normalizeEmail(
  value: string
): string {
  return value
    .trim()
    .toLowerCase();
}

function normalizeName(
  value: string
): string {
  return value
    .trim()
    .toLowerCase()
    .replace(
      /\s+/g,
      " "
    );
}

function createNameKey(
  customer: ImportedCustomer
): string {
  return `${normalizeName(
    customer.customer_name
  )}|${normalizeName(
    customer.business_name
  )}`;
}

function isMeaningfulCustomer(
  customer: ImportedCustomer
): boolean {
  return Boolean(
    customer.customer_name ||
      customer.business_name ||
      customer.phone ||
      customer.email
  );
}

function parseDate(
  value: unknown
): string | null {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  if (
    value instanceof Date &&
    !Number.isNaN(
      value.getTime()
    )
  ) {
    return value
      .toISOString()
      .slice(0, 10);
  }

  const raw =
    String(value).trim();

  if (!raw) {
    return null;
  }

  if (
    /^\d+(\.\d+)?$/.test(raw)
  ) {
    const serial =
      Number(raw);

    if (
      serial > 20000 &&
      serial < 100000
    ) {
      const date =
        XLSX.SSF.parse_date_code(
          serial
        );

      if (date) {
        const month =
          String(
            date.m
          ).padStart(2, "0");

        const day =
          String(
            date.d
          ).padStart(2, "0");

        return `${date.y}-${month}-${day}`;
      }
    }
  }

  const isoMatch =
    raw.match(
      /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/
    );

  if (isoMatch) {
    const year =
      Number(
        isoMatch[1]
      );

    const month =
      String(
        Number(
          isoMatch[2]
        )
      ).padStart(2, "0");

    const day =
      String(
        Number(
          isoMatch[3]
        )
      ).padStart(2, "0");

    const date =
      new Date(
        `${year}-${month}-${day}T12:00:00`
      );

    if (
      !Number.isNaN(
        date.getTime()
      )
    ) {
      return `${year}-${month}-${day}`;
    }
  }

  const indianMatch =
    raw.match(
      /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/
    );

  if (indianMatch) {
    const day =
      Number(
        indianMatch[1]
      );

    const month =
      Number(
        indianMatch[2]
      );

    const year =
      Number(
        indianMatch[3]
      );

    const date =
      new Date(
        `${year}-${String(
          month
        ).padStart(
          2,
          "0"
        )}-${String(
          day
        ).padStart(
          2,
          "0"
        )}T12:00:00`
      );

    if (
      !Number.isNaN(
        date.getTime()
      )
    ) {
      return `${year}-${String(
        month
      ).padStart(
        2,
        "0"
      )}-${String(
        day
      ).padStart(
        2,
        "0"
      )}`;
    }
  }

  const parsed =
    new Date(raw);

  if (
    !Number.isNaN(
      parsed.getTime()
    )
  ) {
    return parsed
      .toISOString()
      .slice(0, 10);
  }

  return null;
}

function normalizePaymentMethod(
  value: string
): string {
  const normalized =
    value
      .trim()
      .toLowerCase()
      .replace(
        /[\s-]+/g,
        "_"
      );

  if (
    normalized === "upi" ||
    normalized === "phonepe" ||
    normalized === "gpay" ||
    normalized === "googlepay"
  ) {
    return "upi";
  }

  if (
    normalized === "bank" ||
    normalized === "bank_transfer" ||
    normalized === "banktransfer" ||
    normalized === "neft" ||
    normalized === "rtgs" ||
    normalized === "imps"
  ) {
    return "bank_transfer";
  }

  if (
    normalized === "cash"
  ) {
    return "cash";
  }

  return "other";
}

function generateInvoiceNumber(
  year: number,
  sequence: number
): string {
  return `INV-${year}-${String(
    sequence
  ).padStart(
    2,
    "0"
  )}`;
}

function generatePaymentReference(
  paymentMethod: string
): string {
  return `IMPORT-${paymentMethod.toUpperCase()}-${Date.now()}-${crypto
    .randomBytes(3)
    .toString("hex")
    .toUpperCase()}`;
}

function mapCustomerRow(
  row: Record<string, unknown>
): ImportedCustomer {
  const customerName =
    findValue(
      row,
      [
        "customer name",
        "customer",
        "name",
        "client name",
        "client",
        "full name",
        "customer_name",
      ]
    );

  const businessName =
    findValue(
      row,
      [
        "business name",
        "company name",
        "company",
        "business",
        "organization",
        "organisation",
        "business_name",
      ]
    );

  const email =
    findValue(
      row,
      [
        "email",
        "email address",
        "email id",
        "mail",
        "email_address",
      ]
    );

  const phone =
    findValue(
      row,
      [
        "phone",
        "phone number",
        "mobile",
        "mobile number",
        "contact",
        "contact number",
        "whatsapp",
        "phone_number",
      ]
    );

  const gstNumber =
    findValue(
      row,
      [
        "gst",
        "gstin",
        "gst number",
        "gst no",
        "gstin number",
        "gst_number",
      ]
    );

  const address =
    findValue(
      row,
      [
        "address",
        "billing address",
        "customer address",
        "location",
        "billing_address",
      ]
    );

  return {
    customer_name:
      customerName ||
      businessName,

    business_name:
      businessName,

    email,

    phone,

    gst_number:
      gstNumber,

    address,
  };
}

function mapImportedRow(
  row: Record<string, unknown>
): ImportedRow {
  const customer =
    mapCustomerRow(row);

  const revenue =
    findNumericValue(
      row,
      [
        "revenue",
        "revenue amount",
        "recorded revenue",
        "historical revenue",
        "sales",
        "sales amount",
        "income",
        "income amount",
        "total revenue",
        "revenue (inr)",
        "revenue inr",
        "recorded revenue (inr)",
      ]
    );

  const invoiceNumber =
    findValue(
      row,
      [
        "invoice number",
        "invoice no",
        "invoice #",
        "invoice",
        "invoice id",
        "invoice_number",
      ]
    );

  const invoiceTotal =
    findNumericValue(
      row,
      [
        "invoice total",
        "invoice amount",
        "invoice value",
        "invoice total amount",
        "total invoice",
        "total",
        "invoice total (inr)",
        "invoice amount (inr)",
        "invoice_total",
      ]
    );

  const amountPaid =
    findNumericValue(
      row,
      [
        "amount paid",
        "paid amount",
        "payment amount",
        "amount received",
        "received amount",
        "paid",
        "amount_paid",
      ]
    );

  const invoiceDate =
    parseDate(
      findValue(
        row,
        [
          "invoice date",
          "invoice_date",
          "date",
          "bill date",
          "billing date",
        ]
      )
    );

  const dueDate =
    parseDate(
      findValue(
        row,
        [
          "due date",
          "due_date",
          "payment due date",
          "invoice due date",
        ]
      )
    );

  const paymentDate =
    parseDate(
      findValue(
        row,
        [
          "payment date",
          "payment_date",
          "paid date",
          "received date",
          "date paid",
        ]
      )
    );

  const paymentMethod =
    normalizePaymentMethod(
      findValue(
        row,
        [
          "payment method",
          "payment_method",
          "method",
          "mode",
          "payment mode",
        ]
      )
    );

  const paymentReference =
    findValue(
      row,
      [
        "payment reference",
        "payment_reference",
        "reference",
        "utr",
        "utr number",
        "transaction id",
        "transaction reference",
        "transaction number",
      ]
    );

  const notes =
    findValue(
      row,
      [
        "invoice notes",
        "invoice note",
        "notes",
        "note",
        "description",
      ]
    );

  const hasInvoiceData =
    Boolean(
      invoiceNumber ||
        invoiceTotal > 0 ||
        amountPaid > 0 ||
        invoiceDate ||
        dueDate
    );

  let invoice:
    ImportedInvoice | null =
    null;

  if (hasInvoiceData) {
    const safeTotal =
      invoiceTotal > 0
        ? invoiceTotal
        : revenue > 0
        ? revenue
        : amountPaid;

    invoice = {
      customer,

      invoiceNumber,

      invoiceDate,

      dueDate,

      total:
        safeTotal,

      amountPaid:
        Math.min(
          amountPaid,
          safeTotal
        ),

      paymentDate,

      paymentMethod,

      paymentReference,

      notes,
    };
  }

  return {
    customer,

    revenue,

    invoice,
  };
}

function addUniqueError(
  errors: string[],
  message: string
) {
  if (
    !errors.includes(
      message
    )
  ) {
    errors.push(
      message
    );
  }
}

export async function POST(
  request: NextRequest
) {
  try {
    /*
     * =========================================================
     * 1. AUTHENTICATION
     * =========================================================
     */

    const supabase =
      await createClient();

    const {
      data: { user },
      error: authError,
    } =
      await supabase.auth.getUser();

    if (authError) {
      console.error(
        "[CustomerImport] Auth error:",
        authError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to verify your account.",
        },
        {
          status: 401,
        }
      );
    }

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error:
            "You must be signed in to import customers.",
        },
        {
          status: 401,
        }
      );
    }

    /*
     * =========================================================
     * 2. READ FILE
     * =========================================================
     */

    const formData =
      await request.formData();

    const file =
      formData.get(
        "file"
      );

    if (
      !(file instanceof File)
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Please select a customer file.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      file.size <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "The uploaded file is empty.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      file.size >
      MAX_FILE_SIZE
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "The file must be smaller than 10 MB.",
        },
        {
          status: 400,
        }
      );
    }

    const fileName =
      file.name.toLowerCase();

    const isSpreadsheet =
      fileName.endsWith(
        ".csv"
      ) ||
      fileName.endsWith(
        ".xlsx"
      ) ||
      fileName.endsWith(
        ".xls"
      );

    if (!isSpreadsheet) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Photo import is not connected yet. Please use CSV or Excel for now.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * =========================================================
     * 3. PARSE WORKBOOK
     * =========================================================
     */

    const buffer =
      await file.arrayBuffer();

    const workbook =
      XLSX.read(
        buffer,
        {
          type: "array",
          cellDates: true,
        }
      );

    if (
      !workbook.SheetNames.length
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "No worksheet was found in the uploaded file.",
        },
        {
          status: 400,
        }
      );
    }

    const worksheet =
      workbook.Sheets[
        workbook.SheetNames[0]
      ];

    if (!worksheet) {
      return NextResponse.json(
        {
          success: false,
          error:
            "The uploaded worksheet could not be read.",
        },
        {
          status: 400,
        }
      );
    }

    const rows =
      XLSX.utils.sheet_to_json<
        Record<
          string,
          unknown
        >
      >(
        worksheet,
        {
          defval: "",
          raw: false,
        }
      );

    if (
      !rows.length
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "No customer rows were found in the uploaded file.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      rows.length >
      MAX_ROWS
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            `The file contains ${rows.length.toLocaleString(
              "en-IN"
            )} rows. Please keep imports below ${MAX_ROWS.toLocaleString(
              "en-IN"
            )} rows.`,
        },
        {
          status: 400,
        }
      );
    }

    /*
     * =========================================================
     * 4. MAP EXCEL ROWS
     * =========================================================
     */

    const importedRows:
      ImportedRow[] =
      [];

    const uploadPhones =
      new Set<string>();

    const uploadEmails =
      new Set<string>();

    const uploadNames =
      new Set<string>();

    let skipped =
      0;

    const errors:
      string[] =
      [];

    rows.forEach(
      (
        row,
        index
      ) => {
        const rowNumber =
          index + 2;

        const mapped =
          mapImportedRow(
            row
          );

        const customer =
          mapped.customer;

        if (
          !isMeaningfulCustomer(
            customer
          )
        ) {
          if (
            mapped.revenue >
              0 &&
            !mapped.invoice
          ) {
            importedRows.push(
              mapped
            );

            return;
          }

          skipped++;

          return;
        }

        if (
          !customer.customer_name
        ) {
          skipped++;

          addUniqueError(
            errors,
            `Row ${rowNumber}: Customer name is missing.`
          );

          return;
        }

        const phone =
          normalizePhone(
            customer.phone
          );

        const email =
          normalizeEmail(
            customer.email
          );

        const nameKey =
          createNameKey(
            customer
          );

        /*
         * IMPORTANT:
         *
         * A customer can legitimately
         * appear on multiple rows when
         * those rows contain different
         * invoices.
         *
         * Therefore we only reject a
         * duplicate customer row when
         * there is no invoice/financial
         * information attached.
         */

        const duplicate =
          (phone &&
            uploadPhones.has(
              phone
            )) ||
          (email &&
            uploadEmails.has(
              email
            )) ||
          uploadNames.has(
            nameKey
          );

        if (
          duplicate &&
          !mapped.invoice &&
          mapped.revenue <=
            0
        ) {
          skipped++;

          addUniqueError(
            errors,
            `Row ${rowNumber}: Duplicate customer in uploaded file.`
          );

          return;
        }

        if (phone) {
          uploadPhones.add(
            phone
          );
        }

        if (email) {
          uploadEmails.add(
            email
          );
        }

        uploadNames.add(
          nameKey
        );

        importedRows.push(
          mapped
        );
      }
    );

    if (
      !importedRows.length
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "No valid customers or financial records were found in the uploaded file.",
          imported: 0,
          skipped,
          errors,
        },
        {
          status: 400,
        }
      );
    }

    /*
     * =========================================================
     * 5. FIND COMPANY
     * =========================================================
     */

    const {
      data: company,
      error: companyError,
    } =
      await supabaseAdmin
        .from(
          "companies"
        )
        .select(
          "id, owner_id, starting_revenue"
        )
        .eq(
          "owner_id",
          user.id
        )
        .maybeSingle();

    if (
      companyError
    ) {
      console.error(
        "[CustomerImport] Company lookup error:",
        companyError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to load your company profile.",
        },
        {
          status: 500,
        }
      );
    }

    if (!company) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Company profile not found. Please complete onboarding first.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * =========================================================
     * 6. FIND EXISTING CUSTOMERS
     * =========================================================
     */

    const {
      data: existingCustomers,
      error:
        existingCustomersError,
    } =
      await supabaseAdmin
        .from(
          "customers"
        )
        .select(
          "id, customer_name, business_name, email, phone"
        )
        .eq(
          "owner_id",
          user.id
        );

    if (
      existingCustomersError
    ) {
      console.error(
        "[CustomerImport] Existing customer lookup error:",
        existingCustomersError
      );

      throw existingCustomersError;
    }

    const existingPhones =
      new Set<string>();

    const existingEmails =
      new Set<string>();

    const existingNames =
      new Set<string>();

    const existingCustomerIds =
      new Map<
        string,
        string | number
      >();

    for (
      const customer of
        existingCustomers ??
        []
    ) {
      const phone =
        normalizePhone(
          cleanString(
            customer.phone
          )
        );

      const email =
        normalizeEmail(
          cleanString(
            customer.email
          )
        );

      const nameKey =
        `${normalizeName(
          cleanString(
            customer.customer_name
          )
        )}|${normalizeName(
          cleanString(
            customer.business_name
          )
        )}`;

      if (phone) {
        existingPhones.add(
          phone
        );

        existingCustomerIds.set(
          `phone:${phone}`,
          customer.id
        );
      }

      if (email) {
        existingEmails.add(
          email
        );

        existingCustomerIds.set(
          `email:${email}`,
          customer.id
        );
      }

      existingNames.add(
        nameKey
      );

      existingCustomerIds.set(
        `name:${nameKey}`,
        customer.id
      );
    }

    /*
     * =========================================================
     * 7. PREPARE CUSTOMER INSERTS
     * =========================================================
     */

    const customersToInsert:
      Array<{
        index: number;
        customer: ImportedCustomer;
      }> =
      [];

    const customerIdByIndex =
      new Map<
        number,
        string | number
      >();

    let customersImported =
      0;

    let customersExisting =
      0;

    for (
      let index = 0;
      index <
      importedRows.length;
      index++
    ) {
      const imported =
        importedRows[index];

      const customer =
        imported.customer;

      if (
        !isMeaningfulCustomer(
          customer
        )
      ) {
        continue;
      }

      const phone =
        normalizePhone(
          customer.phone
        );

      const email =
        normalizeEmail(
          customer.email
        );

      const nameKey =
        createNameKey(
          customer
        );

      let existingId:
        | string
        | number
        | undefined;

      if (
        phone &&
        existingPhones.has(
          phone
        )
      ) {
        existingId =
          existingCustomerIds.get(
            `phone:${phone}`
          );
      }

      if (
        !existingId &&
        email &&
        existingEmails.has(
          email
        )
      ) {
        existingId =
          existingCustomerIds.get(
            `email:${email}`
          );
      }

      if (
        !existingId &&
        existingNames.has(
          nameKey
        )
      ) {
        existingId =
          existingCustomerIds.get(
            `name:${nameKey}`
          );
      }

      if (
        existingId !==
        undefined
      ) {
        customerIdByIndex.set(
          index,
          existingId
        );

        customersExisting++;

        continue;
      }

      customersToInsert.push({
        index,
        customer,
      });

      /*
       * Reserve identity so the
       * same customer is not inserted
       * twice during this upload.
       */
      if (phone) {
        existingPhones.add(
          phone
        );
      }

      if (email) {
        existingEmails.add(
          email
        );
      }

      existingNames.add(
        nameKey
      );
    }

    /*
     * =========================================================
     * 8. INSERT NEW CUSTOMERS
     * =========================================================
     */

    const insertedCustomerIds:
      Array<
        string | number
      > =
      [];

    if (
      customersToInsert.length >
      0
    ) {
      const insertPayload =
        customersToInsert.map(
          ({
            customer,
          }) => ({
            owner_id:
              user.id,

            customer_name:
              customer.customer_name,

            business_name:
              customer.business_name ||
              null,

            email:
              customer.email ||
              null,

            phone:
              customer.phone ||
              null,

            gst_number:
              customer.gst_number ||
              null,

            address:
              customer.address ||
              null,
          })
        );

      const {
        data:
          insertedCustomers,
        error:
          insertError,
      } =
        await supabaseAdmin
          .from(
            "customers"
          )
          .insert(
            insertPayload
          )
          .select(
            "id, owner_id, customer_name, business_name, email, phone, gst_number, address, created_at"
          );

      if (
        insertError
      ) {
        console.error(
          "[CustomerImport] Customer insert error:",
          insertError
        );

        throw insertError;
      }

      for (
        let i = 0;
        i <
        (
          insertedCustomers
            ?.length ??
          0
        );
        i++
      ) {
        const inserted =
          insertedCustomers[
            i
          ];

        const source =
          customersToInsert[
            i
          ];

        if (
          !source
        ) {
          continue;
        }

        customerIdByIndex.set(
          source.index,
          inserted.id
        );

        insertedCustomerIds.push(
          inserted.id
        );
      }

      customersImported =
        insertedCustomers?.length ??
        0;
    }

    /*
     * =========================================================
     * 9. FIND NEXT INVOICE NUMBER
     * =========================================================
     */

    const currentYear =
      new Date().getFullYear();

    const {
      data:
        existingInvoices,
      error:
        invoiceNumberError,
    } =
      await supabaseAdmin
        .from(
          "invoices"
        )
        .select(
          "invoice_number"
        )
        .eq(
          "owner_id",
          user.id
        )
        .like(
          "invoice_number",
          `INV-${currentYear}-%`
        )
        .order(
          "created_at",
          {
            ascending:
              false,
          }
        )
        .limit(5000);

    if (
      invoiceNumberError
    ) {
      console.error(
        "[CustomerImport] Invoice number lookup error:",
        invoiceNumberError
      );

      throw invoiceNumberError;
    }

    let nextInvoiceSequence =
      1;

    for (
      const invoice of
        existingInvoices ??
        []
    ) {
      const parts =
        String(
          invoice.invoice_number ??
            ""
        ).split(
          "-"
        );

      const lastNumber =
        Number(
          parts.at(-1)
        );

      if (
        Number.isFinite(
          lastNumber
        ) &&
        lastNumber >=
          nextInvoiceSequence
      ) {
        nextInvoiceSequence =
          lastNumber + 1;
      }
    }

    /*
     * =========================================================
     * 10. PREPARE INVOICES
     * =========================================================
     */

    const invoiceRows:
      Array<{
        sourceIndex: number;
        customerId:
          | string
          | number;
        invoice:
          ImportedInvoice;
      }> =
      [];

    const invoiceNumbersInUpload =
      new Set<string>();

    let invoicesImported =
      0;

    let paymentsImported =
      0;

    let invoiceRevenue =
      0;

    let historicalRevenue =
      0;

    for (
      let index = 0;
      index <
      importedRows.length;
      index++
    ) {
      const imported =
        importedRows[index];

      /*
       * Invoice data takes priority
       * over generic revenue.
       */
      if (
        imported.invoice
      ) {
        const customerId =
          customerIdByIndex.get(
            index
          );

        if (
          customerId ===
          undefined
        ) {
          addUniqueError(
            errors,
            `Row ${
              index + 2
            }: Customer could not be linked to the imported invoice.`
          );

          continue;
        }

        const invoice =
          imported.invoice;

        let invoiceNumber =
          invoice.invoiceNumber;

        if (
          invoiceNumber
        ) {
          const normalized =
            invoiceNumber
              .trim()
              .toLowerCase();

          if (
            invoiceNumbersInUpload.has(
              normalized
            )
          ) {
            addUniqueError(
              errors,
              `Row ${
                index + 2
              }: Duplicate invoice number "${invoiceNumber}" in the uploaded file.`
            );

            continue;
          }

          invoiceNumbersInUpload.add(
            normalized
          );
        } else {
          invoiceNumber =
            generateInvoiceNumber(
              currentYear,
              nextInvoiceSequence
            );

          nextInvoiceSequence++;

          invoiceNumbersInUpload.add(
            invoiceNumber.toLowerCase()
          );
        }

        if (
          invoice.total <=
          0
        ) {
          addUniqueError(
            errors,
            `Row ${
              index + 2
            }: Invoice exists but no valid invoice total was found.`
          );

          continue;
        }

        const safeAmountPaid =
          Math.min(
            Math.max(
              invoice.amountPaid,
              0
            ),
            invoice.total
          );

        invoiceRows.push({
          sourceIndex:
            index,

          customerId,

          invoice: {
            ...invoice,

            invoiceNumber,

            amountPaid:
              safeAmountPaid,
          },
        });

        invoiceRevenue +=
          invoice.total;

        invoicesImported++;

        if (
          safeAmountPaid >
          0
        ) {
          paymentsImported++;
        }

        continue;
      }

      /*
       * No invoice:
       *
       * treat the amount as historical
       * company revenue.
       */
      if (
        imported.revenue >
        0
      ) {
        historicalRevenue +=
          imported.revenue;
      }
    }

    /*
     * =========================================================
     * 11. INSERT INVOICES
     * =========================================================
     */

    const insertedInvoices:
      Array<{
        id:
          | string
          | number;
        sourceIndex:
          number;
        total:
          number;
        amountPaid:
          number;
      }> =
      [];

    if (
      invoiceRows.length >
      0
    ) {
      const invoicePayload =
        invoiceRows.map(
          ({
            customerId,
            invoice,
          }) => {
            const amountPaid =
              invoice.amountPaid;

            const balanceDue =
              Math.max(
                invoice.total -
                  amountPaid,
                0
              );

            const status =
              balanceDue <=
              0.01
                ? "Paid"
                : amountPaid >
                  0
                ? "Partially Paid"
                : "Pending";

            return {
              owner_id:
                user.id,

              customer_id:
                customerId,

              invoice_number:
                invoice.invoiceNumber,

              invoice_date:
                invoice.invoiceDate ??
                new Date()
                  .toISOString()
                  .slice(
                    0,
                    10
                  ),

              due_date:
                invoice.dueDate,

              total:
                invoice.total,

              amount_paid:
                amountPaid,

              balance_due:
                balanceDue,

              status,

              notes:
                invoice.notes ||
                null,
            };
          }
        );

      const {
        data:
          insertedInvoicesData,
        error:
          invoiceInsertError,
      } =
        await supabaseAdmin
          .from(
            "invoices"
          )
          .insert(
            invoicePayload
          )
          .select(
            "id, invoice_number, total, amount_paid, balance_due, status"
          );

      if (
        invoiceInsertError
      ) {
        console.error(
          "[CustomerImport] Invoice insert error:",
          invoiceInsertError
        );

        throw invoiceInsertError;
      }

      for (
        let i = 0;
        i <
        (
          insertedInvoicesData
            ?.length ??
          0
        );
        i++
      ) {
        const inserted =
          insertedInvoicesData[
            i
          ];

        const source =
          invoiceRows[i];

        if (
          !source
        ) {
          continue;
        }

        insertedInvoices.push({
          id:
            inserted.id,

          sourceIndex:
            source.sourceIndex,

          total:
            Number(
              inserted.total ??
                0
            ),

          amountPaid:
            Number(
              inserted.amount_paid ??
                0
            ),
        });
      }
    }

    /*
     * =========================================================
     * 12. INSERT PAYMENTS
     * =========================================================
     */

    const paymentPayload:
      Array<
        Record<
          string,
          unknown
        >
      > =
      [];

    for (
      const inserted of
        insertedInvoices
    ) {
      if (
        inserted.amountPaid <=
        0
      ) {
        continue;
      }

      const source =
        invoiceRows.find(
          (
            row
          ) =>
            row.sourceIndex ===
            inserted.sourceIndex
        );

      if (
        !source
      ) {
        continue;
      }

      const invoice =
        source.invoice;

      const paymentMethod =
        ALLOWED_PAYMENT_METHODS.includes(
          invoice.paymentMethod as
            (typeof ALLOWED_PAYMENT_METHODS)[number]
        )
          ? invoice.paymentMethod
          : "other";

      const paymentReference =
        invoice.paymentReference ||
        generatePaymentReference(
          paymentMethod
        );

      paymentPayload.push({
        invoice_id:
          inserted.id,

        owner_id:
          user.id,

        amount:
          inserted.amountPaid,

        payment_method:
          paymentMethod,

        payment_reference:
          paymentReference,

        payment_status:
          "completed",

        paid_at:
          invoice.paymentDate
            ? new Date(
                `${invoice.paymentDate}T12:00:00`
              ).toISOString()
            : new Date().toISOString(),
      });
    }

    if (
      paymentPayload.length >
      0
    ) {
      const {
        error:
          paymentInsertError,
      } =
        await supabaseAdmin
          .from(
            "payments"
          )
          .insert(
            paymentPayload
          );

      if (
        paymentInsertError
      ) {
        console.error(
          "[CustomerImport] Payment insert error:",
          paymentInsertError
        );

        const insertedInvoiceIds =
          insertedInvoices.map(
            (
              invoice
            ) =>
              invoice.id
          );

        if (
          insertedInvoiceIds.length >
          0
        ) {
          await supabaseAdmin
            .from(
              "invoices"
            )
            .delete()
            .in(
              "id",
              insertedInvoiceIds
            )
            .eq(
              "owner_id",
              user.id
            );
        }

        throw paymentInsertError;
      }
    }

    /*
     * =========================================================
     * 13. UPDATE HISTORICAL REVENUE
     * =========================================================
     *
     * Invoice revenue is NOT added here.
     *
     * Only revenue that has no invoice
     * is added to starting_revenue.
     */

    let revenueAddedToCompany =
      0;

    if (
      historicalRevenue >
      0
    ) {
      const currentStartingRevenue =
        Number(
          company.starting_revenue ??
            0
        );

      const newStartingRevenue =
        currentStartingRevenue +
        historicalRevenue;

      const {
        error:
          revenueUpdateError,
      } =
        await supabaseAdmin
          .from(
            "companies"
          )
          .update({
            starting_revenue:
              newStartingRevenue,
          })
          .eq(
            "id",
            company.id
          )
          .eq(
            "owner_id",
            user.id
          );

      if (
        revenueUpdateError
      ) {
        console.error(
          "[CustomerImport] Starting revenue update error:",
          revenueUpdateError
        );

        throw revenueUpdateError;
      }

      revenueAddedToCompany =
        historicalRevenue;
    }

    /*
     * =========================================================
     * 14. REVALIDATE APPLICATION
     * =========================================================
     */

    try {
      const {
        revalidatePath,
      } = await import(
        "next/cache"
      );

      revalidatePath(
        "/dashboard"
      );

      revalidatePath(
        "/customers"
      );

      revalidatePath(
        "/invoices"
      );

      revalidatePath(
        "/payments"
      );

      revalidatePath(
        "/reports"
      );
    } catch (
      revalidationError
    ) {
      console.error(
        "[CustomerImport] Revalidation error:",
        revalidationError
      );
    }

    /*
     * =========================================================
     * 15. SUCCESS RESPONSE
     * =========================================================
     */

    return NextResponse.json({
      success: true,

      imported:
        customersImported,

      customersImported:
        customersImported,

      customersExisting:
        customersExisting,

      invoicesImported:
        invoicesImported,

      paymentsImported:
        paymentsImported,

      historicalRevenueAdded:
        revenueAddedToCompany,

      invoiceRevenueImported:
        invoiceRevenue,

      skipped,

      errors,

      customers:
        insertedCustomerIds,

      message:
        `Import completed: ${customersImported.toLocaleString(
          "en-IN"
        )} new customers, ${invoicesImported.toLocaleString(
          "en-IN"
        )} invoices, ${paymentsImported.toLocaleString(
          "en-IN"
        )} payments and ₹${revenueAddedToCompany.toLocaleString(
          "en-IN"
        )} historical revenue processed.`,
    });
  } catch (
    error: unknown
  ) {
    console.error(
      "========== CUSTOMER / FINANCIAL IMPORT ERROR =========="
    );

    console.error(
      error
    );

    return NextResponse.json(
      {
        success: false,

        error:
          error instanceof Error
            ? error.message
            : "Unable to import financial data.",
      },
      {
        status: 500,
      }
    );
  }
}