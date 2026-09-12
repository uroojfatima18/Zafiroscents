/**
 * Payment processing placeholder.
 *
 * Currently returns a successful result for COD (cash on delivery) orders.
 * Replace the body of `processPayment()` with a real JazzCash or Easypaisa
 * integration when payment processing is required.
 *
 * Expected interface for a real gateway:
 *   - Accepts the order total and any required payment metadata
 *   - Returns { success: true, transactionId?: string } on success
 *   - Returns { success: false, error: string } on failure
 */

export interface PaymentResult {
  success: boolean
  transactionId?: string
  error?: string
}

export interface PaymentInput {
  orderId: string
  amount: number // in PKR
  method: string
  customerName: string
  customerPhone: string
}

// ─── Placeholder — swap this body for a real gateway integration ─────────────
export async function processPayment(_input: PaymentInput): Promise<PaymentResult> {
  // TODO: Integrate JazzCash / Easypaisa / Stripe here.
  // For COD orders this is a no-op — payment is collected on delivery.
  return { success: true }
}
