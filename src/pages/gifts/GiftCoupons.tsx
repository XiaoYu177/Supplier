import { useMemo, useState } from "react"
import { Calendar, Edit, Filter, Plus, Tag } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogFooter,
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

type CouponType = "满减优惠券" | "折扣优惠券"
type CouponStatus = "有效" | "过期"
type PublishMode = "立即上架" | "定时上架"

type CouponRecord = {
  id: string
  name: string
  type: CouponType
  amountLabel: string
  supplierIds: string[]
  productIds: string[]
  publishMode: PublishMode
  startDate: string
  endDate: string
  status: CouponStatus
}

type CouponForm = {
  name: string
  type: CouponType
  thresholdAmount: string
  reduceAmount: string
  discountRate: string
  supplierIds: string[]
  productIds: string[]
  publishMode: PublishMode
  startDate: string
  endDate: string
}

const suppliers = [
  { id: "s1", name: "故宫文创旗舰店" },
  { id: "s2", name: "北京礼物官方店" },
  { id: "s3", name: "老北京布鞋坊" },
  { id: "s4", name: "长城纪念品中心" },
]

const products = [
  { id: "p1", name: "故宫脊兽书签套装", supplierId: "s1" },
  { id: "p2", name: "宫廷瑞兽冰箱贴", supplierId: "s1" },
  { id: "p3", name: "京彩北京手账礼盒", supplierId: "s2" },
  { id: "p4", name: "北京地标徽章套组", supplierId: "s2" },
  { id: "p5", name: "老北京布鞋经典款", supplierId: "s3" },
  { id: "p6", name: "长城积木纪念套装", supplierId: "s4" },
]

const initialCoupons: CouponRecord[] = [
  {
    id: "CP20260401",
    name: "春游满减券",
    type: "满减优惠券",
    amountLabel: "满 199 减 30",
    supplierIds: ["s1", "s2"],
    productIds: ["p1", "p3", "p4"],
    publishMode: "立即上架",
    startDate: "2026-04-01",
    endDate: "2026-05-10",
    status: "有效",
  },
  {
    id: "CP20260318",
    name: "文创折扣季",
    type: "折扣优惠券",
    amountLabel: "8.5 折",
    supplierIds: ["s1", "s4"],
    productIds: ["p2", "p6"],
    publishMode: "定时上架",
    startDate: "2026-03-01",
    endDate: "2026-03-31",
    status: "过期",
  },
]

const emptyForm: CouponForm = {
  name: "",
  type: "满减优惠券",
  thresholdAmount: "",
  reduceAmount: "",
  discountRate: "",
  supplierIds: [],
  productIds: [],
  publishMode: "立即上架",
  startDate: "",
  endDate: "",
}

const getStatusBadgeClass = (status: CouponStatus) =>
  status === "有效"
    ? "bg-[#E8F5E9] text-[#4CAF50] hover:bg-[#E8F5E9]"
    : "bg-[#F1EEEE] text-[#8F8787] hover:bg-[#F1EEEE]"

