'use client'

import { useState } from 'react'

type DeployStatus = 'idle' | 'deploying' | 'success' | 'error'

export default function DeployButton() {
  const [status, setStatus] = useState<DeployStatus>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleDeploy() {
    if (status === 'deploying') return
    if (!confirm('Deploy the latest changes to the live site? This takes about 2–3 minutes.')) return

    setStatus('deploying')
    setErrorMsg('')

    try {
      const res = await fetch('/api/deploy', { method: 'POST' })
      const data = await res.json()

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Deploy failed')
      }

      setStatus('success')
      setTimeout(() => setStatus('idle'), 8000)
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : String(err))
      setStatus('error')
      setTimeout(() => setStatus('idle'), 8000)
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <button
        onClick={handleDeploy}
        disabled={status === 'deploying'}
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all disabled:opacity-50"
        style={{
          background: status === 'success' ? '#16a34a' : status === 'error' ? '#7f1d1d' : '#1e293b',
          color: '#fff',
          border: '1px solid',
          borderColor: status === 'success' ? '#16a34a' : status === 'error' ? '#ef4444' : '#334155',
        }}
      >
        {status === 'deploying' && (
          <span className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        )}
        {status === 'idle' && '🚀'}
        {status === 'success' && '✓'}
        {status === 'error' && '⚠'}
        {status === 'idle' && 'Deploy to Vercel'}
        {status === 'deploying' && 'Deploying…'}
        {status === 'success' && 'Deploy triggered!'}
        {status === 'error' && 'Deploy failed'}
      </button>

      {status === 'deploying' && (
        <p className="text-xs text-slate-400">Build takes ~2–3 min. Check Vercel for progress.</p>
      )}
      {status === 'success' && (
        <p className="text-xs text-green-400">Vercel is building. Live in ~2–3 min.</p>
      )}
      {status === 'error' && errorMsg && (
        <p className="text-xs text-red-400">{errorMsg}</p>
      )}
    </div>
  )
}
