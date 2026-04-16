import { useEffect, useMemo, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { Circle, CreditCard, Download, MapPin, Package, Search, Truck, UserRound } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

type OrderStatus = "待发货" | "已发货" | "已完成" | "售后中"
type CouponType = "满减券" | "折扣券" | "无"
type LogisticsStatus = "待发货" | "运输中" | "已签收" | "拒收"

type OrderItem = {
  id: string
  product: string
  sku: string
  qty: number
  image: string
  status: OrderStatus
  statusVariant: "warning" | "success" | "secondary" | "info"
  orderTime: string
  payTime: string
  originalAmount: number
  discountAmount: number
  paidAmount: number
  couponType: CouponType
  receiverName: string
  receiverPhone: string
  receiverAddress: string
  logisticsCompany: string
  logisticsNo: string
  logisticsStatus: LogisticsStatus
  supplierName: string
  paymentMethod: string
}

const orders: OrderItem[] = [
  {
    id: "ORD2026041410001",
    product: "故宫脊兽书签套装",
    sku: "全套6枚装",
    qty: 2,
    image:
      "https://images.unsplash.com/photo-1513530534585-c7b1394c6d51?auto=format&fit=crop&w=200&q=80",
    status: "待发货",
    statusVariant: "warning",
    orderTime: "2026-04-14 09:23:11",
    payTime: "2026-04-14 09:25:08",
    originalAmount: 198,
    discountAmount: 38,
    paidAmount: 160,
    couponType: "满减券",
    receiverName: "王天宇",
    receiverPhone: "13800138001",
    receiverAddress: "北京市朝阳区建国路88号SOHO现代城A座1201室",
    logisticsCompany: "待分配",
    logisticsNo: "待发货",
    logisticsStatus: "待发货",
    supplierName: "故宫文创旗舰店",
    paymentMethod: "微信支付",
  },
  {
    id: "ORD2026041410002",
    product: "长城纪念徽章套装",
    sku: "5枚/套",
    qty: 1,
    image: "https://picsum.photos/seed/changcheng-medal/200/200",
    status: "已发货",
    statusVariant: "success",
    orderTime: "2026-04-14 08:45:36",
    payTime: "2026-04-14 08:46:10",
    originalAmount: 79,
    discountAmount: 20,
    paidAmount: 59,
    couponType: "折扣券",
    receiverName: "刘诗雨",
    receiverPhone: "13900139002",
    receiverAddress: "北京市海淀区中关村大街27号中关村大厦3层",
    logisticsCompany: "顺丰速递",
    logisticsNo: "SF1234567890",
    logisticsStatus: "运输中",
    supplierName: "故宫文创旗舰店",
    paymentMethod: "微信支付",
  },
  {
    id: "ORD2026041310003",
    product: "京剧脸谱书签",
    sku: "单枚装",
    qty: 3,
    image:
      "https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&w=200&q=80",
    status: "已完成",
    statusVariant: "secondary",
    orderTime: "2026-04-13 16:32:02",
    payTime: "2026-04-13 16:34:16",
    originalAmount: 180,
    discountAmount: 30,
    paidAmount: 150,
    couponType: "满减券",
    receiverName: "张雨涵",
    receiverPhone: "13700137003",
    receiverAddress: "北京市东城区东直门南大街11号院2号楼1802室",
    logisticsCompany: "中通快递",
    logisticsNo: "ZT9876543210",
    logisticsStatus: "已签收",
    supplierName: "故宫文创旗舰店",
    paymentMethod: "支付宝",
  },
  {
    id: "ORD2026041310004",
    product: "北京景点冰箱贴套装",
    sku: "8枚/套",
    qty: 2,
    image:
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=200&q=80",
    status: "售后中",
    statusVariant: "info",
    orderTime: "2026-04-13 14:18:44",
    payTime: "2026-04-13 14:20:03",
    originalAmount: 120,
    discountAmount: 40,
    paidAmount: 80,
    couponType: "满减券",
    receiverName: "陈俊峰",
    receiverPhone: "13600136004",
    receiverAddress: "北京市石景山区苹果园路12号中海大厦5层",
    logisticsCompany: "圆通快递",
    logisticsNo: "YT202604131004",
    logisticsStatus: "运输中",
    supplierName: "故宫文创旗舰店",
    paymentMethod: "微信支付",
  },
  {
    id: "ORD2026041210005",
    product: "故宫纹样丝巾",
    sku: "海棠红 200cm*70cm",
    qty: 1,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=200&q=80",
    status: "已完成",
    statusVariant: "secondary",
    orderTime: "2026-04-12 10:05:39",
    payTime: "2026-04-12 10:07:21",
    originalAmount: 238,
    discountAmount: 39,
    paidAmount: 199,
    couponType: "折扣券",
    receiverName: "赵雅宁",
    receiverPhone: "13500135005",
    receiverAddress: "北京市西城区阜成门外大街22号院6号楼903室",
    logisticsCompany: "京东快递",
    logisticsNo: "JD202604121005",
    logisticsStatus: "已签收",
    supplierName: "故宫文创旗舰店",
    paymentMethod: "微信支付",
  },
]

const statusOptions: Array<"全部订单" | OrderStatus> = ["全部订单", "待发货", "已发货", "已完成", "售后中"]
const logisticsStatusOptions: Array<"全部物流状态" | LogisticsStatus> = [
  "全部物流状态",
  "待发货",
  "运输中",
  "已签收",
  "拒收",
]

export default function SupplierOrders() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<"全部订单" | OrderStatus>("全部订单")
  const [logisticsFilter, setLogisticsFilter] = useState<"全部物流状态" | LogisticsStatus>("全部物流状态")
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null)
  const detailScrollRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!selectedOrder) return

    const forceScrollToTop = () => {
      if (detailScrollRef.current) {
        detailScrollRef.current.scrollTop = 0
      }
      const popup = document.querySelector('[data-slot="dialog-content"]') as HTMLElement | null
      if (popup) {
        popup.scrollTop = 0
      }
    }

    forceScrollToTop()
    const raf = window.requestAnimationFrame(forceScrollToTop)
    const timer = window.setTimeout(forceScrollToTop, 30)

    return () => {
      window.cancelAnimationFrame(raf)
      window.clearTimeout(timer)
    }
  }, [selectedOrder])

  const filteredOrders = useMemo(() => {
    const keyword = search.trim().toLowerCase()
    return orders.filter((order) => {
      const statusMatched = statusFilter === "全部订单" || order.status === statusFilter
      const logisticsMatched = logisticsFilter === "全部物流状态" || order.logisticsStatus === logisticsFilter
      const keywordMatched =
        !keyword ||
        `${order.id}${order.product}${order.receiverName}${order.receiverPhone}`.toLowerCase().includes(keyword)
      return statusMatched && logisticsMatched && keywordMatched
    })
  }, [search, statusFilter, logisticsFilter])

  const getStatusBadgeClass = (variant: OrderItem["statusVariant"]) => {
    switch (variant) {
      case "warning":
        return "bg-[#FFF3E0] text-[#F6A018] hover:bg-[#FFF3E0]"
      case "success":
        return "bg-[#E8F5E9] text-[#4CAF50] hover:bg-[#E8F5E9]"
      case "info":
        return "bg-[#E3F2FD] text-[#2196F3] hover:bg-[#E3F2FD]"
      default:
        return "bg-[#F1EEEE] text-[#8F8787] hover:bg-[#F1EEEE]"
    }
  }

  const money = (value: number) => `¥${value.toFixed(2)}`
  const logisticsDesc = (status: LogisticsStatus) =>
    status === "待发货"
      ? "订单已提交，等待商家发货"
      : status === "运输中"
      ? "包裹已揽收，正在运输中"
      : status === "已签收"
      ? "包裹已送达，用户已签收"
      : "包裹已被拒收，等待处理"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1F1A1A]">订单管理</h1>
          <p className="text-muted-foreground">根据供应商范围实时筛选订单，支持查看详细订单信息</p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          导出明细
        </Button>
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative min-w-[260px] flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8F8787]" />
              <Input
                placeholder="订单编号/商品名称/收货人姓名/手机号"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="h-10 pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as typeof statusFilter)}>
              <SelectTrigger className="h-10 w-[150px]">
                <SelectValue placeholder="订单状态" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={logisticsFilter}
              onValueChange={(value) => setLogisticsFilter(value as typeof logisticsFilter)}
            >
              <SelectTrigger className="h-10 w-[150px]">
                <SelectValue placeholder="物流状态" />
              </SelectTrigger>
              <SelectContent>
                {logisticsStatusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#F9F8F7] hover:bg-[#F9F8F7]">
                <TableHead className="w-[190px]">订单编号</TableHead>
                <TableHead className="min-w-[260px]">商品信息</TableHead>
                <TableHead className="w-[80px] text-center">数量</TableHead>
                <TableHead className="w-[120px]">实付金额</TableHead>
                <TableHead className="w-[220px]">优惠类型</TableHead>
                <TableHead className="w-[110px]">订单状态</TableHead>
                <TableHead className="w-[180px]">下单时间</TableHead>
                <TableHead className="w-[180px] text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id} className="hover:bg-[#FAFAFA]">
                  <TableCell className="font-mono text-sm">{order.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img src={order.image} alt={order.product} className="h-12 w-12 rounded-md object-cover" />
                      <div className="min-w-0">
                        <div className="truncate font-medium text-[#1F1A1A]">{order.product}</div>
                        <div className="truncate text-xs text-[#8F8787]">{order.sku}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">x{order.qty}</TableCell>
                  <TableCell className="font-medium text-[#C82829]">{money(order.paidAmount)}</TableCell>
                  <TableCell className="text-sm">
                    <div className="font-medium text-[#1F1A1A]">
                      {order.couponType === "满减券" ? "满减优惠" : order.couponType === "折扣券" ? "折扣优惠" : "无优惠"}
                    </div>
                    <div className="mt-1 text-xs text-[#8F8787]">
                      优惠: {money(order.discountAmount)} / 原价: {money(order.originalAmount)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={order.statusVariant} className={getStatusBadgeClass(order.statusVariant)}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-[#8F8787]">{order.orderTime}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-[#E4DDDD] text-[#4A4444] hover:bg-[#FFF3F3] hover:text-[#C82829]"
                        onClick={() => setSelectedOrder(order)}
                      >
                        详情
                      </Button>
                      {order.status === "待发货" && (
                        <Button size="sm" className="bg-[#C82829] hover:bg-[#B22222]" asChild>
                          <Link to="/supplier/shipping">去发货</Link>
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="flex h-[88vh] w-[min(1200px,calc(100vw-64px))] max-w-none sm:max-w-none flex-col gap-0 overflow-hidden p-0">
          <DialogHeader className="shrink-0 border-b px-6 py-4 pr-12">
            <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
              <Package className="h-5 w-5 text-[#C82829]" />
              订单详情
            </DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div ref={detailScrollRef} className="min-h-0 flex-1 space-y-6 overflow-y-auto px-6 py-5">
              <div className="grid gap-4 rounded-xl bg-[#F9F8F7] p-4 text-sm md:grid-cols-2">
                <div>
                  <div className="mb-1 text-xs text-[#8F8787]">订单编号</div>
                  <div className="font-mono text-lg font-semibold text-[#1F1A1A]">{selectedOrder.id}</div>
                </div>
                <div>
                  <div className="mb-1 text-xs text-[#8F8787]">订单时间</div>
                  <div className="text-lg font-semibold text-[#1F1A1A]">{selectedOrder.orderTime}</div>
                </div>
              </div>

              <div className="border-t border-[#EFE8E8] pt-5">
                <div className="mb-3 flex items-center gap-2 text-base font-semibold text-[#1F1A1A]">
                  <Package className="h-4 w-4 text-[#C82829]" />
                  商品信息
                </div>
                <div className="flex items-center gap-4">
                  <img src={selectedOrder.image} alt={selectedOrder.product} className="h-16 w-16 rounded-lg object-cover" />
                  <div className="min-w-0">
                    <div className="text-base font-medium text-[#1F1A1A]">{selectedOrder.product}</div>
                    <div className="mt-1 text-sm text-[#5C5454]">规格：{selectedOrder.sku}</div>
                    <div className="mt-1 text-sm text-[#5C5454]">数量：x{selectedOrder.qty}</div>
                    <div className="mt-1 text-sm text-[#5C5454]">供应商：{selectedOrder.supplierName}</div>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#EFE8E8] pt-5">
                <div className="mb-3 flex items-center gap-2 text-base font-semibold text-[#1F1A1A]">
                  <CreditCard className="h-4 w-4 text-[#C82829]" />
                  支付与优惠
                </div>
                <div className="grid gap-4 text-sm md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="text-[#8F8787]">原价</div>
                    <div className="font-medium text-[#1F1A1A]">{money(selectedOrder.originalAmount)}</div>
                    <div className="text-[#8F8787]">优惠金额</div>
                    <div className="font-semibold text-[#52C41A]">-{money(selectedOrder.discountAmount)}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-[#8F8787]">优惠类型</div>
                    <div className="font-medium text-[#1F1A1A]">{selectedOrder.couponType}</div>
                    <div className="text-[#8F8787]">实付金额</div>
                    <div className="font-semibold text-[#C82829]">{money(selectedOrder.paidAmount)}</div>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#EFE8E8] pt-5">
                <div className="mb-3 flex items-center gap-2 text-base font-semibold text-[#1F1A1A]">
                  <UserRound className="h-4 w-4 text-[#C82829]" />
                  用户信息
                </div>
                <div className="grid gap-3 text-sm md:grid-cols-2">
                  <div>
                    <div className="text-[#8F8787]">收货人姓名</div>
                    <div className="font-medium text-[#1F1A1A]">{selectedOrder.receiverName}</div>
                  </div>
                  <div>
                    <div className="text-[#8F8787]">联系电话</div>
                    <div className="font-medium text-[#1F1A1A]">{selectedOrder.receiverPhone}</div>
                  </div>
                  <div>
                    <div className="text-[#8F8787]">支付方式</div>
                    <div className="font-medium text-[#1F1A1A]">{selectedOrder.paymentMethod}</div>
                  </div>
                </div>
                <div className="mt-3 text-sm">
                  <div className="mb-1 text-[#8F8787]">收货地址</div>
                  <div className="flex items-start gap-1 font-medium text-[#1F1A1A]">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#C82829]" />
                    <span>{selectedOrder.receiverAddress}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#EFE8E8] pt-5">
                <div className="mb-3 flex items-center gap-2 text-base font-semibold text-[#1F1A1A]">
                  <Truck className="h-4 w-4 text-[#C82829]" />
                  物流状态：
                  <Badge className="ml-1 bg-[#FFF3F3] text-[#C82829] hover:bg-[#FFF3F3]">{selectedOrder.logisticsStatus}</Badge>
                </div>
                <div className="pl-1 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <Circle className="h-2.5 w-2.5 fill-[#C82829] text-[#C82829]" />
                      <div className="mt-1 h-6 w-px bg-[#E4DDDD]" />
                    </div>
                    <div>
                      <div className="font-medium text-[#1F1A1A]">{logisticsDesc(selectedOrder.logisticsStatus)}</div>
                      <div className="mt-1 text-xs text-[#8F8787]">{selectedOrder.payTime}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button className="rounded-full bg-[#C82829] px-5 hover:bg-[#B22222]" onClick={() => setSelectedOrder(null)}>
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
