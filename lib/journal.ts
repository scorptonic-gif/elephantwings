import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export interface JournalPost {
  slug: string
  title: string
  publishedAt: string
  pillar: 'behind-the-scenes' | 'event-spotlight' | 'educational'
  excerpt: string
  content: string
  coverImage: {
    src: string
    alt: string
    width: number
    height: number
  }
}

const JOURNAL_DIR = path.join(process.cwd(), 'content/journal')

function ensureDir() {
  if (!fs.existsSync(JOURNAL_DIR)) {
    fs.mkdirSync(JOURNAL_DIR, { recursive: true })
  }
}

export function getAllPosts(): JournalPost[] {
  ensureDir()
  const files = fs.readdirSync(JOURNAL_DIR).filter((f) => f.endsWith('.mdx') || f.endsWith('.md'))

  return files
    .map((file) => {
      const slug = file.replace(/\.(mdx|md)$/, '')
      return getPostBySlug(slug)
    })
    .filter((p): p is JournalPost => p !== null)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
}

export function getPostBySlug(slug: string): JournalPost | null {
  ensureDir()
  const mdxPath = path.join(JOURNAL_DIR, `${slug}.mdx`)
  const mdPath = path.join(JOURNAL_DIR, `${slug}.md`)
  const filePath = fs.existsSync(mdxPath) ? mdxPath : fs.existsSync(mdPath) ? mdPath : null

  if (!filePath) return null

  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)

  return {
    slug,
    title: data.title ?? '',
    publishedAt: data.publishedAt ?? new Date().toISOString(),
    pillar: data.pillar ?? 'behind-the-scenes',
    excerpt: data.excerpt ?? '',
    content,
    coverImage: data.coverImage ?? {
      src: '/images/journal-default.jpg',
      alt: 'Elephant Wings KC journal post',
      width: 1200,
      height: 630,
    },
  }
}
