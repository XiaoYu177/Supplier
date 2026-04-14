import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart,
  Area
} from "recharts"
import { 
  Users, 
  Ticket, 
  TrendingUp, 
  ShoppingBag,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react"
import { motion } from "motion/react"

const data = [
  { name: "Mon", users: 400, orders: 240, revenue: 2400 },
  { name: "Tue", users: 300, orders: 139, revenue: 2210 },
  { name: "Wed", users: 200, orders: 980, revenue: 2290 },
  { name: "Thu", users: 278, orders: 390, revenue: 2000 },
  { name: "Fri", users: 189, orders: 480, revenue: 2181 },
  { name: "Sat", users: 239, orders: 380, revenue: 2500 },
  { name: "Sun", users: 349, orders: 430, revenue: 2100 },
]

const stats = [
  {
    title: "总用户数",
    value: "12,345",
    change: "+12.5%",
    trend: "up",
    icon: Users,
  },
  {
    title: "今日订单",
    value: "1,234",
    change: "+18.2%",
    trend: "up",
    icon: Ticket,
  },
  {
    title: "销售额",
    value: "¥45,678",
    change: "-2.4%",
    trend: "down",
    icon: ShoppingBag,
  },
  {
    title: "活跃度",
    value: "89.2%",
    change: "+4.3%",
    trend: "up",
    icon: TrendingUp,
  },
]

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-[#1F1A1A]">核心指标总览</h1>
        <p className="text-muted-foreground">欢迎回来，这是京彩游平台的实时核心数据概览。</p>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-none shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[#5C5454]">{stat.title}</CardTitle>
                <div className="bg-[#FFF3F3] p-2 rounded-md">
                  <stat.icon className="h-4 w-4 text-[#C82829]" />
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
                  <span className="ml-1 text-[#8F8787]">较上周</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-1 md:col-span-2 lg:col-span-4 border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">营收趋势</CardTitle>
            <CardDescription>最近7天的平台总销售额变化情况</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#C82829" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#C82829" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EBE5E5" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#8F8787' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#8F8787' }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(130, 0, 20, 0.05)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#C82829" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-2 lg:col-span-3 border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">订单与用户</CardTitle>
            <CardDescription>活跃用户与订单量的对比分析</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EBE5E5" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#8F8787' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#8F8787' }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(130, 0, 20, 0.05)' }}
                  />
                  <Bar dataKey="users" fill="#C82829" radius={[4, 4, 0, 0]} barSize={20} />
                  <Bar dataKey="orders" fill="#F6A018" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
