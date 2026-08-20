import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";

import { createClient } from "@/lib/supabase/server";

type ImportedCustomer = {
  customer_name: string;
  business_name: string;
  email: string;
  phone: string;
  gst_number: string;
  address: string;
};

const MAX_FILE_SIZE = 10 * 1024 * 1024;

function cleanString(value: unknown): string {
  if (value === null || value === undefined) {
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
  const targets = possibleHeaders.map(normalizeHeader);

  for (const [key, value] of Object.entries(row)) {
    if (targets.includes(normalizeHeader(key))) {
      return cleanString(value);
    }
  }

  return "";
}

function mapCustomerRow(
  row: Record<string, unknown>
): ImportedCustomer {
  const customerName = findValue(row, [
    "customer name",
    "customer",
    "name",
    "client name",
    "client",
    "full name",
  ]);

  const businessName = findValue(row, [
    "business name",
    "company name",
    "company",
    "business",
    "organization",
    "organisation",
  ]);

  const email = findValue(row, [
    "email",
    "email address",
    "email id",
    "mail",
  ]);

  const phone = findValue(row, [
    "phone",
    "phone number",
    "mobile",
    "mobile number",
    "contact",
    "contact number",
    "whatsapp",
  ]);

  const gstNumber = findValue(row, [
    "gst",
    "gstin",
    "gst number",
    "gst no",
    "gstin number",
  ]);

  const address = findValue(row, [
    "address",
    "billing address",
    "customer address",
    "location",
  ]);

  return {
    customer_name:
      customerName || businessName,
    business_name: businessName,
    email,
    phone,
    gst_number: gstNumber,
    address,
  };
}

function isMeaningfulRow(
  customer: ImportedCustomer
): boolean {
  return Boolean(
    customer.customer_name ||
      customer.business_name ||
      customer.phone ||
      customer.email
  );
}

function normalizePhone(
  value: string
): string {
  return value.replace(/\D/g, "");
}

function normalizeEmail(
  value: string
): string {
  return value.trim().toLowerCase();
}

function normalizeName(
  value: string
): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
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

export async function POST(
  request: NextRequest
) {
  try {
    /*
     * ============================================================
     * AUTH
     * ============================================================
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
        { status: 401 }
      );
    }

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error:
            "You must be signed in to import customers.",
        },
        { status: 401 }
      );
    }

    /*
     * ============================================================
     * FILE
     * ============================================================
     */

    const formData =
      await request.formData();

    const file =
      formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Please select a customer file.",
        },
        { status: 400 }
      );
    }

    if (file.size <= 0) {
      return NextResponse.json(
        {
          success: false,
          error:
            "The uploaded file is empty.",
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error:
            "The file must be smaller than 10 MB.",
        },
        { status: 400 }
      );
    }

    const fileName =
      file.name.toLowerCase();

    const isSpreadsheet =
      fileName.endsWith(".csv") ||
      fileName.endsWith(".xlsx") ||
      fileName.endsWith(".xls");

    /*
     * Photo import intentionally remains
     * separate until OCR processing is added.
     */

    if (!isSpreadsheet) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Photo import is not connected yet. Please use CSV or Excel for now.",
        },
        { status: 400 }
      );
    }

    /*
     * ============================================================
     * PARSE SPREADSHEET
     * ============================================================
     */

    const buffer =
      await file.arrayBuffer();

    const workbook =
      XLSX.read(buffer, {
        type: "array",
        cellDates: true,
      });

    if (
      !workbook.SheetNames.length
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "No worksheet was found in the uploaded file.",
        },
        { status: 400 }
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
        { status: 400 }
      );
    }

    const rows =
      XLSX.utils.sheet_to_json<
        Record<string, unknown>
      >(worksheet, {
        defval: "",
        raw: false,
      });

    if (!rows.length) {
      return NextResponse.json(
        {
          success: false,
          error:
            "No customer rows were found in the file.",
        },
        { status: 400 }
      );
    }

    /*
     * ============================================================
     * MAP + DEDUPLICATE UPLOAD
     * ============================================================
     */

    const customers: ImportedCustomer[] =
      [];

    const uploadPhones =
      new Set<string>();

    const uploadEmails =
      new Set<string>();

    const uploadNames =
      new Set<string>();

    let skipped = 0;

    const errors: string[] = [];

    rows.forEach(
      (row, index) => {
        const rowNumber =
          index + 2;

        const customer =
          mapCustomerRow(row);

        if (
          !isMeaningfulRow(
            customer
          )
        ) {
          skipped++;
          return;
        }

        if (
          !customer.customer_name
        ) {
          skipped++;

          errors.push(
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

        if (duplicate) {
          skipped++;

          errors.push(
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

        customers.push(
          customer
        );
      }
    );

    if (!customers.length) {
      return NextResponse.json(
        {
          success: false,
          error:
            "No valid customers were found in the uploaded file.",
          imported: 0,
          skipped,
          errors,
        },
        { status: 400 }
      );
    }

    /*
     * ============================================================
     * EXISTING CUSTOMERS
     * ============================================================
     */

    const {
      data: existingCustomers,
      error: existingError,
    } =
      await supabase
        .from("customers")
        .select(
          "id, customer_name, business_name, email, phone"
        )
        .eq(
          "owner_id",
          user.id
        );

    if (existingError) {
      console.error(
        "[CustomerImport] Existing customer lookup error:",
        existingError
      );

      throw existingError;
    }

    const existingPhones =
      new Set<string>();

    const existingEmails =
      new Set<string>();

    const existingNames =
      new Set<string>();

    for (const customer of
      existingCustomers ?? []) {
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
     * ============================================================
     * REMOVE EXISTING DUPLICATES
     * ============================================================
     */

    const customersToInsert: ImportedCustomer[] =
      [];

    for (const customer of
      customers) {
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

      const alreadyExists =
        Boolean(
          phone &&
            existingPhones.has(
              phone
            )
        ) ||
        Boolean(
          email &&
            existingEmails.has(
              email
            )
        ) ||
        existingNames.has(
          nameKey
        );

      if (alreadyExists) {
        skipped++;

        errors.push(
          `${customer.customer_name}: Already exists in ArkenOne.`
        );

        continue;
      }

      customersToInsert.push(
        customer
      );

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
     * ============================================================
     * NOTHING NEW
     * ============================================================
     */

    if (
      !customersToInsert.length
    ) {
      return NextResponse.json({
        success: true,
        imported: 0,
        skipped,
        errors,
        customers: [],
        message:
          "All customers in this file already exist in ArkenOne.",
      });
    }

    /*
     * ============================================================
     * INSERT
     * ============================================================
     */

    const insertPayload =
      customersToInsert.map(
        (customer) => ({
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
      data: insertedCustomers,
      error: insertError,
    } =
      await supabase
        .from("customers")
        .insert(
          insertPayload
        )
        .select(
          "id, owner_id, customer_name, business_name, email, phone, gst_number, address, created_at"
        );

    if (insertError) {
      console.error(
        "[CustomerImport] Insert error:",
        insertError
      );

      throw insertError;
    }

    const imported =
      insertedCustomers?.length ??
      0;

    /*
     * ============================================================
     * RESPONSE
     * ============================================================
     */

    return NextResponse.json({
      success: true,

      imported,

      skipped,

      errors,

      customers:
        insertedCustomers ?? [],

      message:
        imported === 1
          ? "1 customer imported successfully."
          : `${imported} customers imported successfully.`,
    });
  } catch (error: unknown) {
    console.error(
      "========== CUSTOMER IMPORT ERROR =========="
    );

    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to import customers.",
      },
      { status: 500 }
    );
  }
}