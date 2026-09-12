import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a price in PKR.
 * @param amount - price in PKR (integer)
 * @returns e.g. "Rs. 3,800"
 */
export function formatPrice(amount: number): string {
  return `Rs. ${amount.toLocaleString('en-PK')}`
}

/**
 * Generate a human-friendly order number.
 * Format: ZS-XXXX where XXXX is a 4-digit padded counter.
 */
export function generateOrderNumber(sequence: number): string {
  return `ZS-${String(sequence).padStart(4, '0')}`
}

/**
 * Truncate a string to a max length with an ellipsis.
 */
export function truncate(str: string, length: number): string {
  return str.length > length ? `${str.substring(0, length)}…` : str
}
