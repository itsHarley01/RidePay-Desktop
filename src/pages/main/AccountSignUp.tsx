import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AccountSignUp() {
  const navigate = useNavigate()

  const [step, setStep] = useState<'verify' | 'create'>('verify')

  // Step 1 fields
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [verifyError, setVerifyError] = useState('')

  // Step 2 fields
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault()
    setVerifyError('')

    if (email === 'harley@gmail.com' && otp === '123qw') {
      setStep('create')
    } else {
      setVerifyError('Email or OTP did not match.')
    }
  }

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError('')

    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match.')
      return
    }

    // If successful
    navigate('/')
  }

  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <div className="bg-white rounded-lg w-[500px] max-w-full p-8 shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Complete Your Signup</h2>

        {step === 'verify' ? (
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email"
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ${
                  verifyError ? 'border-red-500 ring-red-300' : 'focus:ring-purple-500'
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">OTP Code</label>
              <input
                type="text"
                required
                value={otp}
                onChange={e => setOtp(e.target.value)}
                placeholder="Enter OTP sent to your email"
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ${
                  verifyError ? 'border-red-500 ring-red-300' : 'focus:ring-purple-500'
                }`}
              />
              {verifyError && <p className="text-sm text-red-500 mt-1">{verifyError}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-[#0A2A54] text-white py-2 rounded hover:bg-[#4c608b] transition"
            >
              Verify OTP
            </button>

            <p className="mt-4 text-center text-sm text-gray-600">
              Check your email for the OTP code or contact your manager.
            </p>
          </form>
        ) : (
          <form onSubmit={handleCreateAccount} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Create a password"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Confirm Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ${
                  passwordError ? 'border-red-500 ring-red-300' : 'focus:ring-purple-500'
                }`}
              />
              {passwordError && <p className="text-sm text-red-500 mt-1">{passwordError}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-[#0A2A54] text-white py-2 rounded hover:bg-[#4c608b] transition"
            >
              Create Account
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
