'use client'

import { useFormState } from 'react-dom'
import { saveAboutAction } from './actions'
import type { SiteConfigMap } from '@/lib/cms-types'

interface Props {
  config: SiteConfigMap
}

const inputClass =
  'w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 resize-y'

export default function AboutForm({ config }: Props) {
  const [state, formAction] = useFormState(saveAboutAction, null)

  return (
    <form action={formAction} className="space-y-8">
      {state && !state.success && (
        <div className="bg-red-900/40 border border-red-700/60 rounded-xl p-4 text-red-300 text-sm">
          {state.error}
        </div>
      )}
      {state && state.success && (
        <div className="bg-green-900/40 border border-green-700/60 rounded-xl p-4 text-green-300 text-sm">
          About page saved successfully.
        </div>
      )}

      {/* Chef Bio */}
      <div className="bg-gray-900 rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold text-white">Chef Bio</h2>
        <div>
          <label className="block text-sm text-gray-400 mb-1" htmlFor="about_bio">
            Bio
          </label>
          <textarea
            id="about_bio"
            name="about_bio"
            defaultValue={config.about_bio ?? ''}
            placeholder="Tell your story..."
            rows={8}
            className={inputClass}
            style={{ fontSize: '16px' }}
          />
        </div>
      </div>

      {/* Values */}
      <div className="bg-gray-900 rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold text-white">Values</h2>
        <div>
          <label className="block text-sm text-gray-400 mb-1" htmlFor="about_values">
            Values section
          </label>
          <textarea
            id="about_values"
            name="about_values"
            defaultValue={config.about_values ?? ''}
            placeholder="What drives your cooking philosophy..."
            rows={6}
            className={inputClass}
            style={{ fontSize: '16px' }}
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full font-bold rounded-xl text-white transition-colors hover:opacity-90"
        style={{ minHeight: '48px', fontSize: '16px', backgroundColor: '#E85A1A' }}
      >
        Save About Page
      </button>
    </form>
  )
}
