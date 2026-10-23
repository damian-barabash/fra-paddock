import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { sb, type Profile } from './api'

type Ctx = {
  session: Session | null
  profile: Profile | null
  loading: boolean
  reloadProfile: () => Promise<void>
  signOut: () => Promise<void>
}
const SessionCtx = createContext<Ctx | null>(null)

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const loadProfile = useCallback(async (s: Session | null) => {
    if (!s) {
      setProfile(null)
      return
    }
    const { data } = await sb.from('profiles').select('*').eq('id', s.user.id).maybeSingle()
    setProfile((data as Profile) ?? null)
  }, [])

  useEffect(() => {
    let alive = true
    sb.auth.getSession().then(async ({ data }) => {
      if (!alive) return
      setSession(data.session)
      await loadProfile(data.session)
      if (alive) setLoading(false)
    })
    const { data: sub } = sb.auth.onAuthStateChange((event, s) => {
      setSession(s)
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
        // defer: supabase-js forbids awaiting its own calls inside this callback
        setTimeout(() => loadProfile(s), 0)
      }
    })
    return () => {
      alive = false
      sub.subscription.unsubscribe()
    }
  }, [loadProfile])

  const value: Ctx = {
    session,
    profile,
    loading,
    reloadProfile: () => loadProfile(session),
    signOut: async () => {
      await sb.auth.signOut()
      window.location.hash = ''
    },
  }
  return <SessionCtx.Provider value={value}>{children}</SessionCtx.Provider>
}

export function useSession() {
  const c = useContext(SessionCtx)
  if (!c) throw new Error('useSession outside SessionProvider')
  return c
}
