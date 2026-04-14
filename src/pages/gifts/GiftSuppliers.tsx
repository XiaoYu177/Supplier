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
import { Search, Plus, MoreHorizontal, Edit, Lock, Unlock, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Supplier {
  id: string
  name: string
  contact: string
  phone: string
  productCount: number
  joinDate: string
  status: string
}

const initialSuppliers: Supplier[] = [
  { 
    id: "S001", 
    name: "故宫文创旗舰店", 
    contact: "王经理",
    phone: "13800138000",
    productCount: 24,
    joinDate: "2023-01-15",
    status: "正常"
  },
  { 
    id: "S002", 
    name: "北京礼物官方店", 
    contact: "李主管",
    phone: "13911112222",
    productCount: 15,
    joinDate: "2023-03-20",
    status: "正常"
  },
  { 
    id: "S003", 
    name: "老北京布鞋坊", 
    contact: "张老板",
    phone: "13688889999",
    productCount: 8,
    joinDate: "2023-05-10",
    status: "冻结"
  },
]

export default function GiftSuppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)
  
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    phone: "",
    status: "正常"
  })

  const filteredSuppliers = suppliers.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.contact.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleOpenAdd = () => {
    setEditingSupplier(null)
    setFormData({
      name: "",
      contact: "",
      phone: "",
      status: "正常"
    })
    setIsDialogOpen(true)
  }

  const handleOpenEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier)
    setFormData({
      name: supplier.name,
      contact: supplier.contact,
      phone: supplier.phone,
      status: supplier.status
    })
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    if (!formData.name || !formData.contact || !formData.phone) return

    if (editingSupplier) {
      setSuppliers(suppliers.map(s => 
        s.id === editingSupplier.id ? { ...s, ...formData } : s
      ))
    } else {
      const newSupplier: Supplier = {
        id: `S00${suppliers.length + 1}`,
        ...formData,
        productCount: 0,
        joinDate: new Date().toISOString().split('T')[0]
      }
      setSuppliers([...suppliers, newSupplier])
    }
    setIsDialogOpen(false)
  }

  const toggleStatus = (supplier: Supplier) => {
    const newStatus = supplier.status === "正常" ? "冻结" : "正常"
    setSuppliers(suppliers.map(s => 
      s.id === supplier.id ? { ...s, status: newStatus } : s
    ))
  }

  const handleDelete = (id: string) => {
    setSuppliers(suppliers.filter(s => s.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1F1A1A]">供应商管理</h1>
          <p className="text-muted-foreground">管理入驻平台的供应商，配置分佣比例及账号状态。</p>
        </div>
        <Button className="bg-[#C82829] hover:bg-[#B22222]" onClick={handleOpenAdd}>
          <Plus className="mr-2 h-4 w-4" /> 新增入驻
        </Button>
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[#8F8787]" />
              <Input
                placeholder="搜索供应商名称、联系人..."
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
                  <TableHead className="text-[#5C5454] font-medium">供应商 ID</TableHead>
                  <TableHead className="text-[#5C5454] font-medium">供应商名称</TableHead>
                  <TableHead className="text-[#5C5454] font-medium">联系人信息</TableHead>
                  <TableHead className="text-[#5C5454] font-medium">在售商品数</TableHead>
                  <TableHead className="text-[#5C5454] font-medium">入驻时间</TableHead>
                  <TableHead className="text-[#5C5454] font-medium">状态</TableHead>
                  <TableHead className="text-right text-[#5C5454] font-medium">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSuppliers.map((supplier) => (
                  <TableRow key={supplier.id} className="border-[#EBE5E5] hover:bg-[#FFF3F3]/30 transition-colors">
                    <TableCell className="font-mono text-xs text-[#8F8787]">{supplier.id}</TableCell>
                    <TableCell className="font-medium text-[#1F1A1A]">{supplier.name}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm text-[#1F1A1A]">{supplier.contact}</span>
                        <span className="text-xs text-[#8F8787]">{supplier.phone}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-[#5C5454] font-medium">{supplier.productCount}</TableCell>
                    <TableCell className="text-[#8F8787] text-sm">{supplier.joinDate}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={supplier.status === "正常" 
                          ? "bg-[#52C41A]/10 text-[#52C41A] border-[#52C41A]/20" 
                          : "bg-[#FAAD14]/10 text-[#FAAD14] border-[#FAAD14]/20"
                        }
                      >
                        {supplier.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 px-3 text-[#5C5454] border-[#EBE5E5] hover:bg-[#FFF3F3] hover:text-[#C82829] hover:border-[#C82829]/20" 
                        onClick={() => handleOpenEdit(supplier)}
                      >
                        <Edit className="mr-1.5 h-3.5 w-3.5" /> 编辑
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
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingSupplier ? "编辑供应商" : "新增供应商入驻"}</DialogTitle>
            <DialogDescription>
              请填写供应商的基本信息及账号状态。
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">供应商名称</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="col-span-3 border-[#EBE5E5]"
                placeholder="请输入供应商全称"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="contact" className="text-right">联系人</Label>
              <Input
                id="contact"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                className="col-span-3 border-[#EBE5E5]"
                placeholder="请输入联系人姓名"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">联系电话</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="col-span-3 border-[#EBE5E5]"
                placeholder="请输入联系电话"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">账号状态</Label>
              <div className="col-span-3">
                <Select 
                  value={formData.status} 
                  onValueChange={(val) => setFormData({ ...formData, status: val })}
                >
                  <SelectTrigger className="border-[#EBE5E5] w-full">
                    <SelectValue placeholder="选择状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="正常">正常</SelectItem>
                    <SelectItem value="冻结">冻结</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>取消</Button>
            <Button className="bg-[#C82829] hover:bg-[#B22222]" onClick={handleSave}>
              {editingSupplier ? "保存修改" : "确认入驻"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
