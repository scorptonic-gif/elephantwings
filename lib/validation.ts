export interface InquiryFormData {
  type: 'chef-on-demand' | 'catering'
  name: string
  email: string
  phone: string
  eventDate: string
  notes?: string
  // Chef-On-Demand specific
  guestCount?: '2-6' | '7-12' | '13-20'
  occasion?: string
  kitchenType?: 'full-kitchen' | 'limited-space' | 'outdoor-grill' | string
  dietaryRestrictions?: ('vegan' | 'gluten-free' | 'halal' | 'nut-allergy')[]
  budgetRange?: string
  courseOption?: '5-course' | '7-course'
  // Catering specific
  eventType?: 'corporate' | 'wedding' | 'private-party'
  serviceStyle?: 'drop-off' | 'buffet' | 'plated'
  venueNameAddress?: string
  cateringGuestCount?: number
}

export type ValidationErrors = Record<string, string>

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^[\d\s\-().+]{7,20}$/

const CHEF_GUEST_OPTIONS = ['2-6', '7-12', '13-20'] as const
const COURSE_OPTIONS = ['5-course', '7-course'] as const

export function validateInquiry(data: Partial<InquiryFormData>): ValidationErrors {
  const errors: ValidationErrors = {}

  // Common fields
  if (!data.name?.trim()) {
    errors.name = 'Name is required.'
  }

  if (!data.email?.trim()) {
    errors.email = 'Email is required.'
  } else if (!EMAIL_RE.test(data.email.trim())) {
    errors.email = 'Please enter a valid email address.'
  }

  if (!data.phone?.trim()) {
    errors.phone = 'Phone number is required.'
  } else if (!PHONE_RE.test(data.phone.trim())) {
    errors.phone = 'Please enter a valid phone number.'
  }

  if (!data.eventDate?.trim()) {
    errors.eventDate = 'Event date is required.'
  } else {
    const parsed = new Date(data.eventDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (isNaN(parsed.getTime()) || parsed < today) {
      errors.eventDate = 'Event date must be a future date.'
    }
  }

  // Type-specific validation
  if (data.type === 'chef-on-demand') {
    if (!data.guestCount || !(CHEF_GUEST_OPTIONS as readonly string[]).includes(data.guestCount)) {
      errors.guestCount = 'Please select a valid guest count (2-6, 7-12, or 13-20).'
    }
    if (!data.courseOption || !(COURSE_OPTIONS as readonly string[]).includes(data.courseOption)) {
      errors.courseOption = 'Please select either 5-course or 7-course.'
    }
  }

  if (data.type === 'catering') {
    const count = Number(data.cateringGuestCount)
    if (!data.cateringGuestCount || isNaN(count) || count < 1) {
      errors.cateringGuestCount = 'Guest count must be at least 1.'
    }
  }

  return errors
}
