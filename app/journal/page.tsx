import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import SiteLayout from '@/components/SiteLayout'
import { generatePageMeta } from '@/lib/seo'
import { getAllPosts as getMdxPosts } from '@/lib/journal'
import { getPublishedPosts } from '@/lib/cms'

export const revalidate = 60

export const metadata: Metadata = generatePageMeta('/journal/')

const PILLAR_LABELS: Record<string, string> = {
  'behind-the-scenes': 'Behind the Scenes',
  'event-spotlight': 'Event Spotlight',
  educational: 'Educational',
}

interface DisplayPost {
  slug: string
  title: string
  excerpt: string
  pillar: string
  date: string
  coverImage?: { src: string; alt: string }
}

export default async function JournalPage() {
  let posts: DisplayPost[] = []

  try {
    const dbPosts = await getPublishedPosts()
    if (dbPosts.length > 0) {
      posts = dbPosts.map((p) => ({
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        pillar: p.pillar,
        date: p.published_at ?? new Date().toISOString(),
      }))
    }
  } catch {
    // fall through to MDX fallback
  }

  if (posts.length === 0) {
    const mdxPosts = getMdxPosts()
    posts = mdxPosts.map((p) => ({
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      pillar: p.pillar,
      date: p.publishedAt,
      coverImage: p.coverImage,
    }))
  }

  return (
    <SiteLayout activeSilo="journal">

      <section className="hero-warm pt-16 pb-20 px-4 sm:px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="badge-orange mb-5">Stories from the Kitchen</span>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-stone-900 mt-4 mb-4">
            The Journal
          </h1>
          <p className="text-stone-500 text-lg max-w-xl mx-auto">
            Behind the scenes with Chef Ameet, event spotlights, and Indian Fusion inspiration
            from the Elephant Wings KC kitchen.
          </p>
        </div>
      </section>

      <div className="section-container">
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-stone-400 text-xl mb-6">New stories coming soon.</p>
            <Link href="/" className="btn-primary">Back to Home</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {posts.map((post) => (
              <article key={post.slug} className="card flex flex-col overflow-hidden">
                {post.coverImage && (
                  <div className="relative aspect-video">
                    <Image
                      src={post.coverImage.src}
                      alt={post.coverImage.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}
                <div className="p-6 flex flex-col flex-1">
                  <span className="badge-orange mb-3">{PILLAR_LABELS[post.pillar] ?? post.pillar}</span>
                  <h2 className="font-display text-xl font-bold text-stone-900 mb-2 flex-1 leading-snug">
                    {post.title}
                  </h2>
                  <p className="text-stone-500 text-sm leading-relaxed mb-5">{post.excerpt}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <time className="text-stone-400 text-xs" dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </time>
                    <Link href={`/journal/${post.slug}/`} className="text-orange text-sm font-semibold hover:underline">
                      Read →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

    </SiteLayout>
  )
}
