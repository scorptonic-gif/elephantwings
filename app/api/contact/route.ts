import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { validateInquiry, type InquiryFormData } from '@/lib/validation'
import { SITE_CONFIG } from '@/lib/config'

const resend = new Resend(process.env.EMAIL_API_KEY)

// Simple in-memory rate limiter (per-IP, resets on cold start)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 5
const RATE_WINDOW_MS = 60 * 60 * 1000 // 1 hour

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS })
    return true
  }
  if (entry.count >= RATE_LIMIT) return false
  entry.count++
  return true
}

function sanitize(value: unknown): string {
  if (typeof value !== 'string') return ''
  return value
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim()
}

function buildNotificationEmail(data: InquiryFormData): string {
  const name = sanitize(data.name)
  const email = sanitize(data.email)
  const phone = sanitize(data.phone)
  const eventDate = sanitize(data.eventDate)
  const notes = sanitize(data.notes ?? '')

  if (data.type === 'chef-on-demand') {
    return `
New Chef-On-Demand Inquiry

Name: ${name}
Email: ${email}
Phone: ${phone}
Event Date: ${eventDate}
Guest Count: ${sanitize(data.guestCount ?? '')}
Course Option: ${sanitize(data.courseOption ?? '')}
Occasion: ${sanitize(data.occasion ?? '')}
Kitchen Type: ${sanitize(data.kitchenType ?? '')}
Dietary Restrictions: ${(data.dietaryRestrictions ?? []).map(sanitize).join(', ')}
Budget Range: ${sanitize(data.budgetRange ?? '')}
Notes: ${notes}
    `.trim()
  }

  return `
New Catering Inquiry

Name: ${name}
Email: ${email}
Phone: ${phone}
Event Date: ${eventDate}
Event Type: ${sanitize(data.eventType ?? '')}
Service Style: ${sanitize(data.serviceStyle ?? '')}
Guest Count: ${data.cateringGuestCount ?? ''}
Venue: ${sanitize(data.venueNameAddress ?? '')}
Notes: ${notes}
  `.trim()
}

function buildAutoResponseEmail(data: InquiryFormData): { subject: string; html: string } {
  const name = sanitize(data.name)
  const eventDate = sanitize(data.eventDate)

  if (data.type === 'chef-on-demand') {
    return {
      subject: 'Your Private Dining Experience with Elephant Wings 🐘',
      html: `
<p>Hi ${name},</p>
<p>Thank you for reaching out about a Chef-On-Demand experience! We've received your details for <strong>${eventDate}</strong>.</p>
<p>Chef Ameet is currently in the kitchen crafting new fusion flavors, but we've flagged your inquiry. Creating a custom menu is a collaborative process, so keep an eye on your inbox — we'll be reaching out within 24 hours to discuss your vision, dietary needs, and the guest list.</p>
<p>In the meantime, feel free to browse our latest 'Spice Route' inspirations on our Journal: <a href="${SITE_CONFIG.domain}/journal/">elephantwingskc.com/journal/</a></p>
<p>Talk soon,<br>The Elephant Wings Team</p>
      `.trim(),
    }
  }

  const eventType = sanitize(data.eventType ?? 'Event')
  return {
    subject: `Elephant Wings Catering Inquiry: ${eventType}`,
    html: `
<p>Hello ${name},</p>
<p>We've received your inquiry for catering on <strong>${eventDate}</strong>. Whether it's an office lunch or a grand celebration, we're excited about the possibility of bringing our Indian Fusion flavors to your guests.</p>
<p><strong>What's Next?</strong> Our catering coordinator is reviewing your guest count and service style requirements. You can expect a formal quote or a follow-up call to finalize logistics shortly.</p>
<p>If you need to add any immediate details to your request, simply reply to this email.</p>
<p>Best,<br>The Elephant Wings Catering Team</p>
    `.trim(),
  }
}

export async function POST(request: NextRequest) {
  // Rate limiting
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
  }

  let body: Partial<InquiryFormData>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  // Server-side validation
  const errors = validateInquiry(body)
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 400 })
  }

  const data = body as InquiryFormData

  // Log only timestamp and form type — no PII
  console.log(`[contact] ${new Date().toISOString()} type=${data.type}`)

  try {
    const notificationText = buildNotificationEmail(data)
    const autoResponse = buildAutoResponseEmail(data)

    // Send notification to Chef Ameet
    await resend.emails.send({
      from: 'Elephant Wings KC <noreply@elephantwingskc.com>',
      to: SITE_CONFIG.email,
      subject: `New ${data.type === 'chef-on-demand' ? 'Chef-On-Demand' : 'Catering'} Inquiry — ${sanitize(data.eventDate)}`,
      text: notificationText,
    })

    // Send auto-response to submitter
    await resend.emails.send({
      from: 'Elephant Wings KC <noreply@elephantwingskc.com>',
      to: sanitize(data.email),
      subject: autoResponse.subject,
      html: autoResponse.html,
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err) {
    console.error('[contact] Email send failed:', err instanceof Error ? err.message : 'unknown')
    return NextResponse.json(
      { error: 'Unable to send inquiry. Please call us directly.' },
      { status: 500 }
    )
  }
}
