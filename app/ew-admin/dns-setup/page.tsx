'use client'

import { useState } from 'react'

type StepStatus = 'pending' | 'done'

interface Step {
  id: string
  title: string
  status: StepStatus
}

const VERCEL_IP = '76.76.21.21'
const DOMAIN = 'elephantwingskc.com'

export default function DnsSetupPage() {
  const [steps, setSteps] = useState<Step[]>([
    { id: 'vercel-domain', title: 'Add domain to Vercel project', status: 'pending' },
    { id: 'squarespace-disconnect', title: 'Disconnect domain from Squarespace site', status: 'pending' },
    { id: 'squarespace-dns-a', title: 'Update A record in Squarespace DNS', status: 'pending' },
    { id: 'squarespace-dns-cname', title: 'Add www CNAME record in Squarespace DNS', status: 'pending' },
    { id: 'vercel-verify', title: 'Verify domain in Vercel', status: 'pending' },
    { id: 'ssl', title: 'SSL certificate issued by Vercel', status: 'pending' },
    { id: 'live', title: 'Site live at elephantwingskc.com', status: 'pending' },
  ])

  function toggle(id: string) {
    setSteps(prev => prev.map(s => s.id === id ? { ...s, status: s.status === 'done' ? 'pending' : 'done' } : s))
  }

  const doneCount = steps.filter(s => s.status === 'done').length
  const pct = Math.round((doneCount / steps.length) * 100)

  return (
    <div className="p-6 md:p-8 text-gray-100 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-1">DNS Setup</h1>
      <p className="text-gray-400 text-sm mb-6">
        Move <span className="text-white font-mono">{DOMAIN}</span> from Squarespace to Vercel. Follow each step in order. Check them off as you go.
      </p>

      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>{doneCount} of {steps.length} steps complete</span>
          <span>{pct}%</span>
        </div>
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, background: pct === 100 ? '#16a34a' : '#E85A1A' }}
          />
        </div>
      </div>

      <div className="space-y-4">

        {/* STEP 1 */}
        <StepCard
          step={steps[0]}
          onToggle={() => toggle('vercel-domain')}
          number={1}
        >
          <p className="text-gray-300 text-sm mb-3">
            Tell Vercel which domain to serve your site on.
          </p>
          <ol className="text-sm text-gray-400 space-y-1 list-decimal list-inside mb-3">
            <li>Go to your <ExternalLink href="https://vercel.com/dashboard">Vercel dashboard</ExternalLink></li>
            <li>Click your project <strong className="text-white">elephantwings-k8x3</strong></li>
            <li>Go to <strong className="text-white">Settings → Domains</strong></li>
            <li>Type <code className="bg-gray-800 px-1 rounded text-orange-400">{DOMAIN}</code> and click <strong className="text-white">Add</strong></li>
            <li>Also add <code className="bg-gray-800 px-1 rounded text-orange-400">www.{DOMAIN}</code> and set it to redirect to the apex</li>
          </ol>
          <p className="text-xs text-gray-500">Vercel will show you the DNS records you need — they match what's in Step 3 & 4 below.</p>
        </StepCard>

        {/* STEP 2 */}
        <StepCard
          step={steps[1]}
          onToggle={() => toggle('squarespace-disconnect')}
          number={2}
        >
          <p className="text-gray-300 text-sm mb-3">
            Squarespace locks DNS records while a domain is connected to a site. You must disconnect it first.
          </p>
          <ol className="text-sm text-gray-400 space-y-1 list-decimal list-inside">
            <li>Log in to <ExternalLink href="https://account.squarespace.com">Squarespace</ExternalLink></li>
            <li>Go to <strong className="text-white">Domains</strong> in the left sidebar</li>
            <li>Click <strong className="text-white">{DOMAIN}</strong></li>
            <li>Click <strong className="text-white">Website</strong> → <strong className="text-white">Disconnect</strong></li>
            <li>Confirm the disconnect — your Squarespace site will go offline but the domain stays yours</li>
          </ol>
        </StepCard>

        {/* STEP 3 */}
        <StepCard
          step={steps[2]}
          onToggle={() => toggle('squarespace-dns-a')}
          number={3}
        >
          <p className="text-gray-300 text-sm mb-3">
            Point the root domain (<code className="bg-gray-800 px-1 rounded text-orange-400">{DOMAIN}</code>) to Vercel's servers.
          </p>
          <ol className="text-sm text-gray-400 space-y-1 list-decimal list-inside mb-4">
            <li>In Squarespace, go to <strong className="text-white">Domains → {DOMAIN} → DNS Settings</strong></li>
            <li>Find the existing <strong className="text-white">A record</strong> for <code className="bg-gray-800 px-1 rounded">@</code> (it points to Squarespace's IP)</li>
            <li>Click the pencil/edit icon and change the value to Vercel's IP</li>
            <li>Save</li>
          </ol>
          <DnsRecord type="A" host="@" value={VERCEL_IP} ttl="3600" />
          <p className="text-xs text-gray-500 mt-2">If there are multiple A records for @, delete the old Squarespace ones and keep only this one.</p>
        </StepCard>

        {/* STEP 4 */}
        <StepCard
          step={steps[3]}
          onToggle={() => toggle('squarespace-dns-cname')}
          number={4}
        >
          <p className="text-gray-300 text-sm mb-3">
            Make <code className="bg-gray-800 px-1 rounded text-orange-400">www.{DOMAIN}</code> work too.
          </p>
          <ol className="text-sm text-gray-400 space-y-1 list-decimal list-inside mb-4">
            <li>Still in Squarespace DNS Settings</li>
            <li>Look for an existing CNAME for <code className="bg-gray-800 px-1 rounded">www</code> — edit it, or click <strong className="text-white">Add Record</strong> if it doesn't exist</li>
            <li>Set the values below and save</li>
          </ol>
          <DnsRecord type="CNAME" host="www" value="cname.vercel-dns.com" ttl="3600" />
        </StepCard>

        {/* STEP 5 */}
        <StepCard
          step={steps[4]}
          onToggle={() => toggle('vercel-verify')}
          number={5}
        >
          <p className="text-gray-300 text-sm mb-3">
            After saving the DNS records, go back to Vercel and confirm they're detected.
          </p>
          <ol className="text-sm text-gray-400 space-y-1 list-decimal list-inside">
            <li>Go to <ExternalLink href="https://vercel.com/dashboard">Vercel → your project → Settings → Domains</ExternalLink></li>
            <li>Both <code className="bg-gray-800 px-1 rounded text-orange-400">{DOMAIN}</code> and <code className="bg-gray-800 px-1 rounded text-orange-400">www.{DOMAIN}</code> should show a green checkmark</li>
            <li>If they show "Invalid Configuration", wait 5–10 minutes and refresh — DNS propagation takes time</li>
            <li>Full propagation can take up to 48 hours, but usually under 30 minutes</li>
          </ol>
          <div className="mt-3 p-3 bg-gray-800 rounded-lg text-xs text-gray-400">
            💡 You can check propagation status at{' '}
            <ExternalLink href="https://dnschecker.org/#A/elephantwingskc.com">dnschecker.org</ExternalLink>
            {' '}— look for the A record to show <code className="text-orange-400">{VERCEL_IP}</code> globally.
          </div>
        </StepCard>

        {/* STEP 6 */}
        <StepCard
          step={steps[5]}
          onToggle={() => toggle('ssl')}
          number={6}
        >
          <p className="text-gray-300 text-sm mb-3">
            Vercel automatically provisions a free SSL certificate (HTTPS) once DNS is verified. No action needed — just wait.
          </p>
          <ol className="text-sm text-gray-400 space-y-1 list-decimal list-inside">
            <li>In Vercel → Settings → Domains, the domain will show <strong className="text-white">Valid Configuration</strong></li>
            <li>A padlock icon will appear — SSL is active</li>
            <li>This usually happens within a few minutes of DNS verification</li>
          </ol>
        </StepCard>

        {/* STEP 7 */}
        <StepCard
          step={steps[6]}
          onToggle={() => toggle('live')}
          number={7}
        >
          <p className="text-gray-300 text-sm mb-3">
            Visit your domain to confirm everything is working.
          </p>
          <ol className="text-sm text-gray-400 space-y-1 list-decimal list-inside mb-3">
            <li>Open <ExternalLink href={`https://${DOMAIN}`}>{`https://${DOMAIN}`}</ExternalLink> in a new tab</li>
            <li>Confirm the padlock (HTTPS) is showing</li>
            <li>Check that <ExternalLink href={`https://www.${DOMAIN}`}>{`https://www.${DOMAIN}`}</ExternalLink> redirects to the apex domain</li>
            <li>Test the contact form and admin login</li>
          </ol>
          <div className="p-3 bg-green-950 border border-green-800 rounded-lg text-xs text-green-400">
            🎉 Once this step is checked off, your site is fully live on Vercel.
          </div>
        </StepCard>

      </div>

      {/* Bottom notes */}
      <div className="mt-8 p-4 bg-gray-900 rounded-xl border border-gray-800 text-sm text-gray-400 space-y-2">
        <p className="text-white font-semibold text-sm">Important notes</p>
        <p>• Your Squarespace subscription can be cancelled after the domain is confirmed working on Vercel. The domain registration stays with Squarespace until you choose to transfer it.</p>
        <p>• If you want to transfer the domain registration itself to another registrar (like Cloudflare, which is free), you can do that later — it's optional and doesn't affect anything right now.</p>
        <p>• Email (if you have Squarespace Email or Google Workspace) uses separate MX records. Those won't be affected by changing the A and CNAME records above.</p>
        <p>• The admin panel at <code className="bg-gray-800 px-1 rounded text-orange-400">{DOMAIN}/ew-admin</code> will work automatically once the domain is live.</p>
      </div>
    </div>
  )
}

