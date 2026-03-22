export interface MenuItem {
  name: string
  description: string
  price?: string
  dietary?: ('vegan' | 'vegetarian' | 'gluten-free' | 'spicy')[]
}

interface MenuSectionProps {
  title: string
  description?: string
  items: MenuItem[]
}

const DIETARY_LABELS: Record<string, { label: string; cls: string }> = {
  vegan:        { label: 'Vegan',       cls: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
  vegetarian:   { label: 'Vegetarian',  cls: 'bg-green-50 text-green-700 border border-green-200' },
  'gluten-free':{ label: 'GF',          cls: 'bg-amber-50 text-amber-700 border border-amber-200' },
  spicy:        { label: '🌶 Spicy',    cls: 'bg-red-50 text-red-600 border border-red-200' },
}

export default function MenuSection({ title, description, items }: MenuSectionProps) {
  return (
    <section className="mb-14">
      <h2 className="font-display text-2xl md:text-3xl font-bold text-stone-900 mb-1">{title}</h2>
      {description && <p className="text-stone-500 text-sm mb-6">{description}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => (
          <article key={item.name} className="card p-5 flex flex-col gap-2">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-display text-base font-bold text-stone-900 leading-snug">{item.name}</h3>
              {item.price && (
                <span className="text-orange font-bold text-sm whitespace-nowrap shrink-0">{item.price}</span>
              )}
            </div>
            <p className="text-stone-500 text-sm leading-relaxed">{item.description}</p>
            {item.dietary && item.dietary.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-1">
                {item.dietary.map((tag) => (
                  <span key={tag}
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${DIETARY_LABELS[tag]?.cls ?? 'bg-stone-100 text-stone-500'}`}>
                    {DIETARY_LABELS[tag]?.label ?? tag}
                  </span>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  )
}
