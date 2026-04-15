/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom"
import { AdminLayout } from "./components/layout/AdminLayout"
import { SupplierLayout } from "./pages/supplier/SupplierLayout"
import Dashboard from "./pages/Dashboard"
import GiftDashboard from "./pages/gifts/GiftDashboard"
import GiftProducts from "./pages/gifts/GiftProducts"
import GiftAddProduct from "./pages/gifts/GiftAddProduct"
import GiftCategories from "./pages/gifts/GiftCategories"
import GiftCoupons from "./pages/gifts/GiftCoupons"
import GiftRecommendations from "./pages/gifts/GiftRecommendations"
import GiftSuppliers from "./pages/gifts/GiftSuppliers"
import GiftOrders from "./pages/gifts/GiftOrders"
import GiftLogistics from "./pages/gifts/GiftLogistics"
import GiftRefunds from "./pages/gifts/GiftRefunds"
import GiftAddresses from "./pages/gifts/GiftAddresses"
import GiftFinance from "./pages/gifts/GiftFinance"
import { TooltipProvider } from "@/components/ui/tooltip"
import LoginPage from "./pages/LoginPage"
import SupplierLogin from "./pages/supplier/SupplierLogin"
import SupplierDashboard from "./pages/supplier/SupplierDashboard"
import SupplierOrders from "./pages/supplier/SupplierOrders"
import SupplierShipping from "./pages/supplier/SupplierShipping"
import SupplierRefunds from "./pages/supplier/SupplierRefunds"
import SupplierFinance from "./pages/supplier/SupplierFinance"
import { AuthProvider, useAuth } from "./context/AuthContext"
import { ToastProvider } from "./context/ToastContext"

const Placeholder = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center h-full text-muted-foreground">
    {title} 模块开发中...
  </div>
)

function ProtectedApp() {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/content/*" element={<Placeholder title="内容管理" />} />
        <Route path="/ticketing/*" element={<Placeholder title="票务管理" />} />
        <Route path="/gifts/dashboard" element={<GiftDashboard />} />
        <Route path="/gifts/products" element={<GiftProducts />} />
        <Route path="/gifts/products/add" element={<GiftAddProduct />} />
        <Route path="/gifts/products/edit/:id" element={<GiftAddProduct />} />
        <Route path="/gifts/categories" element={<GiftCategories />} />
        <Route path="/gifts/coupons" element={<GiftCoupons />} />
        <Route path="/gifts/recommendations" element={<GiftRecommendations />} />
        <Route path="/gifts/suppliers" element={<GiftSuppliers />} />
        <Route path="/gifts/orders" element={<GiftOrders />} />
        <Route path="/gifts/logistics" element={<GiftLogistics />} />
        <Route path="/gifts/refunds" element={<GiftRefunds />} />
        <Route path="/gifts/addresses" element={<GiftAddresses />} />
        <Route path="/gifts/finance" element={<GiftFinance />} />
        <Route path="/users/*" element={<Placeholder title="用户管理" />} />
        <Route path="/operations/*" element={<Placeholder title="运营管理" />} />
        <Route path="/ai/*" element={<Placeholder title="AI管理" />} />
        <Route path="/system/*" element={<Placeholder title="系统管理" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AdminLayout>
  )
}

function SupplierApp() {
  return (
    <SupplierLayout>
      <Routes>
        <Route path="/" element={<SupplierDashboard />} />
        <Route path="/orders" element={<SupplierOrders />} />
        <Route path="/shipping" element={<SupplierShipping />} />
        <Route path="/refunds" element={<SupplierRefunds />} />
        <Route path="/finance" element={<SupplierFinance />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </SupplierLayout>
  )
}

function AppRoutes() {
  const { isAuthenticated, isReady } = useAuth()

  if (!isReady) {
    return <div className="min-h-screen bg-background" />
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />}
      />
      <Route
        path="/supplier-login"
        element={isAuthenticated ? <Navigate to="/supplier" replace /> : <SupplierLogin />}
      />
      <Route
        path="/supplier/*"
        element={isAuthenticated ? <SupplierApp /> : <Navigate to="/supplier-login" replace />}
      />
      <Route
        path="*"
        element={isAuthenticated ? <ProtectedApp /> : <Navigate to="/login" replace />}
      />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <TooltipProvider>
          <Router>
            <AppRoutes />
          </Router>
        </TooltipProvider>
      </ToastProvider>
    </AuthProvider>
  )
}
