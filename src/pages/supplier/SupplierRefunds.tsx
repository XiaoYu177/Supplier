import { useEffect, useMemo, useRef, useState } from "react"
import { Search, RefreshCcw, UserRound, CreditCard, Circle, Package } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

type RefundStatus = "待确认" | "处理中" | "已同意" | "已拒绝"

type RefundOrder = {
  id: string
  orderId: string
  product: string
  sku: string
  qty: number
  image: string
  reason: string
  feedbackDesc: string
  status: RefundStatus
  statusVariant: "warning" | "info" | "success" | "secondary"
  applyTime: string
  buyerName: string
  buyerPhone: string
  buyerAddress: string
  payMethod: string
  usedCoupon: boolean
  couponType: "满减券" | "折扣券" | "无"
  originalAmount: number
  discountAmount: number
  paidAmount: number
  refundAmount: number
  images: string[]
}

const initialRefundOrders: RefundOrder[] = [
  {
    id: "REF2026041410001",
    orderId: "ORD2026041210005",
    product: "故宫纹样丝巾",
    sku: "海棠红 200cm*70cm",
    qty: 1,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=260&q=80",
    reason: "商品破损",
    feedbackDesc: "丝巾边缘出现明显开线，包装盒内侧有明显折痕，影响送礼使用。",
    status: "待确认",
    statusVariant: "warning",
    applyTime: "2026-04-14 14:30:08",
    buyerName: "王雨桐",
    buyerPhone: "13800138800",
    buyerAddress: "北京市朝阳区建国路88号SOHO现代城A座1201室",
    payMethod: "微信支付",
    usedCoupon: true,
    couponType: "满减券",
    originalAmount: 238,
    discountAmount: 39,
    paidAmount: 199,
    refundAmount: 199,
    images: [
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=160&q=80",
      "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=160&q=80",
    ],
  },
  {
    id: "REF2026041310002",
    orderId: "ORD2026041010008",
    product: "天坛祈福香囊",
    sku: "典藏礼盒装",
    qty: 2,
    image: "https://images.unsplash.com/photo-1519659528534-7fd733a832a0?auto=format&fit=crop&w=260&q=80",
    reason: "收到商品与描述不符",
    feedbackDesc: "实物颜色偏差较大，和详情页展示差异明显，希望按售后流程处理。",
    status: "处理中",
    statusVariant: "info",
    applyTime: "2026-04-13 09:15:18",
    buyerName: "李泽宇",
    buyerPhone: "13900132211",
    buyerAddress: "北京市海淀区中关村大街27号中关村大厦3层305室",
    payMethod: "支付宝",
    usedCoupon: true,
    couponType: "折扣券",
    originalAmount: 128,
    discountAmount: 28,
    paidAmount: 100,
    refundAmount: 100,
    images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=160&q=80"],
  },
  {
    id: "REF2026041210003",
    orderId: "ORD2026040910003",
    product: "长城纪念徽章套装",
    sku: "5枚/套",
    qty: 1,
    image: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=260&q=80",
    reason: "错拍/多拍",
    feedbackDesc: "下单时误点重复下单，希望取消多余订单并原路退款。",
    status: "已同意",
    statusVariant: "success",
    applyTime: "2026-04-12 16:45:27",
    buyerName: "赵明轩",
    buyerPhone: "13600136655",
    buyerAddress: "北京市丰台区南三环中路88号首科大厦B座902室",
    payMethod: "微信支付",
    usedCoupon: false,
    couponType: "无",
    originalAmount: 59,
    discountAmount: 0,
    paidAmount: 59,
    refundAmount: 59,
    images: [],
  },
]

const statusOptions: Array<"全部状态" | RefundStatus> = ["全部状态", "待确认", "处理中", "已同意", "已拒绝"]

