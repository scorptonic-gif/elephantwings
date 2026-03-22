export type SiteConfigMap = Record<string, string>

export interface HoursRow {
  id: string
  day_name: string
  day_order: number
  open_time: string | null
  close_time: string | null
  is_closed: boolean
}

export interface MenuItem {
  id: string
  name: string
  description: string | null
  price_cents: number
  section: string
  dietary_tags: string[]
  sort_order: number
}

export type MenuItemInput = Omit<MenuItem, 'id'>

export interface Testimonial {
  id: string
  quote: string
  attribution: string
  sort_order: number
}

export type TestimonialInput = Omit<Testimonial, 'id'>

export interface JournalPost {
  id: string
  title: string
  slug: string
  excerpt: string
  body: string
  pillar: string
  cover_image_url: string | null
  status: 'draft' | 'published'
  published_at: string | null
}

export type JournalPostInput = Omit<JournalPost, 'id' | 'published_at'>

export interface MediaAsset {
  id: string
  label: string
  url: string
  storage_path: string
  mime_type: string
  size_bytes: number
}

export type MediaAssetInput = Omit<MediaAsset, 'id'>

export const DIETARY_TAGS = [
  'Vegan', 'Vegetarian', 'Gluten-Free', 'Contains Nuts', 'Spicy', 'Dairy-Free'
] as const

export type DietaryTag = typeof DIETARY_TAGS[number]

export const MENU_SECTIONS = [
  'signatures', 'small_plates', 'drinks', 'chef_on_demand'
] as const

export const JOURNAL_PILLARS = [
  'behind-the-scenes', 'recipes', 'events', 'news'
] as const

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }

export class CmsError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message)
    this.name = 'CmsError'
  }
}
