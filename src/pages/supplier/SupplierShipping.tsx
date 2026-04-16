import { useMemo, useState } from "react"
import { Circle, Copy, Download, MapPin, Package, PencilLine, Plus, Search, Truck } from "lucide-react"
import * as XLSX from "xlsx"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Textarea } from "@/components/ui/textarea"

type ShippingStatus = "待发货" | "已发货" | "已完成" | "拒收"
type ShipMode = "auto" | "manual"
type ToastState = { text: string; isError: boolean; visible: boolean }
type SenderAddress = {
  id: string
  name: string
  phone: string
  address: string
  isDefault: boolean
}

type ShippingOrder = {
  id: string
  product: string
  sku: string
  qty: number
  receiverName: string
  receiverPhone: string
  receiverAddress: string
  status: ShippingStatus
  expressCompany?: string
  waybillNo?: string
  itemType: string
  itemDetail: string
  remark?: string
  logistics: Array<{
    time: string
    location: string
    content: string
  }>
}

const initialOrders: ShippingOrder[] = [
  {
    id: "ORD2026041410001",
    product: "故宫脊兽书签套装",
    sku: "全套6枚装",
    qty: 2,
    receiverName: "王先生",
    receiverPhone: "13912345678",
    receiverAddress: "北京市朝阳区建国路88号SOHO现代城A座1201室",
    status: "待发货",
    itemType: "日用品",
    itemDetail: "故宫脊兽书签套装 全套6枚装 x2",
    remark: "礼品包装",
    logistics: [
      { time: "2026-04-14 09:23", location: "系统", content: "订单已创建，等待供应商发货" },
    ],
  },
  {
    id: "ORD2026041410008",
    product: "天坛祈福香囊",
    sku: "单枚装",
    qty: 1,
    receiverName: "刘女士",
    receiverPhone: "13598762345",
    receiverAddress: "北京市海淀区中关村大街27号",
    status: "待发货",
    itemType: "日用品",
    itemDetail: "天坛祈福香囊 单枚装 x1",
    logistics: [
      { time: "2026-04-14 09:15", location: "系统", content: "订单已创建，等待供应商发货" },
    ],
  },
  {
    id: "ORD2026041410002",
    product: "宫门瑞兽冰箱贴",
    sku: "4枚/套",
    qty: 1,
    receiverName: "李女士",
    receiverPhone: "13645671234",
    receiverAddress: "北京市西城区西单北大街120号",
    status: "已发货",
    expressCompany: "顺丰速递",
    waybillNo: "SF1234567890",
    itemType: "日用品",
    itemDetail: "宫门瑞兽冰箱贴 4枚/套 x1",
    logistics: [
      { time: "2026-04-14 10:20", location: "北京市东城区故宫文创仓", content: "快件已揽收" },
      { time: "2026-04-14 14:05", location: "北京顺丰分拨中心", content: "快件到达分拨中心" },
      { time: "2026-04-15 08:40", location: "北京市西城区西单营业点", content: "快件派送中" },
    ],
  },
  {
    id: "ORD2026041310003",
    product: "故宫脊兽书签套装",
    sku: "礼盒装",
    qty: 3,
    receiverName: "张先生",
    receiverPhone: "18623457890",
    receiverAddress: "北京市东城区王府井大街88号",
    status: "已完成",
    expressCompany: "中通快递",
    waybillNo: "ZT9876543210",
    itemType: "日用品",
    itemDetail: "故宫脊兽书签套装 礼盒装 x3",
    remark: "公司采购",
    logistics: [
      { time: "2026-04-13 18:05", location: "北京市东城区故宫文创仓", content: "快件已揽收" },
      { time: "2026-04-14 09:10", location: "北京中通分拨中心", content: "快件运输中" },
      { time: "2026-04-14 16:45", location: "北京市东城区王府井大街88号", content: "已签收，本人签收" },
    ],
  },
  {
    id: "ORD2026041210005",
    product: "故宫纹样丝巾",
    sku: "海棠红 200cm x 70cm",
    qty: 1,
    receiverName: "陈先生",
    receiverPhone: "13756788901",
    receiverAddress: "北京市石景山区苹果园路12号",
    status: "拒收",
    expressCompany: "圆通快递",
    waybillNo: "YT20260412005",
    itemType: "衣物",
    itemDetail: "故宫纹样丝巾 海棠红 x1",
    remark: "客户拒收",
    logistics: [
      { time: "2026-04-12 14:40", location: "北京市东城区故宫文创仓", content: "快件已揽收" },
      { time: "2026-04-13 10:25", location: "北京市石景山区苹果园营业部", content: "快件派送中" },
      { time: "2026-04-13 12:18", location: "北京市石景山区苹果园路12号", content: "收件人拒收，快件退回" },
    ],
  },
]

