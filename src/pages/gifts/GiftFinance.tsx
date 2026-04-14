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
import { Download, Eye, CheckCircle2, Wallet } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const mockBills = [
  { 
    id: 1, 
    period: "2024-03-01 至 2024-03-31", 
    supplier: "故宫文创旗舰店", 
    revenue: "¥450,678.00",
    commission: "¥67,601.70",
    refunds: "¥5,400.00",
    netPay: "¥377,676.30",
    status: "待确认"
  },
  { 
    id: 2, 
    period: "2024-03-01 至 2024-03-31", 
    supplier: "北京礼物官方店", 
    revenue: "¥320,120.00",
    commission: "¥32,012.00",
    refunds: "¥2,100.00",
    netPay: "¥286,008.00",
    status: "待打款"
  },
  { 
    id: 3, 
    period: "2024-02-01 至 2024-02-29", 
    supplier: "老北京布鞋坊", 
    revenue: "¥180,450.00",
    commission: "¥21,654.00",
    refunds: "¥1,200.00",
    netPay: "¥157,596.00",
    status: "已打款"
  },
]

export default function GiftFinance() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1F1A1A]">财务对账</h1>
          <p className="text-muted-foreground">管理供应商结算账单，核对平台抽成及售后扣款。</p>
        </div>
        <Button variant="outline" className="border-[#EBE5E5]">
          <Download className="mr-2 h-4 w-4" /> 导出账单
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-none shadow-sm bg-[#C82829] text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-sm opacity-80">本月待结算总额</span>
              <Wallet className="h-4 w-4 opacity-80" />
            </div>
            <div className="text-2xl font-bold mt-2">¥1,245,678.00</div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#8F8787]">平台总抽成 (本月)</span>
              <div className="bg-[#FFF3F3] p-1 rounded">
                <CheckCircle2 className="h-4 w-4 text-[#C82829]" />
              </div>
            </div>
            <div className="text-2xl font-bold mt-2 text-[#1F1A1A]">¥186,851.70</div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#8F8787]">售后扣除总额</span>
              <div className="bg-orange-50 p-1 rounded">
                <Wallet className="h-4 w-4 text-[#FAAD14]" />
              </div>
            </div>
            <div className="text-2xl font-bold mt-2 text-[#1F1A1A]">¥8,700.00</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="p-6">
          <div className="rounded-lg border border-[#EBE5E5] overflow-hidden">
            <Table>
              <TableHeader className="bg-[#F9F8F7]">
                <TableRow className="hover:bg-transparent border-[#EBE5E5]">
                  <TableHead className="text-[#5C5454] font-medium">结算周期</TableHead>
                  <TableHead className="text-[#5C5454] font-medium">供应商名称</TableHead>
                  <TableHead className="text-[#5C5454] font-medium">总营业额</TableHead>
                  <TableHead className="text-[#5C5454] font-medium">平台抽成</TableHead>
                  <TableHead className="text-[#5C5454] font-medium">售后扣除</TableHead>
                  <TableHead className="text-[#5C5454] font-medium">应结金额</TableHead>
                  <TableHead className="text-[#5C5454] font-medium">状态</TableHead>
                  <TableHead className="text-right text-[#5C5454] font-medium">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockBills.map((bill) => (
                  <TableRow key={bill.id} className="border-[#EBE5E5] hover:bg-[#FFF3F3]/30 transition-colors">
                    <TableCell className="text-sm text-[#5C5454]">{bill.period}</TableCell>
                    <TableCell className="font-medium text-[#1F1A1A]">{bill.supplier}</TableCell>
                    <TableCell className="text-[#1F1A1A]">{bill.revenue}</TableCell>
                    <TableCell className="text-[#FAAD14]">{bill.commission}</TableCell>
                    <TableCell className="text-destructive">{bill.refunds}</TableCell>
                    <TableCell className="font-bold text-[#C82829]">{bill.netPay}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={
                          bill.status === "已打款" ? "bg-[#52C41A]/10 text-[#52C41A] border-[#52C41A]/20" :
                          bill.status === "待打款" ? "bg-[#FFF3F3] text-[#C82829] border-[#C82829]/20" :
                          "bg-[#F1EEEE] text-[#8F8787] border-[#EBE5E5]"
                        }
                      >
                        {bill.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" className="hover:bg-[#FFF3F3] text-[#C82829]">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {bill.status === "待打款" && (
                          <Button variant="ghost" size="sm" className="text-[#52C41A] hover:bg-green-50">
                            确认打款
                          </Button>
                        )}
                      </div>
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
