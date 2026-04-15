import { useState, useMemo } from "react"
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
import { 
  Search, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  ArrowLeftRight, 
  MapPin,
  Package,
  MessageSquare,
  Edit2,
  Plus,
  Check,
  Settings2,
  Truck
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { format, startOfMonth, endOfMonth, isWithinInterval, parseISO } from "date-fns"

interface AfterSalesRecord {
  id: string
  orderId: string
  type: "退货退款" | "仅退款"
  product: {
    name: string
    image: string
    specs: string
    quantity: number
    originalPrice: number
    paidAmount: number
  }
  refundAmount: number
  status: "待平台审核" | "待买家退货" | "已退款" | "已驳回"
  applyTime: string
  discountInfo: {
    useCoupon: boolean
    couponAmount: number
  }
  reason: string
  description: string
  images: string[]
  logistics?: {
    time: string
    content: string
  }[]
}

interface ReturnAddress {
  id: string
  name: string
  phone: string
  address: string
  isDefault: boolean
}

const MOCK_DATA: AfterSalesRecord[] = [
  {
    id: "AS20260415001",
    orderId: "ORD20260410001",
    type: "退货退款",
    product: {
      name: "故宫日历2026精装版",
      image: "https://picsum.photos/seed/gift1/80/80",
      specs: "精装版 / 红色",
      quantity: 1,
      originalPrice: 128,
      paidAmount: 98,
    },
    refundAmount: 98,
    status: "待平台审核",
    applyTime: "2026-04-15 10:30:00",
    discountInfo: {
      useCoupon: true,
      couponAmount: 30,
    },
    reason: "拍错/不喜欢",
    description: "收到后发现颜色和想象中不太一样，想换个颜色或者退了。",
    images: ["https://picsum.photos/seed/as1/200/200", "https://picsum.photos/seed/as2/200/200"]
  },
  {
    id: "AS20260414002",
    orderId: "ORD20260410005",
    type: "退货退款",
    product: {
      name: "天坛祈年殿积木模型",
      image: "https://picsum.photos/seed/gift2/80/80",
      specs: "标准版",
      quantity: 1,
      originalPrice: 256,
      paidAmount: 256,
    },
    refundAmount: 256,
    status: "待买家退货",
    applyTime: "2026-04-14 15:20:00",
    discountInfo: {
      useCoupon: false,
      couponAmount: 0,
    },
    reason: "质量问题",
    description: "积木有缺失零件，无法拼装完成。",
    images: ["https://picsum.photos/seed/as3/200/200"],
    logistics: [
      { time: "2026-04-15 09:00:00", content: "买家已发货，快递单号：SF123456789" },
      { time: "2026-04-14 15:20:00", content: "售后申请审核通过，等待买家退货" }
    ]
  },
  {
    id: "AS20260416006",
    orderId: "ORD20260411002",
    type: "仅退款",
    product: {
      name: "颐和园文创丝巾",
      image: "https://picsum.photos/seed/gift6/80/80",
      specs: "真丝 / 蓝色",
      quantity: 1,
      originalPrice: 399,
      paidAmount: 359,
    },
    refundAmount: 359,
    status: "待平台审核",
    applyTime: "2026-04-16 14:45:00",
    discountInfo: { useCoupon: true, couponAmount: 40 },
    reason: "质量问题",
    description: "丝巾边缘有脱线现象。",
    images: ["https://picsum.photos/seed/as6/200/200"]
  },
  {
    id: "AS20260417009",
    orderId: "ORD20260414020",
    type: "退货退款",
    product: {
      name: "景泰蓝花瓶",
      image: "https://picsum.photos/seed/gift9/80/80",
      specs: "中号 / 缠枝莲纹",
      quantity: 1,
      originalPrice: 1200,
      paidAmount: 1100,
    },
    refundAmount: 1100,
    status: "已退款",
    applyTime: "2026-04-17 11:30:00",
    discountInfo: { useCoupon: true, couponAmount: 100 },
    reason: "质量问题",
    description: "瓶身有一处明显的划痕。",
    images: ["https://picsum.photos/seed/as9/200/200"]
  },
  {
    id: "AS20260418010",
    orderId: "ORD20260415033",
    type: "仅退款",
    product: {
      name: "兔儿爷泥塑摆件",
      image: "https://picsum.photos/seed/gift10/80/80",
      specs: "手工彩绘版",
      quantity: 1,
      originalPrice: 168,
      paidAmount: 168,
    },
    refundAmount: 168,
    status: "已驳回",
    applyTime: "2026-04-18 10:00:00",
    discountInfo: { useCoupon: false, couponAmount: 0 },
    reason: "其他",
    description: "觉得太贵了，想退款。",
    images: []
  }
]

const MOCK_ADDRESSES: ReturnAddress[] = [
  { id: '1', name: "张经理", phone: "13800138000", address: "北京市东城区故宫博物院售后部 100009", isDefault: true },
  { id: '2', name: "李主管", phone: "13911112222", address: "上海市浦东新区世纪大道售后中心 200120", isDefault: false },
  { id: '3', name: "王组长", phone: "13766667777", address: "广州市天河区天河路售后点 510000", isDefault: false },
]

export default function GiftRefunds() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("全部类型")
  const [statusFilter, setStatusFilter] = useState("全部状态")
  const [dateRange, setDateRange] = useState({
    start: format(startOfMonth(new Date()), "yyyy-MM-dd"),
    end: format(endOfMonth(new Date()), "yyyy-MM-dd")
  })
  
  const [selectedRecord, setSelectedRecord] = useState<AfterSalesRecord | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [addresses, setAddresses] = useState<ReturnAddress[]>(MOCK_ADDRESSES)
  const [selectedAddressId, setSelectedAddressId] = useState<string>("1")
  const [isEditingAddress, setIsEditingAddress] = useState(false)
  const [isAddressListOpen, setIsAddressListOpen] = useState(false)
  
  // 售后处理状态
  const [actionValue, setActionValue] = useState<string>("")

  const filteredData = useMemo(() => {
    return MOCK_DATA.filter(item => {
      const matchesSearch = 
        item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.product.name.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesType = typeFilter === "全部类型" || item.type === typeFilter
      const matchesStatus = statusFilter === "全部状态" || item.status === statusFilter
      
      const itemDate = parseISO(item.applyTime.split(" ")[0])
      const matchesDate = isWithinInterval(itemDate, {
        start: parseISO(dateRange.start),
        end: parseISO(dateRange.end)
      })

      return matchesSearch && matchesType && matchesStatus && matchesDate
    })
  }, [searchTerm, typeFilter, statusFilter, dateRange])

  const stats = useMemo(() => {
    return {
      pending: filteredData.filter(i => i.status === "待平台审核").length,
      returning: filteredData.filter(i => i.status === "待买家退货").length,
      refunded: filteredData.filter(i => i.status === "已退款").length,
      rejected: filteredData.filter(i => i.status === "已驳回").length,
    }
  }, [filteredData])

  const currentAddress = useMemo(() => {
    return addresses.find(a => a.id === selectedAddressId) || addresses[0]
  }, [addresses, selectedAddressId])

  const handleAction = (status: string) => {
    console.log(`Action: ${status} for ${selectedRecord?.id}`)
    setIsDetailOpen(false)
  }

  const handleUpdateAddress = (updated: Partial<ReturnAddress>) => {
    setAddresses(prev => prev.map(a => a.id === selectedAddressId ? { ...a, ...updated } : a))
    setIsEditingAddress(false)
  }

  const handleAddNewAddress = () => {
    const newId = (addresses.length + 1).toString()
    const newAddr: ReturnAddress = {
      id: newId,
      name: "新收件人",
      phone: "13000000000",
      address: "新退货地址",
      isDefault: false
    }
    setAddresses([...addresses, newAddr])
    setSelectedAddressId(newId)
    setIsEditingAddress(true)
    setIsAddressListOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1F1A1A]">售后管理</h1>
          <p className="text-muted-foreground">处理消费者售后申请，审核退款及退货流程。</p>
        </div>
      </div>

      {/* 筛选与统计组合框 */}
      <Card className="border-none shadow-sm overflow-hidden">
        <CardContent className="p-0">
          {/* 筛选区域 */}
          <div className="p-6 border-b border-[#EBE5E5]/50">
            <div className="flex flex-wrap items-end gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-[#8F8787] leading-none">时间范围</label>
                <div className="flex gap-2">
                  <Input 
                    type="date" 
                    value={dateRange.start} 
                    onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                    className="!h-[44px] border-[#EBE5E5] w-[140px] text-sm"
                  />
                  <Input 
                    type="date" 
                    value={dateRange.end} 
                    onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                    className="!h-[44px] border-[#EBE5E5] w-[140px] text-sm"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2 flex-1 min-w-[240px]">
                <label className="text-xs font-medium text-[#8F8787] leading-none">搜索</label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-3.5 h-4 w-4 text-[#8F8787]" />
                  <Input
                    placeholder="订单号、商品名、售后单号"
                    className="pl-8 !h-[44px] border-[#EBE5E5] text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2 w-[160px]">
                <label className="text-xs font-medium text-[#8F8787] leading-none">售后类型</label>
                <div className="relative">
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="!h-[44px] !min-h-[44px] !w-full border-[#EBE5E5] text-sm !py-0">
                      <SelectValue placeholder="全部类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="全部类型">全部类型</SelectItem>
                      <SelectItem value="退货退款">退货退款</SelectItem>
                      <SelectItem value="仅退款">仅退款</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex flex-col gap-2 w-[160px]">
                <label className="text-xs font-medium text-[#8F8787] leading-none">平台状态</label>
                <div className="relative">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="!h-[44px] !min-h-[44px] !w-full border-[#EBE5E5] text-sm !py-0">
                      <SelectValue placeholder="全部状态" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="全部状态">全部状态</SelectItem>
                      <SelectItem value="待平台审核">待平台审核</SelectItem>
                      <SelectItem value="待买家退货">待买家退货</SelectItem>
                      <SelectItem value="已退款">已退款</SelectItem>
                      <SelectItem value="已驳回">已驳回</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
          {/* 统计区域 */}
          <div className="px-6 py-4 bg-[#F9F8F7]/50">
            <div className="flex flex-wrap items-center gap-8">
              {[
                { title: "售后中 (待审核)", value: stats.pending, icon: Clock, color: "text-[#FAAD14]", bg: "bg-[#FAAD14]/10" },
                { title: "待买家退货", value: stats.returning, icon: ArrowLeftRight, color: "text-[#1890FF]", bg: "bg-[#1890FF]/10" },
                { title: "已退款", value: stats.refunded, icon: CheckCircle2, color: "text-[#52C41A]", bg: "bg-[#52C41A]/10" },
                { title: "已驳回", value: stats.rejected, icon: XCircle, color: "text-[#F5222D]", bg: "bg-[#F5222D]/10" },
              ].map((stat, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${stat.bg}`}>
                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-[12px] text-[#8F8787] leading-none mb-1">{stat.title}</p>
                    <p className={`text-lg font-bold leading-none ${stat.color}`}>{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 数据表格 */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-6">
          <div className="rounded-lg border border-[#EBE5E5] overflow-hidden">
            <Table>
              <TableHeader className="bg-[#F9F8F7]">
                <TableRow className="hover:bg-transparent border-[#EBE5E5]">
                  <TableHead className="text-[#5C5454] font-medium">售后单号</TableHead>
                  <TableHead className="text-[#5C5454] font-medium">关联订单号</TableHead>
                  <TableHead className="text-[#5C5454] font-medium">售后类型</TableHead>
                  <TableHead className="text-[#5C5454] font-medium">商品信息</TableHead>
                  <TableHead className="text-[#5C5454] font-medium">退款金额</TableHead>
                  <TableHead className="text-[#5C5454] font-medium">平台状态</TableHead>
                  <TableHead className="text-[#5C5454] font-medium">申请时间</TableHead>
                  <TableHead className="text-right text-[#5C5454] font-medium">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item) => (
                  <TableRow key={item.id} className="border-[#EBE5E5] hover:bg-[#FFF3F3]/30 transition-colors">
                    <TableCell className="font-mono text-xs text-[#8F8787]">{item.id}</TableCell>
                    <TableCell className="font-mono text-xs text-[#8F8787]">{item.orderId}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-normal border-[#EBE5E5]">
                        {item.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img 
                          src={item.product.image} 
                          alt={item.product.name} 
                          className="w-10 h-10 rounded-md object-cover border border-[#EBE5E5]"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-[#1F1A1A] line-clamp-1">{item.product.name}</span>
                          <span className="text-[10px] text-[#8F8787]">{item.product.specs} x{item.product.quantity}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-bold text-[#C82829]">¥{item.refundAmount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={
                          item.status === "待平台审核" ? "bg-[#FAAD14]/10 text-[#FAAD14] border-[#FAAD14]/20" :
                          item.status === "待买家退货" ? "bg-[#1890FF]/10 text-[#1890FF] border-[#1890FF]/20" :
                          item.status === "已退款" ? "bg-[#52C41A]/10 text-[#52C41A] border-[#52C41A]/20" :
                          "bg-[#F5222D]/10 text-[#F5222D] border-[#F5222D]/20"
                        }
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-[#8F8787]">{item.applyTime}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        size="sm" 
                        className="h-8 px-4 bg-[#C82829] hover:bg-[#B22222] text-white"
                        onClick={() => {
                          setSelectedRecord(item)
                          // 初始化处理操作
                          if (item.status === "待平台审核") {
                            setActionValue("审核通过")
                          } else if (item.status === "待买家退货") {
                            setActionValue("确认退款")
                          } else {
                            setActionValue("")
                          }
                          setIsDetailOpen(true)
                        }}
                      >
                        查看详情
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 详情弹窗 */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden p-0 border-none bg-white shadow-2xl flex flex-col">
          <DialogHeader className="p-6 border-b bg-white shrink-0 relative">
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-[#C82829]" />
              售后详情
            </DialogTitle>
          </DialogHeader>

          {selectedRecord && (
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* 物流信息 (仅待买家退货时显示) */}
              {selectedRecord.status === "待买家退货" && selectedRecord.logistics && (
                <Card className="border-[#1890FF]/20 bg-[#1890FF]/5 shadow-none">
                  <CardHeader className="p-4 border-b border-[#1890FF]/10">
                    <CardTitle className="text-sm font-bold flex items-center gap-2 text-[#1890FF]">
                      <Truck className="w-4 h-4" /> 退货物流记录
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-4">
                    {selectedRecord.logistics.map((log, idx) => (
                      <div key={idx} className="flex gap-3 relative">
                        {idx !== selectedRecord.logistics!.length - 1 && (
                          <div className="absolute left-[7px] top-5 bottom-0 w-[2px] bg-[#1890FF]/20" />
                        )}
                        <div className={`w-4 h-4 rounded-full border-2 border-white shrink-0 z-10 ${idx === 0 ? "bg-[#1890FF]" : "bg-[#8F8787]"}`} />
                        <div className="space-y-1">
                          <p className={`text-sm ${idx === 0 ? "text-[#1F1A1A] font-medium" : "text-[#8F8787]"}`}>{log.content}</p>
                          <p className="text-xs text-[#8F8787]">{log.time}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* 退货地址 (仅退货退款且待审核时显示) */}
              {selectedRecord.type === "退货退款" && selectedRecord.status === "待平台审核" && (
                <div className="bg-[#F9F8F7] p-4 rounded-lg space-y-3 border border-[#EBE5E5]">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#C82829]" /> 默认退货地址
                    </h4>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 text-[#C82829] text-xs"
                        onClick={() => setIsAddressListOpen(true)}
                      >
                        <Settings2 className="w-3 h-3 mr-1" /> 管理/选择
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 text-[#C82829] text-xs"
                        onClick={() => setIsEditingAddress(!isEditingAddress)}
                      >
                        <Edit2 className="w-3 h-3 mr-1" /> {isEditingAddress ? "保存" : "编辑"}
                      </Button>
                    </div>
                  </div>
                  {isEditingAddress ? (
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <Input 
                          placeholder="收件人姓名"
                          value={currentAddress.name} 
                          onChange={(e) => handleUpdateAddress({ name: e.target.value })}
                          className="h-8 text-sm"
                        />
                        <Input 
                          placeholder="联系方式"
                          value={currentAddress.phone} 
                          onChange={(e) => handleUpdateAddress({ phone: e.target.value })}
                          className="h-8 text-sm"
                        />
                      </div>
                      <Input 
                        placeholder="收件地址"
                        value={currentAddress.address} 
                        onChange={(e) => handleUpdateAddress({ address: e.target.value })}
                        className="h-8 text-sm"
                      />
                    </div>
                  ) : (
                    <div className="text-sm text-[#5C5454] space-y-1">
                      <p className="font-medium text-[#1F1A1A]">{currentAddress.name} <span className="ml-2 font-normal text-[#8F8787]">{currentAddress.phone}</span></p>
                      <p>{currentAddress.address}</p>
                    </div>
                  )}
                </div>
              )}

              {/* 基本信息 */}
              <Card className="border-[#EBE5E5] shadow-none">
                <CardHeader className="p-4 bg-[#F9F8F7] border-b">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#C82829]" /> 售后信息
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 grid grid-cols-2 gap-y-4 gap-x-8">
                  <div className="space-y-1">
                    <p className="text-xs text-[#8F8787]">售后单号</p>
                    <p className="text-sm font-mono font-medium">{selectedRecord.id}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-[#8F8787]">关联订单号</p>
                    <p className="text-sm font-mono font-medium">{selectedRecord.orderId}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-[#8F8787]">售后类型</p>
                    <p className="text-sm font-medium">{selectedRecord.type}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-[#8F8787]">平台状态</p>
                    <Badge variant="outline" className="bg-[#FFF3F3] text-[#C82829] border-[#C82829]/20">
                      {selectedRecord.status}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-[#8F8787]">退款金额 (实付)</p>
                    <p className="text-sm font-bold text-[#C82829]">¥{selectedRecord.refundAmount.toFixed(2)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-[#8F8787]">优惠信息</p>
                    <p className="text-sm text-[#5C5454]">
                      {selectedRecord.discountInfo.useCoupon 
                        ? `优惠券 -¥${selectedRecord.discountInfo.couponAmount}` 
                        : "无优惠"}
                      <span className="ml-2 text-[#8F8787] line-through">¥{selectedRecord.product.originalPrice}</span>
                    </p>
                  </div>
                  <div className="space-y-1 col-span-2">
                    <p className="text-xs text-[#8F8787]">申请时间</p>
                    <p className="text-sm text-[#5C5454]">{selectedRecord.applyTime}</p>
                  </div>
                </CardContent>
              </Card>

              {/* 商品信息 */}
              <Card className="border-[#EBE5E5] shadow-none">
                <CardHeader className="p-4 bg-[#F9F8F7] border-b">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Package className="w-4 h-4 text-[#C82829]" /> 商品信息
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <img 
                      src={selectedRecord.product.image} 
                      alt={selectedRecord.product.name} 
                      className="w-20 h-20 rounded-lg object-cover border border-[#EBE5E5]"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 space-y-2">
                      <h4 className="font-bold text-[#1F1A1A]">{selectedRecord.product.name}</h4>
                      <div className="flex flex-wrap gap-4 text-sm text-[#5C5454]">
                        <p>规格：{selectedRecord.product.specs}</p>
                        <p>数量：x{selectedRecord.product.quantity}</p>
                        <p>单价：¥{selectedRecord.product.originalPrice}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 用户反馈 */}
              <Card className="border-[#EBE5E5] shadow-none">
                <CardHeader className="p-4 bg-[#F9F8F7] border-b">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-[#C82829]" /> 用户反馈
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  <div className="space-y-2">
                    <p className="text-xs text-[#8F8787]">申请原因</p>
                    <p className="text-sm font-medium text-[#1F1A1A]">{selectedRecord.reason}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs text-[#8F8787]">详细说明</p>
                    <p className="text-sm text-[#5C5454] bg-[#F9F8F7] p-3 rounded-md italic">
                      "{selectedRecord.description}"
                    </p>
                  </div>
                  {selectedRecord.images.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs text-[#8F8787]">凭证图片</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedRecord.images.map((img, idx) => (
                          <img 
                            key={idx} 
                            src={img} 
                            alt="凭证" 
                            className="w-24 h-24 rounded-md object-cover border border-[#EBE5E5] cursor-pointer hover:opacity-80 transition-opacity"
                            referrerPolicy="no-referrer"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* 处理框 */}
              {(selectedRecord.status === "待平台审核" || selectedRecord.status === "待买家退货") && (
                <div className="p-4 border-2 border-dashed border-[#C82829]/20 rounded-xl bg-[#FFF3F3]/30 space-y-4">
                  <h4 className="text-sm font-bold text-[#C82829] flex items-center gap-2">
                    <Settings2 className="w-4 h-4" /> 售后处理
                  </h4>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-[#8F8787]">处理操作</label>
                    <Select value={actionValue} onValueChange={setActionValue}>
                      <SelectTrigger className="!h-11 border-[#EBE5E5] bg-white text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedRecord.status === "待平台审核" ? (
                          <>
                            <SelectItem value="审核通过">审核通过</SelectItem>
                            <SelectItem value="驳回申请">驳回申请</SelectItem>
                          </>
                        ) : (
                          <>
                            <SelectItem value="确认退款">确认退款</SelectItem>
                            <SelectItem value="驳回申请">驳回申请</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                    {selectedRecord.status === "待平台审核" && selectedRecord.type === "仅退款" && actionValue === "审核通过" && (
                      <p className="text-xs text-[#FAAD14] flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> 审核通过后将直接退款
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="p-6 border-t bg-[#F9F8F7] shrink-0 gap-3">
            <DialogClose asChild>
              <Button variant="outline" className="px-8">关闭</Button>
            </DialogClose>
            {(selectedRecord?.status === "待平台审核" || selectedRecord?.status === "待买家退货") && (
              <Button 
                className="bg-[#C82829] hover:bg-[#B22222] px-8" 
                onClick={() => handleAction(actionValue)}
              >
                确认
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 地址管理弹窗 */}
      <Dialog open={isAddressListOpen} onOpenChange={setIsAddressListOpen}>
        <DialogContent className="sm:max-w-[500px] p-0 border-none bg-white shadow-2xl">
          <DialogHeader className="p-6 border-b relative">
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#C82829]" />
              选择退货地址
            </DialogTitle>
          </DialogHeader>
          <div className="p-6 space-y-4 max-h-[400px] overflow-y-auto">
            {addresses.map((addr) => (
              <div 
                key={addr.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedAddressId === addr.id ? "border-[#C82829] bg-[#FFF3F3]/30" : "border-[#EBE5E5] hover:border-[#C82829]/30"}`}
                onClick={() => {
                  setSelectedAddressId(addr.id)
                  setIsAddressListOpen(false)
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-bold text-[#1F1A1A]">{addr.name} <span className="ml-2 font-normal text-[#8F8787]">{addr.phone}</span></p>
                  {selectedAddressId === addr.id && <Check className="w-4 h-4 text-[#C82829]" />}
                </div>
                <p className="text-sm text-[#5C5454]">{addr.address}</p>
              </div>
            ))}
            <Button 
              variant="outline" 
              className="w-full border-dashed border-2 border-[#EBE5E5] h-12 text-[#8F8787] hover:text-[#C82829] hover:border-[#C82829]"
              onClick={handleAddNewAddress}
            >
              <Plus className="w-4 h-4 mr-2" /> 新增退货地址
            </Button>
          </div>
          <DialogFooter className="p-6 border-t bg-[#F9F8F7]">
            <DialogClose asChild>
              <Button variant="outline">取消</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
