import type { MetadataRoute } from 'next'
import { SITE_CONFIG } from '@/lib/config'
import { ROUTE_MAP, type SiloRoute } from '@/lib/routes'

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = Object.keys(ROUTE_MAP) as SiloRoute[]

  return routes.map((route) => ({
    url: `${SITE_CONFIG.domain}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '/' ? 'weekly' : 'monthly',
    priority: route === '/' ? 1.0 : route.startsWith('/services/') ? 0.9 : 0.7,
  }))
}
