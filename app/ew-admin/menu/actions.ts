'use server'
import { revalidatePath } from 'next/cache'
import { upsertMenuItem, deleteMenuItem } from '@/lib/cms'
import { triggerDeploy } from '@/lib/deploy'
import type { ActionResult, MenuItem } from '@/lib/cms-types'

export async function saveMenuItemAction(
  _prevState: ActionResult<MenuItem> | null,
  formData: FormData
): Promise<ActionResult<MenuItem>> {
  const name = String(formData.get('name') ?? '').trim()
  const section = String(formData.get('section') ?? '').trim()
  const priceStr = String(formData.get('price_cents') ?? '').trim()
  const id = String(formData.get('id') ?? '').trim() || undefined

  if (!name) return { success: false, error: 'Name is required' }
  if (!section) return { success: false, error: 'Section is required' }

  const price_cents = parseInt(priceStr, 10)
  if (isNaN(price_cents) || price_cents <= 0) {
    return { success: false, error: 'Price must be a positive number (in cents)' }
  }

  const description = String(formData.get('description') ?? '').trim() || null
  const tagsRaw = formData.getAll('dietary_tags')
  const dietary_tags = tagsRaw.map(String)
  const sort_order = parseInt(String(formData.get('sort_order') ?? '0'), 10) || 0

  try {
    const item = await upsertMenuItem({ id, name, description, price_cents, section, dietary_tags, sort_order })
    revalidatePath('/parlor-kc')
    revalidatePath('/services/chef-on-demand')
    void triggerDeploy()
    return { success: true, data: item }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to save menu item' }
  }
}

export async function deleteMenuItemAction(id: string): Promise<ActionResult<void>> {
  try {
    await deleteMenuItem(id)
    revalidatePath('/parlor-kc')
    revalidatePath('/services/chef-on-demand')
    void triggerDeploy()
    return { success: true, data: undefined }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to delete menu item' }
  }
}
