import { describe, it, expect } from 'vitest'
import { validateInquiry } from '@/lib/validation'

const FUTURE_DATE = '2099-12-31'
const PAST_DATE = '2000-01-01'

describe('validateInquiry — common fields', () => {
  it('returns errors for completely empty submission', () => {
    const errors = validateInquiry({})
    expect(errors.name).toBeDefined()
    expect(errors.email).toBeDefined()
    expect(errors.phone).toBeDefined()
    expect(errors.eventDate).toBeDefined()
  })

  it('requires name', () => {
    const errors = validateInquiry({ name: '' })
    expect(errors.name).toMatch(/required/i)
  })

  it('requires email', () => {
    const errors = validateInquiry({ email: '' })
    expect(errors.email).toMatch(/required/i)
  })

  it('rejects invalid email format', () => {
    const errors = validateInquiry({ name: 'Jane', email: 'not-an-email', phone: '816-555-0100', eventDate: FUTURE_DATE })
    expect(errors.email).toMatch(/valid email/i)
  })

  it('accepts valid email', () => {
    const errors = validateInquiry({
      type: 'catering',
      name: 'Jane',
      email: 'jane@example.com',
      phone: '816-555-0100',
      eventDate: FUTURE_DATE,
      cateringGuestCount: 10,
    })
    expect(errors.email).toBeUndefined()
  })

  it('requires phone', () => {
    const errors = validateInquiry({ phone: '' })
    expect(errors.phone).toMatch(/required/i)
  })

  it('rejects invalid phone', () => {
    const errors = validateInquiry({ name: 'Jane', email: 'jane@example.com', phone: 'abc', eventDate: FUTURE_DATE })
    expect(errors.phone).toMatch(/valid phone/i)
  })

  it('requires eventDate', () => {
    const errors = validateInquiry({ eventDate: '' })
    expect(errors.eventDate).toMatch(/required/i)
  })

  it('rejects past event date', () => {
    const errors = validateInquiry({ name: 'Jane', email: 'jane@example.com', phone: '816-555-0100', eventDate: PAST_DATE })
    expect(errors.eventDate).toMatch(/future/i)
  })

  it('accepts future event date', () => {
    const errors = validateInquiry({
      type: 'catering',
      name: 'Jane',
      email: 'jane@example.com',
      phone: '816-555-0100',
      eventDate: FUTURE_DATE,
      cateringGuestCount: 10,
    })
    expect(errors.eventDate).toBeUndefined()
  })
})

describe('validateInquiry — chef-on-demand', () => {
  const base = {
    type: 'chef-on-demand' as const,
    name: 'Jane',
    email: 'jane@example.com',
    phone: '816-555-0100',
    eventDate: FUTURE_DATE,
  }

  it('requires guestCount', () => {
    const errors = validateInquiry(base)
    expect(errors.guestCount).toBeDefined()
  })

  it('requires courseOption', () => {
    const errors = validateInquiry(base)
    expect(errors.courseOption).toBeDefined()
  })

  it('rejects invalid guestCount value', () => {
    const errors = validateInquiry({ ...base, guestCount: '99-100' as never })
    expect(errors.guestCount).toBeDefined()
  })

  it('accepts guestCount 2-6', () => {
    const errors = validateInquiry({ ...base, guestCount: '2-6', courseOption: '5-course' })
    expect(errors.guestCount).toBeUndefined()
  })

  it('accepts guestCount 7-12', () => {
    const errors = validateInquiry({ ...base, guestCount: '7-12', courseOption: '5-course' })
    expect(errors.guestCount).toBeUndefined()
  })

  it('accepts guestCount 13-20', () => {
    const errors = validateInquiry({ ...base, guestCount: '13-20', courseOption: '7-course' })
    expect(errors.guestCount).toBeUndefined()
  })

  it('accepts courseOption 5-course', () => {
    const errors = validateInquiry({ ...base, guestCount: '2-6', courseOption: '5-course' })
    expect(errors.courseOption).toBeUndefined()
  })

  it('accepts courseOption 7-course', () => {
    const errors = validateInquiry({ ...base, guestCount: '2-6', courseOption: '7-course' })
    expect(errors.courseOption).toBeUndefined()
  })

  it('returns empty errors for fully valid chef-on-demand submission', () => {
    const errors = validateInquiry({ ...base, guestCount: '7-12', courseOption: '5-course' })
    expect(Object.keys(errors)).toHaveLength(0)
  })
})

describe('validateInquiry — catering', () => {
  const base = {
    type: 'catering' as const,
    name: 'Jane',
    email: 'jane@example.com',
    phone: '816-555-0100',
    eventDate: FUTURE_DATE,
  }

  it('requires cateringGuestCount', () => {
    const errors = validateInquiry(base)
    expect(errors.cateringGuestCount).toBeDefined()
  })

  it('rejects zero guest count', () => {
    const errors = validateInquiry({ ...base, cateringGuestCount: 0 })
    expect(errors.cateringGuestCount).toBeDefined()
  })

  it('rejects negative guest count', () => {
    const errors = validateInquiry({ ...base, cateringGuestCount: -5 })
    expect(errors.cateringGuestCount).toBeDefined()
  })

  it('accepts guest count of 1', () => {
    const errors = validateInquiry({ ...base, cateringGuestCount: 1 })
    expect(errors.cateringGuestCount).toBeUndefined()
  })

  it('accepts large guest count', () => {
    const errors = validateInquiry({ ...base, cateringGuestCount: 500 })
    expect(errors.cateringGuestCount).toBeUndefined()
  })

  it('returns empty errors for fully valid catering submission', () => {
    const errors = validateInquiry({ ...base, cateringGuestCount: 50 })
    expect(Object.keys(errors)).toHaveLength(0)
  })
})
