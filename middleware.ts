import { NextRequest, NextResponse } from 'next/server'

async function computeToken(password: string, salt: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password + salt)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (!pathname.startsWith('/ew-admin')) {
    return NextResponse.next()
  }

  // Always allow the login page through
  if (pathname === '/ew-admin/login' || pathname.startsWith('/ew-admin/login/')) {
    return NextResponse.next()
  }

  const sessionCookie = request.cookies.get('ew_admin_session')
  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/ew-admin/login', request.url))
  }

  const expected = await computeToken(
    process.env.ADMIN_PASSWORD ?? '',
    process.env.ADMIN_SECRET_SALT ?? ''
  )

  if (sessionCookie.value !== expected) {
    return NextResponse.redirect(new URL('/ew-admin/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/ew-admin/:path*'],
}
