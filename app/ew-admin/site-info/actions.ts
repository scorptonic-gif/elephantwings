'use server'

import { revalidatePath } from 'next/cache'
import { upsertSiteConfig, upsertHours } from '@/lib/cms'
import { triggerDeploy } from '@/lib/deploy'
import type { ActionResult, HoursRow } from '@/lib/cms-types'

export async function saveSiteInfoAction(_prevState: ActionResult<void> | null, formData: FormData): Promise<ActionResult<void>> {
  // Strip all non-digits so formatted numbers like (816) 588-5973 work
  const phone = String(formData.get('phone') ?? '').replace(/\D/g, '')

  try {
    await upsertSiteConfig('phone', phone)
    await upsertSiteConfig('address_street', String(formData.get('address_street') ?? ''))
    await upsertSiteConfig('address_city', String(formData.get('address_city') ?? ''))
    await upsertSiteConfig('address_state', String(formData.get('address_state') ?? ''))
    await upsertSiteConfig('address_zip', String(formData.get('address_zip') ?? ''))
    await upsertSiteConfig('service_area', String(formData.get('service_area') ?? ''))
    await upsertSiteConfig('service_area_note', String(formData.get('service_area_note') ?? ''))

    // Parse hours from form data
    // Form sends: hours[0][id], hours[0][day_name], hours[0][day_order], hours[0][open_time], hours[0][close_time], hours[0][is_closed]
    const hoursRows: HoursRow[] = []
    for (let i = 0; i < 7; i++) {
      const id = String(formData.get(`hours[${i}][id]`) ?? '')
      const day_name = String(formData.get(`hours[${i}][day_name]`) ?? '')
      const day_order = Number(formData.get(`hours[${i}][day_order]`) ?? i)
      const is_closed = formData.get(`hours[${i}][is_closed]`) === 'true'
      const open_time = is_closed ? null : (String(formData.get(`hours[${i}][open_time]`) ?? '') || null)
      const close_time = is_closed ? null : (String(formData.get(`hours[${i}][close_time]`) ?? '') || null)

      if (id && day_name) {
        hoursRows.push({ id, day_name, day_order, open_time, close_time, is_closed })
      }
    }

    if (hoursRows.length > 0) {
      await upsertHours(hoursRows)
    }

    revalidatePath('/')
    revalidatePath('/parlor-kc')
    revalidatePath('/about')
    void triggerDeploy()

    return { success: true, data: undefined }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to save site info' }
  }
}
