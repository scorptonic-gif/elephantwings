'use client'

import { useState } from 'react'

export default function MailingListForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    // TODO: wire to your email provider (Mailchimp, ConvertKit, etc.)
    // For now, simulate a successful submission
    await new Promise((r) => setTimeout(r, 800))
    setStatus('success')
    setEmail('')
  }

  if (status === 'success') {
    return (
      <div className="bg-orange/8 border border-orange/20 rounded-2xl px-8 py-10 text-center">
        <div className="text-3xl mb-3">🎉</div>
        <p className="font-display text-lg font-bold text-stone-900 mb-1">You&apos;re on the list!</p>
        <p className="text-stone-500 text-sm">Watch your inbox for the good stuff.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        className="form-input flex-1"
        aria-label="Email address"
        disabled={status === 'loading'}
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="btn-primary shrink-0 disabled:opacity-60"
      >
        {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
      </button>
    </form>
  )
}
