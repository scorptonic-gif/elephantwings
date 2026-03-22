import Link from 'next/link'
import Image from 'next/image'
import ClickToCall from './ClickToCall'
import { SITE_CONFIG } from '@/lib/config'
import { getSiteConfig, getHours } from '@/lib/cms'
import type { HoursRow } from '@/lib/cms-types'

function to12Hour(time: string) {
  const [h, m] = time.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return m === 0 ? `${hour} ${period}` : `${hour}:${String(m).padStart(2, '0')} ${period}`
}

export default async function Footer() {
  const staticConfig = SITE_CONFIG

  // Dynamic values — fall back to static config on error
  let phone: string = staticConfig.phone
  let phoneDisplay: string = staticConfig.phoneDisplay
  let addressStreet: string = staticConfig.address.street
  let addressCity: string = staticConfig.address.city
  let addressState: string = staticConfig.address.state
  let addressZip: string = staticConfig.address.zip

  // Hours: either DB rows or static config hours
  let dbHours: HoursRow[] | null = null

  let serviceAreaNote: string = 'Serving Kansas City metro & surrounding areas.'

  try {
    const config = await getSiteConfig()
    if (config.phone) phone = config.phone
    if (config.phone_display) phoneDisplay = config.phone_display
    if (config.address_street) addressStreet = config.address_street
    if (config.address_city) addressCity = config.address_city
    if (config.address_state) addressState = config.address_state
    if (config.address_zip) addressZip = config.address_zip
    if (config.service_area_note) serviceAreaNote = config.service_area_note
  } catch {
    // fall back to static config
  }

  try {
    const rows = await getHours()
    if (rows.length > 0) dbHours = rows
  } catch {
    // fall back to static hours
  }

  return (
    <footer className="bg-white border-t border-stone-200 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* Brand */}
        <div className="md:col-span-1">
          <Image
            src="/logo.png"
            alt="Elephant Wings KC"
            width={130}
            height={70}
            className="h-10 w-auto mb-4"
          />
          <p className="text-black text-sm leading-relaxed">
            Bold Indian Fusion in the heart of Kansas City&apos;s Crossroads.
          </p>
          <div className="flex items-center gap-4 mt-4">
            <a
              href={staticConfig.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Elephant Wings KC on Instagram"
              className="text-orange hover:text-orange-dark transition-colors"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.975.975 1.246 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.975.975-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.975-.975-1.246-2.242-1.308-3.608C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.975-.975 2.242-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.014 7.052.072 5.197.157 3.355.673 2.014 2.014.673 3.355.157 5.197.072 7.052.014 8.332 0 8.741 0 12c0 3.259.014 3.668.072 4.948.085 1.855.601 3.697 1.942 5.038 1.341 1.341 3.183 1.857 5.038 1.942C8.332 23.986 8.741 24 12 24s3.668-.014 4.948-.072c1.855-.085 3.697-.601 5.038-1.942 1.341-1.341 1.857-3.183 1.942-5.038.058-1.28.072-1.689.072-4.948s-.014-3.668-.072-4.948c-.085-1.855-.601-3.697-1.942-5.038C20.645.673 18.803.157 16.948.072 15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
              </svg>
            </a>
            <a
              href={staticConfig.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Elephant Wings KC on Facebook"
              className="text-orange hover:text-orange-dark transition-colors"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
              </svg>
            </a>
            <a
              href={`mailto:${staticConfig.email}`}
              aria-label="Email Elephant Wings KC"
              className="text-orange hover:text-orange-dark transition-colors"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
            </a>
            <a
              href={`tel:${phone}`}
              aria-label="Call Elephant Wings KC"
              className="text-orange hover:text-orange-dark transition-colors"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* NAP */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-black mb-4">Find Us</h3>
          <p className="text-black text-sm leading-relaxed">
            Located inside{' '}
            <a
              href={staticConfig.parlor.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange hover:underline"
            >
              Parlor KC
            </a>
            <br />
            {addressStreet}
            <br />
            {addressCity}, {addressState} {addressZip}
          </p>
          <p className="text-black text-sm mt-3">
            <ClickToCall
              phone={phone}
              display={phoneDisplay}
              className="text-orange hover:underline"
            />
          </p>
          <p className="text-black text-xs mt-4 leading-relaxed">
            {serviceAreaNote}{' '}
            <Link href="/services/catering/#inquiry" className="text-orange hover:underline">
              Inquire about other locations →
            </Link>
          </p>
        </div>

        {/* Hours */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-black mb-4">Hours</h3>
          <ul className="text-black text-sm space-y-2">
            {dbHours ? (
              dbHours.map((h) => (
                <li key={h.id} className="flex justify-between gap-4">
                  <span className="text-black">{h.day_name}</span>
                  <span className={h.is_closed ? 'text-crimson font-bold' : 'text-black'}>
                    {h.is_closed
                      ? 'CLOSED'
                      : h.open_time && h.close_time
                        ? `${to12Hour(h.open_time)}–${to12Hour(h.close_time)}`
                        : 'CLOSED'}
                  </span>
                </li>
              ))
            ) : (
              staticConfig.hours.map((h) => (
                <li key={h.days} className="flex justify-between gap-4">
                  <span className="text-black">{h.days}</span>
                  <span className={h.open ? 'text-black' : 'text-crimson font-bold'}>
                    {h.open ? `${to12Hour(h.open)}–${to12Hour(h.close!)}` : 'CLOSED'}
                  </span>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Nav */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-black mb-4">Explore</h3>
          <nav aria-label="Footer navigation">
            <ul className="text-sm space-y-2.5">
              {[
                { label: 'The Parlor Menu', href: '/parlor-kc/' },
                { label: 'Order Online', href: '/order-online/' },
                { label: 'Chef-On-Demand', href: '/services/chef-on-demand/' },
                { label: 'Event Catering', href: '/services/catering/' },
                { label: 'About Us', href: '/about/' },
                { label: 'Journal', href: '/journal/' },
                { label: 'Links', href: '/links/' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-orange hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <div className="border-t border-stone-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-black">
          <p>© {new Date().getFullYear()} Elephant Wings KC. All rights reserved.</p>
          <p>Indian Fusion · Kansas City, MO</p>
        </div>
      </div>
    </footer>
  )
}
