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
  TrendingUp, 
  ShoppingBag,
  CreditCard,
  RefreshCcw,
  ArrowUpRight,
  ArrowDownRight,
  Calendar
} from "lucide-react"
import { motion } from "motion/react"
import { Button } from "@/components/ui/button"

const data = [
  { name: "03-01", gmv: 4000, orders: 240 },
  { name: "03-02", gmv: 3000, orders: 139 },
  { name: "03-03", gmv: 2000, orders: 980 },
  { name: "03-04", gmv: 2780, orders: 390 },
  { name: "03-05", gmv: 1890, orders: 480 },
  { name: "03-06", gmv: 2390, orders: 380 },
  { name: "03-07", gmv: 3490, orders: 430 },
]

const stats = [
  {
    title: "今日总 GMV",
    value: "¥12,845.00",
    change: "+12.5%",
    trend: "up",
    icon: CreditCard,
  },
  {
    title: "今日总订单量",
    value: "1,234",
    change: "+18.2%",
    trend: "up",
    icon: ShoppingBag,
  },
  {
    title: "整体客单价",
    value: "¥104.09",
    change: "+2.4%",
    trend: "up",
    icon: TrendingUp,
  },
  {
    title: "全局退款率",
    value: "1.2%",
    change: "-0.3%",
    trend: "down",
    icon: RefreshCcw,
  },
]

const topSuppliers = [
  { name: "故宫文创旗舰店", sales: "¥45,678", rank: 1 },
  { name: "北京礼物官方店", sales: "¥32,120", rank: 2 },
  { name: "老北京布鞋坊", sales: "¥28,450", rank: 3 },
  { name: "京华茶叶供应商", sales: "¥21,000", rank: 4 },
  { name: "长城纪念品中心", sales: "¥18,900", rank: 5 },
]

const topProducts = [
  { name: "故宫日历2024", sales: 1200, rank: 1 },
  { name: "天坛祈年殿积木", sales: 850, rank: 2 },
  { name: "北京胡同手绘地图", sales: 640, rank: 3 },
  { name: "京剧脸谱书签", sales: 520, rank: 4 },
  { name: "长城好汉杯", sales: 480, rank: 5 },
]

export default function GiftDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1F1A1A]">礼物全局数据总览</h1>
          <p className="text-muted-foreground">监控平台礼物模块的实时销售与运营指标。</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            日期筛选
          </Button>
          <Button variant="default" size="sm" className="bg-[#C82829] hover:bg-[#B22222]">
            导出报表
          </Button>
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

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
        <Card className="lg:col-span-4 border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">GMV 趋势分析</CardTitle>
            <CardDescription>最近7天的平台礼物销售额变化情况</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorGmv" x1="0" y1="0" x2="0" y2="1">
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
                    dataKey="gmv" 
                    stroke="#C82829" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorGmv)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">订单量统计</CardTitle>
            <CardDescription>每日订单成交量对比</CardDescription>
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
                  <Bar dataKey="orders" fill="#C82829" radius={[4, 4, 0, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">供应商销量排行榜 (TOP 5)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topSuppliers.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      item.rank <= 3 ? "bg-[#C82829] text-white" : "bg-[#F1EEEE] text-[#5C5454]"
                    }`}>
                      {item.rank}
                    </div>
                    <span className="text-sm font-medium text-[#1F1A1A]">{item.name}</span>
                  </div>
                  <span className="text-sm font-bold text-[#C82829]">{item.sales}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">热销礼物排行榜 (TOP 5)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      item.rank <= 3 ? "bg-[#C82829] text-white" : "bg-[#F1EEEE] text-[#5C5454]"
                    }`}>
                      {item.rank}
                    </div>
                    <span className="text-sm font-medium text-[#1F1A1A]">{item.name}</span>
                  </div>
                  <span className="text-sm font-bold text-[#C82829]">{item.sales} 件</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
