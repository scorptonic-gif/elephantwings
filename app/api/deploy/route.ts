import { NextResponse } from 'next/server'

export async function POST() {
  const hookUrl = process.env.VERCEL_DEPLOY_HOOK_URL

  if (!hookUrl) {
    return NextResponse.json(
      { error: 'VERCEL_DEPLOY_HOOK_URL is not set in environment variables.' },
      { status: 500 }
    )
  }

  try {
    const res = await fetch(hookUrl, { method: 'POST' })
    if (!res.ok) {
      const text = await res.text()
      return NextResponse.json(
        { error: `Vercel returned ${res.status}: ${text}` },
        { status: 502 }
      )
    }
    const data = await res.json().catch(() => ({}))
    return NextResponse.json({ ok: true, job: data?.job?.id ?? null })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
