import { getMenuItems } from '@/lib/cms'
import type { MenuItem } from '@/lib/cms-types'
import { MENU_SECTIONS } from '@/lib/cms-types'
import MenuEditor from './MenuEditor'

export default async function AdminMenuPage() {
  let items: MenuItem[] = []
  try { items = await getMenuItems() } catch {}

  const itemsBySection = Object.fromEntries(
    MENU_SECTIONS.map((section) => [section, items.filter((item) => item.section === section)])
  ) as Record<string, MenuItem[]>

  return (
    <div className="text-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-8">Menu</h1>
        <MenuEditor itemsBySection={itemsBySection} />
      </div>
    </div>
  )
}
