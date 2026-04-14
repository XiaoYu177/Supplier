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
import { Plus, ArrowUp, ArrowDown, Trash2, LayoutGrid } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const mockRecommendations = [
  { 
    id: 1, 
    position: "首页轮播", 
    product: "故宫日历2024", 
    weight: 100,
    startTime: "2024-03-01",
    endTime: "2024-12-31",
    status: "展示中"
  },
  { 
    id: 2, 
    position: "猜你喜欢", 
    product: "天坛祈年殿积木", 
    weight: 95,
    startTime: "2024-03-05",
    endTime: "2024-06-30",
    status: "展示中"
  },
  { 
    id: 3, 
    position: "首页轮播", 
    product: "老北京布鞋", 
    weight: 80,
    startTime: "2024-03-10",
    endTime: "2024-04-10",
    status: "已结束"
  },
]

export default function GiftRecommendations() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1F1A1A]">商品推荐配置</h1>
          <p className="text-muted-foreground">配置平台各推荐位的展示商品、排序权重及展示时间。</p>
        </div>
        <Button className="bg-[#C82829] hover:bg-[#B22222]">
          <Plus className="mr-2 h-4 w-4" /> 新增推荐
        </Button>
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="p-6">
          <div className="rounded-lg border border-[#EBE5E5] overflow-hidden">
            <Table>
              <TableHeader className="bg-[#F9F8F7]">
                <TableRow className="hover:bg-transparent border-[#EBE5E5]">
                  <TableHead className="text-[#5C5454] font-medium">推荐位名称</TableHead>
                  <TableHead className="text-[#5C5454] font-medium">关联商品</TableHead>
                  <TableHead className="text-[#5C5454] font-medium">排序权重</TableHead>
                  <TableHead className="text-[#5C5454] font-medium">展示时间</TableHead>
                  <TableHead className="text-[#5C5454] font-medium">状态</TableHead>
                  <TableHead className="text-right text-[#5C5454] font-medium">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockRecommendations.map((rec) => (
                  <TableRow key={rec.id} className="border-[#EBE5E5] hover:bg-[#FFF3F3]/30 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <LayoutGrid className="w-4 h-4 text-[#C82829]" />
                        <span className="font-medium text-[#1F1A1A]">{rec.position}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-[#5C5454]">{rec.product}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[#C82829] font-bold">{rec.weight}</span>
                        <div className="flex flex-col">
                          <Button variant="ghost" size="icon" className="h-4 w-4 hover:text-[#C82829]">
                            <ArrowUp className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-4 w-4 hover:text-[#C82829]">
                            <ArrowDown className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col text-xs text-[#8F8787]">
                        <span>起：{rec.startTime}</span>
                        <span>止：{rec.endTime}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={rec.status === "展示中" 
                          ? "bg-[#52C41A]/10 text-[#52C41A] border-[#52C41A]/20" 
                          : "bg-[#F1EEEE] text-[#8F8787] border-[#EBE5E5]"
                        }
                      >
                        {rec.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="text-destructive hover:bg-red-50">
                        <Trash2 className="mr-2 h-4 w-4" /> 移除
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
