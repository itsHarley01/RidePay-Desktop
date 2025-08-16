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
  HandCoins,
  Map,
  Paperclip
} from 'lucide-react'
import AppSettings from '../settings/AppSettings'

export default function DashboardLayout() {
  const location = useLocation()
  const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({})
  const [showSettings, setShowSettings] = useState(false);

  const role = localStorage.getItem('role') || ''
  const firstName = localStorage.getItem('firstName') || ''
  const lastName = localStorage.getItem('lastName') || ''
  const isOperator = role === 'admin-operator';
  const isTransportCoopAdmin = role === 'admin-transport-cooperative';
  const isSuperAdmin = role === 'super-admin';
  const isDriver = role === 'driver'



  const toggleDropdown = (menu: string) => {
    setOpenDropdowns((prev) => ({ ...prev, [menu]: !prev[menu] }))
  }

  const isActive = (url: string, exact: boolean = false) => {
    return exact ? location.pathname === url : location.pathname.startsWith(url)
  }

  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-white border-r p-4 flex flex-col justify-between">
        <div>
          {/* Logo */}
          <Link
            to="/dashboard"
          >
            <div className="flex items-center mb-8">
              <img src="/ridepay-logo.png" alt="logo" className="w-10 h-10 mr-2" />
              <span className="text-2xl font-bold">
                <span className="text-slate-800">Ride</span>
                <span className="text-yellow-500">Pay</span>
              </span>
            </div>
          </Link>

          {/* Navigation */}
         <nav className="space-y-1">
  {/* Always show Dashboard */}
  <Link
    to="/dashboard"
    className={`flex items-center gap-3 py-2 px-3 rounded hover:bg-gray-100 transition ${
      isActive('/dashboard', true) ? 'text-[#0A2A54] font-bold' : 'text-gray-600'
    }`}
  >
    <LayoutDashboard className="w-5 h-5" />
    Dashboard
  </Link>

  {role === 'driver' ? (
    <>
      {/* Only show this if driver */}
      <Link
        to="/dashboard/driver-history"
        className={`flex items-center gap-3 py-2 px-3 rounded hover:bg-gray-100 transition ${
          isActive('/dashboard/driver-history', true) ? 'text-[#0A2A54] font-bold' : 'text-gray-600'
        }`}
      >
        <FileText className="w-5 h-5" />
        History
      </Link>
    </>
  ) : (
    <>
      {/* Original Full Admin/Operator Navigation Starts Here */}
      
      {!isOperator && (
        <div>
          <button
            onClick={() => toggleDropdown('users')}
            className={`w-full flex items-center justify-between gap-3 py-2 px-3 rounded hover:bg-gray-100 transition ${
              ['/dashboard/admins', '/dashboard/passengers', '/dashboard/drivers'].some(path =>
                isActive(path, true)
              )
                ? 'text-[#0A2A54] font-bold'
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
              <Link to="/dashboard/admins" className={`flex items-center gap-2 text-sm py-1 hover:text-[#0A2A54] ${isActive('/dashboard/admins', true) ? 'text-[#0A2A54] font-semibold' : 'text-gray-600'}`}>
                <UserCheck className="w-4 h-4" /> Admins
              </Link>
              <Link to="/dashboard/passengers" className={`flex items-center gap-2 text-sm py-1 hover:text-[#0A2A54] ${isActive('/dashboard/passengers', true) ? 'text-[#0A2A54] font-semibold' : 'text-gray-600'}`}>
                <UserRound className="w-4 h-4" /> Passengers
              </Link>
              <Link to="/dashboard/drivers" className={`flex items-center gap-2 text-sm py-1 hover:text-[#0A2A54] ${isActive('/dashboard/drivers', true) ? 'text-[#0A2A54] font-semibold' : 'text-gray-600'}`}>
                <Steering className="w-4 h-4" /> Drivers
              </Link>
            </div>
          )}
        </div>
      )}

      {isOperator && (
        <Link
          to="/dashboard/drivers"
          className={`flex items-center gap-3 py-2 px-3 rounded hover:bg-gray-100 transition ${
            isActive('/dashboard/drivers', true) ? 'text-[#0A2A54] font-bold' : 'text-gray-600'
          }`}
        >
          <Steering className="w-5 h-5" />
          Drivers
        </Link>
      )}

      {!isOperator && (
        <div>
          <button
            onClick={() => toggleDropdown('transactions')}
            className={`w-full flex items-center justify-between gap-3 py-2 px-3 rounded hover:bg-gray-100 transition ${
              ['/dashboard/bus-records', '/dashboard/topup-records', '/dashboard/card-registration'].some(path =>
                isActive(path, true)
              )
                ? 'text-[#0A2A54] font-bold'
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
              <Link to="/dashboard/bus-records" className={`flex items-center gap-2 text-sm py-1 hover:text-[#0A2A54] ${isActive('/dashboard/bus-records', true) ? 'text-[#0A2A54] font-semibold' : 'text-gray-600'}`}>
                <Bus className="w-4 h-4" /> Bus records
              </Link>
              <Link to="/dashboard/topup-records" className={`flex items-center gap-2 text-sm py-1 hover:text-[#0A2A54] ${isActive('/dashboard/topup-records', true) ? 'text-[#0A2A54] font-semibold' : 'text-gray-600'}`}>
                <RotateCcw className="w-4 h-4" /> TopUp records
              </Link>
              <Link to="/dashboard/card-registration" className={`flex items-center gap-2 text-sm py-1 hover:text-[#0A2A54] ${isActive('/dashboard/card-registration', true) ? 'text-[#0A2A54] font-semibold' : 'text-gray-600'}`}>
                <CreditCard className="w-4 h-4" /> Card Registration
              </Link>
            </div>
          )}
        </div>
      )}

      {isOperator && (
        <Link
          to="/dashboard/bus-records"
          className={`flex items-center gap-3 py-2 px-3 rounded hover:bg-gray-100 transition ${
            isActive('/dashboard/bus-records', true) ? 'text-[#0A2A54] font-bold' : 'text-gray-600'
          }`}
        >
          <FileText className="w-5 h-5" />
          Bus Records
        </Link>
      )}

      {!isOperator && (
        <Link
          to="/dashboard/topup"
          className={`flex items-center gap-3 py-2 px-3 rounded hover:bg-gray-100 transition ${
            isActive('/dashboard/topup', true) ? 'text-[#0A2A54] font-bold' : 'text-gray-600'
          }`}
        >
          <Grid3X3 className="w-5 h-5" />
          TopUp
        </Link>
      )}

      <Link
        to="/dashboard/bus"
        className={`flex items-center gap-3 py-2 px-3 rounded hover:bg-gray-100 transition ${
          isActive('/dashboard/bus', true) ? 'text-[#0A2A54] font-bold' : 'text-gray-600'
        }`}
      >
        <Bus className="w-5 h-5" />
        Bus
      </Link>

      {!isOperator && (
        <Link
          to="/dashboard/locations"
          className={`flex items-center gap-3 py-2 px-3 rounded hover:bg-gray-100 transition ${
            isActive('/dashboard/locations', true) ? 'text-[#0A2A54] font-bold' : 'text-gray-600'
          }`}
        >
          <Map className="w-5 h-5" />
          Locations
        </Link>
      )}

      <Link
        to="/dashboard/fare"
        className={`flex items-center gap-3 py-2 px-3 rounded hover:bg-gray-100 transition ${
          isActive('/dashboard/fare', true) ? 'text-[#0A2A54] font-bold' : 'text-gray-600'
        }`}
      >
        <Settings className="w-5 h-5" />
        Fare
      </Link>

      <Link
        to="/dashboard/shares"
        className={`flex items-center gap-3 py-2 px-3 rounded hover:bg-gray-100 transition ${
          isActive('/dashboard/shares', true) ? 'text-[#0A2A54] font-bold' : 'text-gray-600'
        }`}
      >
        <HandCoins className="w-5 h-5" />
        Shares
      </Link>
    </>
  )}
</nav>

        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 mt-8 px-3 py-2 border-t pt-4">
          <div className="w-8 h-8 rounded-full bg-[#0A2A54] text-white flex items-center justify-center font-semibold text-sm">
            D
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">{firstName+" "+lastName}</p>
            <p className="text-xs text-gray-500">{role}</p> 
          </div>

          <button
        onClick={() => setShowSettings(true)}
        className="p-2 rounded hover:bg-gray-200 transition cursor-pointer"
        aria-label="Open Settings"
      >
        <Settings className="h-5 w-5 text-gray-500" />
      </button>

      {/* Show Settings Modal/Panel */}
      {showSettings && <AppSettings onClose={() => setShowSettings(false)} />}
            
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
        <Outlet />
      </main>
    </div>
  )
}
