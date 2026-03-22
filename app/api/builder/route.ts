'use server'
import { NextRequest, NextResponse } from 'next/server'
import { getPageBuilderData, savePageBuilderData } from '@/lib/cms'
import { revalidatePath } from 'next/cache'
import { triggerDeploy } from '@/lib/deploy'

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug')
  if (!slug) return NextResponse.json({ error: 'slug required' }, { status: 400 })
  try {
    const data = await getPageBuilderData(slug)
    return NextResponse.json(data ?? { slug, html: '', css: '', components: null, styles: null })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { slug, html, css, components, styles } = body
    if (!slug) return NextResponse.json({ error: 'slug required' }, { status: 400 })
    await savePageBuilderData({ slug, html, css, components, styles })
    // Revalidate the corresponding public page
    revalidatePath(`/${slug === 'home' ? '' : slug}`)
    void triggerDeploy()
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
