import { getSiteConfig } from '@/lib/cms'
import AboutForm from './AboutForm'

export default async function AboutPage() {
  const config = await getSiteConfig()

  return (
    <div className="text-gray-100 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-8">About</h1>
        <AboutForm config={config} />
      </div>
    </div>
  )
}
