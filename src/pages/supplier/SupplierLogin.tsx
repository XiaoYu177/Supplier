import { useEffect, useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { Check, Phone, ShieldCheck, Store } from "lucide-react"

import { useAuth } from "../../context/AuthContext"
import "./supplier-login-ref.css"

type ToastState = {
  text: string
  isError: boolean
  visible: boolean
}

export default function SupplierLogin() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [phone, setPhone] = useState("")
  const [code, setCode] = useState("")
  const [rememberPhone, setRememberPhone] = useState(true)
  const [countdown, setCountdown] = useState(0)
  const [toast, setToast] = useState<ToastState>({ text: "", isError: false, visible: false })

  useEffect(() => {
    const savedPhone = window.localStorage.getItem("supplier-login-phone")
    if (savedPhone) setPhone(savedPhone)
  }, [])

  useEffect(() => {
    if (countdown <= 0) return
    const timer = window.setInterval(() => {
      setCountdown((value) => Math.max(0, value - 1))
    }, 1000)
    return () => window.clearInterval(timer)
  }, [countdown])

  const showToast = (text: string, isError = false) => {
    setToast({ text, isError, visible: true })
    window.setTimeout(() => {
      setToast((current) => ({ ...current, visible: false }))
    }, 2200)
  }

  const handleSendCode = () => {
    if (!phone.trim()) {
      showToast("请输入手机号。", true)
      return
    }
    setCountdown(60)
    showToast("验证码已发送")
  }

  const handleLogin = (event: FormEvent) => {
    event.preventDefault()
    if (!phone.trim() || !code.trim()) {
      showToast("请输入手机号和验证码。", true)
      return
    }

    if (rememberPhone) {
      window.localStorage.setItem("supplier-login-phone", phone.trim())
    } else {
      window.localStorage.removeItem("supplier-login-phone")
    }

    login({
      displayName: "故宫文创旗舰店",
      account: phone.trim(),
      method: "phone",
    })
    showToast("登录成功，正在跳转...")
    window.setTimeout(() => navigate("/supplier", { replace: true }), 450)
  }

  return (
    <div className="supplier-login-page">
      <div className="login-wrapper">
        <div className="login-brand">
          <div className="brand-top">
            <div className="brand-logo">
              <Store size={26} />
            </div>
          </div>

          <div className="brand-content">
            <h2>
              故宫文创旗舰店
              <br />
              供应商管理后台
            </h2>
            <p>为供应商提供订单查看、打包发货、售后跟进、财务对账等一体化工作台。</p>

            <div className="brand-features">
              <div className="brand-feature">
                <Check size={16} />
                <span>专属供应商数据</span>
              </div>
              <div className="brand-feature">
                <Check size={16} />
                <span>发货流程高效可追踪</span>
              </div>
              <div className="brand-feature">
                <Check size={16} />
                <span>订单与账单实时同步</span>
              </div>
            </div>
          </div>

          <div className="brand-decoration">故</div>
        </div>

        <div className="login-form-area">
          <div className="form-header">
            <h1>欢迎回来</h1>
            <p>请登录您的供应商账号</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="form-item">
              <label>手机号</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <Phone size={16} />
                </span>
                <input
                  className="with-icon"
                  type="tel"
                  placeholder="请输入手机号"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                />
              </div>
            </div>

            <div className="form-item">
              <label>验证码</label>
              <div className="captcha-row">
                <div className="input-wrapper" style={{ flex: 1 }}>
                  <span className="input-icon">
                    <ShieldCheck size={16} />
                  </span>
                  <input
                    className="with-icon"
                    type="text"
                    placeholder="请输入验证码"
                    value={code}
                    onChange={(event) => setCode(event.target.value)}
                  />
                </div>
                <button type="button" className="sms-btn" onClick={handleSendCode} disabled={countdown > 0}>
                  {countdown > 0 ? `${countdown}s` : "获取验证码"}
                </button>
              </div>
            </div>

            <div className="options-row">
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={rememberPhone}
                  onChange={(event) => setRememberPhone(event.target.checked)}
                />
                <span>记住手机号</span>
              </label>
              <span className="hint-text">演示环境验证码可任意输入</span>
            </div>

            <button type="submit" className="login-btn">
              登 录
            </button>
          </form>

          <div className="login-footer">
            登录即表示同意 <span>《供应商服务协议》</span> 与 <span>《隐私政策》</span>
          </div>
        </div>
      </div>

      {toast.visible ? (
        <div className="supplier-login-toast-container">
          <div className={`supplier-login-toast ${toast.isError ? "error" : ""}`}>
            <div className="toast-icon">{toast.isError ? "✕" : "✓"}</div>
            <div className="toast-message">{toast.text}</div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
