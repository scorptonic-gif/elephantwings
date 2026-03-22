'use client'

import { useState, useRef } from 'react'
import { uploadMediaAction } from '../actions'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

const inputClass =
  'w-full bg-gray-800 border border-gray-700 rounded-lg px-4 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500'
const inputStyle = { minHeight: '48px', fontSize: '16px' }

export default function MediaUploader() {
  const [label, setLabel] = useState('')
  const [clientError, setClientError] = useState<string | null>(null)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  function validateClient(file: File | null): string | null {
    if (!file || file.size === 0) return 'Please select a file'
    if (!ALLOWED_TYPES.includes(file.type)) return 'Only JPEG, PNG, and WebP images are allowed'
    if (file.size > MAX_SIZE) return 'File must be 5MB or smaller'
    return null
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setResult(null)

    const file = fileRef.current?.files?.[0] ?? null
    const err = validateClient(file)
    if (err) {
      setClientError(err)
      return
    }
    setClientError(null)

    const formData = new FormData()
    formData.append('file', file!)
    formData.append('label', label)

    setUploading(true)
    try {
      const res = await uploadMediaAction(formData)
      if (res.success) {
        setResult({ success: true, message: `Uploaded "${res.data.label}" successfully.` })
        setLabel('')
        if (fileRef.current) fileRef.current.value = ''
      } else {
        setResult({ success: false, message: res.error })
      }
    } finally {
      setUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-900 rounded-xl p-6 space-y-4">
      <h2 className="text-lg font-semibold text-white">Upload New Image</h2>

      {clientError && (
        <div className="bg-red-900/40 border border-red-700/60 rounded-lg p-3 text-red-300 text-sm">
          {clientError}
        </div>
      )}
      {result && (
        <div
          className={`rounded-lg p-3 text-sm border ${
            result.success
              ? 'bg-green-900/40 border-green-700/60 text-green-300'
              : 'bg-red-900/40 border-red-700/60 text-red-300'
          }`}
        >
          {result.message}
        </div>
      )}

      <div>
        <label className="block text-sm text-gray-400 mb-1" htmlFor="media-label">
          Label <span className="text-red-400">*</span>
        </label>
        <input
          id="media-label"
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="e.g. logo, og_default, food_photo_1"
          required
          className={inputClass}
          style={inputStyle}
        />
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1" htmlFor="media-file">
          Image file <span className="text-red-400">*</span>
        </label>
        <input
          id="media-file"
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={() => setClientError(null)}
          className="w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-700 file:text-white hover:file:bg-gray-600 cursor-pointer"
          style={{ minHeight: '48px', fontSize: '16px' }}
        />
        <p className="text-xs text-gray-500 mt-1">JPEG, PNG, or WebP · max 5 MB</p>
      </div>

      <button
        type="submit"
        disabled={uploading}
        className="w-full font-bold rounded-xl text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ minHeight: '48px', fontSize: '16px', backgroundColor: '#E85A1A' }}
      >
        {uploading ? 'Uploading…' : 'Upload Image'}
      </button>
    </form>
  )
}
