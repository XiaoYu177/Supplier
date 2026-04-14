import { useState, useRef, useEffect } from "react"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Eye, Download, Package, Truck, Clock, MapPin, CreditCard, User } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

interface Order {
  id: string
  userName: string
  phone: string
  product: {
    name: string
    image: string
    specs: string
    quantity: number
  }
  supplier: string
  amount: string
  originalPrice: string
  discountType: string
  discountAmount: string
  status: string
  time: string
  address: string
  paymentMethod: string
  logisticsStatus: string
  logisticsRecords: { time: string; content: string }[]
}

const mockOrders: Order[] = [
  { 
    id: "ORD20240320001", 
    userName: "张三",
    phone: "13800138000", 
    product: {
      name: "故宫日历2024", 
      image: "https://picsum.photos/seed/gift1/40/40",
      specs: "精装版",
      quantity: 1
    },
    supplier: "故宫文创旗舰店",
    amount: "¥88.00",
    originalPrice: "¥98.00",
    discountType: "满减优惠",
    discountAmount: "¥10.00",
    status: "待发货",
    time: "2024-03-20 10:00",
    address: "北京市东城区故宫博物院 1号收货点",
    paymentMethod: "微信支付",
    logisticsStatus: "待发货",
    logisticsRecords: [
      { time: "2024-03-20 10:05", content: "订单已提交，等待商家发货" }
    ]
  },
  { 
    id: "ORD20240320002", 
    userName: "李四",
    phone: "13911112222", 
    product: {
      name: "天坛祈年殿积木", 
      image: "https://picsum.photos/seed/gift2/40/40",
      specs: "标准版",
      quantity: 2
    },
    supplier: "北京礼物官方店",
    amount: "¥199.00",
    originalPrice: "¥199.00",
    discountType: "无优惠",
    discountAmount: "¥0.00",
    status: "待付款",
    time: "2024-03-20 11:30",
    address: "上海市浦东新区张江高科技园区 3号楼",
    paymentMethod: "支付宝",
    logisticsStatus: "未产生",
    logisticsRecords: []
  },
  { 
    id: "ORD20240319001", 
    userName: "王五",
    phone: "13688889999", 
    product: {
      name: "老北京布鞋", 
      image: "https://picsum.photos/seed/gift3/40/40",
      specs: "黑色 42码",
      quantity: 1
    },
    supplier: "老北京布鞋坊",
    amount: "¥100.00",
    originalPrice: "¥120.00",
    discountType: "会员折扣",
    discountAmount: "¥20.00",
    status: "已发货",
    time: "2024-03-19 14:20",
    address: "广州市天河区珠江新城 华夏路10号",
    paymentMethod: "微信支付",
    logisticsStatus: "运输中",
    logisticsRecords: [
      { time: "2024-03-20 08:00", content: "快件已到达广州分拨中心" },
      { time: "2024-03-19 18:00", content: "商家已发货，快件揽收成功" }
    ]
  },
]

