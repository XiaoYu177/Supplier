import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

type LoginMethod = "account" | "phone"

type AuthUser = {
  displayName: string
  account: string
  method: LoginMethod
}

type AuthContextValue = {
  isAuthenticated: boolean
  isReady: boolean
  user: AuthUser | null
  login: (payload: AuthUser) => void
  logout: () => void
}

const AUTH_STORAGE_KEY = "jingcai-tour-admin-auth"

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const saved = window.localStorage.getItem(AUTH_STORAGE_KEY)

    if (saved) {
      try {
        setUser(JSON.parse(saved) as AuthUser)
      } catch {
        window.localStorage.removeItem(AUTH_STORAGE_KEY)
      }
    }

    setIsReady(true)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: Boolean(user),
      isReady,
      user,
      login: (payload) => {
        setUser(payload)
        window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(payload))
      },
      logout: () => {
        setUser(null)
        window.localStorage.removeItem(AUTH_STORAGE_KEY)
      },
    }),
    [isReady, user]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }

  return context
}
