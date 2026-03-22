'use server'
import { revalidatePath } from 'next/cache'
import { upsertSiteConfig } from '@/lib/cms'
import { triggerDeploy } from '@/lib/deploy'
import type { ActionResult } from '@/lib/cms-types'

export async function saveAboutAction(_prevState: ActionResult<void> | null, formData: FormData): Promise<ActionResult<void>> {
  try {
    await upsertSiteConfig('about_bio', String(formData.get('about_bio') ?? ''))
    await upsertSiteConfig('about_values', String(formData.get('about_values') ?? ''))
    revalidatePath('/about')
    void triggerDeploy()
    return { success: true, data: undefined }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to save about page' }
  }
}