export default function GiftOrders() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("全部订单状态")
  const [supplierFilter, setSupplierFilter] = useState("全部供应商")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isDetailOpen) {
      // 使用 setTimeout 确保在内容渲染后执行滚动
      const timer = setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = 0
        }
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [isDetailOpen])

  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phone.includes(searchTerm) ||
      order.product.name.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "全部订单状态" || order.status === statusFilter
    const matchesSupplier = supplierFilter === "全部供应商" || order.supplier === supplierFilter

    return matchesSearch && matchesStatus && matchesSupplier
  })

  const handleShowDetail = (order: Order) => {
    setSelectedOrder(order)
    setIsDetailOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1F1A1A]">订单管理</h1>
          <p className="text-muted-foreground">管理礼物订单的履约状态、支付信息及物流详情。</p>
        </div>
        <Button variant="outline" className="border-[#EBE5E5]">
          <Download className="mr-2 h-4 w-4" /> 导出订单
        </Button>
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col space-y-4 mb-6">
            <div className="flex flex-wrap gap-2">
              {["全部订单状态", "待付款", "待发货", "已发货", "已完成", "售后中"].map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? "default" : "outline"}
                  className={statusFilter === status ? "bg-[#C82829] hover:bg-[#B22222]" : "border-[#EBE5E5]"}
                  onClick={() => setStatusFilter(status)}
                  size="sm"
                >
                  {status}
                </Button>
              ))}
            </div>
            
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[#8F8787]" />
                <Input
                  placeholder="搜索订单编号、手机号、商品名称..."
                  className="pl-8 border-[#EBE5E5] focus-visible:ring-[#C82829]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="w-[200px]">
                <Select value={supplierFilter} onValueChange={setSupplierFilter}>
                  <SelectTrigger className="border-[#EBE5E5]">
                    <SelectValue placeholder="全部供应商" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="全部供应商">全部供应商</SelectItem>
                    <SelectItem value="故宫文创旗舰店">故宫文创旗舰店</SelectItem>
                    <SelectItem value="北京礼物官方店">北京礼物官方店</SelectItem>
                    <SelectItem value="老北京布鞋坊">老北京布鞋坊</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-[#EBE5E5] overflow-hidden">
            <Table>
              <TableHeader className="bg-[#F9F8F7]">
                <TableRow className="hover:bg-transparent border-[#EBE5E5]">
                  <TableHead className="text-[#5C5454] font-medium">订单编号/订单时间</TableHead>
                  <TableHead className="text-[#5C5454] font-medium">商品信息</TableHead>
                  <TableHead className="text-[#5C5454] font-medium">供应商</TableHead>
                  <TableHead className="text-[#5C5454] font-medium">支付金额</TableHead>
                  <TableHead className="text-[#5C5454] font-medium">优惠类型</TableHead>
                  <TableHead className="text-[#5C5454] font-medium">订单状态</TableHead>
                  <TableHead className="text-right text-[#5C5454] font-medium">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id} className="border-[#EBE5E5] hover:bg-[#FFF3F3]/30 transition-colors">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-mono text-xs text-[#1F1A1A]">{order.id}</span>
                        <span className="text-[10px] text-[#8F8787]">{order.time}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img 
                          src={order.product.image} 
                          alt={order.product.name} 
                          className="w-10 h-10 rounded-md object-cover border border-[#EBE5E5]"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-[#1F1A1A]">{order.product.name}</span>
                          <span className="text-[10px] text-[#8F8787]">{order.product.specs} x{order.product.quantity}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-[#5C5454]">{order.supplier}</TableCell>
                    <TableCell className="font-bold text-[#C82829]">{order.amount}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-xs text-[#5C5454]">{order.discountType}</span>
                        <span className="text-[10px] text-[#8F8787]">
                          优惠: {order.discountAmount} / 原价: {order.originalPrice}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={
                          order.status === "待发货" ? "bg-[#FFF3F3] text-[#C82829] border-[#C82829]/20" :
                          order.status === "已发货" ? "bg-[#52C41A]/10 text-[#52C41A] border-[#52C41A]/20" :
                          order.status === "待付款" ? "bg-[#FAAD14]/10 text-[#FAAD14] border-[#FAAD14]/20" :
                          "bg-[#F1EEEE] text-[#8F8787] border-[#EBE5E5]"
                        }
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 px-4 text-[#C82829] border-[#C82829]/20 hover:bg-[#C82829] hover:text-white transition-all"
                        onClick={() => handleShowDetail(order)}
                      >
                        详情
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent 
          ref={scrollRef}
          className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto p-0 border-none bg-white shadow-2xl"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          {/* Overlay is handled by DialogPrimitive.Overlay in UI component, usually a simple black transparent one */}
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Package className="w-5 h-5 text-[#C82829]" />
              订单详情
            </DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4 bg-[#F9F8F7] p-4 rounded-lg">
                <div className="space-y-1">
                  <p className="text-xs text-[#8F8787]">订单编号</p>
                  <p className="text-sm font-mono font-medium">{selectedOrder.id}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-[#8F8787]">订单时间</p>
                  <p className="text-sm font-medium">{selectedOrder.time}</p>
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <Package className="w-4 h-4 text-[#C82829]" /> 商品信息
                </h3>
                <div className="flex items-start gap-4 pl-6">
                  <img 
                    src={selectedOrder.product.image} 
                    alt={selectedOrder.product.name} 
                    className="w-16 h-16 rounded-lg object-cover border border-[#EBE5E5]"
                    referrerPolicy="no-referrer"
                  />
                  <div className="space-y-1 flex-1">
                    <p className="text-sm font-bold text-[#1F1A1A]">{selectedOrder.product.name}</p>
                    <p className="text-xs text-[#8F8787]">规格：{selectedOrder.product.specs}</p>
                    <p className="text-xs text-[#8F8787]">数量：x{selectedOrder.product.quantity}</p>
                    <p className="text-xs text-[#5C5454]">供应商：{selectedOrder.supplier}</p>
                  </div>
                </div>
              </div>

              <Separator className="bg-[#EBE5E5]" />

              {/* Price & Discount */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#C82829]" /> 支付与优惠
                </h3>
                <div className="grid grid-cols-2 gap-y-3 pl-6">
                  <div className="space-y-1">
                    <p className="text-xs text-[#8F8787]">原价</p>
                    <p className="text-sm font-medium line-through decoration-[#8F8787]">{selectedOrder.originalPrice}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-[#8F8787]">优惠类型</p>
                    <p className="text-sm font-medium">{selectedOrder.discountType}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-[#8F8787]">优惠金额</p>
                    <p className="text-sm font-medium text-[#52C41A]">-{selectedOrder.discountAmount}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-[#8F8787]">实付金额</p>
                    <p className="text-base font-bold text-[#C82829]">{selectedOrder.amount}</p>
                  </div>
                </div>
              </div>

              <Separator className="bg-[#EBE5E5]" />

              {/* User Info */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <User className="w-4 h-4 text-[#C82829]" /> 用户信息
                </h3>
                <div className="grid grid-cols-2 gap-4 pl-6">
                  <div className="space-y-1">
                    <p className="text-xs text-[#8F8787]">收货人姓名</p>
                    <p className="text-sm font-medium">{selectedOrder.userName}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-[#8F8787]">联系电话</p>
                    <p className="text-sm font-medium">{selectedOrder.phone}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-[#8F8787]">支付方式</p>
                    <p className="text-sm font-medium">{selectedOrder.paymentMethod}</p>
                  </div>
                  <div className="col-span-2 space-y-1">
                    <p className="text-xs text-[#8F8787]">收货地址</p>
                    <div className="flex items-start gap-1">
                      <MapPin className="w-3 h-3 text-[#C82829] mt-1 shrink-0" />
                      <p className="text-sm font-medium">{selectedOrder.address}</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="bg-[#EBE5E5]" />

              {/* Logistics */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#C82829]" /> 物流状态: 
                  <Badge variant="outline" className="ml-2 bg-[#FFF3F3] text-[#C82829] border-[#C82829]/20">
                    {selectedOrder.logisticsStatus}
                  </Badge>
                </h3>
                <div className="pl-6 space-y-4 border-l-2 border-[#F1EEEE] ml-2">
                  {selectedOrder.logisticsRecords.length > 0 ? (
                    selectedOrder.logisticsRecords.map((record, idx) => (
                      <div key={idx} className="relative">
                        <div className="absolute -left-[29px] top-1.5 w-2 h-2 rounded-full bg-[#C82829]" />
                        <p className="text-xs font-bold text-[#1F1A1A]">{record.content}</p>
                        <p className="text-[10px] text-[#8F8787]">{record.time}</p>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center gap-2 text-[#8F8787]">
                      <Clock className="w-3 h-3" />
                      <span className="text-xs">暂无物流信息</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button 
                  className="bg-[#C82829] hover:bg-[#B22222]"
                  onClick={() => setIsDetailOpen(false)}
                >
                  关闭详情
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
