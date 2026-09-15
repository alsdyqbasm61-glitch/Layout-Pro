import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import './style.css'

export default function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function login(event) {
    event.preventDefault()
    setError('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
    }
  }

  async function logout() {
    await supabase.auth.signOut()
  }

  if (loading) {
    return <div className="loading">جاري تحميل نسق برو...</div>
  }

  if (!session) {
    return (
      <main className="login">
        <div className="box">
          <div className="logo">ن</div>

          <h1>نسق برو</h1>
          <p>نظام إدارة المنشآت الذكي</p>

          <form onSubmit={login}>
            <label>البريد الإلكتروني</label>

            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="sad@gmil.com"
              required
            />

            <label>كلمة المرور</label>

            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="أدخل كلمة المرور"
              required
            />

            {error && <div className="error">{error}</div>}

            <button type="submit">تسجيل الدخول</button>
          </form>
        </div>
      </main>
    )
  }

  return (
    <main className="app">
      <header>
        <div>
          <h1>نسق برو</h1>
          <p>نظام إدارة المنشآت الذكي</p>
        </div>

        <button onClick={logout}>تسجيل الخروج</button>
      </header>

      <section className="welcome">
        <h2>مرحبًا بك 👋</h2>
        <p>{session.user.email}</p>
        <strong>نسق برو — الفرع الرئيسي</strong>
      </section>

      <section className="grid">
        <div>
          🏢
          <h3>المنشأة</h3>
          <p>إدارة المنشأة والفروع</p>
        </div>

        <div>
          📦
          <h3>المخزون</h3>
          <p>إدارة المنتجات والمخزون</p>
        </div>

        <div>
          💰
          <h3>المبيعات</h3>
          <p>الفواتير والمبيعات</p>
        </div>

        <div>
          🛒
          <h3>المشتريات</h3>
          <p>الموردون والمشتريات</p>
        </div>

        <div>
          👥
          <h3>العملاء</h3>
          <p>إدارة العملاء والحسابات</p>
        </div>

        <div>
          📊
          <h3>التقارير</h3>
          <p>التقارير والإحصائيات</p>
        </div>
      </section>
    </main>
  )
}
