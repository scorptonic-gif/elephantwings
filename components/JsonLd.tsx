import type { LocalBusinessSchema, ServiceSchema } from '@/lib/schema'

type Schema = LocalBusinessSchema | ServiceSchema

interface JsonLdProps {
  schema: Schema | Schema[]
}

export default function JsonLd({ schema }: JsonLdProps) {
  const schemas = Array.isArray(schema) ? schema : [schema]
  return (
    <>
      {schemas.map((s, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
        />
      ))}
    </>
  )
}
