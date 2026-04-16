import { useMemo, useState } from "react"
import { Search, Download, Wallet, Circle } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

type Bill = {
  id: string
  period: string
  orderCount: number
  billAmount: number
  supplierSettleAmount: number
  generateTime: string
}

const orderDetails = [
  { id: "ORD2026041410001", product: "故宫脊兽书签套装", amount: "¥160.00", status: "已完成" },
  { id: "ORD2026041410002", product: "长城纪念徽章套装", amount: "¥59.00", status: "已完成" },
  { id: "ORD2026041310003", product: "京剧脸谱书签", amount: "¥150.00", status: "已完成" },
  { id: "ORD2026041210005", product: "故宫纹样丝巾", amount: "¥199.00", status: "已完成" },
]

const getCurrentMonth = () => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
}

const money = (value: number) => `¥${value.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const buildWeeklyBills = (monthValue: string): Bill[] => {
  const [yearText, monthText] = monthValue.split("-")
  const year = Number(yearText)
  const month = Number(monthText)
  const monthStart = new Date(year, month - 1, 1)
  const monthEnd = new Date(year, month, 0)
  const daysInMonth = monthEnd.getDate()
  const monthLabel = `${year}年${String(month).padStart(2, "0")}月`

  const fmt = (day: number) => `${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  const list: Bill[] = []
  let weekIndex = 1

  for (let day = 1; day <= daysInMonth; day += 7) {
    const startDay = day
    const endDay = Math.min(day + 6, daysInMonth)
    const orderCount = 180 + weekIndex * 24
    const billAmount = 18000 + weekIndex * 5200
    const endDate = new Date(monthStart.getFullYear(), monthStart.getMonth(), endDay, 18, 0, 0)

    list.push({
      id: `BILL${year}${String(month).padStart(2, "0")}${String(weekIndex).padStart(2, "0")}`,
      period: `${monthLabel}第${weekIndex}周（${fmt(startDay)}~${fmt(endDay)}）`,
      orderCount,
      billAmount,
      supplierSettleAmount: billAmount,
      generateTime: `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, "0")}-${String(endDate.getDate()).padStart(2, "0")} 18:00`,
    })

    weekIndex += 1
  }

  return list
}

export default function SupplierFinance() {
  const currentMonth = getCurrentMonth()
  const [search, setSearch] = useState("")
  const [month, setMonth] = useState(currentMonth)
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null)

  const filteredBills = useMemo(() => {
    const weeklyBills = buildWeeklyBills(month)
    const keyword = search.trim().toLowerCase()
    return weeklyBills.filter((bill) => {
      const keywordMatched = !keyword || `${bill.id}${bill.period}`.toLowerCase().includes(keyword)
      return keywordMatched
    })
  }, [search, month])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1F1A1A]">财务对账</h1>
          <p className="text-muted-foreground">按月查看账单记录，系统每周生成一次账单</p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          导出对账明细
        </Button>
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#5C5454]">账单月份</span>
              <Input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="h-10 w-[180px]" />
            </div>
            <div className="relative min-w-[220px] flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8F8787]" />
              <Input
                placeholder="账单编号/结算周期"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 pl-9"
              />
            </div>
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
                <TableHead className="w-[140px]">账单金额</TableHead>
                <TableHead className="w-[150px]">供应商应结金额</TableHead>
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
                  <TableCell className="font-bold text-[#1F1A1A]">{money(bill.billAmount)}</TableCell>
                  <TableCell className="font-bold text-[#C82829]">{money(bill.supplierSettleAmount)}</TableCell>
                  <TableCell className="text-[#8F8787]">{bill.generateTime}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-[#E4DDDD] text-[#4A4444] hover:bg-[#FFF3F3] hover:text-[#C82829]"
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
        <DialogContent className="flex h-[88vh] w-[min(1200px,calc(100vw-64px))] max-w-none sm:max-w-none flex-col gap-0 overflow-hidden p-0">
          <DialogHeader className="shrink-0 border-b px-6 py-4 pr-12">
            <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
              <Wallet className="h-5 w-5 text-[#C82829]" />
              账单详情
            </DialogTitle>
          </DialogHeader>
          {selectedBill && (
            <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-6 py-5">
              <div className="grid gap-4 rounded-xl bg-[#F9F8F7] p-4 md:grid-cols-2">
                <div>
                  <div className="mb-1 text-xs text-[#8F8787]">账单编号</div>
                  <div className="font-mono font-medium">{selectedBill.id}</div>
                </div>
                <div>
                  <div className="mb-1 text-xs text-[#8F8787]">结算周期</div>
                  <div className="font-medium">{selectedBill.period}</div>
                </div>
                <div>
                  <div className="mb-1 text-xs text-[#8F8787]">生成时间</div>
                  <div className="font-medium">{selectedBill.generateTime}</div>
                </div>
              </div>

              <div className="border-t border-[#EFE8E8] pt-5">
                <div className="mb-3 flex items-center gap-2 text-lg font-semibold text-[#1F1A1A]">
                  <Wallet className="h-4 w-4 text-[#C82829]" />
                  金额汇总
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-[#8F8787]">成交订单数</div>
                    <div className="text-xl font-bold text-[#1F1A1A]">{selectedBill.orderCount}</div>
                  </div>
                  <div>
                    <div className="text-sm text-[#8F8787]">账单金额</div>
                    <div className="text-xl font-bold text-[#1F1A1A]">{money(selectedBill.billAmount)}</div>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#EFE8E8] pt-5">
                <div className="mb-3 flex items-center gap-2 text-lg font-semibold text-[#1F1A1A]">
                  <Circle className="h-2.5 w-2.5 fill-[#C82829] text-[#C82829]" />
                  订单明细
                </div>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[#F9F8F7]">
                      <TableHead>订单编号</TableHead>
                      <TableHead>商品名称</TableHead>
                      <TableHead className="text-right">金额</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderDetails.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono text-sm">{order.id}</TableCell>
                        <TableCell>{order.product}</TableCell>
                        <TableCell className="text-right font-medium text-[#C82829]">{order.amount}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
