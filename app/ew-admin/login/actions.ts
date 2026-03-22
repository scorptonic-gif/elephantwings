'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { ActionResult } from '@/lib/cms-types'

async function computeSessionToken(): Promise<string> {
  const password = process.env.ADMIN_PASSWORD ?? ''
  const salt = process.env.ADMIN_SECRET_SALT ?? ''
  const encoder = new TextEncoder()
  const data = encoder.encode(password + salt)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

export async function loginAction(_prevState: ActionResult<void>, formData: FormData): Promise<ActionResult<void>> {
  const submitted = String(formData.get('password') ?? '').trim()
  const expected = (process.env.ADMIN_PASSWORD ?? '').trim()

  if (!expected) {
    return { success: false, error: 'ADMIN_PASSWORD is not set in environment' }
  }

  if (submitted !== expected) {
    return { success: false, error: 'Invalid password' }
  }

  const token = await computeSessionToken()
  cookies().set('ew_admin_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 86400, // 24 hours
    path: '/',
  })

  redirect('/ew-admin')
}

export async function logoutAction(): Promise<void> {
  cookies().delete('ew_admin_session')
  redirect('/ew-admin/login')
}
