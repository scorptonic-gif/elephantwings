interface ClickToCallProps {
  phone: string
  display?: string
  className?: string
}

function formatPhone(digits: string): string {
  const d = digits.replace(/\D/g, '')
  if (d.length === 10) {
    return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`
  }
  return digits
}

export default function ClickToCall({ phone, display, className }: ClickToCallProps) {
  const label = display ?? formatPhone(phone)
  return (
    <a
      href={`tel:${phone}`}
      className={className}
      aria-label={`Call Elephant Wings KC at ${label}`}
    >
      {label}
    </a>
  )
}
