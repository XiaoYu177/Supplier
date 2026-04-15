import { useState } from "react"
import { Search, Package, Truck } from "lucide-react"

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
import { Label } from "@/components/ui/label"

const pendingOrders = [
  {
    id: "ORD2026041410001",
    product: "故宫脊兽书签套装",
    qty: 2,
    amount: "¥160.00",
    receiver: { name: "王先生", phone: "139****5678", address: "北京市朝阳区建国路88号..." },
    time: "09:23",
  },
  {
    id: "ORD2026041410008",
    product: "天坛祈福香囊",
    qty: 1,
    amount: "¥50.00",
    receiver: { name: "刘女士", phone: "135****2345", address: "北京市海淀区中关村大..." },
    time: "09:15",
  },
  {
    id: "ORD2026041410009",
    product: "胡同门牌系列明信片",
    qty: 5,
    amount: "¥75.00",
    receiver: { name: "张先生", phone: "186****7890", address: "北京市西城区西单北大..." },
    time: "08:52",
  },
  {
    id: "ORD2026041410010",
    product: "京味老字号纸皮核桃",
    qty: 3,
    amount: "¥120.00",
    receiver: { name: "赵女士", phone: "158****3456", address: "北京市丰台区方庄路18..." },
    time: "08:30",
  },
  {
    id: "ORD2026041410011",
    product: "故宫脊兽金属书签",
    qty: 4,
    amount: "¥160.00",
    receiver: { name: "陈先生", phone: "137****8901", address: "北京市石景山区石景山..." },
    time: "07:45",
  },
]

const expressCompanies = [
  { value: "sf", label: "顺丰速运" },
  { value: "ems", label: "EMS" },
  { value: "jd", label: "京东物流" },
  { value: "yto", label: "圆通速递" },
  { value: "zto", label: "中通快递" },
  { value: "sto", label: "申通快递" },
  { value: "yunda", label: "韵达快递" },
]

export default function SupplierShipping() {
  const [search, setSearch] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<typeof pendingOrders[0] | null>(null)
  const [expressCompany, setExpressCompany] = useState("")
  const [waybillNo, setWaybillNo] = useState("")

  const handleShip = () => {
    if (!expressCompany || !waybillNo) return
    // In real app, this would call API
    setSelectedOrder(null)
    setExpressCompany("")
    setWaybillNo("")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1F1A1A]">打包发货</h1>
          <p className="text-muted-foreground">处理待发货订单，回填物流信息并确认发货</p>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <Card className="border-none shadow-sm">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-[#F6A018]">128</div>
            <div className="text-sm text-[#8F8787]">待发货总数</div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-[#4CAF50]">45</div>
            <div className="text-sm text-[#8F8787]">已发货</div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-[#2196F3]">856</div>
            <div className="text-sm text-[#8F8787]">本月累计发货</div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-[#C82829]">89</div>
            <div className="text-sm text-[#8F8787]">今日新增</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">📋 待发货订单列表</CardTitle>
            <Badge className="bg-[#FFF3E0] text-[#F6A018] hover:bg-[#FFF3E0]">
              共 128 单
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-4">
            <div className="relative max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8F8787]" />
              <Input
                placeholder="搜索订单编号"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-10"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="bg-[#F9F8F7] hover:bg-[#F1EEEE]">
                <TableHead className="w-[180px]">订单编号</TableHead>
                <TableHead>商品信息</TableHead>
                <TableHead>收货人信息</TableHead>
                <TableHead className="w-[100px]">实付金额</TableHead>
                <TableHead className="w-[160px]">下单时间</TableHead>
                <TableHead className="w-[100px] text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingOrders.map((order) => (
                <TableRow key={order.id} className="hover:bg-[#FAFAFA]">
                  <TableCell className="font-mono text-sm">{order.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#FFF3F3] flex items-center justify-center">
                        <Package className="h-4 w-4 text-[#C82829]" />
                      </div>
                      <div>
                        <div className="font-medium text-[#1F1A1A]">{order.product}</div>
                        <div className="text-xs text-[#8F8787]">x{order.qty}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium">{order.receiver.name}</div>
                      <div className="text-[#8F8787]">{order.receiver.phone}</div>
                      <div className="text-[#8F8787] truncate max-w-[180px]">
                        {order.receiver.address}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-[#C82829]">{order.amount}</TableCell>
                  <TableCell className="text-[#8F8787]">{order.time}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      className="bg-[#C82829] hover:bg-[#B22222]"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <Truck className="mr-1 h-4 w-4" />
                      发货
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog
        open={!!selectedOrder}
        onOpenChange={() => {
          setSelectedOrder(null)
          setExpressCompany("")
          setWaybillNo("")
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>📦 填写物流信息</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="p-4 bg-[#F9F8F7] rounded-xl">
                <div className="text-xs text-[#8F8787] mb-2">订单编号</div>
                <div className="font-mono font-medium">{selectedOrder.id}</div>
              </div>

              <div className="p-4 bg-[#F9F8F7] rounded-xl">
                <div className="text-xs text-[#8F8787] mb-2">收货信息</div>
                <div className="text-sm">
                  <div className="font-medium">{selectedOrder.receiver.name}</div>
                  <div className="text-[#8F8787]">{selectedOrder.receiver.phone}</div>
                  <div className="text-[#5C5454] mt-1">
                    北京市朝阳区建国路88号SOHO现代城A座1201室
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="express">快递公司</Label>
                <Select value={expressCompany} onValueChange={setExpressCompany}>
                  <SelectTrigger id="express">
                    <SelectValue placeholder="请选择快递公司" />
                  </SelectTrigger>
                  <SelectContent>
                    {expressCompanies.map((company) => (
                      <SelectItem key={company.value} value={company.value}>
                        {company.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="waybill">运单号</Label>
                <Input
                  id="waybill"
                  placeholder="请输入运单号"
                  value={waybillNo}
                  onChange={(e) => setWaybillNo(e.target.value)}
                />
              </div>

              <div className="flex items-start gap-2 p-3 bg-[#E3F2FD] rounded-lg text-sm text-[#1976D2]">
                <Truck className="h-4 w-4 mt-0.5 shrink-0" />
                <span>请确保运单号填写正确，发货后无法撤回</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedOrder(null)
                setExpressCompany("")
                setWaybillNo("")
              }}
            >
              取消
            </Button>
            <Button
              className="bg-[#C82829] hover:bg-[#B22222]"
              onClick={handleShip}
              disabled={!expressCompany || !waybillNo}
            >
              确认发货
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
