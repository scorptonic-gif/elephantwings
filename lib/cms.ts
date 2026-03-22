import { createAdminClient } from './supabase/admin'

// Use service-role client so RLS never blocks CMS reads/writes
const createServerClient = createAdminClient
import type {
  SiteConfigMap,
  HoursRow,
  MenuItem,
  MenuItemInput,
  Testimonial,
  TestimonialInput,
  JournalPost,
  JournalPostInput,
  MediaAsset,
  MediaAssetInput,
} from './cms-types'
import { CmsError } from './cms-types'

// ---------------------------------------------------------------------------
// Site config
// ---------------------------------------------------------------------------

export async function getSiteConfig(): Promise<SiteConfigMap> {
  const supabase = createServerClient()
  const { data, error } = await supabase.from('site_config').select('*')
  if (error) throw new CmsError('Failed to fetch site config', error)
  return Object.fromEntries((data ?? []).map((row: { key: string; value: string }) => [row.key, row.value]))
}

export async function upsertSiteConfig(key: string, value: string): Promise<void> {
  const supabase = createServerClient()
  const { error } = await supabase
    .from('site_config')
    .upsert({ key, value }, { onConflict: 'key' })
  if (error) throw new CmsError(`Failed to upsert site config key "${key}"`, error)
}

// ---------------------------------------------------------------------------
// Hours
// ---------------------------------------------------------------------------

export async function getHours(): Promise<HoursRow[]> {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('hours')
    .select('*')
    .order('day_order', { ascending: true })
  if (error) throw new CmsError('Failed to fetch hours', error)
  return (data ?? []) as HoursRow[]
}

export async function upsertHours(rows: HoursRow[]): Promise<void> {
  const supabase = createServerClient()
  for (const row of rows) {
    const { error } = await supabase
      .from('hours')
      .upsert(row, { onConflict: 'id' })
    if (error) throw new CmsError(`Failed to upsert hours row id="${row.id}"`, error)
  }
}

// ---------------------------------------------------------------------------
// Menu items
// ---------------------------------------------------------------------------

export async function getMenuItems(section?: string): Promise<MenuItem[]> {
  const supabase = createServerClient()
  let query = supabase.from('menu_items').select('*').order('sort_order', { ascending: true })
  if (section !== undefined) {
    query = query.eq('section', section)
  }
  const { data, error } = await query
  if (error) throw new CmsError('Failed to fetch menu items', error)
  return (data ?? []) as MenuItem[]
}

export async function upsertMenuItem(item: MenuItemInput & { id?: string }): Promise<MenuItem> {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('menu_items')
    .upsert(item, { onConflict: 'id' })
    .select()
    .single()
  if (error) throw new CmsError('Failed to upsert menu item', error)
  return data as MenuItem
}

export async function deleteMenuItem(id: string): Promise<void> {
  const supabase = createServerClient()
  const { error } = await supabase.from('menu_items').delete().eq('id', id)
  if (error) throw new CmsError(`Failed to delete menu item id="${id}"`, error)
}

// ---------------------------------------------------------------------------
// Testimonials
// ---------------------------------------------------------------------------

export async function getTestimonials(): Promise<Testimonial[]> {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('sort_order', { ascending: true })
  if (error) throw new CmsError('Failed to fetch testimonials', error)
  return (data ?? []) as Testimonial[]
}

export async function upsertTestimonial(t: TestimonialInput & { id?: string }): Promise<Testimonial> {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('testimonials')
    .upsert(t, { onConflict: 'id' })
    .select()
    .single()
  if (error) throw new CmsError('Failed to upsert testimonial', error)
  return data as Testimonial
}

export async function deleteTestimonial(id: string): Promise<void> {
  const supabase = createServerClient()
  const { error } = await supabase.from('testimonials').delete().eq('id', id)
  if (error) throw new CmsError(`Failed to delete testimonial id="${id}"`, error)
}

// ---------------------------------------------------------------------------
// Journal posts
// ---------------------------------------------------------------------------

export async function getPublishedPosts(): Promise<JournalPost[]> {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('journal_posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
  if (error) throw new CmsError('Failed to fetch published posts', error)
  return (data ?? []) as JournalPost[]
}

export async function getAllPosts(): Promise<JournalPost[]> {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('journal_posts')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw new CmsError('Failed to fetch all posts', error)
  return (data ?? []) as JournalPost[]
}

export async function getPostBySlug(slug: string): Promise<JournalPost | null> {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('journal_posts')
    .select('*')
    .eq('slug', slug)
    .limit(1)
    .maybeSingle()
  if (error) throw new CmsError(`Failed to fetch post with slug="${slug}"`, error)
  return data as JournalPost | null
}

export async function upsertPost(post: JournalPostInput & { id?: string }): Promise<JournalPost> {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('journal_posts')
    .upsert(post, { onConflict: 'id' })
    .select()
    .single()
  if (error) throw new CmsError('Failed to upsert journal post', error)
  return data as JournalPost
}

export async function deletePost(id: string): Promise<void> {
  const supabase = createServerClient()
  const { error } = await supabase.from('journal_posts').delete().eq('id', id)
  if (error) throw new CmsError(`Failed to delete journal post id="${id}"`, error)
}

// ---------------------------------------------------------------------------
// Media assets
// ---------------------------------------------------------------------------

export async function getMediaAssets(): Promise<MediaAsset[]> {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('media_assets')
    .select('*')
    .order('label', { ascending: true })
  if (error) throw new CmsError('Failed to fetch media assets', error)
  return (data ?? []) as MediaAsset[]
}

export async function upsertMediaAsset(asset: MediaAssetInput & { id?: string }): Promise<MediaAsset> {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('media_assets')
    .upsert(asset, { onConflict: 'id' })
    .select()
    .single()
  if (error) throw new CmsError('Failed to upsert media asset', error)
  return data as MediaAsset
}

export async function uploadMedia(file: File, path: string): Promise<string> {
  // Use service role client if available, otherwise fall back to anon key client
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  let supabase: ReturnType<typeof createServerClient>

  if (serviceRoleKey) {
    const { createClient } = await import('@supabase/supabase-js')
    supabase = createClient(supabaseUrl, serviceRoleKey) as unknown as ReturnType<typeof createServerClient>
  } else {
    supabase = createServerClient()
  }

  const { error: uploadError } = await (supabase as ReturnType<typeof createServerClient>)
    .storage
    .from('media')
    .upload(path, file, { upsert: true })

  if (uploadError) throw new CmsError(`Failed to upload media to path="${path}"`, uploadError)

  const { data: urlData } = (supabase as ReturnType<typeof createServerClient>)
    .storage
    .from('media')
    .getPublicUrl(path)

  return urlData.publicUrl
}

// ---------------------------------------------------------------------------
// Slug generation utility
// ---------------------------------------------------------------------------

export function generateSlug(title: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')

  return slug === '' ? 'untitled' : slug
}

// ---------------------------------------------------------------------------
// Page builder
// ---------------------------------------------------------------------------

export interface PageBuilderData {
  slug: string
  html: string
  css: string
  components: unknown
  styles: unknown
  updated_at?: string
}

export async function getPageBuilderData(slug: string): Promise<PageBuilderData | null> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('page_builder')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()
  if (error) throw new CmsError(`Failed to fetch page builder data for slug="${slug}"`, error)
  return data as PageBuilderData | null
}

export async function savePageBuilderData(data: PageBuilderData): Promise<void> {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('page_builder')
    .upsert({ ...data, updated_at: new Date().toISOString() }, { onConflict: 'slug' })
  if (error) throw new CmsError(`Failed to save page builder data for slug="${data.slug}"`, error)
}
