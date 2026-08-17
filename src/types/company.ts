export interface Company {
  id?: number;

  // =========================================================
  // BUSINESS INFORMATION
  // =========================================================

  company_name: string;
  owner_name: string;
  email: string;
  phone: string;

  website?: string;
  address: string;
  gst_number?: string;

  logo_url?: string;

  // =========================================================
  // GENERAL BUSINESS BANKING
  // =========================================================

  bank_name?: string;
  account_number?: string;
  ifsc_code?: string;
  upi_id?: string;

  // =========================================================
  // CUSTOMER PAYMENT SETTINGS
  // =========================================================

  payment_method?:
    | "razorpay"
    | "upi"
    | "bank_transfer";

  payment_display_name?: string;
  payment_phone?: string;

  // =========================================================
  // UPI PAYMENT DETAILS
  // =========================================================

  payment_upi_id?: string;

  // =========================================================
  // BANK TRANSFER PAYMENT DETAILS
  // =========================================================

  payment_bank_name?: string;
  payment_bank_account_name?: string;
  payment_bank_account_number?: string;
  payment_bank_ifsc?: string;

  // =========================================================
  // RAZORPAY PAYMENT DETAILS
  // =========================================================

  payment_razorpay_account_id?: string;

  // =========================================================
  // SYSTEM
  // =========================================================

  created_at?: string;
}