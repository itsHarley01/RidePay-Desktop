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
import Shares from './pages/main/Shares'
import ForgotPassword from './pages/main/ForgotPassword'

import ProtectedRoute from './routes/ProtectedRoute'
import ProtectedRouteByRole from './routes/ProtectedRouteByRole'
import PublicRoute from './routes/PublicRoute'
import DriverDashboard from './pages/Drivers/DriverDashboard'
import DriverHistoy from './pages/Drivers/DriverHistoy'
import TopUp from './pages/main/TopUp'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/account-signup"
          element={
            <PublicRoute>
              <AccountSignUp />
            </PublicRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* Accessible by ALL roles */}
          <Route index element={<Dashboard />} />
        
          {/* DRIVER ONLY */}
          <Route
            path="driver-history"
            element={
              <ProtectedRouteByRole allowedRoles={['driver']}>
                <DriverHistoy />
              </ProtectedRouteByRole>
            }
          />

          {/* ADMIN/OPERATOR/COOP ONLY */}
          <Route
            path="admins"
            element={
              <ProtectedRouteByRole allowedRoles={['super-admin', 'admin-transport-cooperative']}>
                <Admins />
              </ProtectedRouteByRole>
            }
          />
          <Route
            path="passengers"
            element={
              <ProtectedRouteByRole allowedRoles={['super-admin', 'admin-transport-cooperative']}>
                <Passengers />
              </ProtectedRouteByRole>
            }
          />
          <Route
            path="topup-records"
            element={
              <ProtectedRouteByRole allowedRoles={['super-admin', 'admin-transport-cooperative']}>
                <TopUpRecords />
              </ProtectedRouteByRole>
            }
          />
          <Route
            path="topup"
            element={
              <ProtectedRouteByRole allowedRoles={['super-admin', 'admin-transport-cooperative']}>
                <TopUp />
              </ProtectedRouteByRole>
            }
          />
          <Route
            path="card-registration"
            element={
              <ProtectedRouteByRole allowedRoles={['super-admin', 'admin-transport-cooperative']}>
                <CardRegistration />
              </ProtectedRouteByRole>
            }
          />

          <Route
            path="drivers"
            element={
              <ProtectedRouteByRole allowedRoles={['super-admin', 'admin-transport-cooperative', 'admin-operator']}>
                <Drivers />
              </ProtectedRouteByRole>
            }
          />
          <Route
            path="bus-records"
            element={
              <ProtectedRouteByRole allowedRoles={['super-admin', 'admin-transport-cooperative', 'admin-operator']}>
                <BusRecords />
              </ProtectedRouteByRole>
            }
          />
          <Route
            path="bus"
            element={
              <ProtectedRouteByRole allowedRoles={['super-admin', 'admin-transport-cooperative', 'admin-operator']}>
                <Bus />
              </ProtectedRouteByRole>
            }
          />
          <Route
            path="locations"
            element={
              <ProtectedRouteByRole allowedRoles={['super-admin', 'admin-transport-cooperative', 'admin-operator']}>
                <Locations />
              </ProtectedRouteByRole>
            }
          />
          <Route
            path="fare"
            element={
              <ProtectedRouteByRole allowedRoles={['super-admin', 'admin-transport-cooperative', 'admin-operator']}>
                <Fare />
              </ProtectedRouteByRole>
            }
          />
          <Route
            path="shares"
            element={
              <ProtectedRouteByRole allowedRoles={['super-admin', 'admin-transport-cooperative', 'admin-operator']}>
                <Shares />
              </ProtectedRouteByRole>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
