import * as React from "react"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./AppSidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useLocation } from "react-router-dom"

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const pathSegments = location.pathname.split("/").filter(Boolean)

  const getLabel = (segment: string) => {
    const labels: Record<string, string> = {
      content: "内容管理",
      ticketing: "票务管理",
      gifts: "礼物管理",
      users: "用户管理",
      operations: "运营管理",
      ai: "AI管理",
      system: "系统管理",
      attractions: "景点管理",
      events: "活动演出",
      activities: "游玩管理",
      categories: "分类管理",
      products: "门票商品",
      orders: "订单管理",
      verification: "核销记录",
      dashboard: "数据看板",
      recommendations: "礼物推荐",
      suppliers: "供应商管理",
      logistics: "打包发货",
      refunds: "售后管理",
      finance: "财务对账",
      list: "用户列表",
      benefits: "权益管理",
      hotels: "住宿管理",
      food: "美食管理",
      pass: "北京PASS",
      news: "消息公告",
      config: "配置管理",
      prompts: "提示词管理",
      logs: "日志查询",
      accounts: "账号权限",
      add: "新增商品",
    }
    return labels[segment] || segment
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">京彩游</BreadcrumbLink>
              </BreadcrumbItem>
              {pathSegments.map((segment, index) => (
                <React.Fragment key={segment}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    {index === pathSegments.length - 1 ? (
                      <BreadcrumbPage>{getLabel(segment)}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={`/${pathSegments.slice(0, index + 1).join("/")}`}>
                        {getLabel(segment)}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
