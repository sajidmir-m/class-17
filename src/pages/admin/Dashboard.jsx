import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import AdminLayout from '../../components/AdminLayout'

export default function Dashboard() {
  const [stats, setStats] = useState({
    events: 0,
    clients: 0,
    jobs: 0,
    applications: 0,
    news: 0,
    messages: 0,
    stateWorks: 0,
  })
  const [recent, setRecent] = useState({
    events: [],
    messages: [],
    applications: [],
    stateWorks: [],
  })
  const [loading, setLoading] = useState(true)

  const statCards = useMemo(
    () => [
      { label: 'Total Events', value: stats.events, icon: '🎉', gradient: 'from-blue-500 to-cyan-500', to: '/admin/events' },
      { label: 'Total Clients', value: stats.clients, icon: '🏢', gradient: 'from-green-500 to-emerald-500', to: '/admin/clients' },
      { label: 'Total Jobs', value: stats.jobs, icon: '💼', gradient: 'from-purple-500 to-pink-500', to: '/admin/jobs' },
      { label: 'Applications', value: stats.applications, icon: '📨', gradient: 'from-orange-500 to-red-500', to: '/admin/applications' },
      { label: 'News Posts', value: stats.news, icon: '📰', gradient: 'from-indigo-500 to-violet-500', to: '/admin/news' },
      { label: 'Messages', value: stats.messages, icon: '✉️', gradient: 'from-rose-500 to-fuchsia-500', to: '/admin/messages' },
      { label: 'State Works', value: stats.stateWorks, icon: '📍', gradient: 'from-sky-500 to-blue-600', to: '/admin/state-works' },
    ],
    [stats]
  )

  useEffect(() => {
    let mounted = true

    const run = async () => {
      try {
        setLoading(true)

        const [
          eventsRes,
          clientsRes,
          jobsRes,
          applicationsRes,
          newsRes,
          messagesRes,
          stateWorksRes,
          recentEventsRes,
          recentMessagesRes,
          recentApplicationsRes,
          recentStateWorksRes,
        ] = await Promise.all([
          supabase.from('events').select('id', { count: 'exact', head: true }),
          supabase.from('clients').select('id', { count: 'exact', head: true }),
          supabase.from('jobs').select('id', { count: 'exact', head: true }),
          supabase.from('applications').select('id', { count: 'exact', head: true }),
          supabase.from('news').select('id', { count: 'exact', head: true }),
          supabase.from('messages').select('id', { count: 'exact', head: true }),
          supabase.from('state_works').select('id', { count: 'exact', head: true }),
          supabase.from('events').select('id, title, created_at').order('created_at', { ascending: false }).limit(5),
          supabase.from('messages').select('id, name, email, created_at').order('created_at', { ascending: false }).limit(5),
          supabase.from('applications').select('id, name, email, created_at').order('created_at', { ascending: false }).limit(5),
          supabase.from('state_works').select('id, state, title, created_at, slug').order('created_at', { ascending: false }).limit(5),
        ])

        if (!mounted) return

        setStats({
          events: eventsRes.count || 0,
          clients: clientsRes.count || 0,
          jobs: jobsRes.count || 0,
          applications: applicationsRes.count || 0,
          news: newsRes.count || 0,
          messages: messagesRes.count || 0,
          stateWorks: stateWorksRes.count || 0,
        })

        setRecent({
          events: recentEventsRes.data || [],
          messages: recentMessagesRes.data || [],
          applications: recentApplicationsRes.data || [],
          stateWorks: recentStateWorksRes.data || [],
        })
      } catch (e) {
        console.error('Error loading dashboard:', e)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    run()

    return () => {
      mounted = false
    }
  }, [])

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-gray-400">Manage events, clients, jobs, messages, and state-wise work.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/admin/events" className="btn-modern bg-white/10 text-white border border-white/15 hover:bg-white/15 text-sm">
              + Add Event
            </Link>
            <Link to="/admin/clients" className="btn-modern bg-white/10 text-white border border-white/15 hover:bg-white/15 text-sm">
              + Add Client
            </Link>
            <Link to="/admin/state-works" className="btn-modern bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg text-sm">
              + Add State Work
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              {statCards.map((stat) => (
                <Link
                  key={stat.label}
                  to={stat.to}
                  className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-gray-400 text-sm font-medium mb-2">{stat.label}</p>
                      <p className="text-4xl font-bold text-white">{stat.value}</p>
                    </div>
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center text-3xl shadow-lg`}>
                      {stat.icon}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="bg-gray-900/60 border border-gray-700/60 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white">Recent State Works</h2>
                  <Link to="/admin/state-works" className="text-sm text-blue-400 hover:text-blue-300">
                    Manage →
                  </Link>
                </div>
                {recent.stateWorks.length > 0 ? (
                  <div className="space-y-3">
                    {recent.stateWorks.map((w) => (
                      <div key={w.id} className="flex items-start justify-between gap-4 bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
                        <div>
                          <p className="text-white font-medium">{w.state}</p>
                          <p className="text-gray-400 text-sm">{w.title || 'Untitled work'}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-400 text-xs">{w.created_at ? new Date(w.created_at).toLocaleDateString() : ''}</p>
                          <p className="text-gray-500 text-xs">/{w.slug}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">No state works yet. Add your first one.</p>
                )}
              </div>

              <div className="bg-gray-900/60 border border-gray-700/60 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white">Recent Messages</h2>
                  <Link to="/admin/messages" className="text-sm text-blue-400 hover:text-blue-300">
                    View →
                  </Link>
                </div>
                {recent.messages.length > 0 ? (
                  <div className="space-y-3">
                    {recent.messages.map((m) => (
                      <div key={m.id} className="flex items-start justify-between gap-4 bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
                        <div>
                          <p className="text-white font-medium">{m.name || 'Unknown'}</p>
                          <p className="text-gray-400 text-sm">{m.email || ''}</p>
                        </div>
                        <p className="text-gray-400 text-xs">{m.created_at ? new Date(m.created_at).toLocaleDateString() : ''}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">No messages yet.</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="bg-gray-900/60 border border-gray-700/60 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white">Recent Events</h2>
                  <Link to="/admin/events" className="text-sm text-blue-400 hover:text-blue-300">
                    Manage →
                  </Link>
                </div>
                {recent.events.length > 0 ? (
                  <div className="space-y-3">
                    {recent.events.map((e) => (
                      <div key={e.id} className="flex items-start justify-between gap-4 bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
                        <div>
                          <p className="text-white font-medium">{e.title || 'Untitled event'}</p>
                        </div>
                        <p className="text-gray-400 text-xs">{e.created_at ? new Date(e.created_at).toLocaleDateString() : ''}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">No events yet.</p>
                )}
              </div>

              <div className="bg-gray-900/60 border border-gray-700/60 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white">Recent Applications</h2>
                  <Link to="/admin/applications" className="text-sm text-blue-400 hover:text-blue-300">
                    View →
                  </Link>
                </div>
                {recent.applications.length > 0 ? (
                  <div className="space-y-3">
                    {recent.applications.map((a) => (
                      <div key={a.id} className="flex items-start justify-between gap-4 bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
                        <div>
                          <p className="text-white font-medium">{a.name || 'Unknown'}</p>
                          <p className="text-gray-400 text-sm">{a.email || ''}</p>
                        </div>
                        <p className="text-gray-400 text-xs">{a.created_at ? new Date(a.created_at).toLocaleDateString() : ''}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">No applications yet.</p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  )
}
