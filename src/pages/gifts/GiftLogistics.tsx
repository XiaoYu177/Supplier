import { useState, useRef, useEffect } from "react"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  Eye, 
  Download, 
  Truck, 
  Clock, 
  Package, 
  MapPin, 
  Copy, 
  Check, 
  Send,
  ChevronRight,
  Edit2
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import * as XLSX from "xlsx"

interface LogisticsRecord {
  id: string
  orderId: string
  trackingNo: string
  expressType: string
  status: string
  phone: string
  productName: string
  productImage: string
  productSpecs: string
  supplier: string
  recipientName: string
  recipientPhone: string
  recipientAddress: string
  itemCategory: string
  itemDetails: string
  remarks: string
  records: { time: string; content: string }[]
}

const INITIAL_LOGISTICS: LogisticsRecord[] = [
  { 
    id: "L001", 
    orderId: "ORD20240320001", 
    trackingNo: "", 
    expressType: "",
    status: "待发货",
    phone: "13800138000",
    productName: "故宫日历2024",
    productImage: "https://picsum.photos/seed/gift1/40/40",
    productSpecs: "精装版 x1",
    supplier: "故宫文创旗舰店",
    recipientName: "张三",
    recipientPhone: "13800138000",
    recipientAddress: "上海市浦东新区世纪大道1号",
    itemCategory: "日用品",
    itemDetails: "故宫日历2024精装版",
    remarks: "请尽快发货",
    records: [
      { time: "2024-03-20 10:05", content: "订单已提交，等待商家发货" }
    ]
  },
  { 
    id: "L002", 
    orderId: "ORD20240320002", 
    trackingNo: "YT9988776655", 
    expressType: "圆通快递",
    status: "已发货",
    phone: "13911112222",
    productName: "天坛祈年殿积木",
    productImage: "https://picsum.photos/seed/gift2/40/40",
    productSpecs: "标准版 x2",
    supplier: "北京礼物官方店",
    recipientName: "李四",
    recipientPhone: "13911112222",
    recipientAddress: "北京市朝阳区建国门外大道2号",
    itemCategory: "数码产品",
    itemDetails: "天坛祈年殿积木标准版",
    remarks: "送人的礼物",
    records: [
      { time: "2024-03-20 15:30", content: "快件已到达北京分拨中心" },
      { time: "2024-03-20 12:00", content: "商家已发货，快递员已揽收" }
    ]
  },
  { 
    id: "L003", 
    orderId: "ORD20240319001", 
    trackingNo: "ZT1122334455", 
    expressType: "中通快递",
    status: "已完成",
    phone: "13688889999",
    productName: "老北京布鞋",
    productImage: "https://picsum.photos/seed/gift3/40/40",
    productSpecs: "黑色 42码 x1",
    supplier: "老北京布鞋坊",
    recipientName: "王五",
    recipientPhone: "13688889999",
    recipientAddress: "广州市天河区天河路3号",
    itemCategory: "衣物",
    itemDetails: "老北京布鞋黑色42码",
    remarks: "",
    records: [
      { time: "2024-03-20 09:00", content: "快件已签收，感谢使用中通快递" },
      { time: "2024-03-19 20:00", content: "快件正在派送中" },
      { time: "2024-03-19 14:20", content: "商家已发货" }
    ]
  },
  { 
    id: "L004", 
    orderId: "ORD20240318005", 
    trackingNo: "", 
    expressType: "",
    status: "待发货",
    phone: "13566667777",
    productName: "北京礼物明信片",
    productImage: "https://picsum.photos/seed/gift4/40/40",
    productSpecs: "精选套装 x1",
    supplier: "北京礼物官方店",
    recipientName: "赵六",
    recipientPhone: "13566667777",
    recipientAddress: "深圳市南山区深南大道4号",
    itemCategory: "其他",
    itemDetails: "北京礼物明信片精选套装",
    remarks: "",
    records: [
      { time: "2024-03-18 10:05", content: "订单已提交，等待商家发货" }
    ]
  },
  { 
    id: "L005", 
    orderId: "ORD20240318006", 
    trackingNo: "", 
    expressType: "",
    status: "待发货",
    phone: "13799998888",
    productName: "长城模型",
    productImage: "https://picsum.photos/seed/gift5/40/40",
    productSpecs: "大型摆件 x1",
    supplier: "北京礼物官方店",
    recipientName: "孙七",
    recipientPhone: "13799998888",
    recipientAddress: "杭州市西湖区灵隐路5号",
    itemCategory: "其他",
    itemDetails: "长城模型大型摆件",
    remarks: "易碎品请小心",
    records: [
      { time: "2024-03-18 11:30", content: "订单已提交，等待商家发货" }
    ]
  },
]

