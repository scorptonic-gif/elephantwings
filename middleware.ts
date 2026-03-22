import { NextRequest, NextResponse } from 'next/server'

async function hashToken(value: string, salt: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(value + salt)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (!pathname.startsWith('/ew-admin')) {
    return NextResponse.next()
  }

  if (pathname === '/ew-admin/login' || pathname.startsWith('/ew-admin/login/')) {
    return NextResponse.next()
  }

  const sessionCookie = request.cookies.get('ew_admin_session')
  const roleCookie = request.cookies.get('ew_admin_role')

  if (!sessionCookie || !roleCookie) {
    return NextResponse.redirect(new URL('/ew-admin/login', request.url))
  }

  const salt = process.env.ADMIN_SECRET_SALT ?? ''
  const role = roleCookie.value as 'owner' | 'admin'

  const password =
    role === 'owner'
      ? (process.env.OWNER_PASSWORD ?? '')
      : (process.env.ADMIN_PASSWORD ?? '')

  const expected = await hashToken(password + role, salt)

  if (sessionCookie.value !== expected) {
    return NextResponse.redirect(new URL('/ew-admin/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/ew-admin/:path*'],
}
