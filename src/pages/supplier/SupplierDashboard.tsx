import { motion } from "motion/react"
import { Link } from "react-router-dom"
import {
  Package,
  Truck,
  RefreshCcw,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  ChevronRight,
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const stats = [
  {
    title: "待发货订单",
    value: "128",
    change: "+15",
    trend: "up",
    icon: Package,
    href: "/supplier/shipping",
    color: "#F6A018",
    bgColor: "#FFF3E0",
  },
  {
    title: "本月成交订单",
    value: "856",
    change: "+8.3%",
    trend: "up",
    icon: Truck,
    href: "/supplier/orders",
    color: "#4CAF50",
    bgColor: "#E8F5E9",
  },
  {
    title: "售后中订单",
    value: "12",
    change: "-2.1%",
    trend: "down",
    icon: RefreshCcw,
    href: "/supplier/refunds",
    color: "#2196F3",
    bgColor: "#E3F2FD",
  },
  {
    title: "本月应结金额",
    value: "¥89,230",
    change: "+5.8%",
    trend: "up",
    icon: Wallet,
    href: "/supplier/finance",
    color: "#C82829",
    bgColor: "#FFF3F3",
  },
]

const pendingItems = [
  {
    title: "待发货订单",
    count: 128,
    href: "/supplier/shipping",
    bgColor: "#FFF3E0",
    iconColor: "#F6A018",
  },
  {
    title: "待退货退款确认",
    count: 5,
    href: "/supplier/refunds",
    bgColor: "#E8F5E9",
    iconColor: "#4CAF50",
  },
  {
    title: "待核对账单",
    count: 1,
    href: "/supplier/finance",
    bgColor: "#E3F2FD",
    iconColor: "#2196F3",
  },
]

const recentOrders = [
  {
    id: "ORD2026041410001",
    product: "故宫脊兽书签套装",
    qty: 2,
    amount: "¥160.00",
    status: "待发货",
    statusColor: "#F6A018",
    time: "09:23",
  },
  {
    id: "ORD2026041410002",
    product: "长城纪念徽章套装",
    qty: 1,
    amount: "¥59.00",
    status: "已发货",
    statusColor: "#4CAF50",
    time: "08:45",
  },
  {
    id: "ORD2026041310003",
    product: "京剧脸谱书签",
    qty: 3,
    amount: "¥150.00",
    status: "已完成",
    statusColor: "#8F8787",
    time: "16:32",
  },
  {
    id: "ORD2026041310004",
    product: "北京景点冰箱贴套装",
    qty: 2,
    amount: "¥80.00",
    status: "售后中",
    statusColor: "#2196F3",
    time: "14:18",
  },
  {
    id: "ORD2026041210005",
    product: "故宫纹样丝巾",
    qty: 1,
    amount: "¥199.00",
    status: "已完成",
    statusColor: "#8F8787",
    time: "10:05",
  },
]

export default function SupplierDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1F1A1A]">供应商工作台</h1>
          <p className="text-muted-foreground">欢迎回来，故宫文创旗舰店！以下是你店铺的今日数据概览</p>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[#5C5454]">{stat.title}</CardTitle>
                <div className="p-2 rounded-md" style={{ backgroundColor: stat.bgColor }}>
                  <stat.icon className="h-4 w-4" style={{ color: stat.color }} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#1F1A1A]">{stat.value}</div>
                <div className="flex items-center text-xs mt-1">
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="mr-1 h-3 w-3 text-[#52C41A]" />
                  ) : (
                    <ArrowDownRight className="mr-1 h-3 w-3 text-[#FAAD14]" />
                  )}
                  <span className={stat.trend === "up" ? "text-[#52C41A]" : "text-[#FAAD14]"}>
                    {stat.change}
                  </span>
                  <span className="ml-1 text-[#8F8787]">较昨日</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">最近订单</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/supplier/orders" className="text-[#C82829] hover:text-[#B22222]">
                查看全部
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#F9F8F7] hover:bg-[#F1EEEE] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#FFF3F3] flex items-center justify-center">
                      <Package className="h-5 w-5 text-[#C82829]" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-[#1F1A1A]">{order.product}</div>
                      <div className="text-xs text-[#8F8787]">
                        {order.id} · x{order.qty}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-[#C82829]">{order.amount}</div>
                    <div
                      className="text-xs font-medium"
                      style={{ color: order.statusColor }}
                    >
                      {order.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">⏰ 待处理事项</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingItems.map((item) => (
              <Link
                key={item.title}
                to={item.href}
                className="flex items-center justify-between p-4 rounded-xl hover:opacity-90 transition-opacity"
                style={{ backgroundColor: item.bgColor }}
              >
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5" style={{ color: item.iconColor }} />
                  <span className="font-medium text-[#1F1A1A]">{item.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold" style={{ color: item.iconColor }}>
                    {item.count}
                  </span>
                  <ChevronRight className="h-4 w-4 text-[#8F8787]" />
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