const statusOptions = ["全部状态", "待发货", "已发货", "已完成", "拒收"]

const statusBadgeClass: Record<ShippingStatus, string> = {
  待发货: "bg-[#FFF3E0] text-[#F6A018] hover:bg-[#FFF3E0]",
  已发货: "bg-[#E3F2FD] text-[#2196F3] hover:bg-[#E3F2FD]",
  已完成: "bg-[#E8F5E9] text-[#4CAF50] hover:bg-[#E8F5E9]",
  拒收: "bg-[#FFF3F3] text-[#C82829] hover:bg-[#FFF3F3]",
}

const copyItems = (order: ShippingOrder) => [
  { label: "订单号", value: order.id },
  { label: "收件人姓名", value: order.receiverName },
  { label: "收件人联系方式", value: order.receiverPhone },
  { label: "收件地址", value: order.receiverAddress },
  { label: "商品信息", value: order.product },
  { label: "规格详细信息", value: `${order.sku} x${order.qty}` },
]

export default function SupplierShipping() {
  const [orders, setOrders] = useState(initialOrders)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("全部状态")
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [detailOrder, setDetailOrder] = useState<ShippingOrder | null>(null)
  const [shipOrder, setShipOrder] = useState<ShippingOrder | null>(null)
  const [senderAddresses, setSenderAddresses] = useState<SenderAddress[]>([
    {
      id: "sender-1",
      name: "故宫文创旗舰店仓",
      phone: "010-85007001",
      address: "北京市东城区景山前街4号故宫文创仓库",
      isDefault: true,
    },
  ])
  const [selectedSenderId, setSelectedSenderId] = useState("sender-1")
  const [addressManagerOpen, setAddressManagerOpen] = useState(false)
  const [showNewAddressForm, setShowNewAddressForm] = useState(false)
  const [newAddressName, setNewAddressName] = useState("")
  const [newAddressPhone, setNewAddressPhone] = useState("")
  const [newAddressDetail, setNewAddressDetail] = useState("")
  const [shipMode, setShipMode] = useState<ShipMode>("auto")
  const [expressCompany, setExpressCompany] = useState("")
  const [customExpressCompany, setCustomExpressCompany] = useState("")
  const [waybillNo, setWaybillNo] = useState("")
  const [toast, setToast] = useState<ToastState>({ text: "", isError: false, visible: false })
  const selectedSender =
    senderAddresses.find((item) => item.id === selectedSenderId) ||
    senderAddresses.find((item) => item.isDefault) ||
    senderAddresses[0]

  const pendingOrders = orders.filter((order) => order.status === "待发货")

  const filteredOrders = useMemo(() => {
    const keyword = search.trim()
    return orders.filter((order) => {
      const matchedStatus = statusFilter === "全部状态" || order.status === statusFilter
      const matchedKeyword =
        !keyword ||
        `${order.id}${order.receiverPhone}${order.product}`.toLowerCase().includes(keyword.toLowerCase())
      return matchedStatus && matchedKeyword
    })
  }, [orders, search, statusFilter])

  const showToast = (text: string, isError = false) => {
    setToast({ text, isError, visible: true })
    window.setTimeout(() => {
      setToast((current) => ({ ...current, visible: false }))
    }, 2200)
  }

  const visiblePendingOrders = filteredOrders.filter((order) => order.status === "待发货")
  const isAllVisibleSelected =
    visiblePendingOrders.length > 0 &&
    visiblePendingOrders.every((order) => selectedIds.includes(order.id))

  const resetShipForm = () => {
    setShipOrder(null)
    setShipMode("auto")
    setExpressCompany("")
    setCustomExpressCompany("")
    setWaybillNo("")
  }

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text)
    showToast("已复制到剪切板")
  }

  const handleCopyAllAutoInfo = async (order: ShippingOrder) => {
    const content = [
      `收件人姓名：${order.receiverName}`,
      `联系方式：${order.receiverPhone}`,
      `收件地址：${order.receiverAddress}`,
      `商品信息：${order.product}`,
      `规格信息：${order.sku} x${order.qty}`,
    ].join("\n")
    await navigator.clipboard.writeText(content)
    showToast("已一键复制收件信息")
  }

  const handleSetDefaultSender = (senderId: string) => {
    setSenderAddresses((current) =>
      current.map((item) => ({ ...item, isDefault: item.id === senderId }))
    )
    setSelectedSenderId(senderId)
  }

  const handleCreateSenderAddress = () => {
    const name = newAddressName.trim()
    const phone = newAddressPhone.trim()
    const detail = newAddressDetail.trim()
    if (!name || !phone || !detail) {
      showToast("请完整填写新增地址信息", true)
      return
    }
    const nextId = `sender-${Date.now()}`
    setSenderAddresses((current) => [
      ...current.map((item) => ({ ...item, isDefault: false })),
      { id: nextId, name, phone, address: detail, isDefault: true },
    ])
    setSelectedSenderId(nextId)
    setNewAddressName("")
    setNewAddressPhone("")
    setNewAddressDetail("")
    setShowNewAddressForm(false)
    showToast("已新增并设为默认地址")
  }

  const handleToggleAll = (checked: boolean) => {
    const visibleIds = visiblePendingOrders.map((order) => order.id)
    setSelectedIds((current) =>
      checked
        ? Array.from(new Set([...current, ...visibleIds]))
        : current.filter((id) => !visibleIds.includes(id))
    )
  }

  const handleToggleOrder = (orderId: string, checked: boolean) => {
    setSelectedIds((current) =>
      checked ? Array.from(new Set([...current, orderId])) : current.filter((id) => id !== orderId)
    )
  }

  const handleExportPending = () => {
    const data = pendingOrders.map((order, index) => ({
      "编号（单次最多500包裹）": index + 1,
      "收件人姓名": order.receiverName,
      "收件人联系方式": order.receiverPhone,
      "收件地址": order.receiverAddress,
      "物品（在以下6类中选择：日用品、食品、文件、衣物、数码产品、其他）": order.itemType,
      "物品详情": order.itemDetail,
      "备注信息": order.remark || "",
      "外平台单号": order.id,
    }))

    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "待发货订单")
    XLSX.writeFile(workbook, "故宫文创旗舰店-菜鸟裹裹待发货订单.xlsx")
  }

  const handleConfirmShip = () => {
    if (!shipOrder) return

    const finalCompany =
      shipMode === "auto"
        ? "菜鸟裹裹"
        : expressCompany === "其他"
        ? customExpressCompany.trim()
        : expressCompany
    const finalWaybill = shipMode === "auto" ? `CN${shipOrder.id.slice(-8)}` : waybillNo.trim()
    if (!finalCompany || !finalWaybill) return

    setOrders((current) =>
      current.map((order) =>
        order.id === shipOrder.id
          ? {
              ...order,
              status: "已发货",
              expressCompany: finalCompany,
              waybillNo: finalWaybill,
              logistics: [
                {
                  time: new Date().toLocaleString("zh-CN", { hour12: false }),
                  location: selectedSender?.address || "默认仓库",
                  content: "供应商已发货，快件已揽收",
                },
              ],
            }
          : order
      )
    )
    setSelectedIds((current) => current.filter((id) => id !== shipOrder.id))
    resetShipForm()
  }

  const handleBatchShip = () => {
    if (selectedIds.length === 0) {
      showToast("请先选择要发货的订单", true)
      return
    }
    const now = new Date().toLocaleString("zh-CN", { hour12: false })
    setOrders((current) =>
      current.map((order) => {
        if (!selectedIds.includes(order.id) || order.status !== "待发货") return order
        return {
          ...order,
          status: "已发货",
          expressCompany: "菜鸟裹裹",
          waybillNo: `CN${order.id.slice(-8)}`,
          logistics: [
            {
              time: now,
              location: selectedSender?.address || "默认仓库",
              content: "供应商一键发货，快件已揽收",
            },
          ],
        }
      })
    )
    setSelectedIds([])
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1F1A1A]">打包发货</h1>
          <p className="text-muted-foreground">查看物流状态，导出待发货订单，处理订单发货</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleExportPending}>
          <Download className="mr-2 h-4 w-4" />
          导出待发货订单
        </Button>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">打包发货</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex flex-wrap items-center gap-4 px-4 pb-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
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
            <div className="relative min-w-[260px] flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8F8787]" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="搜索订单编号 / 手机号 / 商品名称"
                className="h-10 pl-9"
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2 border-t border-[#EFE8E8] p-4">
            <Button
              size="sm"
              className="h-8 bg-[#C82829] px-3 text-white hover:bg-[#B22222]"
              onClick={handleBatchShip}
            >
              一键发货
            </Button>
            <Badge className="bg-[#FFF3E0] text-[#F6A018] hover:bg-[#FFF3E0]">
              待发货 {pendingOrders.length} 单
            </Badge>
            <span className="text-sm text-[#8F8787]">已选 {selectedIds.length} 单</span>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="bg-[#F9F8F7] hover:bg-[#F1EEEE]">
                <TableHead className="w-[52px] text-center">
                  <div className="flex justify-center">
                    <Checkbox
                      checked={isAllVisibleSelected}
                      onCheckedChange={(checked) => handleToggleAll(Boolean(checked))}
                      aria-label="全选待发货订单"
                    />
                  </div>
                </TableHead>
                <TableHead className="w-[180px]">订单号</TableHead>
                <TableHead className="w-[180px]">快递单号</TableHead>
                <TableHead className="w-[140px]">快递类型</TableHead>
                <TableHead className="w-[120px]">订单状态</TableHead>
                <TableHead className="w-[180px] text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id} className="hover:bg-[#FAFAFA]">
                  <TableCell className="text-center">
                    {order.status === "待发货" ? (
                      <div className="flex justify-center">
                        <Checkbox
                          checked={selectedIds.includes(order.id)}
                          onCheckedChange={(checked) => handleToggleOrder(order.id, Boolean(checked))}
                          aria-label={`选择订单 ${order.id}`}
                        />
                      </div>
                    ) : null}
                  </TableCell>
                  <TableCell className="font-mono text-sm">{order.id}</TableCell>
                  <TableCell className="font-mono text-sm text-[#5C5454]">
                    {order.status === "待发货" ? "" : order.waybillNo}
                  </TableCell>
                  <TableCell>{order.status === "待发货" ? "" : order.expressCompany}</TableCell>
                  <TableCell>
                    <Badge className={statusBadgeClass[order.status]}>{order.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-[#E4DDDD] text-[#4A4444] hover:bg-[#FFF3F3] hover:text-[#C82829]"
                      onClick={() => setDetailOrder(order)}
                    >
                      详情
                    </Button>
                    {order.status === "待发货" ? (
                      <Button
                        size="sm"
                        className="ml-2 bg-[#C82829] text-white hover:bg-[#B22222]"
                        onClick={() => setShipOrder(order)}
                      >
                        去发货
                      </Button>
                    ) : null}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!detailOrder} onOpenChange={() => setDetailOrder(null)}>
        <DialogContent className="flex h-[88vh] w-[min(1200px,calc(100vw-64px))] max-w-none sm:max-w-none flex-col gap-0 overflow-hidden p-0">
          <DialogHeader className="shrink-0 border-b px-6 py-4 pr-12">
            <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
              <Package className="h-5 w-5 text-[#C82829]" />
              物流详情
            </DialogTitle>
          </DialogHeader>
          {detailOrder ? (
            <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-6 py-5">
              <div className="grid gap-4 rounded-xl bg-[#F9F8F7] p-4 text-sm md:grid-cols-2">
                <div>
                  <div className="mb-1 text-xs text-[#8F8787]">订单号</div>
                  <div className="font-mono font-medium">{detailOrder.id}</div>
                </div>
                <div>
                  <div className="mb-1 text-xs text-[#8F8787]">订单状态</div>
                  <Badge className={statusBadgeClass[detailOrder.status]}>{detailOrder.status}</Badge>
                </div>
                <div>
                  <div className="mb-1 text-xs text-[#8F8787]">快递类型</div>
                  <div>{detailOrder.expressCompany || "-"}</div>
                </div>
                <div>
                  <div className="mb-1 text-xs text-[#8F8787]">快递单号</div>
                  <div className="font-mono">{detailOrder.waybillNo || "-"}</div>
                </div>
              </div>
              <div className="border-t border-[#EFE8E8] pt-5">
                <div className="mb-3 flex items-center gap-2 text-lg font-semibold text-[#1F1A1A]">
                  <Truck className="h-4 w-4 text-[#C82829]" />
                  物流记录
                </div>
                <div className="space-y-4">
                  {detailOrder.logistics.map((item) => (
                    <div key={`${item.time}-${item.content}`} className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <Circle className="h-2.5 w-2.5 fill-[#C82829] text-[#C82829]" />
                        <div className="mt-1 h-7 w-px bg-[#E4DDDD]" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-[#1F1A1A]">{item.content}</div>
                        <div className="mt-1 text-sm text-[#5C5454]">{item.location}</div>
                        <div className="mt-1 text-xs text-[#8F8787]">{item.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!shipOrder}
        onOpenChange={() => {
          resetShipForm()
        }}
      >
        <DialogContent className="flex h-[88vh] w-[min(1200px,calc(100vw-64px))] max-w-none sm:max-w-none flex-col gap-0 overflow-hidden p-0">
          <DialogHeader className="shrink-0 border-b px-6 py-4 pr-12">
            <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
              <Truck className="h-5 w-5 text-[#C82829]" />
              去发货
            </DialogTitle>
          </DialogHeader>
          {shipOrder ? (
            <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-6 py-5">
              <div className="rounded-xl bg-[#F9F8F7] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#1F1A1A]">
                    <MapPin className="h-4 w-4 text-[#C82829]" />
                    发货信息
                  </div>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 text-sm font-medium text-[#C82829] hover:text-[#B22222]"
                    onClick={() => setAddressManagerOpen(true)}
                  >
                    <PencilLine className="h-3.5 w-3.5" />
                    编辑
                  </button>
                </div>
                <div className="mt-3 text-sm text-[#1F1A1A]">
                  <div>
                    <span className="font-medium">{selectedSender?.name || "-"}</span>
                    <span className="ml-3 text-[#8F8787]">{selectedSender?.phone || "-"}</span>
                  </div>
                  <div className="mt-1 text-[#5C5454]">{selectedSender?.address || "-"}</div>
                </div>
              </div>

              <div className="border-t border-[#EFE8E8] pt-5">
                <div className="mb-3 text-sm font-semibold text-[#1F1A1A]">发货方式</div>
                <div className="grid grid-cols-2 rounded-xl bg-[#F9F8F7] p-1">
                <Button
                  variant={shipMode === "auto" ? "default" : "ghost"}
                  onClick={() => setShipMode("auto")}
                  className={shipMode === "auto" ? "bg-white text-[#C82829] hover:bg-white" : ""}
                >
                  自动检索
                </Button>
                <Button
                  variant={shipMode === "manual" ? "default" : "ghost"}
                  onClick={() => setShipMode("manual")}
                  className={shipMode === "manual" ? "bg-white text-[#C82829] hover:bg-white" : ""}
                >
                  手动发货
                </Button>
                </div>
              </div>

              {shipMode === "auto" ? (
                <div className="border-t border-[#EFE8E8] pt-5">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold text-[#1F1A1A]">自动检索信息</div>
                    <Button type="button" size="sm" variant="outline" onClick={() => handleCopyAllAutoInfo(shipOrder)}>
                      一键复制
                    </Button>
                  </div>
                  <div className="space-y-2">
                  {copyItems(shipOrder).map((item) => (
                    <div
                      key={item.label}
                      className="grid grid-cols-[120px_1fr_auto] items-center gap-3 rounded-xl bg-[#F9F8F7] px-4 py-3"
                    >
                      <span className="text-sm text-[#8F8787]">{item.label}</span>
                      <span className="text-sm font-medium text-[#1F1A1A]">{item.value}</span>
                      <Button variant="ghost" size="sm" onClick={() => handleCopy(item.value)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  </div>
                  <div className="mt-3 rounded-lg bg-[#FFF7E6] px-4 py-3 text-xs leading-6 text-[#8A5A00]">
                    提示：自动检索发货后，用户端会提示“已发货正在等待快递员上门”，系统将自动检索快递单号实时更新到客户端。
                  </div>
                </div>
              ) : (
                <div className="space-y-4 border-t border-[#EFE8E8] pt-5">
                  <div className="text-sm font-semibold text-[#1F1A1A]">手动发货信息</div>
                  <div className="space-y-2">
                    <Label>快递公司</Label>
                    <Select value={expressCompany} onValueChange={setExpressCompany}>
                      <SelectTrigger>
                        <SelectValue placeholder="请选择快递公司" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="菜鸟裹裹">菜鸟裹裹</SelectItem>
                        <SelectItem value="顺丰快递">顺丰快递</SelectItem>
                        <SelectItem value="邮政快递">邮政快递</SelectItem>
                        <SelectItem value="其他">其他</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {expressCompany === "其他" ? (
                    <div className="space-y-2">
                      <Label>快递公司名称</Label>
                      <Input
                        value={customExpressCompany}
                        onChange={(event) => setCustomExpressCompany(event.target.value)}
                        placeholder="请输入快递公司"
                      />
                    </div>
                  ) : null}
                  <div className="space-y-2">
                    <Label>快递单号</Label>
                    <Input
                      value={waybillNo}
                      onChange={(event) => setWaybillNo(event.target.value)}
                      placeholder="请输入快递单号"
                    />
                  </div>
                </div>
              )}
            </div>
          ) : null}
          <div className="shrink-0 border-t bg-[#faf8f7] px-6 py-4">
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={resetShipForm}>
                取消
              </Button>
              <Button
                className="bg-[#C82829] hover:bg-[#B22222]"
                onClick={handleConfirmShip}
                disabled={
                  shipMode === "manual"
                    ? !expressCompany || !waybillNo || (expressCompany === "其他" && !customExpressCompany)
                    : false
                }
              >
                确认
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div
        className={`fixed bottom-6 right-6 z-50 max-w-[calc(100vw-44px)] min-w-[220px] rounded-lg px-3.5 py-3 text-sm text-white transition-all ${
          toast.visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
        } ${toast.isError ? "bg-[#b22222]" : "bg-[#202020]"}`}
      >
        {toast.text}
      </div>

      <Dialog open={addressManagerOpen} onOpenChange={setAddressManagerOpen}>
        <DialogContent className="flex h-[82vh] w-[min(900px,calc(100vw-56px))] max-w-none flex-col gap-0 overflow-hidden p-0">
          <DialogHeader className="shrink-0 border-b px-6 py-4 pr-12">
            <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
              <MapPin className="h-5 w-5 text-[#C82829]" />
              发货地址管理
            </DialogTitle>
          </DialogHeader>
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6 py-5">
            <div className="space-y-3">
              {senderAddresses.map((item) => (
                <label
                  key={item.id}
                  className="flex cursor-pointer items-start gap-3 rounded-lg border border-[#EBE5E5] bg-white p-3"
                >
                  <input
                    type="radio"
                    name="defaultSenderAddress"
                    checked={item.isDefault}
                    onChange={() => handleSetDefaultSender(item.id)}
                    className="mt-1 h-4 w-4 accent-[#C82829]"
                  />
                  <div className="min-w-0 text-sm">
                    <div className="font-medium text-[#1F1A1A]">
                      {item.name}
                      {item.isDefault ? (
                        <span className="ml-2 rounded-full bg-[#FFF3F3] px-2 py-0.5 text-xs text-[#C82829]">默认地址</span>
                      ) : null}
                    </div>
                    <div className="mt-1 text-[#8F8787]">{item.phone}</div>
                    <div className="mt-1 text-[#5C5454]">{item.address}</div>
                  </div>
                </label>
              ))}
            </div>

            <div className="border-t border-[#EFE8E8] pt-4">
              <Button type="button" variant="outline" onClick={() => setShowNewAddressForm((v) => !v)}>
                <Plus className="mr-2 h-4 w-4" />
                新增地址
              </Button>
              {showNewAddressForm ? (
                <div className="mt-4 space-y-3 rounded-lg bg-[#F9F8F7] p-4">
                  <div className="grid gap-3 md:grid-cols-2">
                    <Input
                      value={newAddressName}
                      onChange={(e) => setNewAddressName(e.target.value)}
                      placeholder="发货人姓名"
                    />
                    <Input
                      value={newAddressPhone}
                      onChange={(e) => setNewAddressPhone(e.target.value)}
                      placeholder="发货手机号"
                    />
                  </div>
                  <Textarea
                    value={newAddressDetail}
                    onChange={(e) => setNewAddressDetail(e.target.value)}
                    placeholder="发件地址"
                  />
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowNewAddressForm(false)}>
                      取消
                    </Button>
                    <Button className="bg-[#C82829] hover:bg-[#B22222]" onClick={handleCreateSenderAddress}>
                      保存地址
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
          <div className="shrink-0 border-t bg-[#faf8f7] px-6 py-4">
            <div className="flex justify-end">
              <Button className="bg-[#C82829] hover:bg-[#B22222]" onClick={() => setAddressManagerOpen(false)}>
                完成
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
