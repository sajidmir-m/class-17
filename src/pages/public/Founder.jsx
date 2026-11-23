import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import PublicLayout from '../../components/PublicLayout'
import { CtaBand, Icon } from '../../components/ui'
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

  useEffect(() => {
    let mounted = true
    const run = async () => {
      try {
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
      }
    }
    run()
    return () => {
      mounted = false
    }
  }, [])

  const socialLinks = useMemo(() => {
    const s = profile.socials || {}
    return [
      { key: 'website', label: 'Website', url: normalizeUrl(s.website) },
      { key: 'linkedin', label: 'LinkedIn', url: normalizeUrl(s.linkedin) },
      { key: 'instagram', label: 'Instagram', url: normalizeUrl(s.instagram) },
      { key: 'facebook', label: 'Facebook', url: normalizeUrl(s.facebook) },
      { key: 'x', label: 'X', url: normalizeUrl(s.x) },
      { key: 'youtube', label: 'YouTube', url: normalizeUrl(s.youtube) },
    ].filter((i) => i.url)
  }, [profile.socials])

  const principles = [
    'Clear pre-activity planning and approvals',
    'Strong promoter training and field discipline',
    'Daily reporting with photos, videos and counts',
    'Firm control of timelines, manpower and vendors',
  ]

  return (
    <PublicLayout>
      <section className="relative overflow-hidden bg-ink-950 pb-24 pt-36 md:pb-32 md:pt-44">
        <div className="absolute -left-40 top-20 h-[520px] w-[520px] rounded-full bg-gold-500/10 blur-[140px]" />
        <div className="grain absolute inset-0 opacity-[0.04] mix-blend-overlay" />

        <div className="container-x relative grid grid-cols-1 items-center gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="relative mx-auto w-full max-w-md animate-fade-up">
              <div className="absolute -bottom-5 -right-5 h-full w-full rounded-2xl border border-gold-400/50" />
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-ink-800 shadow-2xl">
                <img
                  src={profile.image_url || '/ashiq.jpeg'}
                  alt={profile.name}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/ashiq.jpeg'
                  }}
                />
              </div>
            </div>
          </div>

          <div className="animate-fade-up [animation-delay:150ms] lg:col-span-7">
            <p className="eyebrow mb-6">{profile.title}</p>
            <h1 className="font-display text-5xl font-semibold leading-[1.05] text-white md:text-7xl">{profile.name}</h1>
            <blockquote className="mt-8 border-l-2 border-gold-400 pl-6 font-display text-xl italic leading-relaxed text-zinc-200 md:text-2xl">
              {profile.brief_intro}
            </blockquote>

            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-zinc-400">
              {profile.location ? (
                <span className="flex items-center gap-2">
                  <Icon name="pin" className="h-4 w-4 text-gold-400" />
                  {profile.location}
                </span>
              ) : null}
              {profile.email ? (
                <a href={`mailto:${profile.email}`} className="flex items-center gap-2 hover:text-gold-300">
                  <Icon name="mail" className="h-4 w-4 text-gold-400" />
                  {profile.email}
                </a>
              ) : null}
              {profile.phone ? (
                <span className="flex items-center gap-2">
                  <Icon name="phone" className="h-4 w-4 text-gold-400" />
                  {profile.phone}
                </span>
              ) : null}
            </div>

            {socialLinks.length > 0 ? (
              <div className="mt-8 flex flex-wrap gap-2">
                {socialLinks.map((s) => (
                  <a key={s.key} href={s.url} target="_blank" rel="noopener noreferrer" className="chip">
                    {s.label}
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="bg-ink-900 py-24 md:py-32">
        <div className="container-x grid grid-cols-1 gap-16 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow mb-6">About</p>
            <h2 className="section-title">Leading from the ground up.</h2>
          </div>
          <p className="whitespace-pre-line text-lg leading-relaxed text-zinc-400 lg:col-span-8">{profile.about}</p>
        </div>

        <div className="container-x mt-20 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="card p-8 md:p-10">
            <h3 className="text-2xl text-white">Highlights</h3>
            <ul className="mt-6 space-y-4">
              {(profile.highlights || []).map((h, idx) => (
                <li key={idx} className="flex gap-4 text-zinc-300">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-400" />
                  <span className="leading-relaxed">{h}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="card p-8 md:p-10">
            <h3 className="text-2xl text-white">What we maintain</h3>
            <ul className="mt-6 space-y-4">
              {principles.map((t) => (
                <li key={t} className="flex gap-4 text-zinc-300">
                  <Icon name="check" className="mt-0.5 h-5 w-5 shrink-0 text-gold-400" />
                  <span className="leading-relaxed">{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="container-x mt-12">
          <Link to="/about" className="inline-flex items-center gap-2 text-sm font-semibold text-gold-300 hover:text-gold-200">
            About Class 17 Events <Icon name="arrow" className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <CtaBand />
    </PublicLayout>
  )
}