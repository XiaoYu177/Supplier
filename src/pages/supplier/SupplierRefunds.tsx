import { useState } from "react"
import { Search, RefreshCcw, MessageSquare, CheckCircle } from "lucide-react"

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

const refundOrders = [
  {
    id: "REF2026041410001",
    orderId: "ORD2026041210005",
    product: "故宫纹样丝巾",
    sku: "200cm*70cm",
    qty: 1,
    amount: "¥199.00",
    reason: "商品破损",
    status: "待确认",
    statusVariant: "warning" as const,
    applyTime: "2026-04-14 14:30",
    images: ["https://picsum.photos/seed/1/100/100", "https://picsum.photos/seed/2/100/100"],
  },
  {
    id: "REF2026041310002",
    orderId: "ORD2026041010008",
    product: "天坛祈福香囊",
    sku: "单枚装",
    qty: 2,
    amount: "¥100.00",
    reason: "收到商品与描述不符",
    status: "处理中",
    statusVariant: "info" as const,
    applyTime: "2026-04-13 09:15",
    images: ["https://picsum.photos/seed/3/100/100"],
  },
  {
    id: "REF2026041210003",
    orderId: "ORD2026040910003",
    product: "长城纪念徽章套装",
    sku: "5枚/套",
    qty: 1,
    amount: "¥59.00",
    reason: "错拍/多拍",
    status: "已同意",
    statusVariant: "success" as const,
    applyTime: "2026-04-12 16:45",
    images: [],
  },
  {
    id: "REF2026041110004",
    orderId: "ORD2026040810012",
    product: "京剧脸谱书签",
    sku: "单枚装",
    qty: 3,
    amount: "¥150.00",
    reason: "其他",
    status: "已拒绝",
    statusVariant: "secondary" as const,
    applyTime: "2026-04-11 11:20",
    images: [],
  },
]

const statusOptions = [
  { value: "all", label: "全部状态" },
  { value: "pending", label: "待确认" },
  { value: "processing", label: "处理中" },
  { value: "approved", label: "已同意" },
  { value: "rejected", label: "已拒绝" },
]

