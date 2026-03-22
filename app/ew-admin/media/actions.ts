'use server'
import { revalidatePath } from 'next/cache'
import { uploadMedia, upsertMediaAsset } from '@/lib/cms'
import { triggerDeploy } from '@/lib/deploy'
import type { ActionResult, MediaAsset } from '@/lib/cms-types'

export async function uploadMediaAction(formData: FormData): Promise<ActionResult<MediaAsset>> {
  const file = formData.get('file') as File | null
  const label = String(formData.get('label') ?? '').trim()

  if (!file || file.size === 0) {
    return { success: false, error: 'No file provided' }
  }
  if (!label) {
    return { success: false, error: 'Label is required' }
  }

  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { success: false, error: 'Only JPEG, PNG, and WebP images are allowed' }
  }

  const MAX_SIZE = 5 * 1024 * 1024 // 5MB
  if (file.size > MAX_SIZE) {
    return { success: false, error: 'File must be 5MB or smaller' }
  }

  const ext = file.name.split('.').pop() ?? 'jpg'
  const path = `${label}-${Date.now()}.${ext}`

  try {
    const url = await uploadMedia(file, path)
    const asset = await upsertMediaAsset({
      label,
      url,
      storage_path: path,
      mime_type: file.type,
      size_bytes: file.size,
    })
    revalidatePath('/ew-admin/media')
    revalidatePath('/')
    void triggerDeploy()
    return { success: true, data: asset }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Upload failed' }
  }
}