export default function SupplierRefunds() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<"全部状态" | RefundStatus>("全部状态")
  const [selectedRefund, setSelectedRefund] = useState<RefundOrder | null>(null)
  const detailScrollRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!selectedRefund) return
    const scrollTop = () => {
      if (detailScrollRef.current) detailScrollRef.current.scrollTop = 0
      const popup = document.querySelector('[data-slot="dialog-content"]') as HTMLElement | null
      if (popup) popup.scrollTop = 0
    }
    scrollTop()
    const raf = window.requestAnimationFrame(scrollTop)
    const timer = window.setTimeout(scrollTop, 30)
    return () => {
      window.cancelAnimationFrame(raf)
      window.clearTimeout(timer)
    }
  }, [selectedRefund])

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

  const money = (value: number) => `¥${value.toFixed(2)}`

  const filteredRefunds = useMemo(() => {
    const keyword = search.trim().toLowerCase()
    return initialRefundOrders.filter((refund) => {
      const statusMatched = statusFilter === "全部状态" || refund.status === statusFilter
      const keywordMatched =
        !keyword || `${refund.id}${refund.orderId}${refund.product}`.toLowerCase().includes(keyword)
      return statusMatched && keywordMatched
    })
  }, [search, statusFilter])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#1F1A1A]">售后记录</h1>
        <p className="text-muted-foreground">查看本供应商售后订单，仅支持详情查看</p>
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative min-w-[240px] flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8F8787]" />
              <Input
                placeholder="退款编号/订单编号/商品名称"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as typeof statusFilter)}>
              <SelectTrigger className="h-10 w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
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
              <TableRow className="bg-[#F9F8F7] hover:bg-[#F1EEEE]">
                <TableHead className="w-[160px]">退款编号</TableHead>
                <TableHead className="w-[170px]">订单编号</TableHead>
                <TableHead className="min-w-[260px]">商品信息</TableHead>
                <TableHead className="w-[90px] text-center">数量</TableHead>
                <TableHead className="w-[120px]">退款金额</TableHead>
                <TableHead className="w-[220px]">优惠类型</TableHead>
                <TableHead className="w-[100px]">状态</TableHead>
                <TableHead className="w-[170px]">申请时间</TableHead>
                <TableHead className="w-[120px] text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRefunds.map((refund) => (
                <TableRow key={refund.id} className="hover:bg-[#FAFAFA]">
                  <TableCell className="font-mono text-sm">{refund.id}</TableCell>
                  <TableCell className="font-mono text-sm text-[#5C5454]">{refund.orderId}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img src={refund.image} alt={refund.product} className="h-14 w-14 rounded-md object-cover" />
                      <div className="min-w-0">
                        <div className="truncate font-medium text-[#1F1A1A]">{refund.product}</div>
                        <div className="truncate text-xs text-[#8F8787]">{refund.sku}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">x{refund.qty}</TableCell>
                  <TableCell className="font-medium text-[#C82829]">{money(refund.refundAmount)}</TableCell>
                  <TableCell className="text-sm">
                    <div className="font-medium text-[#1F1A1A]">
                      {refund.usedCoupon
                        ? `${refund.couponType === "满减券" ? "满减优惠" : "折扣优惠"}`
                        : "未使用优惠券"}
                    </div>
                    <div className="mt-1 text-xs text-[#8F8787]">
                      优惠: {money(refund.discountAmount)} / 原价: {money(refund.originalAmount)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={refund.statusVariant} className={getStatusBadgeClass(refund.statusVariant)}>
                      {refund.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-[#8F8787]">{refund.applyTime}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-[#E4DDDD] text-[#4A4444] hover:bg-[#FFF3F3] hover:text-[#C82829]"
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
        <DialogContent className="flex h-[88vh] w-[min(1200px,calc(100vw-64px))] max-w-none sm:max-w-none flex-col gap-0 overflow-hidden p-0">
          <DialogHeader className="shrink-0 border-b px-6 py-4 pr-12">
            <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
              <RefreshCcw className="h-5 w-5 text-[#C82829]" />
              售后详情
            </DialogTitle>
          </DialogHeader>
          {selectedRefund && (
            <div ref={detailScrollRef} className="min-h-0 flex-1 space-y-6 overflow-y-auto px-6 py-5">
              <div className="grid gap-4 rounded-xl bg-[#F9F8F7] p-4 text-sm md:grid-cols-2">
                <div>
                  <div className="mb-1 text-xs text-[#8F8787]">退款编号</div>
                  <div className="font-mono font-medium">{selectedRefund.id}</div>
                </div>
                <div>
                  <div className="mb-1 text-xs text-[#8F8787]">订单编号</div>
                  <div className="font-mono font-medium">{selectedRefund.orderId}</div>
                </div>
                <div>
                  <div className="mb-1 text-xs text-[#8F8787]">售后状态</div>
                  <Badge className={getStatusBadgeClass(selectedRefund.statusVariant)}>{selectedRefund.status}</Badge>
                </div>
                <div>
                  <div className="mb-1 text-xs text-[#8F8787]">申请时间</div>
                  <div className="text-sm">{selectedRefund.applyTime}</div>
                </div>
              </div>

              <div className="border-t border-[#EFE8E8] pt-5">
                <div className="mb-3 flex items-center gap-2 text-base font-semibold text-[#1F1A1A]">
                  <UserRound className="h-4 w-4 text-[#C82829]" />
                  买家信息
                </div>
                <div className="grid gap-3 text-sm md:grid-cols-2">
                  <div>
                    <div className="text-[#8F8787]">收货人姓名</div>
                    <div className="font-medium text-[#1F1A1A]">{selectedRefund.buyerName}</div>
                  </div>
                  <div>
                    <div className="text-[#8F8787]">联系电话</div>
                    <div className="font-medium text-[#1F1A1A]">{selectedRefund.buyerPhone}</div>
                  </div>
                  <div>
                    <div className="text-[#8F8787]">支付方式</div>
                    <div className="font-medium text-[#1F1A1A]">{selectedRefund.payMethod}</div>
                  </div>
                </div>
                <div className="mt-3 text-sm">
                  <div className="mb-1 text-[#8F8787]">收货地址</div>
                  <div className="font-medium text-[#1F1A1A]">{selectedRefund.buyerAddress}</div>
                </div>
              </div>

              <div className="border-t border-[#EFE8E8] pt-5">
                <div className="mb-3 flex items-center gap-2 text-base font-semibold text-[#1F1A1A]">
                  <Package className="h-4 w-4 text-[#C82829]" />
                  商品信息
                </div>
                <div className="flex items-center gap-4">
                  <img src={selectedRefund.image} alt={selectedRefund.product} className="h-20 w-20 rounded-lg object-cover" />
                  <div className="min-w-0">
                    <div className="text-base font-medium text-[#1F1A1A]">{selectedRefund.product}</div>
                    <div className="mt-1 text-sm text-[#5C5454]">规格：{selectedRefund.sku}</div>
                    <div className="mt-1 text-sm text-[#5C5454]">数量：x{selectedRefund.qty}</div>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#EFE8E8] pt-5">
                <div className="mb-3 flex items-center gap-2 text-base font-semibold text-[#1F1A1A]">
                  <Circle className="h-2.5 w-2.5 fill-[#C82829] text-[#C82829]" />
                  用户反馈
                </div>
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="mb-1 text-[#8F8787]">售后原因</div>
                    <div className="font-medium text-[#1F1A1A]">{selectedRefund.reason}</div>
                  </div>
                  <div>
                    <div className="mb-1 text-[#8F8787]">问题描述</div>
                    <div className="text-[#1F1A1A]">{selectedRefund.feedbackDesc}</div>
                  </div>
                  {selectedRefund.images.length > 0 ? (
                    <div>
                      <div className="mb-1 text-[#8F8787]">反馈图片</div>
                      <div className="flex gap-2">
                        {selectedRefund.images.map((img, index) => (
                          <img
                            key={index}
                            src={img}
                            alt={`反馈图片${index + 1}`}
                            className="h-16 w-16 rounded-lg object-cover"
                          />
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="border-t border-[#EFE8E8] pt-5">
                <div className="mb-3 flex items-center gap-2 text-base font-semibold text-[#1F1A1A]">
                  <CreditCard className="h-4 w-4 text-[#C82829]" />
                  优惠与金额
                </div>
                <div className="grid gap-4 text-sm md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="text-[#8F8787]">是否使用优惠券</div>
                    <div className="font-medium text-[#1F1A1A]">{selectedRefund.usedCoupon ? "是" : "否"}</div>
                    <div className="text-[#8F8787]">优惠券类型</div>
                    <div className="font-medium text-[#1F1A1A]">{selectedRefund.couponType}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-[#8F8787]">订单原价</div>
                    <div className="font-medium text-[#1F1A1A]">{money(selectedRefund.originalAmount)}</div>
                    <div className="text-[#8F8787]">优惠金额</div>
                    <div className="font-medium text-[#52C41A]">-{money(selectedRefund.discountAmount)}</div>
                    <div className="text-[#8F8787]">实付金额</div>
                    <div className="font-medium text-[#C82829]">{money(selectedRefund.paidAmount)}</div>
                    <div className="text-[#8F8787]">退款金额</div>
                    <div className="font-semibold text-[#C82829]">{money(selectedRefund.refundAmount)}</div>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#EFE8E8] pt-5">
                <div className="mb-3 flex items-center gap-2 text-base font-semibold text-[#1F1A1A]">
                  <RefreshCcw className="h-4 w-4 text-[#C82829]" />
                  处理进度
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <Circle className="h-2.5 w-2.5 fill-[#C82829] text-[#C82829]" />
                      <div className="mt-1 h-6 w-px bg-[#E4DDDD]" />
                    </div>
                    <div>
                      <div>买家提交售后申请</div>
                      <div className="text-xs text-[#8F8787]">{selectedRefund.applyTime}</div>
                    </div>
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
