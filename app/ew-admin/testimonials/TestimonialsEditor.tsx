'use client'

import { useState } from 'react'
import { useFormState } from 'react-dom'
import { saveTestimonialAction, deleteTestimonialAction } from './actions'
import type { Testimonial } from '@/lib/cms-types'

interface Props {
  testimonials: Testimonial[]
}

const inputClass =
  'w-full bg-gray-800 border border-gray-700 rounded-lg px-4 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500'
const inputStyle = { minHeight: '48px', fontSize: '16px' }

function TestimonialForm({
  item,
  onCancel,
}: {
  item?: Testimonial
  onCancel: () => void
}) {
  const [state, formAction] = useFormState(saveTestimonialAction, null)

  return (
    <form action={formAction} className="bg-gray-800 rounded-xl p-5 space-y-4 mt-3">
      {state && !state.success && (
        <div className="bg-red-900/40 border border-red-700/60 rounded-lg p-3 text-red-300 text-sm">
          {state.error}
        </div>
      )}
      {state && state.success && (
        <div className="bg-green-900/40 border border-green-700/60 rounded-lg p-3 text-green-300 text-sm">
          Saved successfully.
        </div>
      )}

      {item && <input type="hidden" name="id" value={item.id} />}

      <div>
        <label className="block text-xs text-gray-400 mb-1">
          Quote <span className="text-red-400">*</span>
        </label>
        <textarea
          name="quote"
          required
          defaultValue={item?.quote ?? ''}
          placeholder="Enter testimonial quote…"
          rows={3}
          className={`${inputClass} py-3 resize-y`}
          style={{ minHeight: '96px', fontSize: '16px' }}
        />
      </div>

      <div>
        <label className="block text-xs text-gray-400 mb-1">
          Attribution <span className="text-red-400">*</span>
        </label>
        <input
          name="attribution"
          type="text"
          required
          defaultValue={item?.attribution ?? ''}
          placeholder="e.g. Jane D., Kansas City"
          className={inputClass}
          style={inputStyle}
        />
      </div>

      <div>
        <label className="block text-xs text-gray-400 mb-1">Sort order</label>
        <input
          name="sort_order"
          type="number"
          min="0"
          defaultValue={item?.sort_order ?? 0}
          className={inputClass}
          style={inputStyle}
        />
      </div>

      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          className="px-5 py-2 rounded-lg font-semibold text-white text-sm transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#E85A1A' }}
        >
          {item ? 'Update Testimonial' : 'Add Testimonial'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2 rounded-lg font-semibold text-gray-300 text-sm bg-gray-700 hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

function TestimonialRow({
  item,
  onEdit,
}: {
  item: Testimonial
  onEdit: (item: Testimonial) => void
}) {
  const [confirming, setConfirming] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleDelete() {
    const result = await deleteTestimonialAction(item.id)
    if (!result.success) {
      setError(result.error)
      setConfirming(false)
    }
  }

  return (
    <div className="flex items-start justify-between gap-4 py-4 border-b border-gray-800 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm leading-relaxed line-clamp-2">
          &ldquo;{item.quote}&rdquo;
        </p>
        <p className="text-gray-400 text-xs mt-1">— {item.attribution}</p>
        {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {confirming ? (
          <>
            <span className="text-xs text-gray-400">Delete?</span>
            <button
              onClick={handleDelete}
              className="text-xs px-3 py-1 rounded bg-red-700 hover:bg-red-600 text-white font-medium transition-colors"
            >
              Yes
            </button>
            <button
              onClick={() => setConfirming(false)}
              className="text-xs px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 text-gray-300 font-medium transition-colors"
            >
              No
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => onEdit(item)}
              className="text-xs px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 text-gray-300 font-medium transition-colors"
            >
              Edit
            </button>
            <button
              onClick={() => setConfirming(true)}
              className="text-xs px-3 py-1 rounded bg-red-900/50 hover:bg-red-800/60 text-red-300 font-medium transition-colors"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default function TestimonialsEditor({ testimonials }: Props) {
  const [addingNew, setAddingNew] = useState(false)
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null)

  function handleEdit(item: Testimonial) {
    setEditingItem(item)
    setAddingNew(false)
  }

  function handleCancelEdit() {
    setEditingItem(null)
  }

  function handleCancelNew() {
    setAddingNew(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={() => {
            setAddingNew(true)
            setEditingItem(null)
          }}
          className="px-5 py-2 rounded-lg font-semibold text-white text-sm transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#E85A1A' }}
        >
          + Add New Testimonial
        </button>
      </div>

      {addingNew && (
        <div className="bg-gray-900 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-gray-300 mb-1">New Testimonial</h3>
          <TestimonialForm onCancel={handleCancelNew} />
        </div>
      )}

      <div className="bg-gray-900 rounded-xl p-5">
        <h2 className="text-base font-bold text-white mb-3">
          All Testimonials
          <span className="ml-2 text-xs font-normal text-gray-500">({testimonials.length})</span>
        </h2>

        {testimonials.length === 0 ? (
          <p className="text-gray-500 text-sm italic">No testimonials yet.</p>
        ) : (
          <div>
            {testimonials.map((item) => (
              <div key={item.id}>
                <TestimonialRow item={item} onEdit={handleEdit} />
                {editingItem?.id === item.id && (
                  <TestimonialForm item={item} onCancel={handleCancelEdit} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
