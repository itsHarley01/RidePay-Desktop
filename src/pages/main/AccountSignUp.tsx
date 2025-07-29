import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import verifyAccountActivationApi from '../../api/verifyAccountActivationApi'
import registerActivatedAccountApi from '../../api/registerActivatedAccountApi'


export default function AccountSignUp() {
  const navigate = useNavigate()

  const [step, setStep] = useState<'verify' | 'create' | 'done'>('verify')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState(Array(6).fill(''))
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [verifyError, setVerifyError] = useState('')
  const [uid, setUid] = useState('')



  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return
    const updatedOtp = [...otp]
    updatedOtp[index] = value
    setOtp(updatedOtp)
    const nextInput = document.getElementById(`otp-${index + 1}`)
    if (value && nextInput) (nextInput as HTMLInputElement).focus()
  }


const handleNextStep = async () => {
  if (step === 'verify') {
    const otpCode = otp.join('');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)) {
      setVerifyError('Please enter a valid email address.');
      return;
    }

    if (otpCode.length !== 6) {
      setVerifyError('Please enter a complete OTP.');
      return;
    }

    setVerifyError('');

    const response = await verifyAccountActivationApi({ email, otp: otpCode });

    if (response.success) {
      setUid(response.uid);
      setStep('create');
    } else {
      setVerifyError('Email or OTP did not match.');
    }

  } else if (step === 'create') {
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      return;
    }

    setPasswordError('');

    try {
      const response = await registerActivatedAccountApi({
        email,
        password,
        old_uid: uid,
      });

      if (response.success) {
        setStep('done');
      } else {
        setPasswordError(response.message || 'Account creation failed.');
      }
    } catch (error) {
      console.error('Account registration error:', error);
      setPasswordError('Something went wrong while creating the account.');
    }
  }
};

  const renderProgress = () => {
    const steps = ['Authentication', 'Create Account', 'Done']
    const index = step === 'verify' ? 0 : step === 'create' ? 1 : 2
    return (
      <div className="flex justify-between mb-8">
        {steps.map((label, i) => (
          <div key={label} className="flex-1 text-center">
            <div
              className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center mb-2 ${
                i <= index ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}
            >
              {i + 1}
            </div>
            <p className="text-sm">{label}</p>
          </div>
        ))}
      </div>
    )
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


      <div className="bg-white rounded-lg w-[720px] min-h-[600px] max-w-full p-8 shadow-lg flex flex-col">
        <h2 className="text-2xl font-bold mb-4 text-center">Complete Your Signup</h2>
        {renderProgress()}

        {step === 'verify' && (
          <div className="flex-1 flex flex-col justify-center space-y-6">
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

            <div>
              <label className="block text-sm font-medium mb-1">OTP Code</label>
              <div className="flex justify-center gap-1 sm:gap-2">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-${idx}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOtpChange(idx, e.target.value)}
                    className="w-10 h-10 text-center border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                ))}
              </div>
            </div>

            {verifyError && (
              <p className="text-sm text-red-500 text-center">{verifyError}</p>
            )}

            <button
              onClick={handleNextStep}
              className="w-full bg-[#0A2A54] text-white py-2 rounded hover:bg-[#4c608b] transition"
            >
              Verify OTP
            </button>

            <p className="mt-4 text-center text-sm text-gray-600">
              Check your email for the OTP code or contact your manager.
            </p>
          </div>
        )}

        {step === 'create' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1">Username</label>
              <input
                type="text"
                disabled
                placeholder={email}
                value={email}
                className="w-full px-3 py-2 border rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-80"
              />
            </div>
            {/* <p>{uid}</p> */}
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
              onClick={handleNextStep}
              className="w-full bg-[#0A2A54] text-white py-2 rounded hover:bg-[#4c608b] transition"
            >
              Create Account
            </button>
          </div>
        )}

        {step === 'done' && (
          <div className="text-center space-y-6">
            <h3 className="text-xl font-semibold text-green-600">Account Created Successfully!</h3>
            <p className="text-gray-600">You can now log in to your account.</p>
            <button
              onClick={() => navigate('/')}
              className="bg-[#0A2A54] text-white py-2 px-6 rounded hover:bg-[#4c608b] transition"
            >
              Go to Login
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
