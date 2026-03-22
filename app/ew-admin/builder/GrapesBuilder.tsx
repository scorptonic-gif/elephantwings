'use client'

import { useEffect, useRef, useState } from 'react'
import './builder.css'

interface Props {
  slug: string
  pageName: string
}

type RightTab = 'styles' | 'traits' | 'layers'

export default function GrapesBuilder({ slug, pageName }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const gjsRef = useRef<Record<string, (...args: unknown[]) => unknown> | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'saving' | 'saved' | 'error'>('loading')
  const [errorMsg, setErrorMsg] = useState('')
  const [rightTab, setRightTab] = useState<RightTab>('styles')
  const [device, setDeviceState] = useState('Desktop')

  useEffect(() => {
    if (!containerRef.current) return
    let destroyed = false

    async function init() {
      const grapesjs = (await import('grapesjs')).default
      // @ts-expect-error css import
      await import('grapesjs/dist/css/grapes.min.css')
      if (destroyed || !containerRef.current) return

      let initHtml = getDefaultContent(slug)
      let initCss = ''
      try {
        const res = await fetch(`/api/builder?slug=${encodeURIComponent(slug)}`)
        if (res.ok) {
          const data = await res.json()
          if (data.html) initHtml = data.html
          if (data.css) initCss = data.css
        }
      } catch { /* start fresh */ }

      if (destroyed) return

      const editor = grapesjs.init({
        container: containerRef.current,
        height: '100%',
        width: 'auto',
        fromElement: false,
        storageManager: false,
        components: initHtml,
        style: initCss,
        canvas: {
          styles: ['https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&display=swap'],
        },
        deviceManager: {
          devices: [
            { name: 'Desktop', width: '' },
            { name: 'Tablet', width: '768px', widthMedia: '992px' },
            { name: 'Mobile', width: '375px', widthMedia: '480px' },
          ],
        },
        panels: { defaults: [] },
        blockManager: {
          appendTo: '.gjs-blocks-container',
          blocks: getBlocks(),
        },
        styleManager: {
          appendTo: '.gjs-styles-container',
          sectors: getStyleSectors(),
        },
        layerManager: { appendTo: '.gjs-layers-container' },
        traitManager: { appendTo: '.gjs-traits-container' },
      })

      gjsRef.current = editor as unknown as Record<string, (...args: unknown[]) => unknown>
      if (!destroyed) setStatus('ready')
    }

    init().catch((err) => {
      if (!destroyed) { setErrorMsg(String(err)); setStatus('error') }
    })

    return () => {
      destroyed = true
      if (gjsRef.current) {
        try { gjsRef.current.destroy() } catch { /* ignore */ }
        gjsRef.current = null
      }
    }
  }, [slug])

  async function handleSave() {
    if (!gjsRef.current) return
    setStatus('saving')
    try {
      const editor = gjsRef.current
      const res = await fetch('/api/builder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          html: editor.getHtml(),
          css: editor.getCss(),
          components: editor.getComponents(),
          styles: editor.getStyle(),
        }),
      })
      if (!res.ok) throw new Error((await res.json()).error || 'Save failed')
      setStatus('saved')
      setTimeout(() => setStatus('ready'), 2500)
    } catch (err) {
      setErrorMsg(String(err))
      setStatus('error')
    }
  }

  function run(command: string) { gjsRef.current?.runCommand(command) }

  function switchDevice(name: string) {
    gjsRef.current?.setDevice(name)
    setDeviceState(name)
  }

  const btnBase = 'px-3 py-1.5 text-xs font-medium rounded-md transition-all'
  const btnGhost = `${btnBase} text-slate-400 hover:text-white hover:bg-slate-700`
  const btnActive = `${btnBase} text-white bg-slate-700`

  const tabBtn = (tab: RightTab, label: string) => (
    <button
      key={tab}
      onClick={() => setRightTab(tab)}
      className={`flex-1 py-2 text-xs font-semibold transition-colors ${
        rightTab === tab
          ? 'text-white border-b-2'
          : 'text-slate-500 hover:text-slate-300 border-b-2 border-transparent'
      }`}
      style={rightTab === tab ? { borderColor: '#E85A1A' } : {}}
    >
      {label}
    </button>
  )

  return (
    <div className="flex flex-col h-full" style={{ background: '#0f172a' }}>

      {/* ── Toolbar ── */}
      <div
        className="flex items-center gap-2 px-4 py-2 shrink-0 flex-wrap"
        style={{ background: '#111827', borderBottom: '1px solid #1e293b' }}
      >
        {/* Page name */}
        <span className="text-white font-semibold text-sm mr-2">{pageName}</span>

        {/* Divider */}
        <div className="w-px h-5 bg-slate-700 mx-1" />

        {/* History */}
        <button onClick={() => run('core:undo')} className={btnGhost} title="Undo">↩</button>
        <button onClick={() => run('core:redo')} className={btnGhost} title="Redo">↪</button>

        <div className="w-px h-5 bg-slate-700 mx-1" />

        {/* Device */}
        <button onClick={() => switchDevice('Desktop')} className={device === 'Desktop' ? btnActive : btnGhost} title="Desktop">🖥 Desktop</button>
        <button onClick={() => switchDevice('Tablet')} className={device === 'Tablet' ? btnActive : btnGhost} title="Tablet">📱 Tablet</button>
        <button onClick={() => switchDevice('Mobile')} className={device === 'Mobile' ? btnActive : btnGhost} title="Mobile">📲 Mobile</button>

        <div className="w-px h-5 bg-slate-700 mx-1" />

        {/* View toggles */}
        <button onClick={() => run('sw-visibility')} className={btnGhost} title="Toggle element borders">⬜ Borders</button>
        <button onClick={() => run('preview')} className={btnGhost} title="Preview">👁 Preview</button>
        <button onClick={() => run('fullscreen')} className={btnGhost} title="Fullscreen">⛶</button>

        {/* Save */}
        <button
          onClick={handleSave}
          disabled={status === 'saving' || status === 'loading'}
          className="ml-auto px-5 py-1.5 text-sm font-bold rounded-lg text-white disabled:opacity-40 transition-all"
          style={{
            background: status === 'saved' ? '#16a34a' : '#E85A1A',
            boxShadow: status === 'saved' ? 'none' : '0 0 0 0 #E85A1A',
          }}
        >
          {status === 'saving' ? 'Saving…' : status === 'saved' ? '✓ Saved' : 'Save & Publish'}
        </button>
      </div>

      {/* Error bar */}
      {status === 'error' && (
        <div
          className="px-4 py-2 text-red-300 text-xs shrink-0 flex items-center justify-between"
          style={{ background: '#450a0a', borderBottom: '1px solid #7f1d1d' }}
        >
          <span>⚠ {errorMsg}</span>
          <button onClick={() => setStatus('ready')} className="text-red-400 hover:text-white ml-4">✕</button>
        </div>
      )}

      {/* ── Main area ── */}
      <div className="flex flex-1 overflow-hidden relative">

        {/* Loading overlay */}
        {status === 'loading' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20" style={{ background: '#0f172a' }}>
            <div className="w-8 h-8 border-2 border-slate-700 rounded-full mb-3" style={{ borderTopColor: '#E85A1A', animation: 'spin 0.8s linear infinite' }} />
            <span className="text-slate-400 text-sm">Loading editor…</span>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* ── Left panel: Blocks ── */}
        <div
          className="flex flex-col shrink-0 overflow-hidden"
          style={{ width: '200px', background: '#111827', borderRight: '1px solid #1e293b' }}
        >
          <div
            className="px-3 py-2.5 text-xs font-bold uppercase tracking-widest shrink-0"
            style={{ color: '#475569', borderBottom: '1px solid #1e293b' }}
          >
            Add Blocks
          </div>
          <div className="gjs-blocks-container flex-1 overflow-y-auto" />
        </div>

        {/* ── Canvas ── */}
        <div ref={containerRef} className="flex-1 overflow-hidden" style={{ minWidth: 0 }} />

        {/* ── Right panel: Styles / Traits / Layers ── */}
        <div
          className="flex flex-col shrink-0 overflow-hidden"
          style={{ width: '240px', background: '#111827', borderLeft: '1px solid #1e293b' }}
        >
          {/* Tabs */}
          <div className="flex shrink-0" style={{ borderBottom: '1px solid #1e293b' }}>
            {tabBtn('styles', 'Style')}
            {tabBtn('traits', 'Settings')}
            {tabBtn('layers', 'Layers')}
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto">
            <div className={`gjs-styles-container h-full ${rightTab === 'styles' ? '' : 'hidden'}`} />
            <div className={`gjs-traits-container h-full ${rightTab === 'traits' ? '' : 'hidden'}`} />
            <div className={`gjs-layers-container h-full ${rightTab === 'layers' ? '' : 'hidden'}`} />
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Default content ──────────────────────────────────────
function getDefaultContent(slug: string): string {
  const map: Record<string, string> = {
    home: `<section style="padding:100px 40px;text-align:center;background:#fff"><h1 style="font-size:2.5rem;font-family:'DM Sans',sans-serif;font-weight:700;color:#111">Bold Indian Fusion in the Heart of KC</h1><p style="font-size:1.1rem;color:#555;margin:16px auto 0;max-width:600px">Catering, private dining, and chef-on-demand experiences.</p><a href="/services/catering" style="display:inline-block;margin-top:32px;padding:14px 32px;background:#E85A1A;color:#fff;border-radius:8px;font-weight:700;text-decoration:none">Book an Event</a></section>`,
    about: `<section style="padding:80px 40px;max-width:800px;margin:0 auto"><h1 style="font-size:2rem;font-family:'DM Sans',sans-serif;font-weight:700">About Elephant Wings KC</h1><p style="margin-top:16px;color:#444;line-height:1.8">Tell your story here…</p></section>`,
  }
  return map[slug] ?? `<section style="padding:80px 40px;text-align:center"><h1 style="font-family:'DM Sans',sans-serif;font-weight:700;color:#111">New Page</h1><p style="color:#555;margin-top:12px">Drag blocks from the left panel to start building.</p></section>`
}

// ── Blocks ───────────────────────────────────────────────
function getBlocks() {
  return [
    { id: 'hero', label: '🦸<br/>Hero', category: 'Sections', content: `<section style="padding:100px 40px;text-align:center;background:#fff"><h1 style="font-size:2.5rem;font-family:'DM Sans',sans-serif;font-weight:700;color:#111">Your Headline Here</h1><p style="font-size:1.1rem;color:#555;margin-top:16px;max-width:600px;margin-left:auto;margin-right:auto">Supporting text goes here.</p><a href="#" style="display:inline-block;margin-top:32px;padding:14px 32px;background:#E85A1A;color:#fff;border-radius:8px;font-weight:700;text-decoration:none">Call to Action</a></section>` },
    { id: 'text-section', label: '📝<br/>Text', category: 'Sections', content: `<section style="padding:60px 40px;max-width:800px;margin:0 auto"><h2 style="font-size:1.75rem;font-family:'DM Sans',sans-serif;font-weight:700;color:#111">Section Title</h2><p style="margin-top:16px;color:#444;line-height:1.8">Your content here. Click to edit.</p></section>` },
    { id: 'two-col', label: '⬛⬛<br/>2 Column', category: 'Sections', content: `<section style="padding:60px 40px;display:flex;gap:40px;max-width:1100px;margin:0 auto;flex-wrap:wrap"><div style="flex:1;min-width:280px"><h2 style="font-family:'DM Sans',sans-serif;font-size:1.5rem;font-weight:700">Left Column</h2><p style="margin-top:12px;color:#444;line-height:1.8">Content here.</p></div><div style="flex:1;min-width:280px"><h2 style="font-family:'DM Sans',sans-serif;font-size:1.5rem;font-weight:700">Right Column</h2><p style="margin-top:12px;color:#444;line-height:1.8">Content here.</p></div></section>` },
    { id: 'image-text', label: '🖼<br/>Img + Text', category: 'Sections', content: `<section style="padding:60px 40px;display:flex;gap:40px;align-items:center;max-width:1100px;margin:0 auto;flex-wrap:wrap"><img src="https://placehold.co/500x350" alt="Image" style="width:100%;max-width:480px;border-radius:12px;object-fit:cover"/><div style="flex:1;min-width:260px"><h2 style="font-family:'DM Sans',sans-serif;font-size:1.75rem;font-weight:700">Heading</h2><p style="margin-top:12px;color:#444;line-height:1.8">Describe what's in the image.</p></div></section>` },
    { id: 'cta-banner', label: '📣<br/>CTA Banner', category: 'Sections', content: `<section style="padding:60px 40px;text-align:center;background:#E85A1A"><h2 style="font-family:'DM Sans',sans-serif;font-size:2rem;font-weight:700;color:#fff">Ready to Book?</h2><p style="color:rgba(255,255,255,0.85);margin-top:12px">Contact us today to check availability.</p><a href="/services/catering" style="display:inline-block;margin-top:28px;padding:14px 36px;background:#fff;color:#E85A1A;border-radius:8px;font-weight:700;text-decoration:none">Get in Touch</a></section>` },
    { id: 'card-grid', label: '🃏<br/>Cards', category: 'Sections', content: `<section style="padding:60px 40px;max-width:1100px;margin:0 auto"><h2 style="font-family:'DM Sans',sans-serif;font-size:1.75rem;font-weight:700;text-align:center;margin-bottom:40px">Our Services</h2><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:24px"><div style="background:#f9f9f9;border-radius:12px;padding:32px"><h3 style="font-family:'DM Sans',sans-serif;font-weight:700">Service One</h3><p style="margin-top:8px;color:#555;font-size:0.95rem">Description.</p></div><div style="background:#f9f9f9;border-radius:12px;padding:32px"><h3 style="font-family:'DM Sans',sans-serif;font-weight:700">Service Two</h3><p style="margin-top:8px;color:#555;font-size:0.95rem">Description.</p></div><div style="background:#f9f9f9;border-radius:12px;padding:32px"><h3 style="font-family:'DM Sans',sans-serif;font-weight:700">Service Three</h3><p style="margin-top:8px;color:#555;font-size:0.95rem">Description.</p></div></div></section>` },
    { id: 'contact-form', label: '📬<br/>Contact', category: 'Forms', content: `<section style="padding:60px 40px;max-width:600px;margin:0 auto"><h2 style="font-family:'DM Sans',sans-serif;font-size:1.75rem;font-weight:700;margin-bottom:32px">Get in Touch</h2><form style="display:flex;flex-direction:column;gap:16px"><input name="name" placeholder="Your Name" style="padding:12px 16px;border:1px solid #ddd;border-radius:8px;font-size:1rem"/><input name="email" type="email" placeholder="Email Address" style="padding:12px 16px;border:1px solid #ddd;border-radius:8px;font-size:1rem"/><input name="phone" type="tel" placeholder="Phone Number" style="padding:12px 16px;border:1px solid #ddd;border-radius:8px;font-size:1rem"/><textarea name="message" placeholder="Your message…" rows="5" style="padding:12px 16px;border:1px solid #ddd;border-radius:8px;font-size:1rem;resize:vertical"></textarea><button type="submit" style="padding:14px;background:#E85A1A;color:#fff;border:none;border-radius:8px;font-size:1rem;font-weight:700;cursor:pointer">Send Message</button></form></section>` },
    { id: 'booking-form', label: '📅<br/>Booking', category: 'Forms', content: `<section style="padding:60px 40px;max-width:600px;margin:0 auto"><h2 style="font-family:'DM Sans',sans-serif;font-size:1.75rem;font-weight:700;margin-bottom:32px">Request a Booking</h2><form style="display:flex;flex-direction:column;gap:16px"><input name="name" placeholder="Full Name" style="padding:12px 16px;border:1px solid #ddd;border-radius:8px;font-size:1rem"/><input name="email" type="email" placeholder="Email" style="padding:12px 16px;border:1px solid #ddd;border-radius:8px;font-size:1rem"/><input name="date" type="date" style="padding:12px 16px;border:1px solid #ddd;border-radius:8px;font-size:1rem"/><input name="guests" type="number" placeholder="Number of Guests" style="padding:12px 16px;border:1px solid #ddd;border-radius:8px;font-size:1rem"/><select name="service" style="padding:12px 16px;border:1px solid #ddd;border-radius:8px;font-size:1rem"><option value="">Select a Service</option><option value="catering">Event Catering</option><option value="cod">Chef-On-Demand</option><option value="parlor">Parlor Dining</option></select><textarea name="notes" placeholder="Special requests…" rows="4" style="padding:12px 16px;border:1px solid #ddd;border-radius:8px;font-size:1rem;resize:vertical"></textarea><button type="submit" style="padding:14px;background:#E85A1A;color:#fff;border:none;border-radius:8px;font-size:1rem;font-weight:700;cursor:pointer">Request Booking</button></form></section>` },
    { id: 'testimonial', label: '⭐<br/>Quote', category: 'Elements', content: `<blockquote style="padding:40px;background:#fff8f5;border-left:4px solid #E85A1A;border-radius:8px;margin:24px 40px"><p style="font-size:1.1rem;color:#333;line-height:1.8;font-style:italic">"The food was absolutely incredible."</p><footer style="margin-top:16px;font-weight:700;color:#E85A1A">— Happy Customer</footer></blockquote>` },
    { id: 'announcement', label: '📢<br/>Banner', category: 'Elements', content: `<div style="background:#C8174F;color:#fff;text-align:center;padding:14px 24px;font-weight:600">🎉 Now booking for fall events! <a href="/services/catering" style="color:#fff;text-decoration:underline;margin-left:8px">Book Now →</a></div>` },
    { id: 'button', label: '🔘<br/>Button', category: 'Elements', content: `<div style="text-align:center;padding:16px"><a href="#" style="display:inline-block;padding:14px 32px;background:#E85A1A;color:#fff;border-radius:8px;font-weight:700;text-decoration:none">Button Text</a></div>` },
    { id: 'image', label: '🖼<br/>Image', category: 'Elements', content: `<div style="padding:16px"><img src="https://placehold.co/800x400" alt="Image" style="width:100%;border-radius:12px;display:block"/></div>` },
    { id: 'divider', label: '—<br/>Divider', category: 'Elements', content: `<hr style="border:none;border-top:1px solid #e5e7eb;margin:40px auto;max-width:800px"/>` },
    { id: 'spacer', label: '↕<br/>Spacer', category: 'Elements', content: `<div style="height:60px"></div>` },
  ]
}

// ── Style sectors ────────────────────────────────────────
function getStyleSectors() {
  return [
    { name: 'Spacing', open: true, properties: ['padding', 'margin'] },
    { name: 'Size', open: false, properties: ['width', 'height', 'max-width', 'min-height'] },
    { name: 'Typography', open: false, properties: ['font-family', 'font-size', 'font-weight', 'color', 'line-height', 'text-align', 'text-decoration'] },
    { name: 'Background', open: false, properties: ['background-color', 'background-image', 'background-size', 'background-position'] },
    { name: 'Border', open: false, properties: ['border', 'border-radius', 'box-shadow'] },
    { name: 'Flex', open: false, properties: ['display', 'flex-direction', 'justify-content', 'align-items', 'gap', 'flex-wrap'] },
  ]
}
