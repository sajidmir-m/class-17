import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { isStaff } from '../lib/auth'

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true)
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    let mounted = true

    const verify = async (session) => {
      const ok = await isStaff(session?.user?.id)
      if (!mounted) return
      setAllowed(ok)
      setLoading(false)
    }

    supabase.auth.getSession().then(({ data: { session } }) => verify(session))

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      verify(session)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!allowed) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}
