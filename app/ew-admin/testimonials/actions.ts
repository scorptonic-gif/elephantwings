'use server'
import { revalidatePath } from 'next/cache'
import { upsertTestimonial, deleteTestimonial } from '@/lib/cms'
import { triggerDeploy } from '@/lib/deploy'
import type { ActionResult, Testimonial } from '@/lib/cms-types'

export async function saveTestimonialAction(
  _prevState: ActionResult<Testimonial> | null,
  formData: FormData
): Promise<ActionResult<Testimonial>> {
  const quote = String(formData.get('quote') ?? '').trim()
  const attribution = String(formData.get('attribution') ?? '').trim()
  const id = String(formData.get('id') ?? '').trim() || undefined

  if (!quote) return { success: false, error: 'Quote is required' }
  if (!attribution) return { success: false, error: 'Attribution is required' }

  const sort_order = parseInt(String(formData.get('sort_order') ?? '0'), 10) || 0

  try {
    const item = await upsertTestimonial({ id, quote, attribution, sort_order })
    revalidatePath('/')
    void triggerDeploy()
    return { success: true, data: item }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to save testimonial' }
  }
}

export async function deleteTestimonialAction(id: string): Promise<ActionResult<void>> {
  try {
    await deleteTestimonial(id)
    revalidatePath('/')
    void triggerDeploy()
    return { success: true, data: undefined }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to delete testimonial' }
  }
}
