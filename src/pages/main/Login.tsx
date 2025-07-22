import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react' // ✅ install this icon library

export default function Login() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <div className="flex bg-white rounded-lg w-[800px] max-w-full">
        {/* Logo Section */}
        <div className="flex flex-col justify-center items-center p-8 w-1/2">
          <img src="/ridepay-logo.png" alt="RidePay Logo" className="w-42 mb-2" />
        </div>

        {/* Vertical Divider */}
        <div className="w-px bg-gray-300 my-12"></div>

        {/* Login Form */}
        <div className="flex flex-col justify-center p-8 w-1/2">
          <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="example.email@gmail.com"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <div
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm mb-4">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="form-checkbox text-purple-600" defaultChecked />
              <span>Remember me</span>
            </label>
            <a href="#" className="text-blue-700 hover:underline">Forgot password?</a>
          </div>

          <button
            onClick={() => navigate('/dashboard')}
            className="w-full bg-[#0A2A54] text-white py-2 rounded hover:bg-[#4c608b] transition"
          >
            Sign in
          </button>

          {/* New account message */}
            <p className="mt-4 text-center text-sm text-gray-600">
              <button
                onClick={() => navigate('/account-signup')}
                className="text-blue-700 hover:underline focus:outline-none"
              >
                Need an account? Please contact your manager.
              </button>
               
            </p>
        </div>
      </div>
    </div>
  )
}
