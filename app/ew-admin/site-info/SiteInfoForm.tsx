'use client'

import { useState } from 'react'
import { useFormState } from 'react-dom'
import { saveSiteInfoAction } from './actions'
import type { SiteConfigMap, HoursRow } from '@/lib/cms-types'

interface Props {
  config: SiteConfigMap
  hours: HoursRow[]
}

const inputClass =
  'w-full bg-gray-800 border border-gray-700 rounded-lg px-4 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500'
const inputStyle = { minHeight: '48px', fontSize: '16px' }

export default function SiteInfoForm({ config, hours }: Props) {
  const [state, formAction] = useFormState(saveSiteInfoAction, null)

  return (
    <form action={formAction} className="space-y-8">
      {state && !state.success && (
        <div className="bg-red-900/40 border border-red-700/60 rounded-xl p-4 text-red-300 text-sm">
          {state.error}
        </div>
      )}
      {state && state.success && (
        <div className="bg-green-900/40 border border-green-700/60 rounded-xl p-4 text-green-300 text-sm">
          Site info saved successfully.
        </div>
      )}

      {/* Contact */}
      <div className="bg-gray-900 rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold text-white">Contact</h2>
        <div>
          <label className="block text-sm text-gray-400 mb-1" htmlFor="phone">
            Phone (10 digits, no dashes)
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            defaultValue={config.phone ?? ''}
            placeholder="8165885973"
            className={inputClass}
            style={inputStyle}
          />
        </div>
      </div>

      {/* Address */}
      <div className="bg-gray-900 rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold text-white">Address</h2>
        <div>
          <label className="block text-sm text-gray-400 mb-1" htmlFor="address_street">
            Street
          </label>
          <input
            id="address_street"
            name="address_street"
            type="text"
            defaultValue={config.address_street ?? ''}
            placeholder="1707 Locust St"
            className={inputClass}
            style={inputStyle}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1" htmlFor="address_city">
              City
            </label>
            <input
              id="address_city"
              name="address_city"
              type="text"
              defaultValue={config.address_city ?? ''}
              placeholder="Kansas City"
              className={inputClass}
              style={inputStyle}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1" htmlFor="address_state">
              State
            </label>
            <input
              id="address_state"
              name="address_state"
              type="text"
              defaultValue={config.address_state ?? ''}
              placeholder="MO"
              className={inputClass}
              style={inputStyle}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1" htmlFor="address_zip">
            ZIP
          </label>
          <input
            id="address_zip"
            name="address_zip"
            type="text"
            defaultValue={config.address_zip ?? ''}
            placeholder="64108"
            className={inputClass}
            style={inputStyle}
          />
        </div>
      </div>

      {/* Service Area */}
      <div className="bg-gray-900 rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold text-white">Service Area</h2>
        <div>
          <label className="block text-sm text-gray-400 mb-1" htmlFor="service_area">
            Service area cities (JSON array)
          </label>
          <textarea
            id="service_area"
            name="service_area"
            defaultValue={config.service_area ?? ''}
            placeholder={`["Kansas City", "Overland Park", "Lee's Summit"]`}
            rows={3}
            className={`${inputClass} py-3 resize-y`}
            style={{ fontSize: '16px' }}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1" htmlFor="service_area_note">
            Outside-area note (shown in footer)
          </label>
          <input
            id="service_area_note"
            name="service_area_note"
            type="text"
            defaultValue={config.service_area_note ?? ''}
            placeholder="Serving KC metro & surrounding areas. Contact us for outside-area events."
            className={inputClass}
            style={inputStyle}
          />
        </div>
      </div>

      {/* Hours */}
      <div className="bg-gray-900 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Hours</h2>
        <div className="space-y-3">
          {hours.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No hours data found. Seed the database with the migration to add hours rows.
            </p>
          ) : (
            hours.map((row, i) => <HoursRowInput key={row.id} row={row} index={i} />)
          )}
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold rounded-xl transition-colors"
        style={{ minHeight: '48px', fontSize: '16px' }}
      >
        Save Site Info
      </button>
    </form>
  )
}

function HoursRowInput({ row, index }: { row: HoursRow; index: number }) {
  const [isClosed, setIsClosed] = useState(row.is_closed)

  const timeInputClass =
    'bg-gray-800 border border-gray-700 rounded-lg px-3 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 disabled:opacity-40 disabled:cursor-not-allowed'
  const timeInputStyle = { minHeight: '40px', fontSize: '16px', width: '120px' }

  return (
    <div className="flex flex-wrap items-center gap-3 py-2 border-b border-gray-800 last:border-0">
      {/* Hidden fields */}
      <input type="hidden" name={`hours[${index}][id]`} value={row.id} />
      <input type="hidden" name={`hours[${index}][day_name]`} value={row.day_name} />
      <input type="hidden" name={`hours[${index}][day_order]`} value={row.day_order} />
      <input type="hidden" name={`hours[${index}][is_closed]`} value={String(isClosed)} />

      {/* Day name */}
      <span className="text-white font-medium w-24 shrink-0">{row.day_name}</span>

      {/* Closed toggle */}
      <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={isClosed}
          onChange={(e) => setIsClosed(e.target.checked)}
          className="w-4 h-4 accent-amber-500"
        />
        Closed
      </label>

      {/* Open time */}
      <div className="flex items-center gap-2">
        <label className="text-xs text-gray-500">Open</label>
        <input
          type="time"
          name={`hours[${index}][open_time]`}
          defaultValue={row.open_time ?? ''}
          disabled={isClosed}
          className={timeInputClass}
          style={timeInputStyle}
        />
      </div>

      {/* Close time */}
      <div className="flex items-center gap-2">
        <label className="text-xs text-gray-500">Close</label>
        <input
          type="time"
          name={`hours[${index}][close_time]`}
          defaultValue={row.close_time ?? ''}
          disabled={isClosed}
          className={timeInputClass}
          style={timeInputStyle}
        />
      </div>
    </div>
  )
}
