import { useState } from "react"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Download, 
  Eye, 
  Wallet, 
  Search, 
  ChevronDown, 
  ChevronUp,
  Package,
  RotateCcw,
  Calendar
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const mockBills = [
  { 
    id: 1, 
    period: "2024-04-01 至 2024-04-30", 
    supplier: "故宫文创旗舰店", 
    revenue: "¥450,678.00",
    soldCount: 1250,
    refunds: "¥5,400.00",
    returnedCount: 12,
    details: {
      soldOrders: [
        { id: "ORD2024040101", product: "故宫日历2024", amount: "¥128.00", time: "2024-04-01 10:20" },
        { id: "ORD2024040102", product: "千里江山图丝巾", amount: "¥358.00", time: "2024-04-01 11:45" },
      ],
      returnedOrders: [
        { id: "ORD2024040105", product: "故宫书签套装", amount: "¥45.00", reason: "质量问题", time: "2024-04-05 14:20" }
      ]
    }
  },
  { 
    id: 2, 
    period: "2024-04-01 至 2024-04-30", 
    supplier: "北京礼物官方店", 
    revenue: "¥320,120.00",
    soldCount: 890,
    refunds: "¥2,100.00",
    returnedCount: 5,
    details: {
      soldOrders: [
        { id: "ORD2024040201", product: "长城模型", amount: "¥299.00", time: "2024-04-02 09:30" },
      ],
      returnedOrders: []
    }
  },
  { 
    id: 3, 
    period: "2024-03-01 至 2024-03-31", 
    supplier: "老北京布鞋坊", 
    revenue: "¥180,450.00",
    soldCount: 450,
    refunds: "¥1,200.00",
    returnedCount: 3,
    details: {
      soldOrders: [],
      returnedOrders: []
    }
  },
]

