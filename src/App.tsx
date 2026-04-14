/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AdminLayout } from "./components/layout/AdminLayout"
import Dashboard from "./pages/Dashboard"
import GiftDashboard from "./pages/gifts/GiftDashboard"
import GiftProducts from "./pages/gifts/GiftProducts"
import GiftAddProduct from "./pages/gifts/GiftAddProduct"
import GiftCategories from "./pages/gifts/GiftCategories"
import GiftRecommendations from "./pages/gifts/GiftRecommendations"
import GiftSuppliers from "./pages/gifts/GiftSuppliers"
import GiftOrders from "./pages/gifts/GiftOrders"
import GiftLogistics from "./pages/gifts/GiftLogistics"
import GiftRefunds from "./pages/gifts/GiftRefunds"
import GiftAddresses from "./pages/gifts/GiftAddresses"
import GiftFinance from "./pages/gifts/GiftFinance"
import { TooltipProvider } from "@/components/ui/tooltip"

const Placeholder = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center h-full text-muted-foreground">
    {title} 模块开发中...
  </div>
)

export default function App() {
  return (
    <TooltipProvider>
      <Router>
        <AdminLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/content/*" element={<Placeholder title="内容管理" />} />
            <Route path="/ticketing/*" element={<Placeholder title="票务管理" />} />
            <Route path="/gifts/dashboard" element={<GiftDashboard />} />
            <Route path="/gifts/products" element={<GiftProducts />} />
            <Route path="/gifts/products/add" element={<GiftAddProduct />} />
            <Route path="/gifts/categories" element={<GiftCategories />} />
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
          </Routes>
        </AdminLayout>
      </Router>
    </TooltipProvider>
  )
}

