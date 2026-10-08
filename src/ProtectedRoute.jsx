import { Navigate } from 'react-router-dom'

function getRoleFromToken(token) {
  try {
    const payload = token.split('.')[1]
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    const role = JSON.parse(json).role
    return role ? String(role).toLowerCase() : null
  } catch (e) {
    return null
  }
}

function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem('token')

  if (!token) {
    return <Navigate to="/" replace />
  }

  if (role) {
    const userRole = getRoleFromToken(token)
    if (userRole !== role.toLowerCase()) {
      return <Navigate to="/jobs" replace />
    }
  }

  return children
}

export default ProtectedRoute