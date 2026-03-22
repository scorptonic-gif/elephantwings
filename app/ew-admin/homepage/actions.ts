'use server'
import { revalidatePath } from 'next/cache'
import { upsertSiteConfig } from '@/lib/cms'
import { triggerDeploy } from '@/lib/deploy'
import type { ActionResult } from '@/lib/cms-types'

export async function saveHomepageAction(_prevState: ActionResult<void> | null, formData: FormData): Promise<ActionResult<void>> {
  try {
    await upsertSiteConfig('hero_headline', String(formData.get('hero_headline') ?? ''))
    await upsertSiteConfig('hero_subtext', String(formData.get('hero_subtext') ?? ''))
    await upsertSiteConfig('announcement_text', String(formData.get('announcement_text') ?? ''))
    await upsertSiteConfig('announcement_enabled', formData.get('announcement_enabled') === 'true' ? 'true' : 'false')
    revalidatePath('/')
    void triggerDeploy()
    return { success: true, data: undefined }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to save homepage settings' }
  }
}
