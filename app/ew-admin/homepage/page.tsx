import { getSiteConfig } from '@/lib/cms'
import HomepageForm from './HomepageForm'

export default async function HomepagePage() {
  const config = await getSiteConfig()

  return (
    <div className="text-gray-100 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-8">Homepage</h1>
        <HomepageForm config={config} />
      </div>
    </div>
  )
}
