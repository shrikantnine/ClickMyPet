// Razorpay configuration and utilities
// Server-side only - never expose keys to client

import Razorpay from 'razorpay'
import crypto from 'crypto'

// Lazy-initialize Razorpay instance so build-time
// evaluation doesn't crash when env vars are not set.
let _razorpayInstance: any = null

function getRazorpayInstance() {
  if (_razorpayInstance) return _razorpayInstance

  const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET

  if (!keyId || !keySecret) {
    // Throw a clear runtime error when called without credentials
    throw new Error('Razorpay credentials missing. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in environment variables.')
  }

  _razorpayInstance = new Razorpay({ key_id: keyId, key_secret: keySecret })
  return _razorpayInstance
}

// Verify Razorpay payment signature
export function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const body = orderId + '|' + paymentId
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
    .update(body)
    .digest('hex')

  return expectedSignature === signature
}

// Create Razorpay order
export interface CreateOrderParams {
  amount: number
  currency?: string
  receipt: string
  notes?: Record<string, string>
}

export async function createRazorpayOrder(params: CreateOrderParams) {
  try {
    const instance = getRazorpayInstance()
    const order = await instance.orders.create({
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
    const instance = getRazorpayInstance()
    const payment = await instance.payments.fetch(paymentId)
    return { success: true, payment }
  } catch (error) {
    console.error('Error fetching payment details:', error)
    return { success: false, error: 'Failed to fetch payment details' }
  }
}

// Process refund
export async function processRefund(paymentId: string, amount?: number) {
  try {
    const instance = getRazorpayInstance()
    const refund = await instance.payments.refund(paymentId, {
      amount: amount,
    })
    return { success: true, refund }
  } catch (error) {
    console.error('Error processing refund:', error)
    return { success: false, error: 'Failed to process refund' }
  }
}
