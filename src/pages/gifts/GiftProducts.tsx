import { useState } from "react"
import { useNavigate } from "react-router-dom"
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
import { Search, Plus, Edit, Trash2, AlertTriangle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ProductForm } from "./GiftAddProduct"

const mockProducts = [
  { 
    id: "G001", 
    name: "故宫日历2024", 
    image: "https://picsum.photos/seed/gift1/40/40",
    price: "¥98.00",
    remainingStock: 1200,
    supplier: "故宫文创旗舰店",
    status: "已上架",
    createTime: "2024-03-01"
  },
  { 
    id: "G002", 
    name: "天坛祈年殿积木", 
    image: "https://picsum.photos/seed/gift2/40/40",
    price: "¥199.00",
    remainingStock: 850,
    supplier: "北京礼物官方店",
    status: "已上架",
    createTime: "2024-03-05"
  },
  { 
    id: "G003", 
    name: "老北京布鞋", 
    image: "https://picsum.photos/seed/gift3/40/40",
    price: "¥120.00",
    remainingStock: 400,
    supplier: "老北京布鞋坊",
    status: "已下架",
    createTime: "2024-03-10"
  },
]

export default function GiftProducts() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("全部状态")
  const [editingProductId, setEditingProductId] = useState<string | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  
  const navigate = useNavigate()

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.supplier.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "全部状态" || product.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleEdit = (id: string) => {
    setEditingProductId(id)
    setIsEditDialogOpen(true)
  }

  const handleAdd = () => {
    setEditingProductId(null)
    setIsEditDialogOpen(true)
  }

  const handleDeleteClick = (id: string) => {
    setDeletingProductId(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    // 模拟删除逻辑
    console.log("Deleting product:", deletingProductId)
    setIsDeleteDialogOpen(false)
    setDeletingProductId(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1F1A1A]">商品管理</h1>
          <p className="text-muted-foreground">管理平台礼物库，配置商品信息、价格及库存。</p>
        </div>
        
        <Button 
          className="bg-[#C82829] hover:bg-[#B22222]"
          onClick={handleAdd}
        >
          <Plus className="mr-2 h-4 w-4" /> 新增商品
        </Button>
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[#8F8787]" />
              <Input
                placeholder="搜索商品名称、供应商..."
                className="pl-8 border-[#EBE5E5] focus-visible:ring-[#C82829]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-[160px]">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="border-[#EBE5E5] w-full">
                  <SelectValue placeholder="全部状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="全部状态">全部状态</SelectItem>
                  <SelectItem value="已上架">已上架</SelectItem>
                  <SelectItem value="已下架">已下架</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-lg border border-[#EBE5E5] overflow-hidden">
            <Table>
              <TableHeader className="bg-[#F9F8F7]">
                <TableRow className="hover:bg-transparent border-[#EBE5E5]">
                  <TableHead className="text-[#5C5454] font-medium">商品 ID</TableHead>
                  <TableHead className="text-[#5C5454] font-medium">商品信息</TableHead>
                  <TableHead className="text-[#5C5454] font-medium">售价</TableHead>
                  <TableHead className="text-[#5C5454] font-medium">剩余库存</TableHead>
                  <TableHead className="text-[#5C5454] font-medium">所属供应商</TableHead>
                  <TableHead className="text-[#5C5454] font-medium">状态</TableHead>
                  <TableHead className="text-[#5C5454] font-medium">创建时间</TableHead>
                  <TableHead className="text-right text-[#5C5454] font-medium">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id} className="border-[#EBE5E5] hover:bg-[#FFF3F3]/30 transition-colors">
                    <TableCell className="font-mono text-xs text-[#8F8787]">{product.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-10 h-10 rounded-md object-cover border border-[#EBE5E5]"
                          referrerPolicy="no-referrer"
                        />
                        <span className="font-medium text-[#1F1A1A]">{product.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-bold text-[#C82829]">{product.price}</span>
                    </TableCell>
                    <TableCell>
                      <span className={`text-sm font-medium ${product.remainingStock < 500 ? "text-[#FAAD14]" : "text-[#52C41A]"}`}>
                        {product.remainingStock}
                      </span>
                    </TableCell>
                    <TableCell className="text-[#5C5454]">{product.supplier}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={product.status === "已上架" 
                          ? "bg-[#FFF3F3] text-[#C82829] border-[#C82829]/20" 
                          : "bg-[#F1EEEE] text-[#8F8787] border-[#EBE5E5]"
                        }
                      >
                        {product.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[#8F8787] text-sm">{product.createTime}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 px-3 text-[#C82829] border-[#C82829]/20 hover:bg-[#C82829] hover:text-white transition-all"
                          onClick={() => handleEdit(product.id)}
                        >
                          <Edit className="mr-1 h-3 w-3" /> 编辑
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-destructive hover:bg-red-50"
                          onClick={() => handleDeleteClick(product.id)}
                        >
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

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-[95vw] xl:max-w-7xl h-[90vh] p-0 gap-0 overflow-hidden border-none shadow-2xl flex flex-col">
          <DialogHeader className="p-6 border-b bg-white shrink-0 flex-none">
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Edit className="w-5 h-5 text-[#C82829]" />
              {editingProductId ? "编辑商品" : "新增商品"}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto bg-[#F9F8F7]">
            <ProductForm 
              productId={editingProductId || undefined} 
              isModal={true}
              onSuccess={() => setIsEditDialogOpen(false)}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* 删除确认弹窗 */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="border-none shadow-2xl">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 text-destructive mb-2">
              <div className="bg-red-100 p-2 rounded-full">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <AlertDialogTitle className="text-xl">确认删除商品？</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-base text-[#5C5454]">
              此操作将永久删除该商品及其关联的 SKU 信息，且无法撤销。请确认是否继续？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6">
            <AlertDialogCancel className="border-[#EBE5E5] hover:bg-[#F9F8F7]">取消</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-[#C82829] hover:bg-[#B22222] text-white"
              onClick={confirmDelete}
            >
              确认删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
