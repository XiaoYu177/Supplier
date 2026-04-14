import { useState } from "react"
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
import { Search, ShieldCheck, AlertCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const mockRefunds = [
  { 
    id: "REF20240320001", 
    orderId: "ORD20240318005", 
    phone: "138****8000", 
    type: "退货退款",
    amount: "¥98.00",
    reason: "拍错/不喜欢",
    status: "待审核",
    time: "2024-03-20 09:00"
  },
  { 
    id: "REF20240320002", 
    orderId: "ORD20240317012", 
    phone: "139****2222", 
    type: "仅退款",
    amount: "¥19.00",
    reason: "质量问题",
    status: "退款中",
    time: "2024-03-20 10:30"
  },
  { 
    id: "REF20240319001", 
    orderId: "ORD20240315008", 
    phone: "136****9999", 
    type: "退货退款",
    amount: "¥120.00",
    reason: "商品损坏",
    status: "已退款",
    time: "2024-03-19 15:20"
  },
]

export default function GiftRefunds() {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1F1A1A]">退款退货审核</h1>
          <p className="text-muted-foreground">处理消费者的售后申请，审核退款理由及凭证。</p>
        </div>
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[#8F8787]" />
              <Input
                placeholder="搜索售后单号、手机号..."
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
                  <TableHead className="text-[#5C5454] font-medium">售后单号</TableHead>
                  <TableHead className="text-[#5C5454] font-medium">关联订单</TableHead>
                  <TableHead className="text-[#5C5454] font-medium">用户手机号</TableHead>
                  <TableHead className="text-[#5C5454] font-medium">售后类型</TableHead>
                  <TableHead className="text-[#5C5454] font-medium">退款金额</TableHead>
                  <TableHead className="text-[#5C5454] font-medium">退款理由</TableHead>
                  <TableHead className="text-[#5C5454] font-medium">状态</TableHead>
                  <TableHead className="text-right text-[#5C5454] font-medium">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockRefunds.map((refund) => (
                  <TableRow key={refund.id} className="border-[#EBE5E5] hover:bg-[#FFF3F3]/30 transition-colors">
                    <TableCell className="font-mono text-xs text-[#8F8787]">{refund.id}</TableCell>
                    <TableCell className="font-mono text-xs text-[#8F8787]">{refund.orderId}</TableCell>
                    <TableCell className="text-[#1F1A1A]">{refund.phone}</TableCell>
                    <TableCell className="text-[#5C5454]">{refund.type}</TableCell>
                    <TableCell className="font-bold text-[#C82829]">{refund.amount}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <AlertCircle className="h-3 w-3 text-[#FAAD14]" />
                        <span className="text-xs text-[#5C5454]">{refund.reason}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={
                          refund.status === "待审核" ? "bg-[#FAAD14]/10 text-[#FAAD14] border-[#FAAD14]/20" :
                          refund.status === "已退款" ? "bg-[#52C41A]/10 text-[#52C41A] border-[#52C41A]/20" :
                          "bg-[#FFF3F3] text-[#C82829] border-[#C82829]/20"
                        }
                      >
                        {refund.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="hover:bg-[#FFF3F3] text-[#C82829]">
                        <ShieldCheck className="mr-2 h-4 w-4" /> 审核
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
