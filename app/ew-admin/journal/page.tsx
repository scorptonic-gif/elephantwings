import { getAllPosts } from '@/lib/cms'
import type { JournalPost } from '@/lib/cms-types'
import JournalEditor from './JournalEditor'

export default async function AdminJournalPage() {
  let posts: JournalPost[] = []
  try { posts = await getAllPosts() } catch {}

  return (
    <div className="text-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-8">Journal</h1>
        <JournalEditor posts={posts} />
      </div>
    </div>
  )
}
