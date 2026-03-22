'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'

const GrapesBuilder = dynamic(() => import('./GrapesBuilder'), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center bg-gray-950">
      <span className="text-gray-400 text-sm">Loading builder…</span>
    </div>
  ),
})

const PAGES = [
  { slug: 'home', name: 'Homepage', path: '/' },
  { slug: 'about', name: 'About', path: '/about' },
  { slug: 'services-catering', name: 'Catering', path: '/services/catering' },
  { slug: 'services-cod', name: 'Chef-On-Demand', path: '/services/chef-on-demand' },
  { slug: 'parlor-kc', name: 'Parlor KC', path: '/parlor-kc' },
  { slug: 'journal', name: 'Journal', path: '/journal' },
  { slug: 'links', name: 'Links', path: '/links' },
]

export default function BuilderPage() {
  const [activePage, setActivePage] = useState<typeof PAGES[0] | null>(null)

  if (!activePage) {
    return (
      <div className="text-gray-100 p-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-2">Page Builder</h1>
          <p className="text-gray-400 text-sm mb-8">
            Select a page to open the visual editor. Drag blocks from the left panel, click to edit text, then hit Save &amp; Publish.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PAGES.map((page) => (
              <button
                key={page.slug}
                onClick={() => setActivePage(page)}
                className="bg-gray-900 hover:bg-gray-800 rounded-xl p-5 text-left transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white group-hover:text-orange-400 transition-colors">{page.name}</p>
                    <p className="text-gray-500 text-xs mt-1">{page.path}</p>
                  </div>
                  <span className="text-gray-600 group-hover:text-orange-400 text-lg transition-colors">→</span>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-8 bg-gray-900 rounded-xl p-5 border border-gray-800">
            <p className="text-gray-400 text-sm">
              <strong className="text-white">How it works:</strong> The builder saves your page layout to the database. The live site renders the saved content. Changes are live immediately after saving — no deploys needed.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Page selector bar */}
      <div className="flex items-center gap-2 px-4 py-2 bg-gray-950 border-b border-gray-800 shrink-0 overflow-x-auto">
        <button
          onClick={() => setActivePage(null)}
          className="text-gray-400 hover:text-white text-xs shrink-0 mr-2"
        >
          ← Pages
        </button>
        {PAGES.map((page) => (
          <button
            key={page.slug}
            onClick={() => setActivePage(page)}
            className={`px-3 py-1 text-xs rounded-lg shrink-0 transition-colors ${
              activePage.slug === page.slug
                ? 'bg-orange-600 text-white font-bold'
                : 'bg-gray-800 text-gray-300 hover:text-white'
            }`}
          >
            {page.name}
          </button>
        ))}
        <a
          href={activePage.path}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto text-xs text-gray-400 hover:text-white shrink-0"
        >
          View Live →
        </a>
      </div>

      {/* Builder fills remaining height */}
      <div className="flex-1 overflow-hidden">
        <GrapesBuilder key={activePage.slug} slug={activePage.slug} pageName={activePage.name} />
      </div>
    </div>
  )
}
