'use server'
import { revalidatePath } from 'next/cache'
import { upsertPost, deletePost, generateSlug } from '@/lib/cms'
import { triggerDeploy } from '@/lib/deploy'
import type { ActionResult, JournalPost } from '@/lib/cms-types'

export async function savePostAction(
  _prevState: ActionResult<JournalPost> | null,
  formData: FormData
): Promise<ActionResult<JournalPost>> {
  const title = String(formData.get('title') ?? '').trim()
  const body = String(formData.get('body') ?? '').trim()
  const excerpt = String(formData.get('excerpt') ?? '').trim()
  const pillar = String(formData.get('pillar') ?? '').trim()
  const id = String(formData.get('id') ?? '').trim() || undefined
  const cover_image_url = String(formData.get('cover_image_url') ?? '').trim() || null

  if (!title) return { success: false, error: 'Title is required' }
  if (!body) return { success: false, error: 'Body is required' }
  if (!excerpt) return { success: false, error: 'Excerpt is required' }
  if (!pillar) return { success: false, error: 'Pillar/category is required' }

  const slug = generateSlug(title)
  const status = (String(formData.get('status') ?? 'draft') as 'draft' | 'published')

  try {
    const post = await upsertPost({ id, title, slug, body, excerpt, pillar, cover_image_url, status })
    revalidatePath('/journal')
    revalidatePath(`/journal/${slug}`)
    void triggerDeploy()
    return { success: true, data: post }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to save post' }
  }
}

export async function publishPostAction(id: string, slug: string): Promise<ActionResult<void>> {
  try {
    await upsertPost({ id, status: 'published' } as Parameters<typeof upsertPost>[0])
    revalidatePath('/journal')
    revalidatePath(`/journal/${slug}`)
    return { success: true, data: undefined }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to publish post' }
  }
}

export async function unpublishPostAction(id: string, slug: string): Promise<ActionResult<void>> {
  try {
    await upsertPost({ id, status: 'draft' } as Parameters<typeof upsertPost>[0])
    revalidatePath('/journal')
    revalidatePath(`/journal/${slug}`)
    return { success: true, data: undefined }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to unpublish post' }
  }
}

export async function deletePostAction(id: string): Promise<ActionResult<void>> {
  try {
    await deletePost(id)
    revalidatePath('/journal')
    return { success: true, data: undefined }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to delete post' }
  }
}