export default function SupplierRefunds() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedRefund, setSelectedRefund] = useState<typeof refundOrders[0] | null>(null)

  const getStatusBadgeClass = (variant: string) => {
    switch (variant) {
      case "warning":
        return "bg-[#FFF3E0] text-[#F6A018] hover:bg-[#FFF3E0]"
      case "info":
        return "bg-[#E3F2FD] text-[#2196F3] hover:bg-[#E3F2FD]"
      case "success":
        return "bg-[#E8F5E9] text-[#4CAF50] hover:bg-[#E8F5E9]"
      default:
        return "bg-[#F1EEEE] text-[#8F8787] hover:bg-[#F1EEEE]"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1F1A1A]">售后记录</h1>
          <p className="text-muted-foreground">查看本供应商的退款退货记录，了解处理进度</p>
        </div>
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8F8787]" />
              <Input
                placeholder="退款编号/订单编号/商品名称"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] h-10">
                <SelectValue placeholder="售后状态" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button size="sm" className="h-10 bg-[#C82829] hover:bg-[#B22222]">
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
                <TableHead className="w-[160px]">退款编号</TableHead>
                <TableHead className="w-[160px]">原订单编号</TableHead>
                <TableHead>商品信息</TableHead>
                <TableHead className="w-[80px]">数量</TableHead>
                <TableHead className="w-[100px]">退款金额</TableHead>
                <TableHead className="w-[100px]">售后原因</TableHead>
                <TableHead className="w-[100px]">状态</TableHead>
                <TableHead className="w-[160px]">申请时间</TableHead>
                <TableHead className="w-[100px] text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {refundOrders.map((refund) => (
                <TableRow key={refund.id} className="hover:bg-[#FAFAFA]">
                  <TableCell className="font-mono text-sm">{refund.id}</TableCell>
                  <TableCell className="font-mono text-sm text-[#8F8787]">
                    {refund.orderId}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#FFF3F3] flex items-center justify-center">
                        <RefreshCcw className="h-4 w-4 text-[#C82829]" />
                      </div>
                      <div>
                        <div className="font-medium text-[#1F1A1A]">{refund.product}</div>
                        <div className="text-xs text-[#8F8787]">{refund.sku}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">x{refund.qty}</TableCell>
                  <TableCell className="font-medium text-[#C82829]">{refund.amount}</TableCell>
                  <TableCell className="text-[#8F8787]">{refund.reason}</TableCell>
                  <TableCell>
                    <Badge
                      variant={refund.statusVariant}
                      className={getStatusBadgeClass(refund.statusVariant)}
                    >
                      {refund.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-[#8F8787]">{refund.applyTime}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[#C82829] hover:text-[#B22222] hover:bg-[#FFF3F3]"
                      onClick={() => setSelectedRefund(refund)}
                    >
                      详情
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedRefund} onOpenChange={() => setSelectedRefund(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>售后详情</DialogTitle>
          </DialogHeader>
          {selectedRefund && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-[#8F8787] mb-1">退款编号</div>
                  <div className="font-mono text-sm">{selectedRefund.id}</div>
                </div>
                <div>
                  <div className="text-xs text-[#8F8787] mb-1">原订单编号</div>
                  <div className="font-mono text-sm">{selectedRefund.orderId}</div>
                </div>
                <div>
                  <div className="text-xs text-[#8F8787] mb-1">售后状态</div>
                  <Badge
                    variant={selectedRefund.statusVariant}
                    className={getStatusBadgeClass(selectedRefund.statusVariant)}
                  >
                    {selectedRefund.status}
                  </Badge>
                </div>
                <div>
                  <div className="text-xs text-[#8F8787] mb-1">申请时间</div>
                  <div className="text-sm">{selectedRefund.applyTime}</div>
                </div>
              </div>

              <div className="p-4 bg-[#F9F8F7] rounded-xl">
                <div className="text-xs text-[#8F8787] mb-2">商品信息</div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-[#FFF3F3] flex items-center justify-center">
                    <RefreshCcw className="h-6 w-6 text-[#C82829]" />
                  </div>
                  <div>
                    <div className="font-medium">{selectedRefund.product}</div>
                    <div className="text-sm text-[#8F8787]">{selectedRefund.sku}</div>
                  </div>
                  <div className="ml-auto text-right">
                    <div className="font-bold text-[#C82829]">{selectedRefund.amount}</div>
                    <div className="text-sm text-[#8F8787]">x{selectedRefund.qty}</div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[#F9F8F7] rounded-xl">
                <div className="text-xs text-[#8F8787] mb-2">售后原因</div>
                <div className="text-sm text-[#1F1A1A]">{selectedRefund.reason}</div>
                {selectedRefund.images.length > 0 && (
                  <div className="flex gap-2 mt-3">
                    {selectedRefund.images.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`凭证 ${index + 1}`}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="p-4 bg-[#F9F8F7] rounded-xl">
                <div className="text-xs text-[#8F8787] mb-2">处理进度</div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-[#4CAF50]" />
                    <span>买家提交退款申请</span>
                    <span className="text-[#8F8787] ml-auto">{selectedRefund.applyTime}</span>
                  </div>
                  {selectedRefund.status !== "待确认" && (
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle
                        className={`h-4 w-4 ${
                          selectedRefund.status === "已同意"
                            ? "text-[#4CAF50]"
                            : selectedRefund.status === "已拒绝"
                            ? "text-[#C82829]"
                            : "text-[#2196F3]"
                        }`}
                      />
                      <span>
                        {selectedRefund.status === "已同意"
                          ? "供应商同意退款"
                          : selectedRefund.status === "已拒绝"
                          ? "供应商拒绝退款"
                          : "等待供应商处理"}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {selectedRefund.status === "待确认" && (
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 border-[#C82829] text-[#C82829] hover:bg-[#FFF3F3]"
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    联系买家
                  </Button>
                  <Button
                    className="flex-1 bg-[#C82829] hover:bg-[#B22222]"
                  >
                    确认退款
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
