import { useEffect, useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import PublicLayout from '../../components/PublicLayout'
import { Chip, CtaBand, Icon, Lightbox, PageHero } from '../../components/ui'
import { toSrc } from '../../data/activities'

const CAMPAIGN_TYPES = [
  { key: 'business', label: 'Business' },
  { key: 'education', label: 'Education' },
  { key: 'healthcare', label: 'Healthcare' },
  { key: 'printer-challenge', label: 'Printer Challenge' },
]

const ACTIVITY_FOCUS = [
  { key: 'cricket', label: 'Cricket' },
  { key: 'social', label: 'Social' },
  { key: 'school', label: 'School' },
  { key: 'brand', label: 'Brand / Other' },
]

function normalizeLocationName(input) {
  if (!input || typeof input !== 'string') return ''

  let s = input.trim()

  // Remove anything in parentheses e.g. "Ahmad Nagar-(Jan 2025)"
  s = s.replace(/\(.*?\)/g, '')

  // Remove common date suffix patterns e.g. "- Sept 2024", "-May 2024", "-2026"
  s = s.replace(/\s*-\s*[A-Za-z]{3,10}\s*\d{4}\s*$/g, '')
  s = s.replace(/\s*-\s*\d{4}\s*$/g, '')

  // Remove extra separators, normalize spaces
  s = s.replace(/[_]+/g, ' ')
  s = s.replace(/\s*-\s*/g, ' ')
  s = s.replace(/\s+/g, ' ').trim()

  // Ignore folder-only "years" segments
  if (/^\d{4}$/.test(s)) return ''

  return s
}

function getImageActivityLabelFromPath(img) {
  if (!img || typeof img !== 'string') return 'Brand activation'
  const s = img.toLowerCase()

  if (s.includes('cricket')) return 'Cricket activity'
  if (s.includes('social activity')) return 'Social activity'
  if (s.includes('school activity')) return 'School activity'
  if (s.includes('epson for business')) return 'Business activation'
  if (s.includes('epson for education')) return 'Education activation'
  if (s.includes('epson for healthcare')) return 'Healthcare activation'
  if (s.includes('epson for printer challenge')) return 'Printer challenge activation'

  return 'Brand activation'
}

function formatActivityText(activity) {
  if (!activity || typeof activity !== 'string') return activity
  // Remove leading "Epson" / "EPSON" so copy feels less brand-heavy
  return activity.replace(/^\s*epson\s+/i, '').trim()
}

function normalizeCampaignTypeFromFolder(folderName) {
  if (!folderName || typeof folderName !== 'string') return ''
  const s = folderName.toLowerCase().trim()

  if (s.includes('epson for business')) return 'business'
  if (s.includes('epson for education')) return 'education'
  if (s.includes('epson for healthcare')) return 'healthcare'
  if (s.includes('epson for printer challenge')) return 'printer-challenge'

  return ''
}

function extractLocationsFromImages(images) {
  if (!Array.isArray(images)) return []

  const out = new Set()

  images.forEach((img) => {
    if (typeof img !== 'string') return
    const parts = img.split('/').filter(Boolean)

    // Expected: /Photos/<Campaign Folder>/<City Folder>/<file>
    const photosIdx = parts.findIndex((p) => p.toLowerCase() === 'photos')
    const cityIdx = photosIdx >= 0 ? photosIdx + 2 : -1

    const citySegment = cityIdx >= 0 ? parts[cityIdx] : ''
    const normalized = normalizeLocationName(citySegment)

    // Filter out campaign folder names if parsing went wrong
    if (!normalized) return
    if (normalized.toLowerCase().startsWith('epson for ')) return

    out.add(normalized)
  })

  return Array.from(out)
}

function extractCampaignTypesFromImages(images) {
  if (!Array.isArray(images)) return []

  const out = new Set()

  images.forEach((img) => {
    if (typeof img !== 'string') return
    const parts = img.split('/').filter(Boolean)

    // Expected: /Photos/<Campaign Folder>/<City Folder>/<file>
    const photosIdx = parts.findIndex((p) => p.toLowerCase() === 'photos')
    const campaignIdx = photosIdx >= 0 ? photosIdx + 1 : -1
    const campaignSegment = campaignIdx >= 0 ? parts[campaignIdx] : ''

    const type = normalizeCampaignTypeFromFolder(campaignSegment)
    if (type) out.add(type)
  })

  return Array.from(out)
}

function imageMatchesDistrict(img, district) {
  if (!district) return true
  if (typeof img !== 'string') return false
  const parts = img.split('/').filter(Boolean)
  const photosIdx = parts.findIndex((p) => p.toLowerCase() === 'photos')
  const cityIdx = photosIdx >= 0 ? photosIdx + 2 : -1
  const citySegment = cityIdx >= 0 ? parts[cityIdx] : ''
  const normalized = normalizeLocationName(citySegment)
  return normalized === district
}

function imageMatchesType(img, typeKey) {
  if (!typeKey) return true
  if (typeof img !== 'string') return false
  const parts = img.split('/').filter(Boolean)
  const photosIdx = parts.findIndex((p) => p.toLowerCase() === 'photos')
  const campaignIdx = photosIdx >= 0 ? photosIdx + 1 : -1
  const campaignSegment = campaignIdx >= 0 ? parts[campaignIdx] : ''
  const normalizedType = normalizeCampaignTypeFromFolder(campaignSegment)
  return normalizedType === typeKey
}

function formatError(e) {
  if (!e) return 'Unknown error'
  if (typeof e === 'string') return e

  // Supabase/PostgREST errors often have these fields
  const msg =
    e.message ||
    e.error_description ||
    e.details ||
    e.hint ||
    (typeof e.toString === 'function' ? e.toString() : '')

  const extra = []
  if (e.code) extra.push(`code: ${e.code}`)
  if (e.details) extra.push(`details: ${e.details}`)
  if (e.hint) extra.push(`hint: ${e.hint}`)

  if (msg && extra.length === 0) return msg
  if (msg && extra.length > 0) return `${msg}\n${extra.join('\n')}`

  try {
    return JSON.stringify(e)
  } catch {
    return 'Unknown error'
  }
}

function getActivityKeyFromPath(img) {
  if (!img || typeof img !== 'string') return 'brand'
  const s = img.toLowerCase()
  if (s.includes('cricket')) return 'cricket'
  if (s.includes('social activity')) return 'social'
  if (s.includes('school activity')) return 'school'
  return 'brand'
}

export default function StateWorkPage() {
  const { slug } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const [works, setWorks] = useState([])
  const [clientsById, setClientsById] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [lightbox, setLightbox] = useState(null)
  const [expandedWorkGalleries, setExpandedWorkGalleries] = useState({})

  const selectedDistrict = (searchParams.get('district') || '').trim()
  const selectedType = (searchParams.get('type') || '').trim()
  const selectedActivity = (searchParams.get('activity') || '').trim()

  useEffect(() => {
    if (!slug) return
    fetchStateWorks(slug)
  }, [slug])

  const fetchStateWorks = async (currentSlug) => {
    try {
      setLoading(true)
      setError('')

      const { data, error: stateError } = await supabase
        .from('state_works')
        .select('*')
        .eq('slug', currentSlug)

      if (stateError) throw stateError

      const stateWorks = data || []
      setWorks(stateWorks)

      const brandIds = Array.from(
        new Set(
          (stateWorks || [])
            .map((item) => item.brand_client_id)
            .filter(Boolean)
        )
      )

      if (brandIds.length > 0) {
        const { data: clientsData, error: clientsError } = await supabase
          .from('clients')
          .select('id, name, logo_url')
          .in('id', brandIds)

        if (clientsError) {
          console.error('Error fetching clients for state work:', clientsError)
        } else if (clientsData) {
          const map = {}
          clientsData.forEach((c) => {
            map[c.id] = c
          })
          setClientsById(map)
        }
      } else {
        setClientsById({})
      }
    } catch (e) {
      console.error('Error loading state work page:', e)
      const friendly = formatError(e)
      // Show more helpful error message
      if (friendly.includes('relation') && friendly.includes('does not exist')) {
        setError('The state_works table does not exist. Please run the database migration to create it.')
      } else if (friendly.includes('permission denied')) {
        setError('Permission denied. Please check your database RLS policies.')
      } else {
        setError(`Unable to load this state right now:\n${friendly}`)
      }
    } finally {
      setLoading(false)
    }
  }

  const primaryWork = works[0]
  const stateName = primaryWork?.state || (slug ? slug.replace(/-/g, ' ') : 'State')

  const { allDistricts, allTypes, allActivityKeys } = useMemo(() => {
    const districts = new Set()
    const types = new Set()
    const activityKeys = new Set()

    works.forEach((w) => {
      extractLocationsFromImages(w.images).forEach((d) => districts.add(d))
      extractCampaignTypesFromImages(w.images).forEach((t) => types.add(t))
      ;(Array.isArray(w.images) ? w.images : []).forEach((img) => {
        activityKeys.add(getActivityKeyFromPath(img))
      })
    })

    return {
      allDistricts: Array.from(districts).sort((a, b) => a.localeCompare(b)),
      allTypes: Array.from(types),
      allActivityKeys: Array.from(activityKeys),
    }
  }, [works])

  const visibleTypes = useMemo(() => {
    // Show only types present in this state's data, but keep a stable ordering
    const present = new Set(allTypes)
    return CAMPAIGN_TYPES.filter((t) => present.has(t.key))
  }, [allTypes])

  const visibleActivityFocus = useMemo(() => {
    const present = new Set(allActivityKeys)
    return ACTIVITY_FOCUS.filter((t) => present.has(t.key))
  }, [allActivityKeys])

  const filteredWorks = useMemo(() => {
    if (!selectedDistrict && !selectedType && !selectedActivity) return works

    return works.filter((w) => {
      const imgs = Array.isArray(w.images) ? w.images : []
      return imgs.some((img) => {
        const activityKey = getActivityKeyFromPath(img)
        const matchesActivity =
          !selectedActivity || (selectedActivity === 'brand' ? activityKey === 'brand' : activityKey === selectedActivity)
        return (
          imageMatchesDistrict(img, selectedDistrict) &&
          imageMatchesType(img, selectedType) &&
          matchesActivity
        )
      })
    })
  }, [works, selectedDistrict, selectedType, selectedActivity])

  const setFilterParams = (next) => {
    const params = new URLSearchParams(searchParams)
    if (next.district !== undefined) {
      if (next.district) params.set('district', next.district)
      else params.delete('district')
    }
    if (next.type !== undefined) {
      if (next.type) params.set('type', next.type)
      else params.delete('type')
    }
    if (next.activity !== undefined) {
      if (next.activity) params.set('activity', next.activity)
      else params.delete('activity')
    }
    setSearchParams(params, { replace: true })
  }

  const hasFilters = Boolean(selectedDistrict || selectedType || selectedActivity)

  return (
    <PublicLayout>
      <PageHero
        eyebrow="State work"
        title={
          <>
            Brand activations in <em className="text-gradient font-medium italic capitalize">{stateName}</em>
          </>
        }
        subtitle={`Person-to-person engagement, face-to-face consultations and hands-on demonstrations delivered across ${stateName}.`}
        image={primaryWork?.images?.[0] ? toSrc(primaryWork.images[0]) : undefined}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Link to="/contact" className="btn-gold">
            Plan a campaign in {stateName}
          </Link>
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white">
            ? Back to home
          </Link>
        </div>
      </PageHero>

      <section className="bg-ink-950 py-16 md:py-24">
        <div className="container-x space-y-10">
          {loading && (
            <div className="space-y-4">
              <div className="h-40 animate-pulse rounded-2xl bg-ink-900" />
              <div className="h-80 animate-pulse rounded-2xl bg-ink-900" />
            </div>
          )}

          {!loading && error && (
            <div className="mx-auto max-w-3xl whitespace-pre-line rounded-2xl border border-red-500/30 bg-red-500/10 px-6 py-4 text-sm text-red-200">
              {error}
            </div>
          )}

          {!loading && !error && works.length === 0 && (
            <div className="card mx-auto max-w-2xl p-10 text-center">
              <h2 className="text-2xl text-white">State work coming soon</h2>
              <p className="mt-3 text-zinc-400">
                Detailed work for <span className="capitalize text-white">{stateName}</span> has not been published yet.
                Want to be our first campaign here?
              </p>
              <Link to="/contact" className="btn-gold mt-8">
                Talk to us
              </Link>
            </div>
          )}

          {!loading && !error && works.length > 0 && (
            <>
              <div className="card space-y-6 p-6 md:p-8">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-2xl text-white">Filter the work</h2>
                    <p className="mt-1 text-sm text-zinc-500">Narrow down by district, campaign type or activity.</p>
                  </div>
                  {hasFilters && (
                    <button
                      type="button"
                      onClick={() => setFilterParams({ district: '', type: '', activity: '' })}
                      className="text-xs font-semibold text-gold-300 hover:text-gold-200"
                    >
                      Clear all filters
                    </button>
                  )}
                </div>

                {allDistricts.length > 0 && (
                  <div>
                    <p className="label-dark">District / city</p>
                    <div className="flex flex-wrap gap-2">
                      <Chip active={!selectedDistrict} onClick={() => setFilterParams({ district: '' })}>
                        All districts
                      </Chip>
                      {allDistricts.map((d) => (
                        <Chip key={d} active={selectedDistrict === d} onClick={() => setFilterParams({ district: d })}>
                          {d}
                        </Chip>
                      ))}
                    </div>
                  </div>
                )}

                {visibleTypes.length > 0 && (
                  <div>
                    <p className="label-dark">Campaign type</p>
                    <div className="flex flex-wrap gap-2">
                      <Chip active={!selectedType} onClick={() => setFilterParams({ type: '' })}>
                        All types
                      </Chip>
                      {visibleTypes.map((t) => (
                        <Chip key={t.key} active={selectedType === t.key} onClick={() => setFilterParams({ type: t.key })}>
                          {t.label}
                        </Chip>
                      ))}
                    </div>
                  </div>
                )}

                {visibleActivityFocus.length > 1 && (
                  <div>
                    <p className="label-dark">Activity</p>
                    <div className="flex flex-wrap gap-2">
                      <Chip active={!selectedActivity} onClick={() => setFilterParams({ activity: '' })}>
                        All activities
                      </Chip>
                      {visibleActivityFocus.map((t) => (
                        <Chip key={t.key} active={selectedActivity === t.key} onClick={() => setFilterParams({ activity: t.key })}>
                          {t.label}
                        </Chip>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {filteredWorks.length === 0 ? (
                <div className="card p-10 text-center">
                  <h3 className="text-xl text-white">No work matches these filters</h3>
                  <p className="mt-2 text-sm text-zinc-400">Try a different district, campaign type or activity.</p>
                  <button
                    type="button"
                    onClick={() => setFilterParams({ district: '', type: '', activity: '' })}
                    className="btn-outline mt-6"
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  {filteredWorks.map((work, idx) => {
                    const allImages = Array.isArray(work.images) ? work.images : []
                    const imagesFiltered = allImages.filter((img) => {
                      const activityKey = getActivityKeyFromPath(img)
                      const matchesActivity =
                        !selectedActivity ||
                        (selectedActivity === 'brand' ? activityKey === 'brand' : activityKey === selectedActivity)
                      return imageMatchesDistrict(img, selectedDistrict) && imageMatchesType(img, selectedType) && matchesActivity
                    })
                    const imagesToUse = hasFilters ? imagesFiltered : allImages
                    const isExpanded = Boolean(expandedWorkGalleries[work.id])
                    const gallery = isExpanded ? imagesToUse : imagesToUse.slice(0, 12)
                    const locations = extractLocationsFromImages(imagesToUse)
                    const brand = work.brand_client_id ? clientsById[work.brand_client_id]?.name : ''

                    return (
                      <article key={work.id} className="card overflow-hidden">
                        <header className="border-b border-white/[0.08] p-6 md:p-8">
                          <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em]">
                            <span className="text-gold-400">Campaign {String(idx + 1).padStart(2, '0')}</span>
                            {brand ? (
                              <>
                                <span className="h-1 w-1 rounded-full bg-zinc-600" />
                                <span className="text-zinc-400">{brand}</span>
                              </>
                            ) : null}
                          </div>
                          <h3 className="mt-3 text-2xl text-white md:text-3xl">{work.title || `Campaign in ${stateName}`}</h3>
                          {work.description ? (
                            <p className="mt-4 max-w-3xl leading-relaxed text-zinc-400">{work.description}</p>
                          ) : null}
                          {locations.length > 0 ? (
                            <div className="mt-6 flex flex-wrap items-center gap-2">
                              <Icon name="pin" className="h-4 w-4 text-gold-400" />
                              {locations.map((loc) => (
                                <button
                                  key={loc}
                                  type="button"
                                  onClick={() => setFilterParams({ district: loc })}
                                  className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-300 transition hover:border-gold-400/50 hover:text-white"
                                >
                                  {loc}
                                </button>
                              ))}
                            </div>
                          ) : null}
                        </header>

                        <div className="grid grid-cols-1 gap-8 p-6 md:p-8 lg:grid-cols-12">
                          <div className="lg:col-span-4">
                            <h4 className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Activities</h4>
                            {Array.isArray(work.activities) && work.activities.length > 0 ? (
                              <ul className="mt-5 space-y-3">
                                {work.activities.map((activity, actIdx) => (
                                  <li key={`${activity}-${actIdx}`} className="flex gap-3 text-sm leading-relaxed text-zinc-300">
                                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-400" />
                                    {formatActivityText(activity)}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="mt-5 text-sm text-zinc-500">No activities listed yet.</p>
                            )}
                          </div>

                          <div className="lg:col-span-8">
                            <div className="flex items-center justify-between">
                              <h4 className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Gallery</h4>
                              <span className="text-xs text-zinc-500">
                                {gallery.length} of {imagesToUse.length}
                              </span>
                            </div>
                            {gallery.length > 0 ? (
                              <>
                                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                                  {gallery.map((img, index) => {
                                    const src = toSrc(img)
                                    const label = getImageActivityLabelFromPath(img)
                                    return (
                                      <button
                                        key={`${img}-${index}`}
                                        type="button"
                                        onClick={() => setLightbox({ src, caption: `${label} · ${stateName}` })}
                                        className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-white/[0.08] bg-ink-800"
                                      >
                                        <img
                                          loading="lazy"
                                          decoding="async"
                                          src={src}
                                          alt={`${label} in ${stateName}`}
                                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                          onError={(e) => {
                                            e.currentTarget.src = '/placeholder-image.svg'
                                          }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
                                        <span className="absolute bottom-2 left-2 text-[10px] font-semibold uppercase tracking-wider text-gold-300 opacity-0 transition group-hover:opacity-100">
                                          {label}
                                        </span>
                                      </button>
                                    )
                                  })}
                                </div>
                                {imagesToUse.length > 12 ? (
                                  <div className="mt-6 flex justify-center">
                                    <button
                                      type="button"
                                      onClick={() => setExpandedWorkGalleries((prev) => ({ ...prev, [work.id]: !prev[work.id] }))}
                                      className="btn-outline"
                                    >
                                      {isExpanded ? 'Show less' : `Show all ${imagesToUse.length} photos`}
                                    </button>
                                  </div>
                                ) : null}
                              </>
                            ) : (
                              <p className="mt-5 text-sm text-zinc-500">No photos for this filter.</p>
                            )}
                          </div>
                        </div>
                      </article>
                    )
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <CtaBand title={`Planning something in ${stateName}?`} />
      <Lightbox src={lightbox?.src} caption={lightbox?.caption} onClose={() => setLightbox(null)} />
    </PublicLayout>
  )
}