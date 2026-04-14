import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, Plus, Trash2, Save, X, Upload, Image as ImageIcon } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface SKU {
  id: string
  name: string
  price: string
  stock: string
  supplierId: string
}

export default function GiftAddProduct() {
  const navigate = useNavigate()
  const [category, setCategory] = useState<string>("")
  const [skus, setSkus] = useState<SKU[]>([
    { id: "1", name: "", price: "", stock: "", supplierId: "" }
  ])
  const [mainImage, setMainImage] = useState<string | null>(null)
  const [detailImages, setDetailImages] = useState<string[]>([])
  const [highlights, setHighlights] = useState<string[]>([""])
  const [specs, setSpecs] = useState<{ name: string; value: string }[]>([{ name: "", value: "" }])
  const [purchaseGuide, setPurchaseGuide] = useState<string>("支持全国快递配送，满99元免运费，节假日提前备货，3-5个工作日送达")
  
  const [basePrice, setBasePrice] = useState<string>("")
  const [totalStock, setTotalStock] = useState<string>("")

  // 自动计算一口价和总库存
  useEffect(() => {
    // 只有当 SKU 有数据时才自动计算，避免覆盖用户可能的手动输入（如果用户正在输入）
    // 或者我们可以认为 SKU 是数据源，变动即更新
    const prices = skus
      .map(sku => parseFloat(sku.price))
      .filter(price => !isNaN(price))
    
    if (prices.length > 0) {
      const minPrice = Math.min(...prices)
      setBasePrice(minPrice.toString())
    } else {
      setBasePrice("")
    }

    const stocks = skus
      .map(sku => parseInt(sku.stock))
      .filter(stock => !isNaN(stock))
    
    const sumStock = stocks.reduce((acc, curr) => acc + curr, 0)
    setTotalStock(sumStock.toString())
  }, [skus])

  const addSku = () => {
    setSkus([...skus, { id: Math.random().toString(36).substr(2, 9), name: "", price: "", stock: "", supplierId: "" }])
  }

  const removeSku = (id: string) => {
    if (skus.length > 1) {
      setSkus(skus.filter(sku => sku.id !== id))
    }
  }

  const updateSku = (id: string, field: keyof SKU, value: string) => {
    setSkus(skus.map(sku => sku.id === id ? { ...sku, [field]: value } : sku))
  }

  const handleMainImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setMainImage(url)
    }
  }

  const handleDetailImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newUrls = Array.from(files).map(file => URL.createObjectURL(file as any))
      setDetailImages([...detailImages, ...newUrls])
    }
  }

  const removeDetailImage = (index: number) => {
    setDetailImages(detailImages.filter((_, i) => i !== index))
  }

  const addHighlight = () => {
    setHighlights([...highlights, ""])
  }

  const removeHighlight = (index: number) => {
    if (highlights.length > 1) {
      setHighlights(highlights.filter((_, i) => i !== index))
    }
  }

  const updateHighlight = (index: number, value: string) => {
    const newHighlights = [...highlights]
    newHighlights[index] = value
    setHighlights(newHighlights)
  }

  const addSpec = () => {
    setSpecs([...specs, { name: "", value: "" }])
  }

  const removeSpec = (index: number) => {
    if (specs.length > 1) {
      setSpecs(specs.filter((_, i) => i !== index))
    }
  }

  const updateSpec = (index: number, field: "name" | "value", value: string) => {
    const newSpecs = [...specs]
    newSpecs[index][field] = value
    setSpecs(newSpecs)
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/gifts/products")}
            className="hover:bg-[#FFF3F3]"
          >
            <ChevronLeft className="h-5 w-5 text-[#C82829]" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#1F1A1A]">新增商品</h1>
            <p className="text-muted-foreground">填写商品详细信息，上传图片并配置 SKU 规格。</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">基础信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">商品名称</Label>
                  <Input id="name" placeholder="请输入商品名称" className="border-[#EBE5E5]" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">商品分类</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="border-[#EBE5E5] w-full">
                      <SelectValue placeholder="选择分类" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="文创周边">文创周边</SelectItem>
                      <SelectItem value="特色美食">特色美食</SelectItem>
                      <SelectItem value="服饰箱包">服饰箱包</SelectItem>
                      <SelectItem value="其他">其他</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>商品主图</Label>
                  <span className="text-[10px] text-muted-foreground">建议 800×800，支持 JPG/PNG，最多 5 张</span>
                </div>
                <div className="flex flex-wrap gap-4">
                  {mainImage ? (
                    <div className="relative w-32 h-32 rounded-lg border border-[#EBE5E5] overflow-hidden group">
                      <img src={mainImage} alt="Main" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button variant="ghost" size="icon" className="text-white" onClick={() => setMainImage(null)}>
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <label className="w-32 h-32 flex flex-col items-center justify-center border-2 border-dashed border-[#EBE5E5] rounded-lg cursor-pointer hover:bg-[#F9F8F7] transition-colors">
                      <Upload className="h-6 w-6 text-[#8F8787] mb-2" />
                      <span className="text-xs text-[#8F8787]">上传主图</span>
                      <input type="file" className="hidden" accept="image/*" onChange={handleMainImageUpload} />
                    </label>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>商品亮点</Label>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={addHighlight}
                    className="h-7 text-xs text-[#C82829] border-[#C82829]/20 hover:bg-[#FFF3F3]"
                  >
                    <Plus className="mr-1 h-3 w-3" /> 添加亮点
                  </Button>
                </div>
                <div className="space-y-3">
                  {highlights.map((highlight, index) => (
                    <div key={index} className="flex gap-2">
                      <Input 
                        placeholder="如：非遗工艺、纯手工制作" 
                        className="border-[#EBE5E5]" 
                        value={highlight}
                        onChange={(e) => updateHighlight(index, e.target.value)}
                      />
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive shrink-0"
                        onClick={() => removeHighlight(index)}
                        disabled={highlights.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>规格参数</Label>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={addSpec}
                    className="h-7 text-xs text-[#C82829] border-[#C82829]/20 hover:bg-[#FFF3F3]"
                  >
                    <Plus className="mr-1 h-3 w-3" /> 添加参数
                  </Button>
                </div>
                <div className="rounded-lg border border-[#EBE5E5] overflow-hidden">
                  <Table>
                    <TableHeader className="bg-[#F9F8F7]">
                      <TableRow className="hover:bg-transparent border-[#EBE5E5]">
                        <TableHead className="text-xs">参数名称</TableHead>
                        <TableHead className="text-xs">参数说明</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {specs.map((spec, index) => (
                        <TableRow key={index} className="border-[#EBE5E5]">
                          <TableCell className="p-3">
                            <Input 
                              className="h-9 text-sm border-[#EBE5E5]" 
                              placeholder="如：材质" 
                              value={spec.name}
                              onChange={(e) => updateSpec(index, "name", e.target.value)}
                            />
                          </TableCell>
                          <TableCell className="p-3">
                            <Input 
                              className="h-9 text-sm border-[#EBE5E5]" 
                              placeholder="如：陶瓷" 
                              value={spec.value}
                              onChange={(e) => updateSpec(index, "value", e.target.value)}
                            />
                          </TableCell>
                          <TableCell className="p-3">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-9 w-9 text-destructive hover:bg-red-50"
                              onClick={() => removeSpec(index)}
                              disabled={specs.length === 1}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>商品详情图</Label>
                  <span className="text-[10px] text-muted-foreground">最多 10 张，展示商品详细信息</span>
                </div>
                <div className="flex flex-wrap gap-4">
                  {detailImages.map((url, index) => (
                    <div key={index} className="relative w-32 h-32 rounded-lg border border-[#EBE5E5] overflow-hidden group">
                      <img src={url} alt={`Detail ${index}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button variant="ghost" size="icon" className="text-white" onClick={() => removeDetailImage(index)}>
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <label className="w-32 h-32 flex flex-col items-center justify-center border-2 border-dashed border-[#EBE5E5] rounded-lg cursor-pointer hover:bg-[#F9F8F7] transition-colors">
                    <Plus className="h-6 w-6 text-[#8F8787] mb-2" />
                    <span className="text-xs text-[#8F8787]">添加详情图</span>
                    <input type="file" className="hidden" accept="image/*" multiple onChange={handleDetailImageUpload} />
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">商品详情描述</Label>
                <Textarea 
                  id="description" 
                  placeholder="请输入商品详细描述内容" 
                  className="min-h-[150px] border-[#EBE5E5] resize-none" 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="story">文化故事</Label>
                <Textarea 
                  id="story" 
                  placeholder="请输入商品背后的文化故事、历史渊源等" 
                  className="min-h-[150px] border-[#EBE5E5] resize-none" 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="guide">购买指南 (配送说明)</Label>
                <Textarea 
                  id="guide" 
                  placeholder="请输入购买指南、配送时效、售后说明等内容" 
                  className="min-h-[100px] border-[#EBE5E5] resize-none" 
                  value={purchaseGuide}
                  onChange={(e) => setPurchaseGuide(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">SKU 规格配置</CardTitle>
              <Button variant="outline" size="sm" onClick={addSku} className="text-[#C82829] border-[#C82829]/20 hover:bg-[#FFF3F3]">
                <Plus className="mr-1 h-3 w-3" /> 添加规格
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-[#EBE5E5] overflow-hidden">
                <Table>
                  <TableHeader className="bg-[#F9F8F7]">
                    <TableRow className="hover:bg-transparent border-[#EBE5E5]">
                      <TableHead className="text-xs">规格名称</TableHead>
                      <TableHead className="text-xs">价格 (¥)</TableHead>
                      <TableHead className="text-xs">库存</TableHead>
                      <TableHead className="text-xs">所属供应商</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {skus.map((sku) => (
                      <TableRow key={sku.id} className="border-[#EBE5E5]">
                        <TableCell className="p-3">
                          <Input 
                            className="h-9 text-sm border-[#EBE5E5]" 
                            placeholder="如：精装版" 
                            value={sku.name}
                            onChange={(e) => updateSku(sku.id, "name", e.target.value)}
                          />
                        </TableCell>
                        <TableCell className="p-3">
                          <Input 
                            className="h-9 text-sm border-[#EBE5E5]" 
                            type="number" 
                            placeholder="0.00" 
                            value={sku.price}
                            onChange={(e) => updateSku(sku.id, "price", e.target.value)}
                          />
                        </TableCell>
                        <TableCell className="p-3">
                          <Input 
                            className="h-9 text-sm border-[#EBE5E5]" 
                            type="number" 
                            placeholder="0" 
                            value={sku.stock}
                            onChange={(e) => updateSku(sku.id, "stock", e.target.value)}
                          />
                        </TableCell>
                        <TableCell className="p-3">
                          <Select value={sku.supplierId} onValueChange={(val) => updateSku(sku.id, "supplierId", val)}>
                            <SelectTrigger className="h-9 text-sm border-[#EBE5E5] w-full">
                              <SelectValue placeholder="选择供应商" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="故宫文创旗舰店">故宫文创旗舰店</SelectItem>
                              <SelectItem value="北京礼物官方店">北京礼物官方店</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="p-3">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-9 w-9 text-destructive hover:bg-red-50"
                            onClick={() => removeSku(sku.id)}
                            disabled={skus.length === 1}
                          >
                            <Trash2 className="h-4 w-4" />
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

        <div className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">价格与库存概览</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="base-price">一口价 (最低 SKU 价格)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-muted-foreground text-sm">¥</span>
                  <Input 
                    id="base-price" 
                    type="number" 
                    className="pl-7 border-[#EBE5E5]" 
                    placeholder="0.00" 
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="total-stock">总库存数量</Label>
                <Input 
                  id="total-stock" 
                  type="number" 
                  className="border-[#EBE5E5]" 
                  placeholder="0" 
                  value={totalStock}
                  onChange={(e) => setTotalStock(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">发布设置</CardTitle>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-[#C82829] hover:bg-[#B22222] h-12 text-lg">
                <Save className="mr-2 h-5 w-5" /> 保存并发布
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
