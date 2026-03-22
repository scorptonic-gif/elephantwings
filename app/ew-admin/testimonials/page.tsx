import { getTestimonials } from '@/lib/cms'
import type { Testimonial } from '@/lib/cms-types'
import TestimonialsEditor from './TestimonialsEditor'

export default async function AdminTestimonialsPage() {
  let testimonials: Testimonial[] = []
  try { testimonials = await getTestimonials() } catch {}

  return (
    <div className="text-gray-100 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-8">Testimonials</h1>
        <TestimonialsEditor testimonials={testimonials} />
      </div>
    </div>
  )
}
