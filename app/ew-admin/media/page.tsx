import { getMediaAssets } from '@/lib/cms'
import type { MediaAsset } from '@/lib/cms-types'
import MediaUploader from './components/MediaUploader'

export default async function AdminMediaPage() {
  let assets: MediaAsset[] = []
  try { assets = await getMediaAssets() } catch {}

  return (
    <div className="text-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-8">Media</h1>
        <MediaUploader />
        <div className="mt-10">
          <h2 className="text-lg font-semibold text-white mb-4">
            Uploaded Assets <span className="text-gray-500 font-normal text-sm">({assets.length})</span>
          </h2>
          {assets.length === 0 ? (
            <p className="text-gray-500 text-sm">No media assets yet.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {assets.map((asset) => (
                <div key={asset.id} className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={asset.url} alt={asset.label} className="w-full aspect-square object-cover" />
                  <div className="p-3 space-y-1">
                    <p className="text-sm font-medium text-white truncate">{asset.label}</p>
                    <p className="text-xs text-gray-500">{asset.mime_type}</p>
                    <p className="text-xs text-gray-500">{(asset.size_bytes / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
