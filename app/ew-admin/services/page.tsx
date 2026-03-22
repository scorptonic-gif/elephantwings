import { getSiteConfig } from '@/lib/cms'
import ServicesForm from './ServicesForm'

export default async function ServicesPage() {
  const config = await getSiteConfig()

  return (
    <div className="text-gray-100 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-8">Services</h1>
        <ServicesForm config={config} />
      </div>
    </div>
  )
}
