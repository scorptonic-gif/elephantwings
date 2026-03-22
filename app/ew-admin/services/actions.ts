'use server'
import { revalidatePath } from 'next/cache'
import { upsertSiteConfig } from '@/lib/cms'
import { triggerDeploy } from '@/lib/deploy'
import type { ActionResult } from '@/lib/cms-types'

export async function saveServicesAction(_prevState: ActionResult<void> | null, formData: FormData): Promise<ActionResult<void>> {
  try {
    await upsertSiteConfig('services_catering_headline', String(formData.get('services_catering_headline') ?? ''))
    await upsertSiteConfig('services_catering_description', String(formData.get('services_catering_description') ?? ''))
    await upsertSiteConfig('services_catering_pricing', String(formData.get('services_catering_pricing') ?? ''))
    await upsertSiteConfig('services_cod_headline', String(formData.get('services_cod_headline') ?? ''))
    await upsertSiteConfig('services_cod_description', String(formData.get('services_cod_description') ?? ''))
    await upsertSiteConfig('services_cod_pricing', String(formData.get('services_cod_pricing') ?? ''))
    revalidatePath('/services/catering')
    revalidatePath('/services/chef-on-demand')
    void triggerDeploy()
    return { success: true, data: undefined }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to save services' }
  }
}
