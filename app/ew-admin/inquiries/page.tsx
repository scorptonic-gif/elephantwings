// No database — inquiries are forwarded directly to Chef Ameet's email.

export default function AdminInquiriesPage() {
  return (
    <div className="text-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-8">Inquiries</h1>

        <div className="bg-yellow-900/20 border border-yellow-700/40 rounded-xl p-5 mb-8">
          <p className="text-yellow-300 text-sm font-medium mb-1">📬 Email-Only Mode</p>
          <p className="text-yellow-200/70 text-sm">
            Inquiries are forwarded directly to{' '}
            <strong className="text-yellow-200">ameet.elephantwings@gmail.com</strong> in real
            time. No data is stored here. To enable a persistent inbox view, connect a database
            and update <code className="text-yellow-300">app/api/contact/route.ts</code>.
          </p>
        </div>

        <div className="bg-gray-900 rounded-xl p-8 text-center">
          <div className="text-5xl mb-4">📭</div>
          <h2 className="text-xl font-bold text-white mb-2">No stored inquiries</h2>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            All Chef-On-Demand and Catering inquiries are delivered directly to Chef Ameet&apos;s
            inbox. Check <strong className="text-white">ameet.elephantwings@gmail.com</strong> to
            view and respond to submissions.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-900 rounded-xl p-5">
            <h3 className="font-bold text-white mb-2">Chef-On-Demand Inquiries</h3>
            <p className="text-gray-400 text-sm">
              Subject line: <code className="text-gray-300">New Chef-On-Demand Inquiry — [Date]</code>
            </p>
          </div>
          <div className="bg-gray-900 rounded-xl p-5">
            <h3 className="font-bold text-white mb-2">Catering Inquiries</h3>
            <p className="text-gray-400 text-sm">
              Subject line: <code className="text-gray-300">New Catering Inquiry — [Date]</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
