'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { ActionResult } from '@/lib/cms-types'

async function hashToken(value: string, salt: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(value + salt)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

// Returns 'owner' | 'admin' | null
async function resolveRole(submitted: string): Promise<'owner' | 'admin' | null> {
  const salt = process.env.ADMIN_SECRET_SALT ?? ''

  const ownerPass = process.env.OWNER_PASSWORD ?? ''
  const adminPass = process.env.ADMIN_PASSWORD ?? ''

  if (ownerPass && submitted === ownerPass) return 'owner'
  if (adminPass && submitted === adminPass) return 'admin'
  return null
}

export async function loginAction(_prevState: ActionResult<void>, formData: FormData): Promise<ActionResult<void>> {
  const submitted = String(formData.get('password') ?? '').trim()
  const salt = process.env.ADMIN_SECRET_SALT ?? ''

  const role = await resolveRole(submitted)

  if (!role) {
    return { success: false, error: 'Invalid password' }
  }

  // Token encodes role so middleware can verify without re-checking password
  const token = await hashToken(submitted + role, salt)

  cookies().set('ew_admin_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 86400 * 7, // 7 days
    path: '/',
  })

  // Store role separately (httpOnly, not readable by JS)
  cookies().set('ew_admin_role', role, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 86400 * 7,
    path: '/',
  })

  redirect('/ew-admin')
}

export async function logoutAction(): Promise<void> {
  cookies().delete('ew_admin_session')
  cookies().delete('ew_admin_role')
  redirect('/ew-admin/login')
}
