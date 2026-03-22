import { ROUTE_MAP } from '@/lib/routes'

const ROUTES = Object.keys(ROUTE_MAP)

export default function AdminAnalyticsPage() {
  return (
    <div className="text-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-8">Analytics</h1>

        <div className="bg-blue-900/20 border border-blue-700/40 rounded-xl p-5 mb-8">
          <p className="text-blue-300 text-sm font-medium mb-1">📊 Analytics Setup</p>
          <p className="text-blue-200/70 text-sm">
            Full analytics are available via Google Analytics 4 (GA4). Set{' '}
            <code className="text-blue-300">NEXT_PUBLIC_GA4_ID</code> in your environment
            variables to enable tracking. View detailed reports at{' '}
            <a
              href="https://analytics.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-300 hover:underline"
            >
              analytics.google.com
            </a>
            .
          </p>
        </div>

        <h2 className="text-lg font-bold text-white mb-4">Tracked Routes</h2>
        <div className="space-y-2">
          {ROUTES.map((route) => {
            const config = ROUTE_MAP[route as keyof typeof ROUTE_MAP]
            return (
              <div key={route} className="bg-gray-900 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="font-mono text-sm text-white">{route}</p>
                  <p className="text-gray-400 text-xs">{config.primaryKeyword}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-500 text-xs capitalize">{config.silo}</span>
                  <a
                    href={route}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    View →
                  </a>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-8 bg-gray-900 rounded-xl p-6">
          <h3 className="font-bold text-white mb-3">Quick Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <a
              href="https://analytics.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-800 rounded-lg p-3 text-sm text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
            >
              Google Analytics 4 →
            </a>
            <a
              href="https://search.google.com/search-console"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-800 rounded-lg p-3 text-sm text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
            >
              Google Search Console →
            </a>
            <a
              href="https://business.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-800 rounded-lg p-3 text-sm text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
            >
              Google Business Profile →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
