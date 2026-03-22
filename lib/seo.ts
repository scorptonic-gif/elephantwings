import type { Metadata } from 'next'
import { ROUTE_MAP, type SiloRoute } from './routes'
import { SITE_CONFIG } from './config'

export function generatePageMeta(route: string, config = SITE_CONFIG): Metadata {
  const routeConfig = ROUTE_MAP[route as SiloRoute]

  if (!routeConfig) {
    throw new Error(
      `[generatePageMeta] Unrecognized route: "${route}". Add it to ROUTE_MAP in lib/routes.ts before deploying.`
    )
  }

  // Canonical: absolute URL, no trailing slash
  const canonicalPath = route === '/' ? '' : route.replace(/\/$/, '')
  const canonical = `${config.domain}${canonicalPath}`

  const ogImageUrl = `${config.domain}${config.og.defaultImage}`

  return {
    title: routeConfig.meta.title,
    description: routeConfig.meta.description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: routeConfig.meta.title,
      description: routeConfig.meta.description,
      url: canonical,
      siteName: config.name,
      images: [
        {
          url: ogImageUrl,
          width: config.og.width,
          height: config.og.height,
          alt: `${config.name} — Bold Indian Fusion in Kansas City`,
        },
      ],
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: routeConfig.meta.title,
      description: routeConfig.meta.description,
      images: [ogImageUrl],
    },
  }
}
