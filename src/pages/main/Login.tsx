import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import loginAuthApi from '../../api/loginAuthApi';
import { fetchUserById } from '../../api/fetchUserApi'; // Make sure this is correctly imported

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError(null);
    setLoading(true);
    
    try {
      // Step 1: Log in and get token (+ possibly uid or dev data)
      const res = await loginAuthApi({ email, password });
    
      localStorage.setItem('token', res.token);
    
      if (res.isDev) {
        // 👉 Handle Dev Superadmin Login
        localStorage.setItem('firstName', res.firstName);
        localStorage.setItem('lastName', res.lastName);
        localStorage.setItem('role', res.role);
        localStorage.setItem('isDev', 'true');
      
        // Optional: Clear Firebase-related values if switching from user to dev
        localStorage.removeItem('uid');
        localStorage.removeItem('sysid');
      } else {
        // 👉 Handle Normal Firebase Login
        localStorage.setItem('uid', res.uid);
        localStorage.setItem('isDev', 'false');
      
        // Fetch additional user info
        const user = await fetchUserById(res.uid);
      
        if (user.role || user.firstName || user.lastName) {
          localStorage.setItem('role', user.role);
          localStorage.setItem('sysid', user.systemUid);
          localStorage.setItem('firstName', user.firstName);
          localStorage.setItem('lastName', user.lastName);
          localStorage.setItem('organization', user.organization);
          localStorage.setItem('operatorUnit', user.operatorUnit);
        }
      }
    
      // Step 3: Navigate to dashboard
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <div className="flex bg-white rounded-lg w-[800px] max-w-full shadow-md">
        {/* Logo Section */}
        <div className="flex flex-col justify-center items-center p-8 w-1/2">
          <img src="/ridepay-logo.png" alt="RidePay Logo" className="w-42 mb-2" />
        </div>

        {/* Divider */}
        <div className="w-px bg-gray-300 my-12"></div>

        {/* Login Form */}
        <div className="flex flex-col justify-center p-8 w-1/2">
          <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example.email@gmail.com"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-[#0A2A54]"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-[#0A2A54]"
              />
              <div
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>
          </div>

          {error && <div className="mb-4 text-red-600 text-sm text-center">{error}</div>}

          <p className="mt-4 text-center text-sm text-gray-600">
            <button
              onClick={() => navigate('/forgot-password')}
              className="text-blue-700 hover:underline focus:outline-none"
            >
              Forgot Password
            </button>
          </p>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-[#0A2A54] text-white py-2 rounded hover:bg-[#4c608b] transition disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>

          <p className="mt-4 text-center text-sm text-gray-600">
            <button
              onClick={() => navigate('/account-signup')}
              className="text-blue-700 hover:underline focus:outline-none"
            >
              Don't have an account?
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
