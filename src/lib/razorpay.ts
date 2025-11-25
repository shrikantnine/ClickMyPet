// Razorpay configuration and utilities
// Server-side only - never expose keys to client

import Razorpay from 'razorpay'
import crypto from 'crypto'

// Razorpay instance (server-side only)
export const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

// Verify Razorpay payment signature
export function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const body = orderId + '|' + paymentId
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest('hex')

  return expectedSignature === signature
}

// Create Razorpay order
export interface CreateOrderParams {
  amount: number // in cents (USD) or smallest currency unit
  currency?: string
  receipt: string
  notes?: Record<string, string>
}

export async function createRazorpayOrder(params: CreateOrderParams) {
  try {
    const order = await razorpayInstance.orders.create({
      amount: params.amount,
      currency: params.currency || 'USD',
      receipt: params.receipt,
      notes: params.notes,
    })
    return { success: true, order }
  } catch (error) {
    console.error('Error creating Razorpay order:', error)
    return { success: false, error: 'Failed to create order' }
  }
}

// Fetch payment details
export async function fetchPaymentDetails(paymentId: string) {
  try {
    const payment = await razorpayInstance.payments.fetch(paymentId)
    return { success: true, payment }
  } catch (error) {
    console.error('Error fetching payment details:', error)
    return { success: false, error: 'Failed to fetch payment details' }
  }
}

// Process refund
export async function processRefund(paymentId: string, amount?: number) {
  try {
    const refund = await razorpayInstance.payments.refund(paymentId, {
      amount: amount, // If not specified, full refund
    })
    return { success: true, refund }
  } catch (error) {
    console.error('Error processing refund:', error)
    return { success: false, error: 'Failed to process refund' }
  }
}
