import LoginForm from './LoginForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">🐘 Elephant Wings</h1>
          <p className="text-gray-400 text-sm mt-1">Admin Panel</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
