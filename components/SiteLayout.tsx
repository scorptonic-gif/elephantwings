import Header from './Header'
import Footer from './Footer'
import JsonLd from './JsonLd'
import { buildLocalBusinessSchema, type PageType } from '@/lib/schema'
import { SITE_CONFIG } from '@/lib/config'
import type { Silo } from '@/lib/routes'

interface SiteLayoutProps {
  children: React.ReactNode
  activeSilo?: Silo
  pageType?: PageType
}

export default function SiteLayout({
  children,
  activeSilo,
  pageType = 'general',
}: SiteLayoutProps) {
  const schema = buildLocalBusinessSchema(SITE_CONFIG, pageType)

  return (
    <div className="min-h-screen flex flex-col bg-white text-charcoal">
      <JsonLd schema={schema} />
      <Header activeSilo={activeSilo} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
