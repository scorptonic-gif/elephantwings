'use client'

import { useState } from 'react'
import { useFormState } from 'react-dom'
import { saveMenuItemAction, deleteMenuItemAction } from './actions'
import { MENU_SECTIONS, DIETARY_TAGS } from '@/lib/cms-types'
import type { MenuItem } from '@/lib/cms-types'

interface Props {
  itemsBySection: Record<string, MenuItem[]>
}

const inputClass =
  'w-full bg-gray-800 border border-gray-700 rounded-lg px-4 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500'
const inputStyle = { minHeight: '44px', fontSize: '16px' }

function formatPrice(cents: number): string {
  return '$' + (cents / 100).toFixed(2)
}

function MenuItemForm({
  item,
  onCancel,
}: {
  item?: MenuItem
  onCancel: () => void
}) {
  const [state, formAction] = useFormState(saveMenuItemAction, null)
  const [priceDollars, setPriceDollars] = useState(
    item ? (item.price_cents / 100).toFixed(2) : ''
  )

  // Convert dollars to cents for the hidden field
  const priceCents = Math.round(parseFloat(priceDollars || '0') * 100)

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
      <input type="hidden" name="price_cents" value={String(priceCents)} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-gray-400 mb-1">
            Name <span className="text-red-400">*</span>
          </label>
          <input
            name="name"
            type="text"
            required
            defaultValue={item?.name ?? ''}
            placeholder="Item name"
            className={inputClass}
            style={inputStyle}
          />
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1">
            Price (dollars) <span className="text-red-400">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            required
            value={priceDollars}
            onChange={(e) => setPriceDollars(e.target.value)}
            placeholder="12.99"
            className={inputClass}
            style={inputStyle}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs text-gray-400 mb-1">Description</label>
        <textarea
          name="description"
          defaultValue={item?.description ?? ''}
          placeholder="Optional description"
          rows={2}
          className={`${inputClass} py-2 resize-y`}
          style={{ fontSize: '16px' }}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-gray-400 mb-1">
            Section <span className="text-red-400">*</span>
          </label>
          <select
            name="section"
            required
            defaultValue={item?.section ?? ''}
            className={`${inputClass} py-2`}
            style={inputStyle}
          >
            <option value="">Select section…</option>
            {MENU_SECTIONS.map((s) => (
              <option key={s} value={s}>
                {s.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
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
      </div>

      <div>
        <label className="block text-xs text-gray-400 mb-2">Dietary tags</label>
        <div className="flex flex-wrap gap-3">
          {DIETARY_TAGS.map((tag) => (
            <label key={tag} className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                name="dietary_tags"
                value={tag}
                defaultChecked={item?.dietary_tags.includes(tag)}
                className="accent-orange-500"
              />
              {tag}
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          className="px-5 py-2 rounded-lg font-semibold text-white text-sm transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#E85A1A' }}
        >
          {item ? 'Update Item' : 'Add Item'}
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

function MenuItemRow({ item, onEdit }: { item: MenuItem; onEdit: (item: MenuItem) => void }) {
  const [confirming, setConfirming] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleDelete() {
    const result = await deleteMenuItemAction(item.id)
    if (!result.success) {
      setError(result.error)
      setConfirming(false)
    }
  }

  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-gray-800 last:border-0">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-white">{item.name}</span>
          <span className="text-orange-400 font-mono text-sm">{formatPrice(item.price_cents)}</span>
          {item.dietary_tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        {item.description && (
          <p className="text-gray-400 text-sm mt-0.5 truncate">{item.description}</p>
        )}
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

export default function MenuEditor({ itemsBySection }: Props) {
  const [addingNew, setAddingNew] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)

  function handleEdit(item: MenuItem) {
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
          + Add New Item
        </button>
      </div>

      {addingNew && (
        <div className="bg-gray-900 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-gray-300 mb-1">New Menu Item</h3>
          <MenuItemForm onCancel={handleCancelNew} />
        </div>
      )}

      {MENU_SECTIONS.map((section) => {
        const items = itemsBySection[section] ?? []
        return (
          <div key={section} className="bg-gray-900 rounded-xl p-5">
            <h2 className="text-base font-bold text-white capitalize mb-3">
              {section.replace(/_/g, ' ')}
              <span className="ml-2 text-xs font-normal text-gray-500">({items.length})</span>
            </h2>

            {items.length === 0 ? (
              <p className="text-gray-500 text-sm italic">No items in this section.</p>
            ) : (
              <div>
                {items.map((item) => (
                  <div key={item.id}>
                    <MenuItemRow item={item} onEdit={handleEdit} />
                    {editingItem?.id === item.id && (
                      <MenuItemForm item={item} onCancel={handleCancelEdit} />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
