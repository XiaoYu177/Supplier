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
import { Plus, MapPin, Edit, Trash2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const mockAddresses = [
  { 
    id: 1, 
    name: "京彩游售后中心", 
    phone: "010-88889999", 
    address: "北京市东城区故宫景山前街4号",
    isDefault: true
  },
  { 
    id: 2, 
    name: "北京礼物仓储部", 
    phone: "13811112222", 
    address: "北京市朝阳区大屯路甲11号",
    isDefault: false
  },
]

export default function GiftAddresses() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1F1A1A]">退货地址管理</h1>
          <p className="text-muted-foreground">管理消费者退货时的收货地址，可配置多个退货点。</p>
        </div>
        <Button className="bg-[#C82829] hover:bg-[#B22222]">
          <Plus className="mr-2 h-4 w-4" /> 新增退货点
        </Button>
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="p-6">
          <div className="rounded-lg border border-[#EBE5E5] overflow-hidden">
            <Table>
              <TableHeader className="bg-[#F9F8F7]">
                <TableRow className="hover:bg-transparent border-[#EBE5E5]">
                  <TableHead className="text-[#5C5454] font-medium">收件人</TableHead>
                  <TableHead className="text-[#5C5454] font-medium">联系电话</TableHead>
                  <TableHead className="text-[#5C5454] font-medium">详细地址</TableHead>
                  <TableHead className="text-[#5C5454] font-medium">是否默认</TableHead>
                  <TableHead className="text-right text-[#5C5454] font-medium">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockAddresses.map((addr) => (
                  <TableRow key={addr.id} className="border-[#EBE5E5] hover:bg-[#FFF3F3]/30 transition-colors">
                    <TableCell className="font-medium text-[#1F1A1A]">{addr.name}</TableCell>
                    <TableCell className="text-[#5C5454]">{addr.phone}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3 h-3 text-[#C82829]" />
                        <span className="text-sm text-[#5C5454]">{addr.address}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {addr.isDefault && (
                        <Badge className="bg-[#C82829] hover:bg-[#C82829]">默认</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-[#FFF3F3]">
                          <Edit className="h-4 w-4 text-[#5C5454]" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-50 text-destructive">
                          <Trash2 className="h-4 w-4" />
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
    </div>
  )
}