export default function GiftLogistics() {
  const [logisticsData, setLogisticsData] = useState<LogisticsRecord[]>(INITIAL_LOGISTICS)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("全部订单")
  const [selectedRecord, setSelectedRecord] = useState<LogisticsRecord | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isShipOpen, setIsShipOpen] = useState(false)
  const [shipMode, setShipMode] = useState<"auto" | "manual">("auto")
  const [senderInfo, setSenderInfo] = useState({
    name: "故宫文创管理员",
    phone: "010-65131892",
    address: "北京市东城区故宫博物院 100009"
  })
  const [isEditingAddress, setIsEditingAddress] = useState(false)
  const [expressCompany, setExpressCompany] = useState("")
  const [otherExpress, setOtherExpress] = useState("")
  const [trackingNo, setTrackingNo] = useState("")
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [copiedField, setCopiedField] = useState<string | null>(null)
  
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isDetailOpen) {
      const timer = setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = 0
        }
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [isDetailOpen])

  const filteredLogistics = logisticsData.filter(item => {
    const matchesSearch = 
      item.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.phone.includes(searchTerm) ||
      item.productName.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "全部订单" || item.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleShowDetail = (record: LogisticsRecord) => {
    setSelectedRecord(record)
    setIsDetailOpen(true)
  }

  const handleShowShip = (record: LogisticsRecord) => {
    setSelectedRecord(record)
    setIsShipOpen(true)
    setShipMode("auto")
    setExpressCompany("")
    setOtherExpress("")
    setTrackingNo("")
  }

  const handleExport = () => {
    const pendingOrders = logisticsData.filter(item => item.status === "待发货")
    const data = pendingOrders.map((item, index) => ({
      "编号": index + 1,
      "收件人姓名": item.recipientName,
      "收件人联系方式": item.recipientPhone,
      "收件地址": item.recipientAddress,
      "物品类": item.itemCategory,
      "物品详情": item.itemDetails,
      "备注信息": item.remarks,
      "单号": ""
    }))

    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "待发货订单")
    XLSX.writeFile(wb, "待发货订单导出.xlsx")
  }

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const handleConfirmShip = () => {
    if (!selectedRecord) return

    const company = expressCompany === "其他" ? otherExpress : expressCompany
    
    setLogisticsData(prev => prev.map(item => 
      item.id === selectedRecord.id 
        ? { 
            ...item, 
            status: "已发货", 
            expressType: company || "菜鸟裹裹", 
            trackingNo: trackingNo || "CN" + Math.random().toString().slice(2, 12),
            records: [
              { time: new Date().toLocaleString(), content: `商家已发货，快递公司：${company || "菜鸟裹裹"}` },
              ...item.records
            ]
          } 
        : item
    ))
    
    setIsShipOpen(false)
    setSelectedIds(prev => prev.filter(id => id !== selectedRecord.id))
  }

  const handleBatchShip = () => {
    setLogisticsData(prev => prev.map(item => 
      selectedIds.includes(item.id)
        ? { 
            ...item, 
            status: "已发货", 
            expressType: "菜鸟裹裹", 
            trackingNo: "CN" + Math.random().toString().slice(2, 12),
            records: [
              { time: new Date().toLocaleString(), content: "商家已批量发货，默认使用菜鸟裹裹" },
              ...item.records
            ]
          } 
        : item
    ))
    setSelectedIds([])
  }

  const toggleSelectAll = () => {
    const pendingIds = filteredLogistics.filter(i => i.status === "待发货").map(i => i.id)
    if (selectedIds.length === pendingIds.length && pendingIds.length > 0) {
      setSelectedIds([])
    } else {
      setSelectedIds(pendingIds)
    }
  }

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id))
    } else {
      setSelectedIds([...selectedIds, id])
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1F1A1A]">打包发货</h1>
          <p className="text-muted-foreground">监控订单物流状态，查询快递行程及签收记录。</p>
        </div>
        <div className="flex gap-2">
          {selectedIds.length > 0 && (
            <Button 
              className="bg-[#C82829] hover:bg-[#B22222]"
              onClick={handleBatchShip}
            >
              <Send className="mr-2 h-4 w-4" /> 一键发货 ({selectedIds.length})
            </Button>
          )}
          <Button variant="outline" className="border-[#EBE5E5]" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" /> 导出待发货订单
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col space-y-4 mb-6">
            <div className="flex flex-wrap gap-2">
              {["全部订单", "待发货", "已发货", "已完成", "拒收"].map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? "default" : "outline"}
                  className={statusFilter === status ? "bg-[#C82829] hover:bg-[#B22222]" : "border-[#EBE5E5]"}
                  onClick={() => setStatusFilter(status)}
                  size="sm"
                >
                  {status}
                </Button>
              ))}
            </div>
            
            <div className="relative max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[#8F8787]" />
              <Input
                placeholder="搜索订单编号、手机号、商品名称..."
                className="pl-8 border-[#EBE5E5] focus-visible:ring-[#C82829]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-lg border border-[#EBE5E5] overflow-hidden">
            <Table>
              <TableHeader className="bg-[#F9F8F7]">
                <TableRow className="hover:bg-transparent border-[#EBE5E5]">
                  <TableHead className="w-[50px]">
                    <Checkbox 
                      checked={selectedIds.length > 0 && selectedIds.length === filteredLogistics.filter(i => i.status === "待发货").length}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="text-[#5C5454] font-medium">订单号</TableHead>
                  <TableHead className="text-[#5C5454] font-medium">商品信息</TableHead>
                  <TableHead className="text-[#5C5454] font-medium">供应商</TableHead>
                  <TableHead className="text-[#5C5454] font-medium">快递单号</TableHead>
                  <TableHead className="text-[#5C5454] font-medium">快递类型</TableHead>
                  <TableHead className="text-[#5C5454] font-medium">订单状态</TableHead>
                  <TableHead className="text-right text-[#5C5454] font-medium">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogistics.map((item) => (
                  <TableRow key={item.id} className="border-[#EBE5E5] hover:bg-[#FFF3F3]/30 transition-colors">
                    <TableCell>
                      {item.status === "待发货" && (
                        <Checkbox 
                          checked={selectedIds.includes(item.id)}
                          onCheckedChange={() => toggleSelect(item.id)}
                        />
                      )}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-[#1F1A1A]">{item.orderId}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img 
                          src={item.productImage} 
                          alt={item.productName} 
                          className="w-10 h-10 rounded-md object-cover border border-[#EBE5E5]"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-[#1F1A1A]">{item.productName}</span>
                          <span className="text-[10px] text-[#8F8787]">{item.productSpecs}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-[#5C5454]">{item.supplier}</TableCell>
                    <TableCell className="font-mono text-xs text-[#5C5454]">
                      {item.status === "待发货" ? "-" : item.trackingNo}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-[#8F8787]" />
                        <span className="text-sm text-[#5C5454]">
                          {item.status === "待发货" ? "-" : item.expressType}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={
                          item.status === "待发货" ? "bg-[#FFF3F3] text-[#C82829] border-[#C82829]/20" :
                          item.status === "已发货" ? "bg-[#52C41A]/10 text-[#52C41A] border-[#52C41A]/20" :
                          item.status === "已完成" ? "bg-[#1890FF]/10 text-[#1890FF] border-[#1890FF]/20" :
                          "bg-[#F5222D]/10 text-[#F5222D] border-[#F5222D]/20"
                        }
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {item.status === "待发货" && (
                          <Button 
                            variant="default" 
                            size="sm" 
                            className="h-8 px-4 bg-[#C82829] hover:bg-[#B22222]"
                            onClick={() => handleShowShip(item)}
                          >
                            去发货
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 px-4 text-[#C82829] border-[#C82829]/20 hover:bg-[#C82829] hover:text-white transition-all"
                          onClick={() => handleShowDetail(item)}
                        >
                          详情
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 去发货弹窗 */}
      <Dialog open={isShipOpen} onOpenChange={setIsShipOpen}>
        <DialogContent className="sm:max-w-[600px] h-[85vh] p-0 border-none bg-white shadow-2xl overflow-hidden flex flex-col">
          <DialogHeader className="p-6 border-b shrink-0">
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Send className="w-5 h-5 text-[#C82829]" />
              订单发货
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* 发货地址 */}
            <div className="bg-[#F9F8F7] p-4 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#C82829]" /> 发货信息
                </h4>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 text-[#C82829]"
                  onClick={() => setIsEditingAddress(!isEditingAddress)}
                >
                  <Edit2 className="w-3.5 h-3.5 mr-1" /> {isEditingAddress ? "保存" : "编辑"}
                </Button>
              </div>
              {isEditingAddress ? (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Input 
                      placeholder="发件人姓名"
                      value={senderInfo.name} 
                      onChange={(e) => setSenderInfo(prev => ({ ...prev, name: e.target.value }))}
                      className="h-9 border-[#EBE5E5]"
                    />
                    <Input 
                      placeholder="联系电话"
                      value={senderInfo.phone} 
                      onChange={(e) => setSenderInfo(prev => ({ ...prev, phone: e.target.value }))}
                      className="h-9 border-[#EBE5E5]"
                    />
                  </div>
                  <Input 
                    placeholder="详细发货地址"
                    value={senderInfo.address} 
                    onChange={(e) => setSenderInfo(prev => ({ ...prev, address: e.target.value }))}
                    className="h-9 border-[#EBE5E5]"
                  />
                </div>
              ) : (
                <div className="text-sm text-[#5C5454] space-y-1">
                  <p className="font-medium text-[#1F1A1A]">{senderInfo.name} <span className="ml-2 font-normal text-[#8F8787]">{senderInfo.phone}</span></p>
                  <p>{senderInfo.address}</p>
                </div>
              )}
            </div>

            {/* 选项切换 */}
            <div className="flex border-b border-[#EBE5E5]">
              <button
                className={`px-6 py-2 text-sm font-medium transition-colors relative ${shipMode === "auto" ? "text-[#C82829]" : "text-[#8F8787]"}`}
                onClick={() => setShipMode("auto")}
              >
                自动检索
                {shipMode === "auto" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C82829]" />}
              </button>
              <button
                className={`px-6 py-2 text-sm font-medium transition-colors relative ${shipMode === "manual" ? "text-[#C82829]" : "text-[#8F8787]"}`}
                onClick={() => setShipMode("manual")}
              >
                手动填写
                {shipMode === "manual" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C82829]" />}
              </button>
            </div>

            {selectedRecord && (
              <div className="space-y-4">
                {shipMode === "auto" ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-3">
                      {[
                        { label: "订单号", value: selectedRecord.orderId, field: "orderId" },
                        { label: "收件人姓名", value: selectedRecord.recipientName, field: "name" },
                        { label: "收件人联系方式", value: selectedRecord.recipientPhone, field: "phone" },
                        { label: "收件地址", value: selectedRecord.recipientAddress, field: "address" },
                        { label: "商品信息", value: selectedRecord.productName, field: "product" },
                        { label: "规范详细信息", value: selectedRecord.productSpecs, field: "specs" },
                      ].map((item) => (
                        <div key={item.field} className="flex items-center justify-between p-3 bg-white border border-[#EBE5E5] rounded-md group hover:border-[#C82829]/30 transition-colors">
                          <div className="space-y-0.5">
                            <p className="text-[10px] text-[#8F8787]">{item.label}</p>
                            <p className="text-sm font-medium text-[#1F1A1A]">{item.value}</p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-[#8F8787] hover:text-[#C82829]"
                            onClick={() => handleCopy(item.value, item.field)}
                          >
                            {copiedField === item.field ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                          </Button>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 bg-[#FFF3F3] rounded-md border border-[#C82829]/10">
                      <p className="text-xs text-[#C82829] leading-relaxed">
                        <strong>提示：</strong>自动检索发货后，用户端会提示“已发货正在等待快递员上门”，系统将自动检索快递单号实时更新到客户端。
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#5C5454]">快递公司</label>
                      <Select value={expressCompany} onValueChange={setExpressCompany}>
                        <SelectTrigger className="border-[#EBE5E5]">
                          <SelectValue placeholder="选择快递公司" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="菜鸟裹裹">菜鸟裹裹</SelectItem>
                          <SelectItem value="顺丰快递">顺丰快递</SelectItem>
                          <SelectItem value="邮政快递">邮政快递</SelectItem>
                          <SelectItem value="其他">其他</SelectItem>
                        </SelectContent>
                      </Select>
                      {expressCompany === "其他" && (
                        <Input 
                          placeholder="请输入快递公司名称" 
                          value={otherExpress}
                          onChange={(e) => setOtherExpress(e.target.value)}
                          className="mt-2 border-[#EBE5E5]"
                        />
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#5C5454]">快递单号</label>
                      <Input 
                        placeholder="请输入快递单号" 
                        value={trackingNo}
                        onChange={(e) => setTrackingNo(e.target.value)}
                        className="border-[#EBE5E5]"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <DialogFooter className="p-6 border-t bg-[#F9F8F7] shrink-0">
            <Button variant="outline" onClick={() => setIsShipOpen(false)}>取消</Button>
            <Button 
              className="bg-[#C82829] hover:bg-[#B22222]"
              onClick={handleConfirmShip}
            >
              确认发货
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent 
          ref={scrollRef}
          className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto p-0 border-none bg-white shadow-2xl"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Truck className="w-5 h-5 text-[#C82829]" />
              物流详情
            </DialogTitle>
          </DialogHeader>
          
          {selectedRecord && (
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4 bg-[#F9F8F7] p-4 rounded-lg">
                <div className="space-y-1">
                  <p className="text-xs text-[#8F8787]">订单编号</p>
                  <p className="text-sm font-mono font-medium">{selectedRecord.orderId}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-[#8F8787]">快递单号</p>
                  <p className="text-sm font-mono font-medium">{selectedRecord.status === "待发货" ? "-" : selectedRecord.trackingNo}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-[#8F8787]">快递公司</p>
                  <p className="text-sm font-medium">{selectedRecord.status === "待发货" ? "-" : selectedRecord.expressType}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-[#8F8787]">当前状态</p>
                  <Badge variant="outline" className="bg-[#FFF3F3] text-[#C82829] border-[#C82829]/20">
                    {selectedRecord.status}
                  </Badge>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#C82829]" /> 行程记录
                </h3>
                <div className="pl-6 space-y-6 border-l-2 border-[#F1EEEE] ml-2">
                  {selectedRecord.records.map((record, idx) => (
                    <div key={idx} className="relative">
                      <div className={`absolute -left-[29px] top-1.5 w-2 h-2 rounded-full ${idx === 0 ? "bg-[#C82829] ring-4 ring-[#C82829]/10" : "bg-[#D9D9D9]"}`} />
                      <p className={`text-sm ${idx === 0 ? "font-bold text-[#1F1A1A]" : "text-[#5C5454]"}`}>{record.content}</p>
                      <p className="text-xs text-[#8F8787] mt-1">{record.time}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button 
                  className="bg-[#C82829] hover:bg-[#B22222]"
                  onClick={() => setIsDetailOpen(false)}
                >
                  关闭
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
