'use client'

import { useFormState } from 'react-dom'
import { loginAction } from './actions'

const initialState = { success: true as const, data: undefined }

export default function LoginForm() {
  const [state, formAction] = useFormState(loginAction, initialState)

  return (
    <form action={formAction} className="space-y-4">
      {!state.success && (
        <p className="text-red-400 text-sm text-center">{state.error}</p>
      )}
      <div>
        <label htmlFor="password" className="block text-sm text-gray-400 mb-1">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
          style={{ minHeight: '48px', fontSize: '16px' }}
          placeholder="Enter admin password"
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-lg font-semibold text-white transition-colors"
        style={{ minHeight: '48px', backgroundColor: '#E85A1A' }}
      >
        Log In
      </button>
    </form>
  )
}
