import { useEffect, useMemo, useState } from 'react'
import AdminLayout from '../../components/AdminLayout'
import { supabase } from '../../lib/supabaseClient'

const PROFILE_KEY = 'main'

const emptyProfile = {
  key: PROFILE_KEY,
  name: 'MD Ashique Sidique',
  title: 'Founder & Chairman',
  brief_intro:
    'Founder & Chairman of Class 17 Events, focused on strategy-led activations and on-ground execution across India.',
  about:
    'Class 17 Events is built on clear planning, disciplined execution, and measurable impact. We work across schools, retail, sports, corporate and industrial outreach — with a strong emphasis on quality teams, compliance, and consistent reporting.',
  highlights: [
    'Pan-India campaign execution across metros and tier cities',
    'Strong school and campus activation capability',
    'Retail & channel programs with promoter-led engagement',
    'Event planning, operations, and measurable reporting',
  ],
  phone: '',
  email: '',
  location: '',
  image_url: '/ashiq.jpeg',
  socials: {
    facebook: '',
    instagram: '',
    linkedin: '',
    x: '',
    youtube: '',
    website: '',
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

export default function Founder() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState(emptyProfile)
  const [error, setError] = useState('')

  const highlightsText = useMemo(() => (profile.highlights || []).join('\n'), [profile.highlights])

  useEffect(() => {
    let mounted = true
    const run = async () => {
      try {
        setLoading(true)
        setError('')

        const { data, error: fetchError } = await supabase
          .from('founder_profile')
          .select('*')
          .eq('key', PROFILE_KEY)
          .maybeSingle()

        if (fetchError) throw fetchError
        if (!mounted) return

        if (data) {
          setProfile({
            ...emptyProfile,
            ...data,
            highlights: Array.isArray(data.highlights) ? data.highlights : emptyProfile.highlights,
            socials: safeJsonParse(data.socials, emptyProfile.socials),
            image_url: data.image_url || '/ashiq.jpeg',
          })
        } else {
          setProfile(emptyProfile)
        }
      } catch (e) {
        console.error('Error loading founder profile:', e)
        if (mounted) setError(e?.message || 'Failed to load founder profile')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    run()
    return () => {
      mounted = false
    }
  }, [])

  const onChange = (e) => {
    const { name, value } = e.target
    setProfile((p) => ({ ...p, [name]: value }))
  }

  const onSocialChange = (e) => {
    const { name, value } = e.target
    setProfile((p) => ({ ...p, socials: { ...(p.socials || {}), [name]: value } }))
  }

  const onHighlightsText = (e) => {
    const value = e.target.value || ''
    const lines = value
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)
    setProfile((p) => ({ ...p, highlights: lines }))
  }

  const saveProfile = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const payload = {
        key: PROFILE_KEY,
        name: profile.name?.trim() || '',
        title: profile.title?.trim() || '',
        brief_intro: profile.brief_intro || '',
        about: profile.about || '',
        highlights: Array.isArray(profile.highlights) ? profile.highlights : [],
        phone: profile.phone || '',
        email: profile.email || '',
        location: profile.location || '',
        image_url: profile.image_url || '/ashiq.jpeg',
        socials: profile.socials || {},
        updated_at: new Date().toISOString(),
      }

      const { data: existing, error: existingErr } = await supabase
        .from('founder_profile')
        .select('key')
        .eq('key', PROFILE_KEY)
        .maybeSingle()

      if (existingErr) throw existingErr

      if (existing) {
        const { error: updateErr } = await supabase.from('founder_profile').update(payload).eq('key', PROFILE_KEY)
        if (updateErr) throw updateErr
      } else {
        const { error: insertErr } = await supabase.from('founder_profile').insert([payload])
        if (insertErr) throw insertErr
      }
    } catch (e) {
      console.error('Error saving founder profile:', e)
      setError(e?.message || 'Failed to save profile')
      alert('Error saving profile: ' + (e?.message || 'Unknown error'))
    } finally {
      setSaving(false)
    }
  }

  const deleteProfile = async () => {
    if (!confirm('Delete the founder profile? This will remove it from the public page.')) return
    setSaving(true)
    setError('')
    try {
      const { error: delErr } = await supabase.from('founder_profile').delete().eq('key', PROFILE_KEY)
      if (delErr) throw delErr
      setProfile(emptyProfile)
    } catch (e) {
      console.error('Error deleting founder profile:', e)
      setError(e?.message || 'Failed to delete profile')
      alert('Error deleting profile: ' + (e?.message || 'Unknown error'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-3">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">Founder Profile</h1>
            <p className="text-gray-400 text-sm md:text-base">
              Edit the founder details shown on the public Founder page. Changes are saved to Supabase.
            </p>
          </div>
          <div className="flex gap-3">
            <a
              href="/founder"
              target="_blank"
              rel="noreferrer"
              className="btn-modern bg-white/10 text-white border border-white/15 hover:bg-white/15 text-sm"
            >
              Preview Public Page →
            </a>
            <button
              type="button"
              onClick={deleteProfile}
              disabled={saving}
              className="btn-modern bg-red-600/90 hover:bg-red-600 text-white text-sm disabled:opacity-60"
            >
              Delete Profile
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 bg-gray-900/60 border border-gray-700/60 rounded-2xl p-5 md:p-6 shadow-xl">
              <form onSubmit={saveProfile} className="space-y-4">
                {error ? (
                  <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-200 text-sm">
                    {error}
                  </div>
                ) : null}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                    <input
                      name="name"
                      value={profile.name || ''}
                      onChange={onChange}
                      className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                    <input
                      name="title"
                      value={profile.title || ''}
                      onChange={onChange}
                      className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white"
                      placeholder="e.g., Founder & Chairman"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Brief Intro</label>
                  <textarea
                    name="brief_intro"
                    value={profile.brief_intro || ''}
                    onChange={onChange}
                    rows={3}
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white"
                    placeholder="1–2 lines for the top of the page"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">About</label>
                  <textarea
                    name="about"
                    value={profile.about || ''}
                    onChange={onChange}
                    rows={7}
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white"
                    placeholder="Full about text"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Highlights (one per line)</label>
                  <textarea
                    value={highlightsText}
                    onChange={onHighlightsText}
                    rows={6}
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white"
                    placeholder="Add one point per line"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                    <input
                      name="phone"
                      value={profile.phone || ''}
                      onChange={onChange}
                      className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white"
                      placeholder="+91..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={profile.email || ''}
                      onChange={onChange}
                      className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white"
                      placeholder="name@company.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                    <input
                      name="location"
                      value={profile.location || ''}
                      onChange={onChange}
                      className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white"
                      placeholder="City, Country"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Image URL</label>
                    <input
                      name="image_url"
                      value={profile.image_url || ''}
                      onChange={onChange}
                      className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white"
                      placeholder="/ashiq.jpeg or https://..."
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Tip: keep it <span className="font-semibold">/ashiq.jpeg</span> to use the local image.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-gray-700 bg-gray-900/40 p-4">
                    <p className="text-sm text-gray-300 font-medium mb-3">Social Links</p>
                    <div className="grid grid-cols-1 gap-2">
                      {[
                        ['website', 'Website'],
                        ['linkedin', 'LinkedIn'],
                        ['instagram', 'Instagram'],
                        ['facebook', 'Facebook'],
                        ['x', 'X (Twitter)'],
                        ['youtube', 'YouTube'],
                      ].map(([key, label]) => (
                        <input
                          key={key}
                          name={key}
                          value={(profile.socials || {})[key] || ''}
                          onChange={onSocialChange}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm"
                          placeholder={`${label} URL`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setProfile(emptyProfile)}
                    disabled={saving}
                    className="btn-modern bg-white/10 text-white border border-white/15 hover:bg-white/15 disabled:opacity-60"
                  >
                    Reset (Local)
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn-modern bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg disabled:opacity-60"
                  >
                    {saving ? 'Saving…' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-gray-900/60 border border-gray-700/60 rounded-2xl p-5 md:p-6 shadow-xl">
              <p className="text-white font-semibold mb-4">Live Preview</p>
              <div className="rounded-2xl border border-gray-700 bg-gray-950/40 p-5">
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden border border-white/10 bg-gray-800 shrink-0">
                    <img
                      src={profile.image_url || '/ashiq.jpeg'}
                      alt={profile.name || 'Founder'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/ashiq.jpeg'
                      }}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-white text-lg font-bold truncate">{profile.name || '—'}</p>
                    <p className="text-gray-300 text-sm truncate">{profile.title || '—'}</p>
                    <p className="text-gray-400 text-xs mt-1 line-clamp-2">{profile.brief_intro || ''}</p>
                  </div>
                </div>
                <div className="mt-5">
                  <p className="text-gray-300 text-sm font-medium mb-2">Highlights</p>
                  <ul className="space-y-2">
                    {(profile.highlights || []).slice(0, 6).map((h, idx) => (
                      <li key={idx} className="text-gray-300 text-sm flex gap-2">
                        <span className="text-blue-400 mt-0.5">•</span>
                        <span className="line-clamp-2">{h}</span>
                      </li>
                    ))}
                    {(profile.highlights || []).length === 0 ? (
                      <li className="text-gray-500 text-sm">No highlights yet.</li>
                    ) : null}
                  </ul>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-4">
                Public route: <span className="font-semibold text-gray-200">/founder</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

