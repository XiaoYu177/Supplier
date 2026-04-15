import * as React from "react"
import { Link, useLocation } from "react-router-dom"
import {
  LayoutDashboard,
  Package,
  Truck,
  RefreshCcw,
  Wallet,
  Store,
  ChevronRight,
  LogOut,
  User,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

const supplierMenuItems = [
  {
    title: "工作台",
    icon: LayoutDashboard,
    url: "/supplier",
  },
  {
    title: "订单管理",
    icon: Package,
    url: "/supplier/orders",
  },
  {
    title: "打包发货",
    icon: Truck,
    url: "/supplier/shipping",
  },
  {
    title: "售后记录",
    icon: RefreshCcw,
    url: "/supplier/refunds",
  },
  {
    title: "财务对账",
    icon: Wallet,
    url: "/supplier/finance",
  },
]

export function SupplierLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const pathSegments = location.pathname.split("/").filter(Boolean)

  const getLabel = (segment: string) => {
    const labels: Record<string, string> = {
      supplier: "供应商业务中心",
      orders: "订单管理",
      shipping: "打包发货",
      refunds: "售后记录",
      finance: "财务对账",
    }
    return labels[segment] || segment
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar variant="inset" className="w-[260px] border-r border-sidebar-border">
        <SidebarHeader className="p-6 border-b border-sidebar-border">
          <Link to="/supplier" className="flex items-center gap-3">
            <div className="bg-[#C82829] text-white p-2 rounded-xl shadow-md">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <span className="text-lg font-bold text-[#1F1A1A] tracking-tight">供应商后台</span>
              <div className="text-xs text-[#8F8787]">北京礼物 · 数据隔离</div>
            </div>
          </Link>
        </SidebarHeader>

        <SidebarContent className="p-4">
          <SidebarMenu>
            {supplierMenuItems.map((item) => {
              const isActive = location.pathname === item.url
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    className={`h-11 px-4 rounded-xl ${
                      isActive
                        ? "bg-[#FFF3F3] text-[#C82829] font-medium"
                        : "hover:bg-[#F1EEEE] text-[#5C5454]"
                    }`}
                  >
                    <Link to={item.url}>
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="p-4 border-t border-sidebar-border">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton className="h-14 px-4 rounded-xl hover:bg-[#F1EEEE]">
                <Avatar className="h-9 w-9 rounded-lg bg-gradient-to-br from-[#C82829] to-[#8B0000]">
                  <AvatarFallback className="bg-transparent text-white font-bold">
                    故
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight ml-2">
                  <span className="truncate font-bold text-[#1F1A1A]">故宫文创旗舰店</span>
                  <span className="truncate text-xs text-[#8F8787]">供应商管理员</span>
                </div>
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="start" className="w-[--radix-dropdown-menu-trigger-width]">
              <DropdownMenuItem>
                <Store className="mr-2 h-4 w-4" />
                店铺信息
              </DropdownMenuItem>
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                个人中心
              </DropdownMenuItem>
              <Separator className="my-1" />
              <DropdownMenuItem className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                退出登录
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </Sidebar>

      <div className="flex-1 flex flex-col">
        <header className="h-16 shrink-0 items-center gap-2 border-b px-6 flex">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/supplier" className="text-[#5C5454] hover:text-[#C82829]">
                  京彩游
                </BreadcrumbLink>
              </BreadcrumbItem>
              {pathSegments.map((segment, index) => (
                <React.Fragment key={segment}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    {index === pathSegments.length - 1 ? (
                      <BreadcrumbPage className="text-[#1F1A1A] font-medium">
                        {getLabel(segment)}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink
                        href={`/${pathSegments.slice(0, index + 1).join("/")}`}
                        className="text-[#5C5454] hover:text-[#C82829]"
                      >
                        {getLabel(segment)}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}
