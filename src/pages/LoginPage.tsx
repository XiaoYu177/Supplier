import { useEffect, useState } from "react"
import { motion } from "motion/react"
import { Landmark, LockKeyhole, ShieldCheck, Smartphone } from "lucide-react"
import { useNavigate } from "react-router-dom"

import loginBackground from "@/src/assets/login-bg.jpg"
import { useAuth } from "@/src/context/AuthContext"
import { useToast } from "@/src/context/ToastContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type LoginTab = "account" | "phone"

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { showToast } = useToast()

  const [activeTab, setActiveTab] = useState<LoginTab>("account")
  const [account, setAccount] = useState("")
  const [password, setPassword] = useState("")
  const [phone, setPhone] = useState("")
  const [code, setCode] = useState("")
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    if (countdown <= 0) {
      return
    }

    const timer = window.setTimeout(() => {
      setCountdown((value) => value - 1)
    }, 1000)

    return () => window.clearTimeout(timer)
  }, [countdown])

  const handleAccountLogin = () => {
    if (!account.trim() || !password.trim()) {
      showToast("请先填写账号和密码。", "error")
      return
    }

    login({
      displayName: "管理员",
      account: account.trim() || "admin",
      method: "account",
    })
    showToast("登录成功，欢迎进入京彩游后台。")
    navigate("/", { replace: true })
  }

  const handleSendCode = () => {
    if (!phone.trim()) {
      showToast("请先填写手机号。", "error")
      return
    }

    setCountdown(60)
    showToast("验证码已发送，请注意查收。")
  }

  const handlePhoneLogin = () => {
    if (!phone.trim() || !code.trim()) {
      showToast("请先填写手机号和验证码。", "error")
      return
    }

    login({
      displayName: "管理员",
      account: phone.trim() || "13800138000",
      method: "phone",
    })
    showToast("登录成功，欢迎进入京彩游后台。")
    navigate("/", { replace: true })
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f7e1cd]">
      <img
        src={loginBackground}
        alt="京彩游后台登录背景"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,244,232,0.18)_0%,rgba(255,244,232,0.06)_36%,rgba(100,43,17,0.12)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_32%,rgba(255,255,255,0.75),transparent_26%),radial-gradient(circle_at_88%_70%,rgba(255,243,222,0.5),transparent_18%)]" />

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
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#fff6ef] px-3 py-1 text-xs font-semibold tracking-[0.24em] text-[#9f5e3e]">
                  <Landmark className="h-3.5 w-3.5" />
                  JINGCAI YOU
                </div>
                <h1 className="text-3xl font-semibold tracking-[0.08em] text-[#5d2f1e]">
                  综合管理后台
                </h1>
                <p className="mt-2 text-sm leading-6 text-[#9a745d]">
                  京彩北京，邀您共游
                </p>
              </div>
              <div className="hidden rounded-2xl bg-[#fff7f1] p-3 text-[#b36a45] shadow-inner sm:block">
                <ShieldCheck className="h-6 w-6" />
              </div>
            </div>

            <div className="space-y-5">
              <div className="grid h-[64px] w-full grid-cols-2 rounded-[22px] bg-[#f8eee7] p-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("account")}
                  className={`rounded-[16px] px-4 text-base font-semibold transition-all ${
                    activeTab === "account"
                      ? "bg-white text-[#8a4b2f] shadow-[0_8px_18px_rgba(150,95,60,0.12)]"
                      : "text-[#7f695d]"
                  }`}
                >
                  账号密码登录
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("phone")}
                  className={`rounded-[16px] px-4 text-base font-semibold transition-all ${
                    activeTab === "phone"
                      ? "bg-white text-[#8a4b2f] shadow-[0_8px_18px_rgba(150,95,60,0.12)]"
                      : "text-[#7f695d]"
                  }`}
                >
                  手机号登录
                </button>
              </div>

              {activeTab === "account" ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#7b5542]">账号</label>
                    <div className="relative">
                      <Landmark className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#c08a6d]" />
                      <Input
                        value={account}
                        onChange={(event) => setAccount(event.target.value)}
                        placeholder="请输入账号"
                        className="h-12 rounded-2xl border-[#ead9cd] bg-white/85 pl-11 text-[#5d2f1e] placeholder:text-[#b39583]"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#7b5542]">密码</label>
                    <div className="relative">
                      <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#c08a6d]" />
                      <Input
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="请输入密码"
                        className="h-12 rounded-2xl border-[#ead9cd] bg-white/85 pl-11 text-[#5d2f1e] placeholder:text-[#b39583]"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={handleAccountLogin}
                    className="mt-2 h-12 w-full rounded-2xl bg-[linear-gradient(135deg,#bb5a35_0%,#e39b64_100%)] text-base font-semibold text-white shadow-[0_18px_32px_rgba(192,109,63,0.28)] hover:opacity-95"
                  >
                    登录
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#7b5542]">手机号</label>
                  <div className="relative">
                    <Smartphone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#c08a6d]" />
                    <Input
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      placeholder="请输入手机号"
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
                  className="mt-2 h-12 w-full rounded-2xl bg-[linear-gradient(135deg,#bb5a35_0%,#e39b64_100%)] text-base font-semibold text-white shadow-[0_18px_32px_rgba(192,109,63,0.28)] hover:opacity-95"
                >
                  登录
                </Button>
                </div>
              )}
            </div>

          </div>
        </motion.div>
      </div>
    </div>
  )
}
