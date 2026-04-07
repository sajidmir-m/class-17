import { useEffect, useMemo, useState } from 'react'
import PublicLayout from '../../components/PublicLayout'
import { supabase } from '../../lib/supabaseClient'

const PROFILE_KEY = 'main'

const fallbackProfile = {
  name: 'MD Ashique Sidique',
  title: 'Founder & Chairman',
  brief_intro:
    'Founder & Chairman of Class 17 Events, delivering strategy-led activations and on-ground execution across India.',
  about:
    'Class 17 Events is built on clear planning, disciplined execution, and measurable impact. We work across schools, retail, sports, corporate and industrial outreach — with a strong emphasis on quality teams, compliance, and consistent reporting.',
  highlights: [
    'Pan-India campaign execution across metros and tier cities',
    'School & campus activations with trained teams',
    'Retail activations, channel outreach, and promoter-led demos',
    'Operations discipline with reporting and measurable outcomes',
  ],
  phone: '',
  email: '',
  location: '',
  image_url: '/ashiq.jpeg',
  socials: {
    website: '',
    linkedin: '',
    instagram: '',
    facebook: '',
    x: '',
    youtube: '',
  },
}

const safeJsonParse = (v, fallback) => {
  if (!v) return fallback
  if (typeof v === 'object') return v
  try {
    return JSON.parse(v)
  } catch {
    return fallback
  }
}

const normalizeUrl = (u) => {
  if (!u || typeof u !== 'string') return ''
  const s = u.trim()
  if (!s) return ''
  if (s.startsWith('http://') || s.startsWith('https://')) return s
  if (s.startsWith('/')) return s
  return `https://${s}`
}

export default function Founder() {
  const [profile, setProfile] = useState(fallbackProfile)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const run = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('founder_profile')
          .select('*')
          .eq('key', PROFILE_KEY)
          .maybeSingle()

        if (error) throw error
        if (!mounted) return

        if (data) {
          setProfile({
            ...fallbackProfile,
            ...data,
            highlights: Array.isArray(data.highlights) ? data.highlights : fallbackProfile.highlights,
            socials: safeJsonParse(data.socials, fallbackProfile.socials),
            image_url: data.image_url || '/ashiq.jpeg',
          })
        } else {
          setProfile(fallbackProfile)
        }
      } catch (e) {
        console.error('Error loading founder profile:', e)
        if (mounted) setProfile(fallbackProfile)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    run()
    return () => {
      mounted = false
    }
  }, [])

  const socialLinks = useMemo(() => {
    const s = profile.socials || {}
    const items = [
      { key: 'website', label: 'Website', icon: '🌐', url: normalizeUrl(s.website) },
      { key: 'linkedin', label: 'LinkedIn', icon: '🔗', url: normalizeUrl(s.linkedin) },
      { key: 'instagram', label: 'Instagram', icon: '📷', url: normalizeUrl(s.instagram) },
      { key: 'facebook', label: 'Facebook', icon: '📘', url: normalizeUrl(s.facebook) },
      { key: 'x', label: 'X', icon: '✖️', url: normalizeUrl(s.x) },
      { key: 'youtube', label: 'YouTube', icon: '▶️', url: normalizeUrl(s.youtube) },
    ]
    return items.filter((i) => i.url)
  }, [profile.socials])

  return (
    <PublicLayout>
      <section className="py-16 md:py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-14">
            <h1 className="section-title">Founder</h1>
            <p className="text-gray-600 text-base md:text-xl max-w-3xl mx-auto">
              Leadership, vision, and operations discipline that keep campaigns consistent — across every state.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="p-6 md:p-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-4">
                  <div className="flex justify-center lg:justify-start">
                    <div className="w-56 md:w-64 aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-200 border border-gray-200 shadow-lg">
                      <img
                        src={profile.image_url || '/ashiq.jpeg'}
                        alt={profile.name || 'Founder'}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/ashiq.jpeg'
                        }}
                      />
                    </div>
                  </div>

                  <div className="mt-6 text-center lg:text-left">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{profile.name}</h2>
                    <p className="text-gray-600 font-semibold mt-1">{profile.title}</p>
                    {profile.location ? <p className="text-sm text-gray-500 mt-2">📍 {profile.location}</p> : null}
                    {profile.email ? (
                      <p className="text-sm text-gray-500 mt-1">
                        ✉️ <a className="hover:underline" href={`mailto:${profile.email}`}>{profile.email}</a>
                      </p>
                    ) : null}
                    {profile.phone ? <p className="text-sm text-gray-500 mt-1">📞 {profile.phone}</p> : null}
                  </div>

                  {socialLinks.length > 0 ? (
                    <div className="mt-6 flex flex-wrap justify-center lg:justify-start gap-2">
                      {socialLinks.map((s) => (
                        <a
                          key={s.key}
                          href={s.url}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-sm font-semibold text-gray-700 shadow-sm transition"
                        >
                          <span className="mr-2">{s.icon}</span>
                          {s.label}
                        </a>
                      ))}
                    </div>
                  ) : null}
                </div>

                <div className="lg:col-span-8 space-y-6">
                  <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100 p-6 md:p-7">
                    <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                      {profile.brief_intro}
                    </p>
                  </div>

                  <div className="prose prose-lg max-w-none">
                    <h3 className="text-gray-900">About</h3>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {profile.about}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                      <h3 className="text-lg font-bold text-gray-900 mb-3">What we maintain</h3>
                      <ul className="space-y-2">
                        {[
                          'Clear pre-activity planning & approvals',
                          'Strong promoter training & field discipline',
                          'Daily reporting with photos/videos and counts',
                          'Timelines, manpower, and vendor control',
                        ].map((t) => (
                          <li key={t} className="text-gray-700 text-sm flex gap-2">
                            <span className="text-blue-600 mt-0.5">✓</span>
                            <span>{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                      <h3 className="text-lg font-bold text-gray-900 mb-3">Highlights</h3>
                      <ul className="space-y-2">
                        {(profile.highlights || []).map((h, idx) => (
                          <li key={idx} className="text-gray-700 text-sm flex gap-2">
                            <span className="text-purple-600 mt-0.5">•</span>
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {loading ? (
                    <p className="text-xs text-gray-500">Loading profile…</p>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}

