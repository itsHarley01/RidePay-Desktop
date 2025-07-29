// src/components/ProtectedRouteByRole.tsx
import { Navigate, useLocation } from 'react-router-dom'

interface ProtectedRouteProps {
  allowedRoles: string[]
  children: React.ReactNode
}

export default function ProtectedRouteByRole({ allowedRoles, children }: ProtectedRouteProps) {
  const location = useLocation()
  const userRole = localStorage.getItem('role') || ''

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" state={{ from: location }} replace />
  }

  return <>{children}</>
}
