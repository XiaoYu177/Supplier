import type { ReactNode } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Grid3X3, PackageSearch, Truck, RefreshCcw, Wallet, Store, LogOut } from "lucide-react"

import { useAuth } from "../../context/AuthContext"

const menuItems = [
  { title: "工作台", path: "/supplier", icon: Grid3X3 },
  { title: "订单管理", path: "/supplier/orders", icon: PackageSearch },
  { title: "打包发货", path: "/supplier/shipping", icon: Truck },
  { title: "售后记录", path: "/supplier/refunds", icon: RefreshCcw },
  { title: "财务对账", path: "/supplier/finance", icon: Wallet },
]

function isActive(pathname: string, target: string) {
  if (target === "/supplier") {
    return pathname === "/supplier" || pathname === "/supplier/"
  }
  return pathname.startsWith(target)
}

export function SupplierLayout({ children }: { children: ReactNode }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate("/supplier-login", { replace: true })
  }

  return (
    <div className="min-h-screen w-full bg-[#f5f5f5] text-[#1f1a1a]">
      <div className="flex min-h-screen w-full">
        <aside className="sticky top-0 flex h-screen w-[260px] shrink-0 self-start flex-col border-r border-[#e4dddd] bg-[#f8f8f8]">
          <div className="border-b border-[#e4dddd] px-6 py-6">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-[#c82829] text-white">
                <Store className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h1 className="truncate text-lg font-semibold leading-none">故宫文创旗舰店</h1>
                <p className="mt-1 truncate text-sm text-[#5f5b5b]">供应商管理后台</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-5">
            {menuItems.map((item) => {
              const active = isActive(location.pathname, item.path)
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex h-11 items-center gap-3 rounded-lg px-3 text-base font-semibold leading-none whitespace-nowrap transition ${
                    active
                      ? "bg-[#fff1f1] text-[#c82829]"
                      : "text-[#3f3a3a] hover:bg-[#f0ebeb] hover:text-[#c82829]"
                  }`}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  <span className="truncate">{item.title}</span>
                </Link>
              )
            })}
          </nav>

          <div className="border-t border-[#e4dddd] p-4">
            <div className="mb-3 flex items-center gap-3 rounded-lg bg-white px-3 py-3">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-[#b51617] text-white">
                故
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">故宫文创旗舰店</p>
                <p className="truncate text-xs text-[#6f6b6b]">供应商管理员</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-[#e1d5d5] bg-white text-sm font-semibold text-[#4a4444] transition hover:border-[#c82829] hover:text-[#c82829]"
            >
              <LogOut className="h-4 w-4" />
              退出登录
            </button>
          </div>
        </aside>

        <div className="flex h-screen min-w-0 flex-1 flex-col">
          <header className="h-16 border-b border-[#e4dddd] bg-[#f8f8f8] px-6">
            <div className="flex h-full items-center text-sm text-[#474242]">
              <span>京彩游</span>
              <span className="mx-2 text-[#8a8585]">›</span>
              <span>供应商业务中心</span>
            </div>
          </header>
          <main className="min-w-0 flex-1 overflow-x-auto overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </div>
  )
}
