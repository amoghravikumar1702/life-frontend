/**
 * Current maximum single payment we allow through Razorpay.
 *
 * IMPORTANT:
 * This is an DhanarkOS-side safety limit based on the
 * current Razorpay limit on the account.
 *
 * If Razorpay increases the account limit later,
 * change this number only.
 */
export const MAX_RAZORPAY_PAYMENT_INR = 50_000;

export const MIN_RAZORPAY_PAYMENT_INR = 1;