import { useState } from "react"
import { motion } from "motion/react"
import { Landmark, ShieldCheck, Smartphone } from "lucide-react"
import { useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SupplierLogin() {
  const navigate = useNavigate()

  const [phone, setPhone] = useState("")
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const [notice, setNotice] = useState("供应商账号登录，仅支持手机号 + 验证码方式。")
  const [countdown, setCountdown] = useState(0)

  const handleSendCode = () => {
    const normalizedPhone = phone.trim()

    if (!/^1\d{10}$/.test(normalizedPhone)) {
      setError("请输入正确的 11 位手机号。")
      return
    }

    setError("")
    setNotice(`验证码已发送至 ${normalizedPhone}，演示环境可输入任意 4-6 位数字登录。`)
    setCountdown(60)
  }

  const handlePhoneLogin = () => {
    const normalizedPhone = phone.trim()

    if (!/^1\d{10}$/.test(normalizedPhone)) {
      setError("请输入正确的 11 位手机号。")
      return
    }

    if (!/^\d{4,6}$/.test(code.trim())) {
      setError("请输入 4-6 位验证码。")
      return
    }

    setError("")
    setNotice("登录成功，正在进入供应商工作台。")
    navigate("/supplier", { replace: true })
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f7e1cd]">
      <div className="absolute inset-0 bg-gradient-to-br from-[#fff8f0] via-[#f7e1cd] to-[#e8c9a8]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(200,40,41,0.08),transparent_40%),radial-gradient(circle_at_80%_20%,rgba(200,40,41,0.06),transparent_35%)]" />

      <div className="relative z-10 flex min-h-screen items-center justify-end px-4 py-8 sm:px-8 lg:px-16">
        <motion.div
          initial={{ opacity: 0, x: 36 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="w-full max-w-[440px]"
        >
          <div className="rounded-[28px] border border-white/45 bg-white/72 p-6 shadow-[0_24px_90px_rgba(116,58,33,0.22)] backdrop-blur-xl sm:p-8">
            <div className="mb-8 flex items-start justify-between gap-4">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#FFF3F3] px-3 py-1 text-xs font-semibold tracking-[0.24em] text-[#C82829]">
                  <Landmark className="h-3.5 w-3.5" />
                  SUPPLIER
                </div>
                <h1 className="text-3xl font-semibold tracking-[0.08em] text-[#5d2f1e]">
                  供应商登录
                </h1>
                <p className="mt-2 text-sm leading-6 text-[#9a745d]">
                  管理您的商品订单、发货履约及财务对账。
                </p>
              </div>
              <div className="hidden rounded-2xl bg-[#FFF3F3] p-3 text-[#C82829] shadow-inner sm:block">
                <ShieldCheck className="h-6 w-6" />
              </div>
            </div>

            <Tabs defaultValue="phone" className="gap-5">
              <TabsList className="grid h-12 w-full grid-cols-1 rounded-2xl bg-[#f8eee7] p-1">
                <TabsTrigger
                  value="phone"
                  className="rounded-[14px] text-sm font-semibold data-[active]:bg-white data-[active]:text-[#8a4b2f]"
                >
                  手机号登录
                </TabsTrigger>
              </TabsList>

              <TabsContent value="phone" className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#7b5542]">手机号</label>
                  <div className="relative">
                    <Smartphone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#c08a6d]" />
                    <Input
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      placeholder="请输入绑定手机号"
                      className="h-12 rounded-2xl border-[#ead9cd] bg-white/85 pl-11 text-[#5d2f1e] placeholder:text-[#b39583]"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#7b5542]">验证码</label>
                  <div className="flex gap-3">
                    <Input
                      value={code}
                      onChange={(event) => setCode(event.target.value)}
                      placeholder="请输入验证码"
                      className="h-12 rounded-2xl border-[#ead9cd] bg-white/85 text-[#5d2f1e] placeholder:text-[#b39583]"
                    />
                    <Button
                      variant="outline"
                      onClick={handleSendCode}
                      disabled={countdown > 0}
                      className="h-12 min-w-[120px] rounded-2xl border-[#e6c7b3] bg-[#fff7f1] px-4 font-semibold text-[#9f5e3e] hover:bg-[#fff1e7]"
                    >
                      {countdown > 0 ? `${countdown}s 后重发` : "获取验证码"}
                    </Button>
                  </div>
                </div>
                <Button
                  onClick={handlePhoneLogin}
                  className="mt-2 h-12 w-full rounded-2xl bg-[linear-gradient(135deg,#C82829_0%,#8B0000_100%)] text-base font-semibold text-white shadow-[0_18px_32px_rgba(200,40,41,0.28)] hover:opacity-95"
                >
                  登录供应商后台
                </Button>
              </TabsContent>
            </Tabs>

            <div className="mt-6 rounded-2xl border border-[#f0dfd4] bg-[#fffaf6] px-4 py-3 text-sm">
              <p className="text-[#8c624d]">{notice}</p>
              {error ? <p className="mt-1 text-[#c14a3a]">{error}</p> : null}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
