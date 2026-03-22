import Link from 'next/link'
import DeployButton from './components/DeployButton'

const sections = [
  { href: '/ew-admin/builder', emoji: '🎨', title: 'Page Builder', desc: 'Drag-and-drop visual editor for all pages' },
  { href: '/ew-admin/site-info', emoji: '🏪', title: 'Site Info', desc: 'Hours, phone, address, service area' },
  { href: '/ew-admin/homepage', emoji: '📣', title: 'Homepage', desc: 'Hero headline, subtext, announcement banner' },
  { href: '/ew-admin/menu', emoji: '🍽️', title: 'Menu', desc: 'Add, edit, and delete menu items' },
  { href: '/ew-admin/testimonials', emoji: '⭐', title: 'Testimonials', desc: 'Manage customer testimonials' },
  { href: '/ew-admin/about', emoji: '👨‍🍳', title: 'About', desc: 'Chef bio and values section' },
  { href: '/ew-admin/journal', emoji: '📖', title: 'Journal', desc: 'Publish and manage journal posts' },
  { href: '/ew-admin/services', emoji: '🎪', title: 'Services', desc: 'Catering and Chef-On-Demand copy' },
  { href: '/ew-admin/media', emoji: '🖼️', title: 'Media', desc: 'Upload logo, OG image, food photos' },
  { href: '/ew-admin/inquiries', emoji: '📬', title: 'Inquiries', desc: 'View catering and chef inquiry submissions' },
  { href: '/ew-admin/analytics', emoji: '📊', title: 'Analytics', desc: 'Basic page-view analytics' },
]

export default function AdminDashboard() {
  return (
    <div className="text-gray-100 p-6 md:p-8">
      <div className="max-w-4xl mx-auto">

        {/* Header row */}
        <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Dashboard</h1>
            <p className="text-gray-400 text-sm">
              Content saves instantly. Use Deploy when you want to push code changes live.
            </p>
          </div>
          <DeployButton />
        </div>

        {/* Status legend */}
        <div className="flex gap-4 mb-6 flex-wrap">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
            Content changes → live instantly via Supabase
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span className="w-2 h-2 rounded-full bg-orange-500 inline-block" />
            Code/layout changes → need Deploy
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="bg-gray-900 rounded-xl p-6 hover:bg-gray-800 transition-colors group flex flex-col justify-center"
            >
              <div className="text-3xl mb-3">{section.emoji}</div>
              <h2 className="text-lg font-bold text-white group-hover:text-yellow-400 transition-colors mb-1">
                {section.title}
              </h2>
              <p className="text-gray-400 text-sm">{section.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
