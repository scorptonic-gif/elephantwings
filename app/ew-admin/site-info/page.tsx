import { getSiteConfig, getHours } from '@/lib/cms'
import SiteInfoForm from './SiteInfoForm'

export default async function SiteInfoPage() {
  const [config, hours] = await Promise.all([getSiteConfig(), getHours()])

  return (
    <div className="text-gray-100 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-8">Site Info</h1>
        <SiteInfoForm config={config} hours={hours} />
      </div>
    </div>
  )
}
