import type { SiteConfig } from './config'

export type PageType = 'restaurant' | 'chef-on-demand' | 'catering' | 'general'

export interface PostalAddress {
  '@type': 'PostalAddress'
  streetAddress: string
  addressLocality: string
  addressRegion: string
  postalCode: string
  addressCountry: string
}

export interface OpeningHoursSpecification {
  '@type': 'OpeningHoursSpecification'
  dayOfWeek: string[]
  opens: string
  closes: string
}

export interface LocalBusinessSchema {
  '@context': 'https://schema.org'
  '@type': 'Restaurant' | 'LocalBusiness'
  name: string
  url: string
  telephone: string
  address: PostalAddress
  openingHoursSpecification: OpeningHoursSpecification[]
  servesCuisine?: string[]
  priceRange?: string
  hasMenu?: string
}

export interface ServiceSchema {
  '@context': 'https://schema.org/'
  '@type': 'Service'
  serviceType: string
  provider: {
    '@type': 'Restaurant'
    name: string
    address: PostalAddress
  }
  areaServed: {
    '@type': 'City'
    name: string
  }
  description: string
}

const DAY_MAP: Record<string, string[]> = {
  'Wednesday–Thursday': ['Wednesday', 'Thursday'],
  'Friday–Saturday': ['Friday', 'Saturday'],
  Sunday: ['Sunday'],
}

export function buildLocalBusinessSchema(
  config: SiteConfig,
  pageType: PageType
): LocalBusinessSchema {
  const address: PostalAddress = {
    '@type': 'PostalAddress',
    streetAddress: config.address.street,
    addressLocality: config.address.city,
    addressRegion: config.address.state,
    postalCode: config.address.zip,
    addressCountry: 'US',
  }

  const openingHours: OpeningHoursSpecification[] = config.hours
    .filter((h) => h.open !== null && h.close !== null)
    .map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: DAY_MAP[h.days] ?? [h.days],
      opens: h.open as string,
      closes: h.close as string,
    }))

  const base = {
    '@context': 'https://schema.org' as const,
    name: config.name,
    url: config.domain,
    telephone: `+1${config.phone}`,
    address,
    openingHoursSpecification: openingHours,
  }

  if (pageType === 'restaurant') {
    return {
      ...base,
      '@type': 'Restaurant',
      servesCuisine: ['Indian Fusion', 'Indian', 'Fusion'],
      priceRange: '$$',
      hasMenu: `${config.domain}/parlor-kc/`,
    }
  }

  return {
    ...base,
    '@type': 'LocalBusiness',
  }
}

export const CHEF_ON_DEMAND_SERVICE_SCHEMA: ServiceSchema = {
  '@context': 'https://schema.org/',
  '@type': 'Service',
  serviceType: 'Chef-On-Demand / Private Chef',
  provider: {
    '@type': 'Restaurant',
    name: 'Elephant Wings KC',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '1707 Locust St, Space 2',
      addressLocality: 'Kansas City',
      addressRegion: 'MO',
      postalCode: '64108',
      addressCountry: 'US',
    },
  },
  areaServed: {
    '@type': 'City',
    name: 'Kansas City',
  },
  description:
    'Premium Indian Fusion private chef services and curated dining experiences by Chef Ameet.',
}
