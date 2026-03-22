'use client'

import { useState, type FormEvent } from 'react'
import { validateInquiry, type InquiryFormData, type ValidationErrors } from '@/lib/validation'

interface InquiryFormProps {
  type: 'chef-on-demand' | 'catering'
  onSuccess?: () => void
}

const FIELD_CLASS = 'form-input'
const LABEL_CLASS = 'form-label'
const ERROR_CLASS = 'form-error'

export default function InquiryForm({ type, onSuccess }: InquiryFormProps) {
  const [formData, setFormData] = useState<Partial<InquiryFormData>>({ type })
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [serverError, setServerError] = useState('')

  function update(field: keyof InquiryFormData, value: unknown) {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  function toggleDietary(tag: string) {
    const current = (formData.dietaryRestrictions as string[]) ?? []
    const next = current.includes(tag) ? current.filter((t) => t !== tag) : [...current, tag]
    update('dietaryRestrictions', next)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const validationErrors = validateInquiry(formData)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setStatus('submitting')
    setServerError('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setStatus('success')
        onSuccess?.()
      } else if (res.status === 400) {
        const body = await res.json()
        setErrors(body.errors ?? {})
        setStatus('idle')
      } else {
        const body = await res.json()
        setServerError(body.error ?? 'Something went wrong. Please try again.')
        setStatus('error')
      }
    } catch {
      setServerError('Unable to send inquiry. Please call us directly at 816.588.5973.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-orange/5 border border-orange/20 rounded-2xl p-10 text-center">
        <div className="text-5xl mb-4">🐘</div>
        <h3 className="font-display text-2xl font-bold text-stone-900 mb-3">Inquiry Sent!</h3>
        <p className="text-stone-500">
          Success! Your inquiry has been sent directly to Chef Ameet. While you wait for our
          reply, check out our current menu at Parlor KC.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Common fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className={LABEL_CLASS}>
            Full Name <span className="text-accent">*</span>
          </label>
          <input
            id="name"
            type="text"
            className={FIELD_CLASS}
            placeholder="Your name"
            value={formData.name ?? ''}
            onChange={(e) => update('name', e.target.value)}
            aria-describedby={errors.name ? 'name-error' : undefined}
            aria-invalid={!!errors.name}
          />
          {errors.name && <p id="name-error" className={ERROR_CLASS}>{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="email" className={LABEL_CLASS}>
            Email <span className="text-accent">*</span>
          </label>
          <input
            id="email"
            type="email"
            className={FIELD_CLASS}
            placeholder="you@example.com"
            value={formData.email ?? ''}
            onChange={(e) => update('email', e.target.value)}
            aria-describedby={errors.email ? 'email-error' : undefined}
            aria-invalid={!!errors.email}
          />
          {errors.email && <p id="email-error" className={ERROR_CLASS}>{errors.email}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="phone" className={LABEL_CLASS}>
            Phone <span className="text-accent">*</span>
          </label>
          <input
            id="phone"
            type="tel"
            className={FIELD_CLASS}
            placeholder="816-555-0100"
            value={formData.phone ?? ''}
            onChange={(e) => update('phone', e.target.value)}
            aria-describedby={errors.phone ? 'phone-error' : undefined}
            aria-invalid={!!errors.phone}
          />
          {errors.phone && <p id="phone-error" className={ERROR_CLASS}>{errors.phone}</p>}
        </div>

        <div>
          <label htmlFor="eventDate" className={LABEL_CLASS}>
            Event Date <span className="text-accent">*</span>
          </label>
          <input
            id="eventDate"
            type="date"
            className={FIELD_CLASS}
            value={formData.eventDate ?? ''}
            onChange={(e) => update('eventDate', e.target.value)}
            aria-describedby={errors.eventDate ? 'eventDate-error' : undefined}
            aria-invalid={!!errors.eventDate}
          />
          {errors.eventDate && <p id="eventDate-error" className={ERROR_CLASS}>{errors.eventDate}</p>}
        </div>
      </div>

      {/* Chef-On-Demand specific */}
      {type === 'chef-on-demand' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="guestCount" className={LABEL_CLASS}>
                Guest Count <span className="text-accent">*</span>
              </label>
              <select
                id="guestCount"
                className={FIELD_CLASS}
                value={formData.guestCount ?? ''}
                onChange={(e) => update('guestCount', e.target.value)}
                aria-describedby={errors.guestCount ? 'guestCount-error' : undefined}
                aria-invalid={!!errors.guestCount}
              >
                <option value="">Select guest count</option>
                <option value="2-6">2–6 guests</option>
                <option value="7-12">7–12 guests</option>
                <option value="13-20">13–20 guests</option>
              </select>
              {errors.guestCount && <p id="guestCount-error" className={ERROR_CLASS}>{errors.guestCount}</p>}
            </div>

            <div>
              <label htmlFor="courseOption" className={LABEL_CLASS}>
                Course Option <span className="text-accent">*</span>
              </label>
              <select
                id="courseOption"
                className={FIELD_CLASS}
                value={formData.courseOption ?? ''}
                onChange={(e) => update('courseOption', e.target.value)}
                aria-describedby={errors.courseOption ? 'courseOption-error' : undefined}
                aria-invalid={!!errors.courseOption}
              >
                <option value="">Select courses</option>
                <option value="5-course">5-Course ($140/person)</option>
                <option value="7-course">7-Course ($165/person)</option>
              </select>
              {errors.courseOption && <p id="courseOption-error" className={ERROR_CLASS}>{errors.courseOption}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="occasion" className={LABEL_CLASS}>Occasion</label>
              <input
                id="occasion"
                type="text"
                className={FIELD_CLASS}
                placeholder="Anniversary, Birthday, Dinner Party..."
                value={formData.occasion ?? ''}
                onChange={(e) => update('occasion', e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="kitchenType" className={LABEL_CLASS}>Kitchen Type</label>
              <select
                id="kitchenType"
                className={FIELD_CLASS}
                value={formData.kitchenType ?? ''}
                onChange={(e) => update('kitchenType', e.target.value)}
              >
                <option value="">Select kitchen type</option>
                <option value="full-kitchen">Full Kitchen</option>
                <option value="limited-space">Limited Space</option>
                <option value="outdoor-grill">Outdoor Grill</option>
              </select>
            </div>
          </div>

          <div>
            <label className={LABEL_CLASS}>Dietary Restrictions</label>
            <div className="flex flex-wrap gap-3">
              {['vegan', 'gluten-free', 'halal', 'nut-allergy'].map((tag) => {
                const checked = (formData.dietaryRestrictions as string[] | undefined)?.includes(tag) ?? false
                return (
                  <label key={tag} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleDietary(tag)}
                      className="accent-accent w-4 h-4"
                    />
                    <span className="text-stone-500 text-sm capitalize">{tag.replace('-', ' ')}</span>
                  </label>
                )
              })}
            </div>
          </div>

          <div>
            <label htmlFor="budgetRange" className={LABEL_CLASS}>Budget Range (optional)</label>
            <input
              id="budgetRange"
              type="text"
              className={FIELD_CLASS}
              placeholder="e.g. $500–$1,000"
              value={formData.budgetRange ?? ''}
              onChange={(e) => update('budgetRange', e.target.value)}
            />
          </div>
        </>
      )}

      {/* Catering specific */}
      {type === 'catering' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="eventType" className={LABEL_CLASS}>Event Type</label>
              <select
                id="eventType"
                className={FIELD_CLASS}
                value={formData.eventType ?? ''}
                onChange={(e) => update('eventType', e.target.value)}
              >
                <option value="">Select event type</option>
                <option value="corporate">Corporate</option>
                <option value="wedding">Wedding</option>
                <option value="private-party">Private Party</option>
              </select>
            </div>

            <div>
              <label htmlFor="serviceStyle" className={LABEL_CLASS}>Service Style</label>
              <select
                id="serviceStyle"
                className={FIELD_CLASS}
                value={formData.serviceStyle ?? ''}
                onChange={(e) => update('serviceStyle', e.target.value)}
              >
                <option value="">Select service style</option>
                <option value="drop-off">Drop-Off</option>
                <option value="buffet">Buffet</option>
                <option value="plated">Plated</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="cateringGuestCount" className={LABEL_CLASS}>
                Guest Count <span className="text-accent">*</span>
              </label>
              <input
                id="cateringGuestCount"
                type="number"
                min="1"
                className={FIELD_CLASS}
                placeholder="Number of guests"
                value={formData.cateringGuestCount ?? ''}
                onChange={(e) => update('cateringGuestCount', Number(e.target.value))}
                aria-describedby={errors.cateringGuestCount ? 'cateringGuestCount-error' : undefined}
                aria-invalid={!!errors.cateringGuestCount}
              />
              {errors.cateringGuestCount && (
                <p id="cateringGuestCount-error" className={ERROR_CLASS}>{errors.cateringGuestCount}</p>
              )}
            </div>

            <div>
              <label htmlFor="venueNameAddress" className={LABEL_CLASS}>Venue Name & Address</label>
              <input
                id="venueNameAddress"
                type="text"
                className={FIELD_CLASS}
                placeholder="Venue name and address"
                value={formData.venueNameAddress ?? ''}
                onChange={(e) => update('venueNameAddress', e.target.value)}
              />
            </div>
          </div>
        </>
      )}

      {/* Notes */}
      <div>
        <label htmlFor="notes" className={LABEL_CLASS}>Additional Notes</label>
        <textarea
          id="notes"
          rows={4}
          className={FIELD_CLASS}
          placeholder="Tell us anything else about your event..."
          value={formData.notes ?? ''}
          onChange={(e) => update('notes', e.target.value)}
        />
      </div>

      {/* Server error */}
      {status === 'error' && serverError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm">
          {serverError}
        </div>
      )}

      {/* Confidentiality statement + Submit */}
      <div className="space-y-4">
        <p className="text-stone-400 text-xs leading-relaxed">
          Your inquiry details — including your name, address, and event information — are handled
          with complete professional confidentiality and are never shared with third parties.
        </p>
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="btn-primary w-full text-sm disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === 'submitting' ? 'Sending...' : 'Send Inquiry'}
        </button>
      </div>
    </form>
  )
}
