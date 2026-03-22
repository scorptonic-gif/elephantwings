'use client'

import { useState } from 'react'
import { useFormState } from 'react-dom'
import { saveHomepageAction } from './actions'
import type { SiteConfigMap } from '@/lib/cms-types'

interface Props {
  config: SiteConfigMap
}

const inputClass =
  'w-full bg-gray-800 border border-gray-700 rounded-lg px-4 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 disabled:opacity-40 disabled:cursor-not-allowed'
const inputStyle = { minHeight: '48px', fontSize: '16px' }

export default function HomepageForm({ config }: Props) {
  const [state, formAction] = useFormState(saveHomepageAction, null)
  const [announcementEnabled, setAnnouncementEnabled] = useState(
    config.announcement_enabled === 'true'
  )

  return (
    <form action={formAction} className="space-y-8">
      {state && !state.success && (
        <div className="bg-red-900/40 border border-red-700/60 rounded-xl p-4 text-red-300 text-sm">
          {state.error}
        </div>
      )}
      {state && state.success && (
        <div className="bg-green-900/40 border border-green-700/60 rounded-xl p-4 text-green-300 text-sm">
          Homepage settings saved successfully.
        </div>
      )}

      {/* Hero */}
      <div className="bg-gray-900 rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold text-white">Hero</h2>
        <div>
          <label className="block text-sm text-gray-400 mb-1" htmlFor="hero_headline">
            Headline <span className="text-red-400">*</span>
          </label>
          <input
            id="hero_headline"
            name="hero_headline"
            type="text"
            required
            defaultValue={config.hero_headline ?? ''}
            placeholder="Elephant Wings KC"
            className={inputClass}
            style={inputStyle}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1" htmlFor="hero_subtext">
            Subtext
          </label>
          <textarea
            id="hero_subtext"
            name="hero_subtext"
            defaultValue={config.hero_subtext ?? ''}
            placeholder="Kansas City's premier private chef experience"
            rows={3}
            className={`${inputClass} py-3 resize-y`}
            style={{ fontSize: '16px' }}
          />
        </div>
      </div>

      {/* Announcement Banner */}
      <div className="bg-gray-900 rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold text-white">Announcement Banner</h2>

        {/* Hidden field so the value is always submitted */}
        <input type="hidden" name="announcement_enabled" value={String(announcementEnabled)} />

        <label className="flex items-center gap-3 cursor-pointer select-none">
          <div
            role="switch"
            aria-checked={announcementEnabled}
            onClick={() => setAnnouncementEnabled((v) => !v)}
            className={`relative w-11 h-6 rounded-full transition-colors ${
              announcementEnabled ? 'bg-orange-500' : 'bg-gray-700'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                announcementEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </div>
          <span className="text-sm text-gray-300">
            {announcementEnabled ? 'Enabled' : 'Disabled'}
          </span>
        </label>

        <div>
          <label className="block text-sm text-gray-400 mb-1" htmlFor="announcement_text">
            Announcement text
          </label>
          <input
            id="announcement_text"
            name="announcement_text"
            type="text"
            defaultValue={config.announcement_text ?? ''}
            placeholder="Now open for private events!"
            disabled={!announcementEnabled}
            className={inputClass}
            style={inputStyle}
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full font-bold rounded-xl text-white transition-colors hover:opacity-90"
        style={{ minHeight: '48px', fontSize: '16px', backgroundColor: '#E85A1A' }}
      >
        Save Homepage
      </button>
    </form>
  )
}
