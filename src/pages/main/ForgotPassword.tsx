import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import sendPasswordResetApi from '../../api/sendPasswordResetApi' // <-- your backend API

export default function ForgotPassword() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

const handleReset = async () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email || !emailRegex.test(email)) {
    setError('Please enter a valid email address.')
    return
  }

  setError('')

  try {
    const response = await sendPasswordResetApi(email.trim().toLowerCase()) // sanitize input
    console.log('Password Reset API Response:', response) // 🔍 log the full response

    if (response.success) {
      setSubmitted(true)
    } else {
      setError(response.message || 'Failed to send reset email.')
    }
  } catch (err) {
    console.error('Password reset error:', err)
    setError('Something went wrong. Please try again later.')
  }
}


  return (
    <div className="relative flex justify-center items-center h-screen bg-gray-100">
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-4 left-4 p-2 bg-[#0A2A54] hover:bg-[#6f86a3] rounded-full text-slate-700 hover:text-slate-900 transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-5 h-5 text-white"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div className="bg-white rounded-lg w-[500px] min-h-[320px] max-w-full p-8 shadow-lg flex flex-col justify-center">
        <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>

        {!submitted ? (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            <button
              onClick={handleReset}
              className="w-full bg-[#0A2A54] text-white py-2 rounded hover:bg-[#4c608b] transition"
            >
              Send Reset Email
            </button>
          </div>
        ) : (
          <div className="text-center space-y-6">
            <h3 className="text-lg font-semibold text-green-600">Reset Link Sent!</h3>
            <p className="text-gray-600">
              Check your email for a link to reset your password.
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-[#0A2A54] text-white py-2 px-6 rounded hover:bg-[#4c608b] transition"
            >
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
