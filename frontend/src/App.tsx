import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { Toaster } from "sonner"

import { DashboardLayout } from "@/layouts/DashboardLayout"
import { Landing } from "@/pages/Landing"
import { Login } from "@/pages/Login"
import { Register } from "@/pages/Register"
import { Overview } from "@/pages/dashboard/Overview"
import { Policies } from "@/pages/dashboard/Policies"
import { Claims } from "@/pages/dashboard/Claims"
import { Settings } from "@/pages/dashboard/Settings"
import { ClaimDetail } from "@/pages/dashboard/ClaimDetail"
import { Documents } from "@/pages/dashboard/Documents"

import { ProtectedRoute } from "@/components/layout/ProtectedRoute"

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes - Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

        {/* Protected Routes - Dashboard */}
        <Route element={<ProtectedRoute />}>
          <Route path="/app" element={<DashboardLayout />}>
            <Route index element={<Overview />} />
            <Route path="policies" element={<Policies />} />
            <Route path="claims" element={<Claims />} />
            <Route path="claims/:claimId" element={<ClaimDetail />} />
            <Route path="documents" element={<Documents />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>

        {/* Landing Page */}
        <Route path="/" element={<Landing />} />

        {/* App Redirect */}
        <Route path="/app" element={<Navigate to="/app/overview" replace />} />

        {/* Catch all - Redirect to landing or dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster position="top-right" />
    </Router>
  )
}

export default App
