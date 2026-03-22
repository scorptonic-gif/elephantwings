import Link from 'next/link'
import SiteLayout from '@/components/SiteLayout'

export default function NotFound() {
  return (
    <SiteLayout>
      <section className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-24">
        <div className="text-7xl mb-6 select-none">🐘</div>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-stone-900 mb-4">
          Oops! That spice didn&apos;t exist.
        </h1>
        <p className="text-stone-500 text-xl mb-10 max-w-md">
          Let&apos;s get you back to the menu.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/order-online/" className="btn-primary">Order Online</Link>
          <Link href="/services/catering/" className="btn-outline">Event Catering</Link>
          <Link href="/services/chef-on-demand/" className="btn-outline">Chef-On-Demand</Link>
        </div>
      </section>
    </SiteLayout>
  )
}
