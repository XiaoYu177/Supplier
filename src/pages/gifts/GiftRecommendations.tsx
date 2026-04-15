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
import { Plus, Trash2, Edit, Settings2, LayoutList } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const mockRecommendations = [
  { 
    id: 1, 
    weight: 100,
    product: "故宫日历2024", 
    supplier: "故宫文创旗舰店",
    position: "商城首页",
    startTime: "2024-03-01",
    endTime: "永久",
    status: "展示中"
  },
  { 
    id: 2, 
    weight: 95,
    product: "天坛祈年殿积木", 
    supplier: "北京礼物官方店",
    position: "猜你喜欢",
    startTime: "2024-03-05",
    endTime: "2024-06-30",
    status: "展示中"
  },
  { 
    id: 3, 
    weight: 80,
    product: "老北京布鞋", 
    supplier: "老北京布鞋坊",
    position: "商城首页",
    startTime: "2024-03-10",
    endTime: "2024-04-10",
    status: "已过期"
  },
]

export default function GiftRecommendations() {
  const [displayOrder, setDisplayOrder] = useState("上架时间")
  const [categoryOrder, setCategoryOrder] = useState("后台配置的分类")
  
  const [isDisplayOrderDialogOpen, setIsDisplayOrderDialogOpen] = useState(false)
  const [tempDisplayOrder, setTempDisplayOrder] = useState("上架时间")
  
  const [isCategoryOrderDialogOpen, setIsCategoryOrderDialogOpen] = useState(false)
  const [categories, setCategories] = useState([
    { id: 1, name: "文创周边" },
    { id: 2, name: "特色美食" },
    { id: 3, name: "工艺手作" },
    { id: 4, name: "纪念服饰" },
  ])
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedItemToDelete, setSelectedItemToDelete] = useState<number | null>(null)
  
  const [formData, setFormData] = useState({
    product: "",
    position: "商城首页",
    weight: "1",
    displayStatus: "立即展示",
    displayTimeType: "永久",
    startTime: "",
    endTime: ""
  })

  const handleDeleteClick = (id: number) => {
    setSelectedItemToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    // Perform delete action here
    console.log("Deleted item:", selectedItemToDelete)
    setIsDeleteDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1F1A1A]">礼物推荐</h1>
          <p className="text-muted-foreground">配置礼物展示顺序、分类顺序以及推荐位的展示商品。</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <LayoutList className="w-4 h-4 text-[#C82829]" />
              礼物展示顺序
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between bg-[#F9F8F7] p-4 rounded-lg border border-[#EBE5E5]">
              <div className="flex flex-col gap-1">
                <span className="text-sm text-[#8F8787]">当前排序方式</span>
                <span className="font-medium text-[#1F1A1A]">按{displayOrder}展示</span>
              </div>
              <Button variant="outline" size="sm" onClick={() => {
                setTempDisplayOrder(displayOrder)
                setIsDisplayOrderDialogOpen(true)
              }}>
                <Edit className="w-4 h-4 mr-2" />
                编辑
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <LayoutList className="w-4 h-4 text-[#C82829]" />
              礼物分类顺序
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between bg-[#F9F8F7] p-4 rounded-lg border border-[#EBE5E5]">
              <div className="flex flex-col gap-1">
                <span className="text-sm text-[#8F8787]">当前排序方式</span>
                <span className="font-medium text-[#1F1A1A]">按{categoryOrder}展示</span>
              </div>
              <Button variant="outline" size="sm" onClick={() => setIsCategoryOrderDialogOpen(true)}>
                <Edit className="w-4 h-4 mr-2" />
                编辑
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-lg font-bold">推荐商品记录</CardTitle>
          <Button className="bg-[#C82829] hover:bg-[#B22222]" onClick={() => {
            setEditingId(null)
            setFormData({
              product: "",
              position: "商城首页",
              weight: "1",
              displayStatus: "立即展示",
              displayTimeType: "永久",
              startTime: "",
              endTime: ""
            })
            setIsAddDialogOpen(true)
          }}>
            <Plus className="mr-2 h-4 w-4" /> 新增推荐
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-[#EBE5E5] overflow-hidden">
            <Table>
              <TableHeader className="bg-[#F9F8F7]">
                <TableRow className="hover:bg-transparent border-[#EBE5E5]">
                  <TableHead className="text-[#5C5454] font-medium">权重</TableHead>
                  <TableHead className="text-[#5C5454] font-medium">商品信息</TableHead>
                  <TableHead className="text-[#5C5454] font-medium">供应商</TableHead>
                  <TableHead className="text-[#5C5454] font-medium">推荐位置</TableHead>
                  <TableHead className="text-[#5C5454] font-medium">展示时间</TableHead>
                  <TableHead className="text-[#5C5454] font-medium">状态</TableHead>
                  <TableHead className="text-right text-[#5C5454] font-medium">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockRecommendations.map((rec) => (
                  <TableRow key={rec.id} className="border-[#EBE5E5] hover:bg-[#FFF3F3]/30 transition-colors">
                    <TableCell>
                      <span className="font-mono text-[#C82829] font-bold">{rec.weight}</span>
                    </TableCell>
                    <TableCell className="font-medium text-[#1F1A1A]">{rec.product}</TableCell>
                    <TableCell className="text-[#5C5454]">{rec.supplier}</TableCell>
                    <TableCell className="text-[#5C5454]">{rec.position}</TableCell>
                    <TableCell>
                      <div className="flex flex-col text-xs text-[#8F8787]">
                        {rec.endTime === "永久" ? (
                          <span>永久展示</span>
                        ) : (
                          <>
                            <span>起：{rec.startTime}</span>
                            <span>止：{rec.endTime}</span>
                          </>
                        )}
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
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 px-3 text-[#C82829] border-[#C82829]/20 hover:bg-[#C82829] hover:text-white transition-all"
                          onClick={() => {
                            setEditingId(rec.id)
                            setFormData({
                              product: rec.product,
                              position: rec.position,
                              weight: rec.weight.toString(),
                              displayStatus: rec.status === "展示中" ? "立即展示" : "定时展示",
                              displayTimeType: rec.endTime === "永久" ? "永久" : "自定义时间",
                              startTime: rec.startTime || "",
                              endTime: rec.endTime === "永久" ? "" : rec.endTime
                            })
                            setIsAddDialogOpen(true)
                          }}
                        >
                          <Edit className="mr-1 h-3 w-3" /> 编辑
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-destructive hover:bg-red-50" 
                          onClick={() => handleDeleteClick(rec.id)}
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

      {/* 编辑展示顺序弹窗 */}
      <Dialog open={isDisplayOrderDialogOpen} onOpenChange={setIsDisplayOrderDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>编辑礼物展示顺序</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <RadioGroup value={tempDisplayOrder} onValueChange={setTempDisplayOrder} className="flex flex-col gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="上架时间" id="order-time" />
                <Label htmlFor="order-time">按上架时间展示</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="销量" id="order-sales" />
                <Label htmlFor="order-sales">按销量展示</Label>
              </div>
            </RadioGroup>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDisplayOrderDialogOpen(false)}>取消</Button>
            <Button className="bg-[#C82829] hover:bg-[#C82829]/90 text-white" onClick={() => {
              setDisplayOrder(tempDisplayOrder)
              setIsDisplayOrderDialogOpen(false)
            }}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 编辑分类顺序弹窗 */}
      <Dialog open={isCategoryOrderDialogOpen} onOpenChange={setIsCategoryOrderDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>编辑礼物分类顺序</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="border border-[#EBE5E5] rounded-md divide-y divide-[#EBE5E5]">
              {categories.map((cat, index) => (
                <div key={cat.id} className="flex items-center justify-between p-3 bg-white hover:bg-[#F9F8F7] transition-colors">
                  <span className="text-sm font-medium text-[#1F1A1A]">{cat.name}</span>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      disabled={index === 0}
                      onClick={() => {
                        const newCats = [...categories];
                        [newCats[index - 1], newCats[index]] = [newCats[index], newCats[index - 1]];
                        setCategories(newCats);
                      }}
                    >
                      上移
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      disabled={index === categories.length - 1}
                      onClick={() => {
                        const newCats = [...categories];
                        [newCats[index + 1], newCats[index]] = [newCats[index], newCats[index + 1]];
                        setCategories(newCats);
                      }}
                    >
                      下移
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCategoryOrderDialogOpen(false)}>取消</Button>
            <Button className="bg-[#C82829] hover:bg-[#C82829]/90 text-white" onClick={() => {
              setCategoryOrder("自定义排序")
              setIsCategoryOrderDialogOpen(false)
            }}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 新增/编辑推荐弹窗 */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingId ? "编辑推荐" : "新增推荐"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="product">选择商品</Label>
              <Select value={formData.product} onValueChange={(v) => setFormData({...formData, product: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择要推荐的商品" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="故宫日历2024">故宫日历2024</SelectItem>
                  <SelectItem value="天坛祈年殿积木">天坛祈年殿积木</SelectItem>
                  <SelectItem value="老北京布鞋">老北京布鞋</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="position">推荐位置</Label>
              <Select value={formData.position} onValueChange={(v) => setFormData({...formData, position: v})}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择推荐位置" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="商城首页">商城首页</SelectItem>
                  <SelectItem value="猜你喜欢">猜你喜欢</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="weight">排序权重</Label>
              <Input 
                id="weight" 
                type="number" 
                value={formData.weight} 
                onChange={(e) => setFormData({...formData, weight: e.target.value})}
                placeholder="数字越大越靠前" 
              />
              <p className="text-xs text-muted-foreground">数字越大越靠前</p>
            </div>

            <div className="grid gap-3">
              <Label>展示状态</Label>
              <RadioGroup 
                value={formData.displayStatus} 
                onValueChange={(v) => setFormData({...formData, displayStatus: v})}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="立即展示" id="status-immediate" />
                  <Label htmlFor="status-immediate" className="font-normal">立即展示</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="定时展示" id="status-scheduled" />
                  <Label htmlFor="status-scheduled" className="font-normal">定时展示</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid gap-3">
              <Label>展示时间</Label>
              <RadioGroup 
                value={formData.displayTimeType} 
                onValueChange={(v) => setFormData({...formData, displayTimeType: v})}
                className="flex gap-4 mb-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="永久" id="time-permanent" />
                  <Label htmlFor="time-permanent" className="font-normal">永久</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="自定义时间" id="time-custom" />
                  <Label htmlFor="time-custom" className="font-normal">自定义时间</Label>
                </div>
              </RadioGroup>
              
              {formData.displayTimeType === "自定义时间" && (
                <div className="flex items-center gap-2">
                  <Input 
                    type="date" 
                    value={formData.startTime}
                    onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                  />
                  <span className="text-muted-foreground">至</span>
                  <Input 
                    type="date" 
                    value={formData.endTime}
                    onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                  />
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>取消</Button>
            <Button className="bg-[#C82829] hover:bg-[#C82829]/90 text-white" onClick={() => setIsAddDialogOpen(false)}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 删除确认弹窗 */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除该推荐商品吗？</AlertDialogTitle>
            <AlertDialogDescription>
              删除后该商品将不再在推荐位展示，此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive hover:bg-destructive/90 text-white" onClick={confirmDelete}>
              确认删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
