import { useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  UserCheck,
  UserRound,
  NavigationIcon as Steering,
  FileText,
  Bus,
  RotateCcw,
  CreditCard,
  Grid3X3,
  Settings,
  ChevronRight,
  ChevronDown,
} from 'lucide-react'

export default function DashboardLayout() {
  const location = useLocation()
  const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({})

  const toggleDropdown = (menu: string) => {
    setOpenDropdowns((prev) => ({ ...prev, [menu]: !prev[menu] }))
  }

  const isActive = (url: string) => location.pathname.startsWith(url)

  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-white border-r p-4 flex flex-col justify-between">
        <div>
          {/* Logo */}
          <div className="flex items-center mb-8">
            <img src="/ridepay-logo.png" alt="logo" className="w-10 h-10 mr-2" />
            <span className="text-2xl font-bold">
              <span className="text-slate-800">Ride</span>
              <span className="text-yellow-500">Pay</span>
            </span>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            <Link
              to="/dashboard"
              className={`flex items-center gap-3 py-2 px-3 rounded hover:bg-gray-100 transition ${
                isActive('/dashboard') ? 'text-purple-900 font-semibold' : 'text-gray-600'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </Link>

            {/* Users Dropdown */}
            <div>
              <button
                onClick={() => toggleDropdown('users')}
                className={`w-full flex items-center justify-between gap-3 py-2 px-3 rounded hover:bg-gray-100 transition ${
                  isActive('/admins') || isActive('/passengers') || isActive('/drivers')
                    ? 'text-purple-900 font-semibold'
                    : 'text-gray-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5" />
                  Users
                </div>
                {openDropdowns['users'] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              {openDropdowns['users'] && (
                <div className="ml-8 space-y-1">
                  <Link to="/admins" className="flex items-center gap-2 text-sm py-1 text-gray-600 hover:text-purple-900">
                    <UserCheck className="w-4 h-4" /> Admins
                  </Link>
                  <Link to="/passengers" className="flex items-center gap-2 text-sm py-1 text-gray-600 hover:text-purple-900">
                    <UserRound className="w-4 h-4" /> Passengers
                  </Link>
                  <Link to="/drivers" className="flex items-center gap-2 text-sm py-1 text-gray-600 hover:text-purple-900">
                    <Steering className="w-4 h-4" /> Drivers
                  </Link>
                </div>
              )}
            </div>

            {/* Transactions Dropdown */}
            <div>
              <button
                onClick={() => toggleDropdown('transactions')}
                className={`w-full flex items-center justify-between gap-3 py-2 px-3 rounded hover:bg-gray-100 transition ${
                  isActive('/bus-records') || isActive('/topup-records') || isActive('/card-registration')
                    ? 'text-purple-900 font-semibold'
                    : 'text-gray-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5" />
                  Transactions
                </div>
                {openDropdowns['transactions'] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              {openDropdowns['transactions'] && (
                <div className="ml-8 space-y-1">
                  <Link to="/bus-records" className="flex items-center gap-2 text-sm py-1 text-gray-600 hover:text-purple-900">
                    <Bus className="w-4 h-4" /> Bus records
                  </Link>
                  <Link to="/topup-records" className="flex items-center gap-2 text-sm py-1 text-gray-600 hover:text-purple-900">
                    <RotateCcw className="w-4 h-4" /> TopUp records
                  </Link>
                  <Link to="/card-registration" className="flex items-center gap-2 text-sm py-1 text-gray-600 hover:text-purple-900">
                    <CreditCard className="w-4 h-4" /> Card Registration
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/topup"
              className={`flex items-center gap-3 py-2 px-3 rounded hover:bg-gray-100 transition ${
                isActive('/topup') ? 'text-purple-900 font-semibold' : 'text-gray-600'
              }`}
            >
              <Grid3X3 className="w-5 h-5" />
              TopUp
            </Link>

            <Link
              to="/bus"
              className={`flex items-center gap-3 py-2 px-3 rounded hover:bg-gray-100 transition ${
                isActive('/bus') ? 'text-purple-900 font-semibold' : 'text-gray-600'
              }`}
            >
              <Bus className="w-5 h-5" />
              Bus
            </Link>

            <Link
              to="/fare"
              className={`flex items-center gap-3 py-2 px-3 rounded hover:bg-gray-100 transition ${
                isActive('/fare') ? 'text-purple-900 font-semibold' : 'text-gray-600'
              }`}
            >
              <Settings className="w-5 h-5" />
              Fare
            </Link>
          </nav>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 mt-8 px-3 py-2 border-t pt-4">
          <div className="w-8 h-8 rounded-full bg-purple-900 text-white flex items-center justify-center font-semibold text-sm">
            D
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Aparece</p>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
          <Settings className="h-5 w-5 text-gray-500" />
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
        <Outlet />
      </main>
    </div>
  )
}
