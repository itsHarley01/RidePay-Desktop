// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/main/Login'
import Dashboard from './pages/main/Dashboard'
import DashboardLayout from './pages/layout/DashboardLayout'
import Admins from './pages/main/Admins'
import Passengers from './pages/main/Passengers'
import Drivers from './pages/main/Drivers'
import BusRecords from './pages/main/BusRecords'
import TopUpRecords from './pages/main/TopUpRecords'
import CardRegistration from './pages/main/CardRegistration'
import Bus from './pages/main/Bus'
import Fare from './pages/main/Fare'
import Locations from './pages/main/Locations'
import AccountSignUp from './pages/main/AccountSignUp'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Login />} />
        <Route path="/account-signup" element={<AccountSignUp />} />

        {/* Protected Route with layout */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />

          {/* Users Subpages */}
          <Route path="/dashboard/admins" element={<Admins />} />
          <Route path="/dashboard/passengers" element={<Passengers />} />
          <Route path="/dashboard/drivers" element={<Drivers />} />

          {/* Transactions Subpages */}
          <Route path="/dashboard/bus-records" element={<BusRecords />} />
          <Route path="/dashboard/topup-records" element={<TopUpRecords />} />
          <Route path="/dashboard/card-registration" element={<CardRegistration />} />

          {/* Other Pages */}
          <Route path="/dashboard/topup" element={<TopUpRecords />} />
          <Route path="/dashboard/bus" element={<Bus />} />
          <Route path="/dashboard/locations" element={<Locations />} />
          <Route path="/dashboard/fare" element={<Fare />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