export default function GiftCoupons() {
  const [coupons, setCoupons] = useState<CouponRecord[]>(initialCoupons)
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [supplierKeyword, setSupplierKeyword] = useState("")
  const [productKeyword, setProductKeyword] = useState("")
  const [supplierPickerOpen, setSupplierPickerOpen] = useState(false)
  const [productPickerOpen, setProductPickerOpen] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [form, setForm] = useState<CouponForm>(emptyForm)
  const [editingCoupon, setEditingCoupon] = useState<CouponRecord | null>(null)
  const [statusDraft, setStatusDraft] = useState<CouponStatus>("有效")

  const filteredProducts = useMemo(() => {
    if (form.supplierIds.length === 0) {
      return products
    }

    return products.filter((product) => form.supplierIds.includes(product.supplierId))
  }, [form.supplierIds])

  const visibleSuppliers = useMemo(
    () =>
      suppliers.filter((supplier) =>
        supplier.name.toLowerCase().includes(supplierKeyword.trim().toLowerCase())
      ),
    [supplierKeyword]
  )

  const visibleProductsInDialog = useMemo(
    () =>
      filteredProducts.filter((product) =>
        product.name.toLowerCase().includes(productKeyword.trim().toLowerCase())
      ),
    [filteredProducts, productKeyword]
  )

  const visibleCoupons = coupons.filter((coupon) => {
    const matchType = typeFilter === "all" || coupon.type === typeFilter
    const matchStatus = statusFilter === "all" || coupon.status === statusFilter
    return matchType && matchStatus
  })

  const getSupplierNames = (ids: string[]) => {
    if (ids.length === 0) {
      return "全部供应商"
    }

    return suppliers
      .filter((supplier) => ids.includes(supplier.id))
      .map((supplier) => supplier.name)
      .join("、")
  }

  const getProductNames = (ids: string[]) => {
    if (ids.length === 0) {
      return "全部商品"
    }

    return products
      .filter((product) => ids.includes(product.id))
      .map((product) => product.name)
      .join("、")
  }

  const resetForm = () => {
    setForm(emptyForm)
    setSupplierKeyword("")
    setProductKeyword("")
    setSupplierPickerOpen(false)
    setProductPickerOpen(false)
    setIsDialogOpen(false)
  }

  const toggleSelection = (
    currentValues: string[],
    value: string,
    key: "supplierIds" | "productIds"
  ) => {
    const nextValues = currentValues.includes(value)
      ? currentValues.filter((item) => item !== value)
      : [...currentValues, value]

    setForm((current) => ({
      ...current,
      [key]: nextValues,
      ...(key === "supplierIds" && nextValues.length !== current.supplierIds.length
        ? {
            productIds: current.productIds.filter((productId) =>
              products.some(
                (product) =>
                  product.id === productId &&
                  (nextValues.length === 0 || nextValues.includes(product.supplierId))
              )
            ),
          }
        : {}),
    }))
  }

  const handleSubmitCoupon = () => {
    if (!form.name.trim()) return
    if (
      form.type === "满减优惠券" &&
      (!form.thresholdAmount.trim() || !form.reduceAmount.trim())
    ) return
    if (form.type === "折扣优惠券" && !form.discountRate.trim()) return
    if (!form.startDate || !form.endDate) return

    const newCoupon: CouponRecord = {
      id: `CP${Date.now()}`,
      name: form.name.trim(),
      type: form.type,
      amountLabel:
        form.type === "满减优惠券"
          ? `满 ${form.thresholdAmount} 减 ${form.reduceAmount}`
          : `${form.discountRate} 折`,
      supplierIds: form.supplierIds,
      productIds: form.productIds,
      publishMode: form.publishMode,
      startDate: form.startDate,
      endDate: form.endDate,
      status: new Date(form.endDate) >= new Date() ? "有效" : "过期",
    }

    setCoupons((current) => [newCoupon, ...current])
    resetForm()
  }

  const openEditStatus = (coupon: CouponRecord) => {
    setEditingCoupon(coupon)
    setStatusDraft(coupon.status)
  }

  const saveEditedStatus = () => {
    if (!editingCoupon) return

    setCoupons((current) =>
      current.map((coupon) =>
        coupon.id === editingCoupon.id ? { ...coupon, status: statusDraft } : coupon
      )
    )
    setEditingCoupon(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1F1A1A]">优惠管理</h1>
          <p className="text-muted-foreground">
            管理满减与折扣优惠券，配置供应商、商品和上架有效期。
          </p>
        </div>
        <Button
          className="bg-[#C82829] hover:bg-[#B22222]"
          onClick={() => {
            setForm(emptyForm)
            setSupplierKeyword("")
            setProductKeyword("")
            setSupplierPickerOpen(false)
            setProductPickerOpen(false)
            setIsDialogOpen(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          新增优惠券
        </Button>
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex items-center gap-2 text-sm text-[#8F8787]">
              <Filter className="h-4 w-4" />
              筛选框
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-[220px]">
                <SelectValue>
                  {typeFilter === "all" ? "全部类型优惠券" : typeFilter}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部类型优惠券</SelectItem>
                <SelectItem value="满减优惠券">满减优惠券</SelectItem>
                <SelectItem value="折扣优惠券">折扣优惠券</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue>
                  {statusFilter === "all" ? "全部状态" : statusFilter}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="有效">有效</SelectItem>
                <SelectItem value="过期">过期</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Tag className="h-5 w-5 text-[#C82829]" />
            优惠券记录
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-lg border border-[#EBE5E5]">
            <Table>
              <TableHeader className="bg-[#F9F8F7]">
                <TableRow className="hover:bg-transparent border-[#EBE5E5]">
                  <TableHead>优惠券名称</TableHead>
                  <TableHead>供应商名称</TableHead>
                  <TableHead>优惠商品信息</TableHead>
                  <TableHead>优惠方式</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleCoupons.map((coupon) => (
                  <TableRow key={coupon.id} className="border-[#EBE5E5] hover:bg-[#FFF3F3]/20">
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium text-[#1F1A1A]">{coupon.name}</div>
                        <div className="text-xs text-[#8F8787]">{coupon.type}</div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[220px] whitespace-normal text-sm text-[#5C5454]">
                      {getSupplierNames(coupon.supplierIds)}
                    </TableCell>
                    <TableCell className="max-w-[320px] whitespace-normal text-sm text-[#5C5454]">
                      {getProductNames(coupon.productIds)}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-sm">
                        <div className="font-medium text-[#1F1A1A]">{coupon.amountLabel}</div>
                        <div className="text-[#8F8787]">
                          {coupon.publishMode} | {coupon.startDate} 至 {coupon.endDate}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusBadgeClass(coupon.status)}>
                        {coupon.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-[#C82829]/20 text-[#C82829] hover:bg-[#FFF3F3]"
                        onClick={() => openEditStatus(coupon)}
                      >
                        <Edit className="mr-1 h-3.5 w-3.5" />
                        编辑
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>新增优惠券</DialogTitle>
          </DialogHeader>
          <div className="grid gap-5 py-2">
            <div className="grid gap-2">
              <Label>优惠券名称</Label>
              <Input
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                placeholder="请输入优惠券名称"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label>优惠券类型</Label>
                <Select
                  value={form.type}
                  onValueChange={(value: CouponType) =>
                    setForm((current) => ({
                      ...current,
                      type: value,
                      thresholdAmount: value === "满减优惠券" ? current.thresholdAmount : "",
                      reduceAmount: value === "满减优惠券" ? current.reduceAmount : "",
                      discountRate: value === "折扣优惠券" ? current.discountRate : "",
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="满减优惠券">满减优惠券</SelectItem>
                    <SelectItem value="折扣优惠券">折扣优惠券</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {form.type === "满减优惠券" ? (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label>满多少金额</Label>
                    <Input
                      value={form.thresholdAmount}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          thresholdAmount: event.target.value,
                        }))
                      }
                      placeholder="如：199"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>减多少金额</Label>
                    <Input
                      value={form.reduceAmount}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          reduceAmount: event.target.value,
                        }))
                      }
                      placeholder="如：30"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid gap-2">
                  <Label>折扣力度</Label>
                  <Input
                    value={form.discountRate}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        discountRate: event.target.value,
                      }))
                    }
                    placeholder="如：8.5"
                  />
                </div>
              )}
            </div>

            <div className="grid gap-3 rounded-xl border border-[#EBE5E5] bg-[#FAF8F6] p-4">
              <div className="flex items-center justify-between">
                  <Label>选择供应商</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setForm((current) => ({ ...current, supplierIds: [], productIds: [] }))
                  }
                >
                  默认全部供应商
                </Button>
              </div>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setSupplierPickerOpen((current) => !current)}
                  className="flex h-10 w-full items-center justify-between rounded-lg border border-[#EBE5E5] bg-white px-3 text-left text-sm text-[#5C5454]"
                >
                  <span className="truncate">
                    {form.supplierIds.length === 0 ? "全部供应商" : getSupplierNames(form.supplierIds)}
                  </span>
                  <span className="text-xs text-[#8F8787]">{supplierPickerOpen ? "收起" : "选择"}</span>
                </button>
                {supplierPickerOpen ? (
                  <div className="absolute left-0 right-0 top-12 z-20 grid gap-3 rounded-xl border border-[#EBE5E5] bg-white p-3 shadow-lg">
                    <Input
                      value={supplierKeyword}
                      onChange={(event) => setSupplierKeyword(event.target.value)}
                      placeholder="输入供应商名称搜索匹配"
                    />
                    <div className="grid max-h-56 gap-3 overflow-y-auto">
                      {visibleSuppliers.map((supplier) => (
                        <label
                          key={supplier.id}
                          className="flex items-center gap-3 rounded-lg border border-[#EBE5E5] px-3 py-2 text-sm"
                        >
                          <Checkbox
                            checked={form.supplierIds.includes(supplier.id)}
                            onCheckedChange={() =>
                              toggleSelection(form.supplierIds, supplier.id, "supplierIds")
                            }
                          />
                          <span>{supplier.name}</span>
                        </label>
                      ))}
                      {visibleSuppliers.length === 0 ? (
                        <div className="rounded-lg border border-dashed border-[#E6D6CC] px-3 py-6 text-center text-sm text-[#8F8787]">
                          没有匹配到供应商
                        </div>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="grid gap-3 rounded-xl border border-[#EBE5E5] bg-[#FAF8F6] p-4">
              <div className="flex items-center justify-between">
                <Label>选择商品</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setForm((current) => ({ ...current, productIds: [] }))}
                >
                  默认全部商品
                </Button>
              </div>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setProductPickerOpen((current) => !current)}
                  className="flex h-10 w-full items-center justify-between rounded-lg border border-[#EBE5E5] bg-white px-3 text-left text-sm text-[#5C5454]"
                >
                  <span className="truncate">
                    {form.productIds.length === 0 ? "全部商品" : getProductNames(form.productIds)}
                  </span>
                  <span className="text-xs text-[#8F8787]">{productPickerOpen ? "收起" : "选择"}</span>
                </button>
                {productPickerOpen ? (
                  <div className="absolute left-0 right-0 top-12 z-20 grid gap-3 rounded-xl border border-[#EBE5E5] bg-white p-3 shadow-lg">
                    <Input
                      value={productKeyword}
                      onChange={(event) => setProductKeyword(event.target.value)}
                      placeholder="输入商品名称搜索匹配"
                    />
                    <div className="grid max-h-56 gap-3 overflow-y-auto">
                      {visibleProductsInDialog.map((product) => (
                        <label
                          key={product.id}
                          className="flex items-center gap-3 rounded-lg border border-[#EBE5E5] px-3 py-2 text-sm"
                        >
                          <Checkbox
                            checked={form.productIds.includes(product.id)}
                            onCheckedChange={() =>
                              toggleSelection(form.productIds, product.id, "productIds")
                            }
                          />
                          <span>{product.name}</span>
                        </label>
                      ))}
                      {visibleProductsInDialog.length === 0 ? (
                        <div className="rounded-lg border border-dashed border-[#E6D6CC] px-3 py-6 text-center text-sm text-[#8F8787]">
                          没有匹配到商品
                        </div>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="grid gap-2">
                <Label>上架方式</Label>
                <Select
                  value={form.publishMode}
                  onValueChange={(value: PublishMode) =>
                    setForm((current) => ({ ...current, publishMode: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="立即上架">立即上架</SelectItem>
                    <SelectItem value="定时上架">定时上架</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>开始日期</Label>
                <Input
                  type="date"
                  value={form.startDate}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, startDate: event.target.value }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label>结束日期</Label>
                <Input
                  type="date"
                  value={form.endDate}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, endDate: event.target.value }))
                  }
                />
              </div>
            </div>

            <div className="rounded-xl border border-dashed border-[#E9D7D0] bg-[#FFF9F6] px-4 py-3 text-sm text-[#8F8787]">
              <div className="flex items-center gap-2 font-medium text-[#7B5542]">
                <Calendar className="h-4 w-4" />
                有效期日期选择
              </div>
              <p className="mt-1">
                当前配置：{form.publishMode}，适用供应商为
                {form.supplierIds.length === 0 ? "全部供应商" : `${form.supplierIds.length} 个供应商`}，
                适用商品为{form.productIds.length === 0 ? "全部商品" : `${form.productIds.length} 个商品`}。
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={resetForm}>
              关闭
            </Button>
            <Button className="bg-[#C82829] hover:bg-[#B22222]" onClick={handleSubmitCoupon}>
              确认
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(editingCoupon)} onOpenChange={(open) => !open && setEditingCoupon(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>编辑优惠券状态</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="rounded-lg bg-[#F9F8F7] px-4 py-3 text-sm text-[#5C5454]">
              {editingCoupon?.name}
            </div>
            <div className="grid gap-2">
              <Label>状态</Label>
              <Select value={statusDraft} onValueChange={(value: CouponStatus) => setStatusDraft(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="有效">有效</SelectItem>
                  <SelectItem value="过期">过期</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingCoupon(null)}>
              关闭
            </Button>
            <Button className="bg-[#C82829] hover:bg-[#B22222]" onClick={saveEditedStatus}>
              确认
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
