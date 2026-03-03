import { useEffect, useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import PublicLayout from '../../components/PublicLayout'

const CAMPAIGN_TYPES = [
  { key: 'business', label: 'Business' },
  { key: 'education', label: 'Education' },
  { key: 'healthcare', label: 'Healthcare' },
  { key: 'printer-challenge', label: 'Printer Challenge' },
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

export default function StateWorkPage() {
  const { slug } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const [works, setWorks] = useState([])
  const [clientsById, setClientsById] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedImage, setSelectedImage] = useState(null)
  const [expandedWorkGalleries, setExpandedWorkGalleries] = useState({})

  const selectedDistrict = (searchParams.get('district') || '').trim()
  const selectedType = (searchParams.get('type') || '').trim()

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

  const { allDistricts, allTypes } = useMemo(() => {
    const districts = new Set()
    const types = new Set()

    works.forEach((w) => {
      extractLocationsFromImages(w.images).forEach((d) => districts.add(d))
      extractCampaignTypesFromImages(w.images).forEach((t) => types.add(t))
    })

    return {
      allDistricts: Array.from(districts).sort((a, b) => a.localeCompare(b)),
      allTypes: Array.from(types),
    }
  }, [works])

  const visibleTypes = useMemo(() => {
    // Show only types present in this state's data, but keep a stable ordering
    const present = new Set(allTypes)
    return CAMPAIGN_TYPES.filter((t) => present.has(t.key))
  }, [allTypes])

  const filteredWorks = useMemo(() => {
    if (!selectedDistrict && !selectedType) return works

    return works.filter((w) => {
      const imgs = Array.isArray(w.images) ? w.images : []
      return imgs.some((img) => imageMatchesDistrict(img, selectedDistrict) && imageMatchesType(img, selectedType))
    })
  }, [works, selectedDistrict, selectedType])

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
    setSearchParams(params, { replace: true })
  }

  return (
    <PublicLayout>
      <section className="bg-gradient-to-br from-[#0b0b0c] via-[#1a0b10] to-[#5b0d1b] text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-white/70 mb-3">
                State Work
              </p>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
                Brand Activations in {stateName}
              </h1>
              <p className="text-blue-100 max-w-2xl text-sm md:text-base">
                Explore our person-to-person engagement activities, face-to-face consultations, and hands-on demonstrations 
                that Class 17 Events has executed across {stateName}. Each campaign focuses on direct customer interactions 
                and personalized solutions.
              </p>
            </div>
            <div className="flex flex-col items-start md:items-end gap-3">
              <Link
                to="/"
                className="inline-flex items-center text-sm font-medium text-white/90 hover:text-white underline-offset-2 hover:underline"
              >
                ← Back to Home
              </Link>
              <Link
                to="/contact"
                className="btn-modern bg-white text-[#5b0d1b] hover:bg-gray-100 shadow-lg text-sm"
              >
                Plan a Campaign in {stateName}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {loading && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">Loading state work...</p>
            </div>
          )}

          {!loading && error && (
            <div className="max-w-3xl mx-auto bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl text-sm">
              {error}
            </div>
          )}

          {!loading && !error && works.length === 0 && (
            <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-sm p-8 text-center space-y-3">
              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                State work coming soon
              </h2>
              <p className="text-gray-600 text-sm md:text-base">
                We have not added detailed work for <span className="font-semibold">{stateName}</span> yet.
                Your admin panel lets you create state-wise work with images, activities, and brand mapping —
                once added, it will appear here automatically.
              </p>
              <p className="text-gray-500 text-xs">
                Tip: Use the admin &quot;State Works&quot; section to create an entry for this state.
              </p>
            </div>
          )}

          {!loading && !error && works.length > 0 && (
            <>
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Our Work in {stateName}</h2>
                <p className="text-gray-600 text-sm md:text-base mb-6">
                  All state work is shown below as multiple cards inside this section.
                </p>

                {/* Filters */}
                <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-[#0b0b0c] via-[#121214] to-[#1a0b10] p-5 md:p-6 mb-8 space-y-5 text-white">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white">Filter by District / City</p>
                      <p className="text-xs text-white/70">Click a district to see only the work from that location.</p>
                    </div>
                    {(selectedDistrict || selectedType) && (
                      <button
                        type="button"
                        onClick={() => setFilterParams({ district: '', type: '' })}
                        className="text-xs font-semibold text-white hover:text-white border border-white/20 hover:border-white/40 bg-white/10 rounded-full px-3 py-2 w-fit"
                      >
                        Clear filters
                      </button>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setFilterParams({ district: '' })}
                      className={
                        selectedDistrict
                          ? 'text-xs font-semibold text-white bg-white/10 border border-white/20 rounded-full px-3 py-1 hover:border-white/40'
                          : 'text-xs font-semibold text-white bg-gradient-to-r from-[#5b0d1b] to-[#0b0b0c] border border-transparent rounded-full px-3 py-1'
                      }
                    >
                      All Districts
                    </button>
                    {allDistricts.map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setFilterParams({ district: d })}
                        className={
                          selectedDistrict === d
                            ? 'text-xs font-semibold text-white bg-gradient-to-r from-[#5b0d1b] to-[#0b0b0c] border border-transparent rounded-full px-3 py-1'
                            : 'text-xs font-semibold text-white/90 bg-white/10 border border-white/20 rounded-full px-3 py-1 hover:border-white/40'
                        }
                      >
                        {d}
                      </button>
                    ))}
                  </div>

                  {visibleTypes.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-white">Filter by Campaign Type</p>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setFilterParams({ type: '' })}
                          className={
                            selectedType
                              ? 'text-xs font-semibold text-white bg-white/10 border border-white/20 rounded-full px-3 py-1 hover:border-white/40'
                              : 'text-xs font-semibold text-white bg-gradient-to-r from-[#0b0b0c] to-[#5b0d1b] border border-transparent rounded-full px-3 py-1'
                          }
                        >
                          All Types
                        </button>
                        {visibleTypes.map((t) => (
                          <button
                            key={t.key}
                            type="button"
                            onClick={() => setFilterParams({ type: t.key })}
                            className={
                              selectedType === t.key
                                ? 'text-xs font-semibold text-white bg-gradient-to-r from-[#0b0b0c] to-[#5b0d1b] border border-transparent rounded-full px-3 py-1'
                                : 'text-xs font-semibold text-white/90 bg-white/10 border border-white/20 rounded-full px-3 py-1 hover:border-white/40'
                            }
                          >
                            {t.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {filteredWorks.length === 0 ? (
                  <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
                    <h3 className="text-lg font-bold text-gray-900">No work found for this filter</h3>
                    <p className="text-sm text-gray-600 mt-2">
                      Try selecting a different district/city or campaign type.
                    </p>
                    <button
                      type="button"
                      onClick={() => setFilterParams({ district: '', type: '' })}
                      className="mt-4 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl px-4 py-2"
                    >
                      Clear filters
                    </button>
                  </div>
                ) : (
                <div className="space-y-6">
                  {filteredWorks.map((work, idx) => {
                    const allImages = Array.isArray(work.images) ? work.images : []
                    const imagesFiltered = allImages.filter(
                      (img) => imageMatchesDistrict(img, selectedDistrict) && imageMatchesType(img, selectedType)
                    )
                    const imagesToUse = selectedDistrict || selectedType ? imagesFiltered : allImages

                    const isExpanded = Boolean(expandedWorkGalleries[work.id])
                    const gallery = isExpanded ? imagesToUse : imagesToUse.slice(0, 12)
                    const locations = extractLocationsFromImages(imagesToUse)
                    return (
                      <article key={work.id} className="rounded-2xl border border-gray-200 shadow-md hover:shadow-xl overflow-hidden transition-all duration-300 bg-white">
                        <div className="p-5 md:p-6 bg-gradient-to-r from-[#0b0b0c] via-[#121214] to-[#5b0d1b] border-b border-gray-200 text-white">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#5b0d1b] to-black flex items-center justify-center text-white font-bold text-sm">
                                  {idx + 1}
                                </div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-white/80">
                                  Campaign Work
                                </p>
                              </div>
                              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                                {work.title || `Campaign in ${stateName}`}
                              </h3>
                              {work.brand_client_id && (
                                <div className="flex items-center gap-2 mt-2">
                                  <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                  </svg>
                                  <p className="text-sm text-white/80">
                                    Brand:{' '}
                                    <span className="font-semibold text-white">
                                      {clientsById[work.brand_client_id]?.name || 'Not specified'}
                                    </span>
                                  </p>
                                </div>
                              )}
                              {locations.length > 0 && (
                                <div className="mt-4">
                                  <div className="flex items-center gap-2 mb-2">
                                    <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 12.414a4 4 0 10-5.657 5.657l4.243 4.243a8 8 0 0011.314-11.314z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-white/70">
                                      Districts / Cities Covered
                                    </p>
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    {locations.map((loc) => (
                                      <button
                                        key={loc}
                                        type="button"
                                        onClick={() => setFilterParams({ district: loc })}
                                        className="text-xs font-semibold text-white bg-white/10 border border-white/20 rounded-full px-3 py-1 hover:border-white/40"
                                      >
                                        {loc}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          {work.description && (
                            <p className="text-white/85 mt-4 text-sm md:text-base leading-relaxed bg-white/10 rounded-lg p-3 border border-white/10">
                              {work.description}
                            </p>
                          )}
                        </div>

                        <div className="p-5 md:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div>
                            <div className="flex items-center gap-2 mb-4">
                              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                              <h4 className="text-lg font-semibold text-gray-900">Person-to-Person Activities</h4>
                            </div>
                            {Array.isArray(work.activities) && work.activities.length > 0 ? (
                              <ul className="space-y-3">
                                {work.activities.map((activity, actIdx) => (
                                  <li 
                                    key={`${activity}-${actIdx}`} 
                                    className="group flex items-start gap-3 text-sm text-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-xl px-4 py-3 hover:shadow-md hover:border-blue-200 transition-all duration-200"
                                  >
                                    <div className="flex-shrink-0 mt-0.5">
                                      <div className="w-2 h-2 rounded-full bg-blue-600 group-hover:bg-blue-700 transition-colors"></div>
                                    </div>
                                    <span className="flex-1 leading-relaxed">{activity}</span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-sm text-gray-500">No activities added yet.</p>
                            )}
                          </div>

                            <div>
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-[#5b0d1b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <h4 className="text-lg font-semibold text-gray-900">Photo Gallery</h4>
                              </div>
                              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                {gallery.length} of {imagesToUse.length}
                              </span>
                            </div>
                            {gallery.length > 0 ? (
                              <>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                  {gallery.map((img, index) => {
                                  // Handle both public folder paths and full URLs
                                  const imageSrc = img.startsWith('/') ? img : (img.startsWith('http') ? img : `/${img}`)
                                  return (
                                    <button
                                      key={`${img}-${index}`}
                                      type="button"
                                      onClick={() => setSelectedImage(imageSrc)}
                                      className="group relative rounded-xl overflow-hidden border-2 border-gray-200 hover:border-blue-400 shadow-sm hover:shadow-lg transition-all duration-300"
                                    >
                                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                                      <img
                                        src={imageSrc}
                                        alt={`Work image ${index + 1} in ${stateName}`}
                                        className="w-full h-28 sm:h-32 object-cover group-hover:scale-110 transition-transform duration-300"
                                        onError={(e) => {
                                          // Fallback if image doesn't load
                                          e.target.src = '/placeholder-image.svg'
                                        }}
                                      />
                                      <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                        <div className="bg-white/90 backdrop-blur-sm rounded-full p-1.5">
                                          <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                          </svg>
                                        </div>
                                      </div>
                                    </button>
                                  )
                                  })}
                                </div>

                                {imagesToUse.length > 12 && (
                                  <div className="mt-4 flex justify-center">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setExpandedWorkGalleries((prev) => ({
                                          ...prev,
                                          [work.id]: !prev[work.id],
                                        }))
                                      }
                                      className="text-sm font-semibold text-white bg-gradient-to-r from-[#0b0b0c] to-[#5b0d1b] rounded-xl px-4 py-2 shadow-md hover:shadow-lg"
                                    >
                                      {isExpanded ? 'Show less' : `Show all images (${imagesToUse.length})`}
                                    </button>
                                  </div>
                                )}
                              </>
                            ) : (
                              <p className="text-sm text-gray-500">
                                No images for this filter. Try a different district/city or type.
                              </p>
                            )}
                          </div>
                        </div>
                      </article>
                    )
                  })}
                </div>
                )}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Image Modal/Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 text-3xl font-bold w-12 h-12 flex items-center justify-center bg-black/60 rounded-full hover:bg-black/80 transition-all duration-200 shadow-lg z-10"
            aria-label="Close image"
          >
            ×
          </button>
          <div className="relative max-w-7xl max-h-[90vh] flex items-center justify-center">
            <img
              src={selectedImage}
              alt="Full size view"
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              onError={(e) => {
                e.target.src = '/placeholder-image.svg'
              }}
            />
          </div>
        </div>
      )}
    </PublicLayout>
  )
}