function StepCard({
  step,
  onToggle,
  number,
  children,
}: {
  step: Step
  onToggle: () => void
  number: number
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(number === 1)
  const done = step.status === 'done'

  return (
    <div className={`rounded-xl border transition-colors ${done ? 'border-green-800 bg-green-950/30' : 'border-gray-800 bg-gray-900'}`}>
      <button
        className="w-full flex items-center gap-3 px-4 py-3 text-left"
        onClick={() => setOpen(o => !o)}
      >
        <span
          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${done ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'}`}
        >
          {done ? '✓' : number}
        </span>
        <span className={`flex-1 text-sm font-semibold ${done ? 'text-green-400 line-through' : 'text-white'}`}>
          {step.title}
        </span>
        <span className="text-gray-500 text-xs">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="px-4 pb-4 border-t border-gray-800 pt-3">
          {children}
          <button
            onClick={onToggle}
            className={`mt-4 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
              done
                ? 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                : 'bg-green-700 text-white hover:bg-green-600'
            }`}
          >
            {done ? 'Mark as not done' : 'Mark as done ✓'}
          </button>
        </div>
      )}
    </div>
  )
}

function DnsRecord({ type, host, value, ttl }: { type: string; host: string; value: string; ttl: string }) {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden text-xs font-mono">
      <div className="grid grid-cols-4 bg-gray-700 text-gray-400 px-3 py-1.5">
        <span>Type</span>
        <span>Host</span>
        <span className="col-span-2">Value</span>
      </div>
      <div className="grid grid-cols-4 px-3 py-2 text-white items-center gap-1">
        <span className="text-orange-400 font-bold">{type}</span>
        <span>{host}</span>
        <span className="col-span-2 text-green-400 break-all">{value}</span>
      </div>
      <div className="px-3 pb-2 text-gray-500">TTL: {ttl} (or "Automatic")</div>
    </div>
  )
}

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-orange-400 hover:text-orange-300 underline underline-offset-2"
    >
      {children}
    </a>
  )
}
