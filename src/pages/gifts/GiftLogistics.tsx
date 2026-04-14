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
import { Search, Eye, Download, Truck, Clock, Package, MapPin } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

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
  records: { time: string; content: string }[]
}

const mockLogistics: LogisticsRecord[] = [
  { 
    id: "L001", 
    orderId: "ORD20240320001", 
    trackingNo: "SF1425364758", 
    expressType: "顺丰速递",
    status: "待发货",
    phone: "13800138000",
    productName: "故宫日历2024",
    productImage: "https://picsum.photos/seed/gift1/40/40",
    productSpecs: "精装版 x1",
    supplier: "故宫文创旗舰店",
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
    records: [
      { time: "2024-03-20 09:00", content: "快件已签收，感谢使用中通快递" },
      { time: "2024-03-19 20:00", content: "快件正在派送中" },
      { time: "2024-03-19 14:20", content: "商家已发货" }
    ]
  },
  { 
    id: "L004", 
    orderId: "ORD20240318005", 
    trackingNo: "CN7766554433", 
    expressType: "菜鸟裹裹",
    status: "拒收",
    phone: "13566667777",
    productName: "北京礼物明信片",
    productImage: "https://picsum.photos/seed/gift4/40/40",
    productSpecs: "精选套装 x1",
    supplier: "北京礼物官方店",
    records: [
      { time: "2024-03-19 10:00", content: "用户拒收，快件正在退回商家" },
      { time: "2024-03-18 16:00", content: "派送不成功，原因：用户拒收" }
    ]
  },
]

export default function GiftLogistics() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("全部订单")
  const [selectedRecord, setSelectedRecord] = useState<LogisticsRecord | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
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

  const filteredLogistics = mockLogistics.filter(item => {
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1F1A1A]">物流记录</h1>
          <p className="text-muted-foreground">监控订单物流状态，查询快递行程及签收记录。</p>
        </div>
        <Button variant="outline" className="border-[#EBE5E5]">
          <Download className="mr-2 h-4 w-4" /> 导出记录
        </Button>
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
                    <TableCell className="font-mono text-xs text-[#5C5454]">{item.trackingNo}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-[#8F8787]" />
                        <span className="text-sm text-[#5C5454]">{item.expressType}</span>
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
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 px-4 text-[#C82829] border-[#C82829]/20 hover:bg-[#C82829] hover:text-white transition-all"
                        onClick={() => handleShowDetail(item)}
                      >
                        详情
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

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
                  <p className="text-sm font-mono font-medium">{selectedRecord.trackingNo}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-[#8F8787]">快递公司</p>
                  <p className="text-sm font-medium">{selectedRecord.expressType}</p>
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
