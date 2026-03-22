'use client'

import { useFormState } from 'react-dom'
import { saveServicesAction } from './actions'
import type { SiteConfigMap } from '@/lib/cms-types'

interface Props {
  config: SiteConfigMap
}

const inputClass =
  'w-full bg-gray-800 border border-gray-700 rounded-lg px-4 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500'
const inputStyle = { minHeight: '48px', fontSize: '16px' }

export default function ServicesForm({ config }: Props) {
  const [state, formAction] = useFormState(saveServicesAction, null)

  return (
    <form action={formAction} className="space-y-8">
      {state && !state.success && (
        <div className="bg-red-900/40 border border-red-700/60 rounded-xl p-4 text-red-300 text-sm">
          {state.error}
        </div>
      )}
      {state && state.success && (
        <div className="bg-green-900/40 border border-green-700/60 rounded-xl p-4 text-green-300 text-sm">
          Services settings saved successfully.
        </div>
      )}

      {/* Catering */}
      <div className="bg-gray-900 rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold text-white">Catering</h2>
        <div>
          <label className="block text-sm text-gray-400 mb-1" htmlFor="services_catering_headline">
            Headline
          </label>
          <input
            id="services_catering_headline"
            name="services_catering_headline"
            type="text"
            defaultValue={config.services_catering_headline ?? ''}
            placeholder="Catering Services"
            className={inputClass}
            style={inputStyle}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1" htmlFor="services_catering_description">
            Description
          </label>
          <textarea
            id="services_catering_description"
            name="services_catering_description"
            defaultValue={config.services_catering_description ?? ''}
            placeholder="Describe your catering services..."
            rows={4}
            className={`${inputClass} py-3 resize-y`}
            style={{ fontSize: '16px' }}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1" htmlFor="services_catering_pricing">
            Pricing
          </label>
          <textarea
            id="services_catering_pricing"
            name="services_catering_pricing"
            defaultValue={config.services_catering_pricing ?? ''}
            placeholder="Pricing details..."
            rows={3}
            className={`${inputClass} py-3 resize-y`}
            style={{ fontSize: '16px' }}
          />
        </div>
      </div>

      {/* Chef-On-Demand */}
      <div className="bg-gray-900 rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold text-white">Chef-On-Demand</h2>
        <div>
          <label className="block text-sm text-gray-400 mb-1" htmlFor="services_cod_headline">
            Headline
          </label>
          <input
            id="services_cod_headline"
            name="services_cod_headline"
            type="text"
            defaultValue={config.services_cod_headline ?? ''}
            placeholder="Chef-On-Demand"
            className={inputClass}
            style={inputStyle}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1" htmlFor="services_cod_description">
            Description
          </label>
          <textarea
            id="services_cod_description"
            name="services_cod_description"
            defaultValue={config.services_cod_description ?? ''}
            placeholder="Describe your chef-on-demand service..."
            rows={4}
            className={`${inputClass} py-3 resize-y`}
            style={{ fontSize: '16px' }}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1" htmlFor="services_cod_pricing">
            Pricing
          </label>
          <textarea
            id="services_cod_pricing"
            name="services_cod_pricing"
            defaultValue={config.services_cod_pricing ?? ''}
            placeholder="Pricing details..."
            rows={3}
            className={`${inputClass} py-3 resize-y`}
            style={{ fontSize: '16px' }}
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full font-bold rounded-xl text-white transition-colors hover:opacity-90"
        style={{ minHeight: '48px', fontSize: '16px', backgroundColor: '#E85A1A' }}
      >
        Save Services
      </button>
    </form>
  )
}
