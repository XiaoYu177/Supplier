import * as React from "react"
import {
  LayoutDashboard,
  FileText,
  Ticket,
  Gift,
  Users,
  Settings,
  Bot,
  Globe,
  ChevronRight,
  LogOut,
  User,
  Search,
} from "lucide-react"
import { Link, useLocation } from "react-router-dom"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@radix-ui/react-collapsible"

const menuItems = [
  {
    title: "数据看板",
    icon: LayoutDashboard,
    url: "/",
  },
  {
    title: "内容管理",
    icon: FileText,
    url: "/content",
  },
  {
    title: "票务管理",
    icon: Ticket,
    url: "/ticketing",
  },
  {
    title: "礼物管理",
    icon: Gift,
    url: "/gifts",
    items: [
      { title: "数据看板", url: "/gifts/dashboard" },
      { title: "商品管理", url: "/gifts/products" },
      { title: "新增商品", url: "/gifts/products/add" },
      { title: "分类管理", url: "/gifts/categories" },
      { title: "礼物推荐", url: "/gifts/recommendations" },
      { title: "供应商管理", url: "/gifts/suppliers" },
      { title: "订单管理", url: "/gifts/orders" },
      { title: "打包发货", url: "/gifts/logistics" },
      { title: "售后管理", url: "/gifts/refunds" },
      { title: "财务对账", url: "/gifts/finance" },
    ],
  },
  {
    title: "用户管理",
    icon: Users,
    url: "/users",
  },
  {
    title: "运营管理",
    icon: Globe,
    url: "/operations",
  },
  {
    title: "AI管理",
    icon: Bot,
    url: "/ai",
  },
  {
    title: "系统管理",
    icon: Settings,
    url: "/system",
  },
]

export function AppSidebar() {
  const location = useLocation()

  return (
    <Sidebar variant="inset">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3 font-bold text-2xl text-primary">
          <div className="bg-primary text-primary-foreground p-2 rounded-xl shadow-md">
            <Globe className="w-7 h-7" />
          </div>
          <span className="tracking-tight">京彩游后台</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm font-semibold mb-2 px-2">主菜单</SidebarGroupLabel>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                {item.items ? (
                  <Collapsible 
                    defaultOpen={location.pathname.startsWith(item.url)}
                    className="group/collapsible"
                  >
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton 
                        tooltip={item.title} 
                        className="text-base font-medium"
                        render={<Link to={item.items[0].url} />}
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto w-4 h-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton 
                              render={<Link to={subItem.url} />} 
                              isActive={location.pathname === subItem.url}
                              className="text-sm py-2"
                            >
                              {subItem.title}
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </Collapsible>
                ) : (
                  <SidebarMenuButton 
                    render={<Link to={item.url} />} 
                    isActive={location.pathname === item.url} 
                    tooltip={item.title}
                    className="text-base font-medium"
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto w-4 h-4 text-sidebar-foreground/30" />
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-6 border-t border-sidebar-border/50">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg" className="hover:bg-sidebar-accent rounded-xl p-2 h-14">
              <Avatar className="h-10 w-10 rounded-lg shadow-sm">
                <AvatarImage src="https://picsum.photos/seed/admin/40/40" alt="Admin" />
                <AvatarFallback className="bg-primary text-white">AD</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight ml-2">
                <span className="truncate font-bold text-base text-[#1F1A1A]">管理员</span>
                <span className="truncate text-xs text-[#8F8787]">admin@jingcaiyou.com</span>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="w-[--radix-dropdown-menu-trigger-width]">
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              个人中心
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              退出登录
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
