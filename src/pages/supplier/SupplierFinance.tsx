import { useState } from "react"
import { Search, FileText, CheckCircle, Download, Calendar } from "lucide-react"

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
  DialogFooter,
} from "@/components/ui/dialog"

const bills = [
  {
    id: "BILL202604",
    period: "2026年04月",
    orderCount: 856,
    amount: "¥89,230.00",
    commission: "¥4,461.50",
    netAmount: "¥84,768.50",
    status: "待核对",
    statusVariant: "warning" as const,
    generateTime: "2026-04-01 00:00",
  },
  {
    id: "BILL202603",
    period: "2026年03月",
    orderCount: 1024,
    amount: "¥105,680.00",
    commission: "¥5,284.00",
    netAmount: "¥100,396.00",
    status: "已核对",
    statusVariant: "success" as const,
    generateTime: "2026-03-01 00:00",
  },
  {
    id: "BILL202602",
    period: "2026年02月",
    orderCount: 892,
    amount: "¥92,450.00",
    commission: "¥4,622.50",
    netAmount: "¥87,827.50",
    status: "已核对",
    statusVariant: "success" as const,
    generateTime: "2026-02-01 00:00",
  },
  {
    id: "BILL202601",
    period: "2026年01月",
    orderCount: 1156,
    amount: "¥118,920.00",
    commission: "¥5,946.00",
    netAmount: "¥112,974.00",
    status: "已核对",
    statusVariant: "success" as const,
    generateTime: "2026-01-01 00:00",
  },
]

const orderDetails = [
  { id: "ORD2026041410001", product: "故宫脊兽书签套装", amount: "¥160.00", status: "已完成" },
  { id: "ORD2026041410002", product: "长城纪念徽章套装", amount: "¥59.00", status: "已完成" },
  { id: "ORD2026041310003", product: "京剧脸谱书签", amount: "¥150.00", status: "已完成" },
  { id: "ORD2026041310004", product: "北京景点冰箱贴套装", amount: "¥80.00", status: "已完成" },
  { id: "ORD2026041210005", product: "故宫纹样丝巾", amount: "¥199.00", status: "已完成" },
]

