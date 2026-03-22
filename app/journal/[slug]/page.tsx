import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import SiteLayout from '@/components/SiteLayout'
import { getAllPosts as getMdxPosts, getPostBySlug as getMdxPostBySlug } from '@/lib/journal'
import { getPostBySlug as getDbPostBySlug } from '@/lib/cms'
import { SITE_CONFIG } from '@/lib/config'

export const revalidate = 60

interface Props { params: { slug: string } }

export async function generateStaticParams() {
  return getMdxPosts().map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Try DB first, then MDX
  try {
    const dbPost = await getDbPostBySlug(params.slug)
    if (dbPost) {
      const canonical = `${SITE_CONFIG.domain}/journal/${dbPost.slug}`
      return {
        title: `${dbPost.title} | Elephant Wings KC`,
        description: dbPost.excerpt,
        alternates: { canonical },
        openGraph: {
          title: dbPost.title,
          description: dbPost.excerpt,
          url: canonical,
          type: 'article',
          publishedTime: dbPost.published_at ?? undefined,
        },
      }
    }
  } catch {
    // fall through to MDX
  }

  const mdxPost = getMdxPostBySlug(params.slug)
  if (!mdxPost) return {}
  const canonical = `${SITE_CONFIG.domain}/journal/${mdxPost.slug}`
  return {
    title: `${mdxPost.title} | Elephant Wings KC`,
    description: mdxPost.excerpt,
    alternates: { canonical },
    openGraph: {
      title: mdxPost.title,
      description: mdxPost.excerpt,
      url: canonical,
      images: [{ url: `${SITE_CONFIG.domain}${mdxPost.coverImage.src}`, width: mdxPost.coverImage.width, height: mdxPost.coverImage.height, alt: mdxPost.coverImage.alt }],
      type: 'article',
      publishedTime: mdxPost.publishedAt,
    },
  }
}

export default async function JournalPostPage({ params }: Props) {
  // Try DB post first
  let dbPost = null
  try {
    dbPost = await getDbPostBySlug(params.slug)
  } catch {
    // fall through to MDX
  }

  if (dbPost) {
    const paragraphs = dbPost.body.split('\n\n').filter(Boolean)
    const date = dbPost.published_at ?? new Date().toISOString()

    return (
      <SiteLayout activeSilo="journal">
        <article className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          {dbPost.cover_image_url && (
            <div className="relative aspect-video rounded-2xl overflow-hidden mb-10 shadow-md">
              <Image src={dbPost.cover_image_url} alt={dbPost.title} fill className="object-cover" priority />
            </div>
          )}

          <div className="mb-8">
            <span className="badge-orange mb-4">{dbPost.pillar.replace(/-/g, ' ')}</span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-stone-900 mt-4 mb-3 leading-tight">
              {dbPost.title}
            </h1>
            <time className="text-stone-400 text-sm" dateTime={date}>
              {new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </time>
          </div>

          <div className="prose prose-stone prose-lg max-w-none prose-headings:font-display prose-a:text-orange">
            {paragraphs.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          <div className="bg-stone-50 border border-stone-100 rounded-2xl p-10 mt-14 text-center">
            <h2 className="font-display text-2xl font-bold text-stone-900 mb-3">
              Ready to Experience Elephant Wings?
            </h2>
            <div className="flex flex-wrap gap-3 justify-center mt-6">
              <Link href="/order-online/" className="btn-primary">Order Online</Link>
              <Link href="/services/chef-on-demand/" className="btn-outline">Book Chef-On-Demand</Link>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link href="/journal/" className="text-orange hover:underline text-sm font-semibold">← Back to Journal</Link>
          </div>
        </article>
      </SiteLayout>
    )
  }

  // Fall back to MDX post
  const post = getMdxPostBySlug(params.slug)
  if (!post) notFound()

  return (
    <SiteLayout activeSilo="journal">
      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-16">

        <div className="relative aspect-video rounded-2xl overflow-hidden mb-10 shadow-md">
          <Image src={post.coverImage.src} alt={post.coverImage.alt} fill className="object-cover" priority />
        </div>

        <div className="mb-8">
          <span className="badge-orange mb-4">{post.pillar.replace(/-/g, ' ')}</span>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-stone-900 mt-4 mb-3 leading-tight">
            {post.title}
          </h1>
          <time className="text-stone-400 text-sm" dateTime={post.publishedAt}>
            {new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </time>
        </div>

        <div
          className="prose prose-stone prose-lg max-w-none prose-headings:font-display prose-a:text-orange"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="bg-stone-50 border border-stone-100 rounded-2xl p-10 mt-14 text-center">
          <h2 className="font-display text-2xl font-bold text-stone-900 mb-3">
            Ready to Experience Elephant Wings?
          </h2>
          <div className="flex flex-wrap gap-3 justify-center mt-6">
            <Link href="/order-online/" className="btn-primary">Order Online</Link>
            <Link href="/services/chef-on-demand/" className="btn-outline">Book Chef-On-Demand</Link>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/journal/" className="text-orange hover:underline text-sm font-semibold">← Back to Journal</Link>
        </div>

      </article>
    </SiteLayout>
  )
}
