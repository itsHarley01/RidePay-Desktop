import { useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()

  return (
    <div className="flex h-screen justify-center items-center bg-white">
      <div>
        <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
        <input type="email" placeholder="Email" className="border p-2 mb-2 block" />
        <input type="password" placeholder="Password" className="border p-2 mb-2 block" />
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          Sign In
        </button>
      </div>
    </div>
  )
}