export default function SupplierFinance() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedBill, setSelectedBill] = useState<typeof bills[0] | null>(null)

  const getStatusBadgeClass = (variant: string) => {
    switch (variant) {
      case "warning":
        return "bg-[#FFF3E0] text-[#F6A018] hover:bg-[#FFF3E0]"
      case "success":
        return "bg-[#E8F5E9] text-[#4CAF50] hover:bg-[#E8F5E9]"
      default:
        return "bg-[#F1EEEE] text-[#8F8787] hover:bg-[#F1EEEE]"
    }
  }

  const filteredBills = bills.filter((bill) => {
    if (statusFilter === "all") return true
    if (statusFilter === "pending") return bill.status === "待核对"
    if (statusFilter === "confirmed") return bill.status === "已核对"
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1F1A1A]">财务对账</h1>
          <p className="text-muted-foreground">查看每月结算账单，核对订单金额及佣金</p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          导出对账明细
        </Button>
      </div>

      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <Card className="border-none shadow-sm">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-[#C82829]">¥84,768.50</div>
            <div className="text-sm text-[#8F8787]">本月应结金额</div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-[#4CAF50]">856</div>
            <div className="text-sm text-[#8F8787]">本月成交订单</div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-[#2196F3]">¥4,461.50</div>
            <div className="text-sm text-[#8F8787]">本月佣金</div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-[#F6A018]">1</div>
            <div className="text-sm text-[#8F8787]">待核对账单</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8F8787]" />
              <Input
                placeholder="账单编号/结算周期"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] h-10">
                <SelectValue placeholder="账单状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="pending">待核对</SelectItem>
                <SelectItem value="confirmed">已核对</SelectItem>
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
                <TableHead className="w-[140px]">账单编号</TableHead>
                <TableHead className="w-[120px]">结算周期</TableHead>
                <TableHead className="w-[100px]">订单数</TableHead>
                <TableHead className="w-[120px]">订单金额</TableHead>
                <TableHead className="w-[100px]">佣金</TableHead>
                <TableHead className="w-[120px]">应结金额</TableHead>
                <TableHead className="w-[100px]">状态</TableHead>
                <TableHead className="w-[160px]">生成时间</TableHead>
                <TableHead className="w-[120px] text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBills.map((bill) => (
                <TableRow key={bill.id} className="hover:bg-[#FAFAFA]">
                  <TableCell className="font-mono text-sm">{bill.id}</TableCell>
                  <TableCell className="font-medium">{bill.period}</TableCell>
                  <TableCell className="text-center">{bill.orderCount}</TableCell>
                  <TableCell className="font-medium text-[#1F1A1A]">{bill.amount}</TableCell>
                  <TableCell className="text-[#8F8787]">-{bill.commission}</TableCell>
                  <TableCell className="font-bold text-[#C82829]">{bill.netAmount}</TableCell>
                  <TableCell>
                    <Badge
                      variant={bill.statusVariant}
                      className={getStatusBadgeClass(bill.statusVariant)}
                    >
                      {bill.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-[#8F8787]">{bill.generateTime}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[#C82829] hover:text-[#B22222] hover:bg-[#FFF3F3]"
                      onClick={() => setSelectedBill(bill)}
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

      <Dialog open={!!selectedBill} onOpenChange={() => setSelectedBill(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>账单详情</DialogTitle>
          </DialogHeader>
          {selectedBill && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-[#F9F8F7] rounded-xl">
                  <div className="text-xs text-[#8F8787] mb-1">账单编号</div>
                  <div className="font-mono font-medium">{selectedBill.id}</div>
                </div>
                <div className="p-4 bg-[#F9F8F7] rounded-xl">
                  <div className="text-xs text-[#8F8787] mb-1">结算周期</div>
                  <div className="font-medium">{selectedBill.period}</div>
                </div>
                <div className="p-4 bg-[#F9F8F7] rounded-xl">
                  <div className="text-xs text-[#8F8787] mb-1">账单状态</div>
                  <Badge
                    variant={selectedBill.statusVariant}
                    className={getStatusBadgeClass(selectedBill.statusVariant)}
                  >
                    {selectedBill.status}
                  </Badge>
                </div>
              </div>

              <div className="p-4 bg-[#FFF3F3] rounded-xl">
                <div className="text-xs text-[#8F8787] mb-3">金额汇总</div>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm text-[#8F8787]">成交订单数</div>
                    <div className="text-xl font-bold text-[#1F1A1A]">{selectedBill.orderCount}</div>
                  </div>
                  <div>
                    <div className="text-sm text-[#8F8787]">订单金额</div>
                    <div className="text-xl font-bold text-[#1F1A1A]">{selectedBill.amount}</div>
                  </div>
                  <div>
                    <div className="text-sm text-[#8F8787]">平台佣金</div>
                    <div className="text-xl font-bold text-[#C82829]">-{selectedBill.commission}</div>
                  </div>
                  <div>
                    <div className="text-sm text-[#8F8787]">应结金额</div>
                    <div className="text-xl font-bold text-[#C82829]">{selectedBill.netAmount}</div>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-[#1F1A1A] mb-2">订单明细</div>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[#F9F8F7]">
                      <TableHead>订单编号</TableHead>
                      <TableHead>商品名称</TableHead>
                      <TableHead className="text-right">金额</TableHead>
                      <TableHead className="text-right">状态</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderDetails.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono text-sm">{order.id}</TableCell>
                        <TableCell>{order.product}</TableCell>
                        <TableCell className="text-right font-medium text-[#C82829]">
                          {order.amount}
                        </TableCell>
                        <TableCell className="text-right text-[#8F8787]">{order.status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {selectedBill.status === "待核对" && (
                <div className="flex items-start gap-2 p-3 bg-[#E3F2FD] rounded-lg text-sm text-[#1976D2]">
                  <Calendar className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>请仔细核对账单金额，如有疑问请联系平台客服。确认后将进入结算流程。</span>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            {selectedBill?.status === "待核对" && (
              <>
                <Button variant="outline" onClick={() => setSelectedBill(null)}>
                  取消
                </Button>
                <Button className="bg-[#C82829] hover:bg-[#B22222]">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  确认账单
                </Button>
              </>
            )}
            {selectedBill?.status === "已核对" && (
              <Button variant="outline" onClick={() => setSelectedBill(null)}>
                关闭
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
