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
import { Search, Plus, Trash2, Edit, Save, X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface Category {
  id: string
  name: string
  productCount: number
  createTime: string
}

const initialCategories: Category[] = [
  { id: "C001", name: "文创周边", productCount: 12, createTime: "2024-03-01" },
  { id: "C002", name: "特色美食", productCount: 8, createTime: "2024-03-05" },
  { id: "C003", name: "服饰箱包", productCount: 5, createTime: "2024-03-10" },
  { id: "C004", name: "其他", productCount: 3, createTime: "2024-03-15" },
]

export default function GiftCategories() {
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState("")

  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return
    const newCat: Category = {
      id: `C00${categories.length + 1}`,
      name: newCategoryName,
      productCount: 0,
      createTime: new Date().toISOString().split('T')[0]
    }
    setCategories([...categories, newCat])
    setNewCategoryName("")
    setIsAddDialogOpen(false)
  }

  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter(cat => cat.id !== id))
  }

  const startEditing = (cat: Category) => {
    setEditingId(cat.id)
    setEditingName(cat.name)
  }

  const saveEdit = () => {
    if (!editingName.trim()) return
    setCategories(categories.map(cat => 
      cat.id === editingId ? { ...cat, name: editingName } : cat
    ))
    setEditingId(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1F1A1A]">分类管理</h1>
          <p className="text-muted-foreground">管理商品所属分类，支持新增、修改及删除分类名称。</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#C82829] hover:bg-[#B22222]">
              <Plus className="mr-2 h-4 w-4" /> 新增分类
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>新增分类</DialogTitle>
              <DialogDescription>
                请输入新的商品分类名称。
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  分类名称
                </Label>
                <Input
                  id="name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="col-span-3 border-[#EBE5E5]"
                  placeholder="如：数码电子"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>取消</Button>
              <Button className="bg-[#C82829] hover:bg-[#B22222]" onClick={handleAddCategory}>确认添加</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[#8F8787]" />
              <Input
                placeholder="搜索分类名称..."
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
                  <TableHead className="text-[#5C5454] font-medium">分类 ID</TableHead>
                  <TableHead className="text-[#5C5454] font-medium">分类名称</TableHead>
                  <TableHead className="text-[#5C5454] font-medium">关联商品数</TableHead>
                  <TableHead className="text-[#5C5454] font-medium">创建时间</TableHead>
                  <TableHead className="text-right text-[#5C5454] font-medium">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.map((category) => (
                  <TableRow key={category.id} className="border-[#EBE5E5] hover:bg-[#FFF3F3]/30 transition-colors">
                    <TableCell className="font-mono text-xs text-[#8F8787]">{category.id}</TableCell>
                    <TableCell>
                      {editingId === category.id ? (
                        <Input 
                          value={editingName} 
                          onChange={(e) => setEditingName(e.target.value)}
                          className="h-8 w-40 border-[#EBE5E5]"
                          autoFocus
                        />
                      ) : (
                        <span className="font-medium text-[#1F1A1A]">{category.name}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-[#5C5454]">{category.productCount}</span>
                    </TableCell>
                    <TableCell className="text-[#8F8787] text-sm">{category.createTime}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {editingId === category.id ? (
                          <>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600 hover:bg-green-50" onClick={saveEdit}>
                              <Save className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:bg-gray-50" onClick={() => setEditingId(null)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-[#5C5454] hover:bg-[#FFF3F3]" onClick={() => startEditing(category)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-destructive hover:bg-red-50"
                              onClick={() => handleDeleteCategory(category.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
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
