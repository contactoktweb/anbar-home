'use server'

import crypto from 'crypto'

export async function generateWompiSignature(reference: string, amountInCents: number, currency: string) {
  const integrityKey = process.env.WOMPI_INTEGRITY_KEY
  
  if (!integrityKey) {
    throw new Error('Missing WOMPI_INTEGRITY_KEY in environment variables')
  }

  const stringToHash = `${reference}${amountInCents}${currency}${integrityKey}`
  const encondedText = new TextEncoder().encode(stringToHash)
  const hashBuffer = await crypto.subtle.digest('SHA-256', encondedText)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

  return hashHex
}
