import { useState } from "react"
import { Link } from "react-router-dom"
import { Search, Filter, Download, Package } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const orders = [
  {
    id: "ORD2026041410001",
    product: "故宫脊兽书签套装",
    sku: "全套6枚装",
    qty: 2,
    amount: "¥160.00",
    delivery: "快递物流",
    status: "待发货",
    statusVariant: "warning" as const,
    time: "2026-04-14 09:23",
  },
  {
    id: "ORD2026041410002",
    product: "长城纪念徽章套装",
    sku: "5枚/套",
    qty: 1,
    amount: "¥59.00",
    delivery: "快递物流",
    status: "已发货",
    statusVariant: "success" as const,
    time: "2026-04-14 08:45",
  },
  {
    id: "ORD2026041310003",
    product: "京剧脸谱书签",
    sku: "单枚装",
    qty: 3,
    amount: "¥150.00",
    delivery: "景区自提",
    status: "已完成",
    statusVariant: "secondary" as const,
    time: "2026-04-13 16:32",
  },
  {
    id: "ORD2026041310004",
    product: "北京景点冰箱贴套装",
    sku: "8枚/套",
    qty: 2,
    amount: "¥80.00",
    delivery: "快递物流",
    status: "售后中",
    statusVariant: "info" as const,
    time: "2026-04-13 14:18",
  },
  {
    id: "ORD2026041210005",
    product: "故宫纹样丝巾",
    sku: "200cm*70cm",
    qty: 1,
    amount: "¥199.00",
    delivery: "快递物流",
    status: "已完成",
    statusVariant: "secondary" as const,
    time: "2026-04-12 10:05",
  },
]

const statusOptions = [
  { value: "all", label: "全部状态" },
  { value: "pending", label: "待发货" },
  { value: "shipped", label: "已发货" },
  { value: "completed", label: "已完成" },
  { value: "refund", label: "售后中" },
]

const deliveryOptions = [
  { value: "all", label: "全部方式" },
  { value: "express", label: "快递物流" },
  { value: "pickup", label: "景区自提" },
]

export default function SupplierOrders() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [deliveryFilter, setDeliveryFilter] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<typeof orders[0] | null>(null)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1F1A1A]">订单管理</h1>
          <p className="text-muted-foreground">管理本供应商的全部订单，支持查看订单详情及状态筛选</p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          导出明细
        </Button>
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8F8787]" />
              <Input
                placeholder="订单编号/商品名称/收货人手机"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] h-10">
                <SelectValue placeholder="订单状态" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={deliveryFilter} onValueChange={setDeliveryFilter}>
              <SelectTrigger className="w-[140px] h-10">
                <SelectValue placeholder="履约方式" />
              </SelectTrigger>
              <SelectContent>
                {deliveryOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button size="sm" className="h-10 bg-[#C82829] hover:bg-[#B22222]">
              <Filter className="mr-2 h-4 w-4" />
              筛选
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#F9F8F7] hover:bg-[#F1EEEE]">
                <TableHead className="w-[180px]">订单编号</TableHead>
                <TableHead>商品信息</TableHead>
                <TableHead className="w-[80px]">数量</TableHead>
                <TableHead className="w-[100px]">实付金额</TableHead>
                <TableHead className="w-[100px]">履约方式</TableHead>
                <TableHead className="w-[100px]">订单状态</TableHead>
                <TableHead className="w-[160px]">下单时间</TableHead>
                <TableHead className="w-[120px] text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} className="hover:bg-[#FAFAFA]">
                  <TableCell className="font-mono text-sm">{order.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#FFF3F3] flex items-center justify-center">
                        <Package className="h-4 w-4 text-[#C82829]" />
                      </div>
                      <div>
                        <div className="font-medium text-[#1F1A1A]">{order.product}</div>
                        <div className="text-xs text-[#8F8787]">{order.sku}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">x{order.qty}</TableCell>
                  <TableCell className="font-medium text-[#C82829]">{order.amount}</TableCell>
                  <TableCell>
                    <Badge
                      variant={order.delivery === "快递物流" ? "default" : "secondary"}
                      className={
                        order.delivery === "快递物流"
                          ? "bg-[#E3F2FD] text-[#1976D2] hover:bg-[#E3F2FD]"
                          : "bg-[#F1EEEE] text-[#5C5454] hover:bg-[#F1EEEE]"
                      }
                    >
                      {order.delivery}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={order.statusVariant}
                      className={
                        order.statusVariant === "warning"
                          ? "bg-[#FFF3E0] text-[#F6A018] hover:bg-[#FFF3E0]"
                          : order.statusVariant === "success"
                          ? "bg-[#E8F5E9] text-[#4CAF50] hover:bg-[#E8F5E9]"
                          : order.statusVariant === "info"
                          ? "bg-[#E3F2FD] text-[#2196F3] hover:bg-[#E3F2FD]"
                          : "bg-[#F1EEEE] text-[#8F8787] hover:bg-[#F1EEEE]"
                      }
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-[#8F8787]">{order.time}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[#C82829] hover:text-[#B22222] hover:bg-[#FFF3F3]"
                      onClick={() => setSelectedOrder(order)}
                    >
                      详情
                    </Button>
                    {order.status === "待发货" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-[#C82829] hover:text-[#B22222] hover:bg-[#FFF3F3]"
                        asChild
                      >
                        <Link to="/supplier/shipping">去发货</Link>
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>订单详情</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-[#8F8787] mb-1">订单编号</div>
                  <div className="font-mono text-sm">{selectedOrder.id}</div>
                </div>
                <div>
                  <div className="text-xs text-[#8F8787] mb-1">订单状态</div>
                  <Badge
                    variant={selectedOrder.statusVariant}
                    className={
                      selectedOrder.statusVariant === "warning"
                        ? "bg-[#FFF3E0] text-[#F6A018]"
                        : selectedOrder.statusVariant === "success"
                        ? "bg-[#E8F5E9] text-[#4CAF50]"
                        : "bg-[#F1EEEE] text-[#8F8787]"
                    }
                  >
                    {selectedOrder.status}
                  </Badge>
                </div>
                <div>
                  <div className="text-xs text-[#8F8787] mb-1">下单时间</div>
                  <div className="text-sm">{selectedOrder.time}</div>
                </div>
                <div>
                  <div className="text-xs text-[#8F8787] mb-1">履约方式</div>
                  <div className="text-sm">{selectedOrder.delivery}</div>
                </div>
              </div>

              <div className="p-4 bg-[#F9F8F7] rounded-xl">
                <div className="text-xs text-[#8F8787] mb-2">商品信息</div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-[#FFF3F3] flex items-center justify-center">
                    <Package className="h-6 w-6 text-[#C82829]" />
                  </div>
                  <div>
                    <div className="font-medium">{selectedOrder.product}</div>
                    <div className="text-sm text-[#8F8787]">{selectedOrder.sku}</div>
                  </div>
                  <div className="ml-auto text-right">
                    <div className="font-bold text-[#C82829]">{selectedOrder.amount}</div>
                    <div className="text-sm text-[#8F8787]">x{selectedOrder.qty}</div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[#F9F8F7] rounded-xl">
                <div className="text-xs text-[#8F8787] mb-2">收货信息</div>
                <div className="text-sm">
                  <div className="font-medium">王先生</div>
                  <div className="text-[#8F8787]">139****5678</div>
                  <div className="text-[#5C5454] mt-1">
                    北京市朝阳区建国路88号SOHO现代城A座1201室
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
