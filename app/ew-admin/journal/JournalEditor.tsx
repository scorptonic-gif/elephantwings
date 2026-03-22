'use client'

import { useState } from 'react'
import { useFormState } from 'react-dom'
import { savePostAction, deletePostAction, publishPostAction, unpublishPostAction } from './actions'
import type { JournalPost } from '@/lib/cms-types'
import { JOURNAL_PILLARS } from '@/lib/cms-types'

interface Props {
  posts: JournalPost[]
}

const inputClass =
  'w-full bg-gray-800 border border-gray-700 rounded-lg px-4 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500'
const inputStyle = { minHeight: '48px', fontSize: '16px' }

function clientSlug(title: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
  return slug === '' ? '' : slug
}

function PostForm({
  item,
  onCancel,
}: {
  item?: JournalPost
  onCancel: () => void
}) {
  const [state, formAction] = useFormState(savePostAction, null)
  const [titleValue, setTitleValue] = useState(item?.title ?? '')
  const slugPreview = clientSlug(titleValue)

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
      <input type="hidden" name="status" value={item?.status ?? 'draft'} />

      <div>
        <label className="block text-xs text-gray-400 mb-1">
          Title <span className="text-red-400">*</span>
        </label>
        <input
          name="title"
          type="text"
          required
          value={titleValue}
          onChange={(e) => setTitleValue(e.target.value)}
          placeholder="Post title…"
          className={inputClass}
          style={inputStyle}
        />
        {slugPreview && (
          <p className="text-xs text-gray-500 mt-1">
            Slug: <span className="text-gray-400 font-mono">{slugPreview}</span>
          </p>
        )}
      </div>

      <div>
        <label className="block text-xs text-gray-400 mb-1">
          Excerpt <span className="text-red-400">*</span>
        </label>
        <textarea
          name="excerpt"
          required
          defaultValue={item?.excerpt ?? ''}
          placeholder="Short description for SEO and previews…"
          rows={3}
          className={`${inputClass} py-3 resize-y`}
          style={{ minHeight: '96px', fontSize: '16px' }}
        />
      </div>

      <div>
        <label className="block text-xs text-gray-400 mb-1">
          Body <span className="text-red-400">*</span>
        </label>
        <textarea
          name="body"
          required
          defaultValue={item?.body ?? ''}
          placeholder="Full post content…"
          rows={10}
          className={`${inputClass} py-3 resize-y`}
          style={{ minHeight: '200px', fontSize: '16px' }}
        />
      </div>

      <div>
        <label className="block text-xs text-gray-400 mb-1">
          Pillar / Category <span className="text-red-400">*</span>
        </label>
        <select
          name="pillar"
          required
          defaultValue={item?.pillar ?? ''}
          className={inputClass}
          style={inputStyle}
        >
          <option value="" disabled>Select a pillar…</option>
          {JOURNAL_PILLARS.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs text-gray-400 mb-1">Cover Image URL</label>
        <input
          name="cover_image_url"
          type="url"
          defaultValue={item?.cover_image_url ?? ''}
          placeholder="https://…"
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
          {item ? 'Update Post' : 'Save Post'}
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

function PostRow({
  item,
  onEdit,
}: {
  item: JournalPost
  onEdit: (item: JournalPost) => void
}) {
  const [confirming, setConfirming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    setLoading(true)
    const result = await deletePostAction(item.id)
    setLoading(false)
    if (!result.success) {
      setError(result.error)
      setConfirming(false)
    }
  }

  async function handlePublish() {
    setLoading(true)
    const result = await publishPostAction(item.id, item.slug)
    setLoading(false)
    if (!result.success) setError(result.error)
  }

  async function handleUnpublish() {
    setLoading(true)
    const result = await unpublishPostAction(item.id, item.slug)
    setLoading(false)
    if (!result.success) setError(result.error)
  }

  return (
    <div className="flex items-start justify-between gap-4 py-4 border-b border-gray-800 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-white font-medium text-sm">{item.title}</p>
        <p className="text-gray-500 text-xs font-mono mt-0.5">{item.slug}</p>
        <div className="flex items-center gap-2 mt-1">
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded ${
              item.status === 'published'
                ? 'bg-green-900/30 text-green-400'
                : 'bg-gray-700 text-gray-400'
            }`}
          >
            {item.status === 'published' ? 'Published' : 'Draft'}
          </span>
          <span className="text-gray-600 text-xs">{item.pillar}</span>
          {item.published_at && (
            <span className="text-gray-600 text-xs">
              {new Date(item.published_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          )}
        </div>
        {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
      </div>

      <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
        {confirming ? (
          <>
            <span className="text-xs text-gray-400">Delete?</span>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="text-xs px-3 py-1 rounded bg-red-700 hover:bg-red-600 text-white font-medium transition-colors disabled:opacity-50"
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
            {item.status === 'draft' ? (
              <button
                onClick={handlePublish}
                disabled={loading}
                className="text-xs px-3 py-1 rounded bg-green-900/50 hover:bg-green-800/60 text-green-300 font-medium transition-colors disabled:opacity-50"
              >
                Publish
              </button>
            ) : (
              <button
                onClick={handleUnpublish}
                disabled={loading}
                className="text-xs px-3 py-1 rounded bg-yellow-900/50 hover:bg-yellow-800/60 text-yellow-300 font-medium transition-colors disabled:opacity-50"
              >
                Unpublish
              </button>
            )}
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

export default function JournalEditor({ posts }: Props) {
  const [addingNew, setAddingNew] = useState(false)
  const [editingItem, setEditingItem] = useState<JournalPost | null>(null)

  function handleEdit(item: JournalPost) {
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
          + Add New Post
        </button>
      </div>

      {addingNew && (
        <div className="bg-gray-900 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-gray-300 mb-1">New Post</h3>
          <PostForm onCancel={handleCancelNew} />
        </div>
      )}

      <div className="bg-gray-900 rounded-xl p-5">
        <h2 className="text-base font-bold text-white mb-3">
          All Posts
          <span className="ml-2 text-xs font-normal text-gray-500">({posts.length})</span>
        </h2>

        {posts.length === 0 ? (
          <p className="text-gray-500 text-sm italic">No posts yet.</p>
        ) : (
          <div>
            {posts.map((item) => (
              <div key={item.id}>
                <PostRow item={item} onEdit={handleEdit} />
                {editingItem?.id === item.id && (
                  <PostForm item={item} onCancel={handleCancelEdit} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