export default function GiftFinance() {
  const [supplierFilter, setSupplierFilter] = useState("全部供应商")
  const [dateRange, setDateRange] = useState({
    start: "2024-04-01",
    end: "2024-04-30"
  })
  const [selectedBill, setSelectedBill] = useState<typeof mockBills[0] | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const filteredBills = mockBills.filter(bill => {
    const matchSupplier = supplierFilter === "全部供应商" || bill.supplier === supplierFilter;
    const billStartDate = bill.period.split(" ")[0];
    const matchDate = (!dateRange.start || billStartDate >= dateRange.start) &&
                      (!dateRange.end || billStartDate <= dateRange.end);
    return matchSupplier && matchDate;
  });

  const parseMoney = (str: string) => Number(str.replace(/[^0-9.-]+/g,""));
  const formatMoney = (num: number) => "¥" + num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const totalRevenue = filteredBills.reduce((sum, bill) => sum + parseMoney(bill.revenue), 0);
  const totalRefunds = filteredBills.reduce((sum, bill) => sum + parseMoney(bill.refunds), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1F1A1A]">财务对账</h1>
          <p className="text-muted-foreground">管理供应商结算账单，核对成交金额及售后扣款。</p>
        </div>
        <Button variant="outline" className="border-[#EBE5E5]">
          <Download className="mr-2 h-4 w-4" /> 导出账单
        </Button>
      </div>

      {/* 筛选与统计区域 */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6">
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
              <div className="flex flex-col gap-2 w-[200px]">
                <label className="text-xs font-medium text-[#8F8787] leading-none">供应商筛选</label>
                <div className="relative">
                  <Select value={supplierFilter} onValueChange={setSupplierFilter}>
                    <SelectTrigger className="!h-[44px] !min-h-[44px] !w-full border-[#EBE5E5] text-sm !py-0">
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
              <Button className="bg-[#C82829] hover:bg-[#C82829]/90 h-[44px] px-6">
                查询
              </Button>
            </div>

            {/* 统计数据 */}
            <div className="flex items-center gap-8 bg-[#F9F8F7] px-6 py-3 rounded-lg border border-[#EBE5E5]">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <div className="bg-red-50 p-1 rounded">
                    <Wallet className="h-3.5 w-3.5 text-[#C82829]" />
                  </div>
                  <span className="text-xs font-medium text-[#8F8787]">本月成交总额</span>
                  <span className="text-[10px] text-[#8F8787] opacity-70">(已扣除售后)</span>
                </div>
                <div className="text-lg font-bold text-[#1F1A1A] pl-7">{formatMoney(totalRevenue)}</div>
              </div>
              <div className="w-px h-10 bg-[#EBE5E5]"></div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <div className="bg-orange-50 p-1 rounded">
                    <Wallet className="h-3.5 w-3.5 text-[#FAAD14]" />
                  </div>
                  <span className="text-xs font-medium text-[#8F8787]">售后扣除总额 (本月)</span>
                </div>
                <div className="text-lg font-bold text-[#1F1A1A] pl-7">{formatMoney(totalRefunds)}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm">
        <CardContent className="p-6">
          <div className="rounded-lg border border-[#EBE5E5] overflow-hidden">
            <Table>
              <TableHeader className="bg-[#F9F8F7]">
                <TableRow className="hover:bg-transparent border-[#EBE5E5]">
                  <TableHead className="text-[#5C5454] font-medium">结算周期</TableHead>
                  <TableHead className="text-[#5C5454] font-medium">供应商名称</TableHead>
                  <TableHead className="text-[#5C5454] font-medium">成交金额</TableHead>
                  <TableHead className="text-[#5C5454] font-medium">售出商品数量</TableHead>
                  <TableHead className="text-[#5C5454] font-medium">退款金额</TableHead>
                  <TableHead className="text-[#5C5454] font-medium">退回商品数量</TableHead>
                  <TableHead className="text-right text-[#5C5454] font-medium">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBills.length > 0 ? filteredBills.map((bill) => (
                  <TableRow key={bill.id} className="border-[#EBE5E5] hover:bg-[#FFF3F3]/30 transition-colors">
                    <TableCell className="text-sm text-[#5C5454]">{bill.period}</TableCell>
                    <TableCell className="font-medium text-[#1F1A1A]">{bill.supplier}</TableCell>
                    <TableCell className="text-[#1F1A1A] font-medium">{bill.revenue}</TableCell>
                    <TableCell className="text-[#1F1A1A]">
                      <div className="flex items-center gap-1">
                        <Package className="h-3 w-3 text-[#8F8787]" />
                        {bill.soldCount}
                      </div>
                    </TableCell>
                    <TableCell className="text-destructive">{bill.refunds}</TableCell>
                    <TableCell className="text-[#FAAD14]">
                      <div className="flex items-center gap-1">
                        <RotateCcw className="h-3 w-3" />
                        {bill.returnedCount}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="default" 
                          size="sm" 
                          className="bg-[#C82829] hover:bg-[#C82829]/90 text-white px-4 h-8"
                          onClick={() => {
                            setSelectedBill(bill);
                            setIsDialogOpen(true);
                          }}
                        >
                          详情
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-[#8F8787]">
                      没有找到符合条件的账单记录
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="!max-w-[800px] w-[90vw] max-h-[90vh] flex flex-col p-0 border-none bg-white shadow-2xl overflow-hidden">
          <DialogHeader className="px-6 py-4 border-b border-[#EBE5E5] bg-[#F9F8F7] shrink-0">
            <DialogTitle className="text-lg font-bold text-[#1F1A1A]">
              账单详情 - {selectedBill?.supplier}
            </DialogTitle>
          </DialogHeader>
          
          {selectedBill && (
            <div className="flex-1 overflow-hidden flex flex-col p-6">
              <Tabs defaultValue="sold" className="flex-1 flex flex-col overflow-hidden">
                <TabsList className="grid w-[400px] grid-cols-2 mb-4 shrink-0">
                  <TabsTrigger value="sold" className="data-[state=active]:bg-[#C82829] data-[state=active]:text-white">
                    售出商品订单明细
                  </TabsTrigger>
                  <TabsTrigger value="returned" className="data-[state=active]:bg-[#C82829] data-[state=active]:text-white">
                    退回商品订单明细
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="sold" className="flex-1 overflow-y-auto min-h-0 m-0 pr-2">
                  <div className="rounded-md border border-[#EBE5E5] bg-white">
                    <Table>
                      <TableHeader className="bg-[#F9F8F7] sticky top-0 z-10">
                        <TableRow className="hover:bg-transparent border-[#EBE5E5]">
                          <TableHead className="text-xs">订单号</TableHead>
                          <TableHead className="text-xs">商品名称</TableHead>
                          <TableHead className="text-xs">成交金额</TableHead>
                          <TableHead className="text-xs">下单时间</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedBill.details.soldOrders.length > 0 ? (
                          selectedBill.details.soldOrders.map((order) => (
                            <TableRow key={order.id} className="border-[#EBE5E5]">
                              <TableCell className="text-xs">{order.id}</TableCell>
                              <TableCell className="text-xs">{order.product}</TableCell>
                              <TableCell className="text-xs font-medium">{order.amount}</TableCell>
                              <TableCell className="text-xs text-[#8F8787]">{order.time}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center py-8 text-xs text-[#8F8787]">暂无数据</TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                <TabsContent value="returned" className="flex-1 overflow-y-auto min-h-0 m-0 pr-2">
                  <div className="rounded-md border border-[#EBE5E5] bg-white">
                    <Table>
                      <TableHeader className="bg-[#F9F8F7] sticky top-0 z-10">
                        <TableRow className="hover:bg-transparent border-[#EBE5E5]">
                          <TableHead className="text-xs">订单号</TableHead>
                          <TableHead className="text-xs">商品名称</TableHead>
                          <TableHead className="text-xs">退款金额</TableHead>
                          <TableHead className="text-xs">退款原因</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedBill.details.returnedOrders.length > 0 ? (
                          selectedBill.details.returnedOrders.map((order) => (
                            <TableRow key={order.id} className="border-[#EBE5E5]">
                              <TableCell className="text-xs">{order.id}</TableCell>
                              <TableCell className="text-xs">{order.product}</TableCell>
                              <TableCell className="text-xs font-medium text-destructive">{order.amount}</TableCell>
                              <TableCell className="text-xs text-[#8F8787]">{order.reason}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center py-8 text-xs text-[#8F8787]">暂无数据</TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

