import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import PublicLayout from '../../components/PublicLayout'

const CAMPAIGN_TYPES = [
  { key: 'business', label: 'Business' },
  { key: 'education', label: 'Education' },
  { key: 'healthcare', label: 'Healthcare' },
  { key: 'printer-challenge', label: 'Printer Challenge' },
]

function normalizeCampaignTypeFromFolder(folderName) {
  if (!folderName || typeof folderName !== 'string') return ''
  const s = folderName.toLowerCase().trim()
  if (s.includes('epson for business')) return 'business'
  if (s.includes('epson for education')) return 'education'
  if (s.includes('epson for healthcare')) return 'healthcare'
  if (s.includes('epson for printer challenge')) return 'printer-challenge'
  return ''
}

function extractTypeFromImagePath(img) {
  if (!img || typeof img !== 'string') return ''
  const parts = img.split('/').filter(Boolean)
  const photosIdx = parts.findIndex((p) => p.toLowerCase() === 'photos')
  const campaignIdx = photosIdx >= 0 ? photosIdx + 1 : -1
  const campaignSegment = campaignIdx >= 0 ? parts[campaignIdx] : ''
  return normalizeCampaignTypeFromFolder(campaignSegment)
}

export default function Portfolio() {
  const [events, setEvents] = useState([])
  const [stateWorks, setStateWorks] = useState([])
  const [activeTab, setActiveTab] = useState('state-works')
  const [selectedType, setSelectedType] = useState('')
  const [selectedImage, setSelectedImage] = useState(null)

  useEffect(() => {
    fetchPortfolioData()
  }, [])

  const fetchPortfolioData = async () => {
    try {
      const [eventsRes, stateWorksRes] = await Promise.all([
        supabase.from('events').select('*').order('created_at', { ascending: false }),
        supabase.from('state_works').select('*').order('created_at', { ascending: false }),
      ])

      if (eventsRes.data) setEvents(eventsRes.data)
      if (stateWorksRes.data) setStateWorks(stateWorksRes.data)
    } catch (e) {
      console.error('Error loading portfolio:', e)
    }
  }

  const stateWorkImages = useMemo(() => {
    const imgs = (stateWorks || [])
      .flatMap((w) => (Array.isArray(w.images) ? w.images.map((img) => ({ img, state: w.state, title: w.title })) : []))
      .filter((x) => x && x.img)

    if (!selectedType) return imgs
    return imgs.filter((x) => extractTypeFromImagePath(x.img) === selectedType)
  }, [stateWorks, selectedType])

  const visibleTypes = useMemo(() => {
    const present = new Set(stateWorkImages.map((x) => extractTypeFromImagePath(x.img)).filter(Boolean))
    return CAMPAIGN_TYPES.filter((t) => present.has(t.key))
  }, [stateWorkImages])

  return (
    <PublicLayout>
      <div className="py-20 bg-gradient-to-br from-black via-[#0f0f12] to-[#5b0d1b] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.35em] text-white/70 mb-4">Portfolio</p>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4">Our Work</h1>
            <p className="text-white/80 max-w-3xl mx-auto">
              A curated view of district-level activations, face-to-face engagement, and high-impact brand experiences.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
            <button
              type="button"
              onClick={() => setActiveTab('state-works')}
              className={
                activeTab === 'state-works'
                  ? 'px-5 py-2 rounded-full bg-white text-[#5b0d1b] font-semibold'
                  : 'px-5 py-2 rounded-full bg-white/10 border border-white/15 text-white font-semibold hover:bg-white/15'
              }
            >
              State Activations
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('events')}
              className={
                activeTab === 'events'
                  ? 'px-5 py-2 rounded-full bg-white text-[#5b0d1b] font-semibold'
                  : 'px-5 py-2 rounded-full bg-white/10 border border-white/15 text-white font-semibold hover:bg-white/15'
              }
            >
              Events
            </button>
          </div>

          {activeTab === 'state-works' && (
            <div className="space-y-8">
              <div className="rounded-2xl bg-white/10 border border-white/15 p-5 md:p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">Campaign Type</p>
                    <p className="text-xs text-white/70">Filter portfolio images by campaign category.</p>
                  </div>
                  {selectedType && (
                    <button
                      type="button"
                      onClick={() => setSelectedType('')}
                      className="text-xs font-semibold text-white border border-white/20 bg-white/10 rounded-full px-3 py-2 w-fit"
                    >
                      Clear type filter
                    </button>
                  )}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedType('')}
                    className={
                      selectedType
                        ? 'text-xs font-semibold text-white/90 bg-white/10 border border-white/20 rounded-full px-3 py-1 hover:border-white/35'
                        : 'text-xs font-semibold text-white bg-gradient-to-r from-black to-[#5b0d1b] border border-transparent rounded-full px-3 py-1'
                    }
                  >
                    All Types
                  </button>
                  {visibleTypes.map((t) => (
                    <button
                      key={t.key}
                      type="button"
                      onClick={() => setSelectedType(t.key)}
                      className={
                        selectedType === t.key
                          ? 'text-xs font-semibold text-white bg-gradient-to-r from-black to-[#5b0d1b] border border-transparent rounded-full px-3 py-1'
                          : 'text-xs font-semibold text-white/90 bg-white/10 border border-white/20 rounded-full px-3 py-1 hover:border-white/35'
                      }
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {stateWorkImages.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {stateWorkImages.slice(0, 48).map((x, idx) => {
                    const src = x.img.startsWith('/') ? x.img : x.img.startsWith('http') ? x.img : `/${x.img}`
                    return (
                      <button
                        key={`${src}-${idx}`}
                        type="button"
                        onClick={() => setSelectedImage(src)}
                        className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-sm hover:shadow-xl transition-all duration-300"
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                        <img
                          src={src}
                          alt={x.title || x.state || 'Portfolio image'}
                          className="w-full h-36 sm:h-40 object-cover group-hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            e.target.src = '/placeholder-image.svg'
                          }}
                        />
                        <div className="absolute bottom-2 left-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-[11px] text-white/90 font-semibold truncate">{x.state || 'State work'}</p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-white/70 text-lg">No portfolio images available yet.</p>
                  <p className="text-white/60 text-sm mt-2">Add images under State Works to populate this section.</p>
                </div>
              )}

              {stateWorkImages.length > 48 && (
                <div className="text-center text-sm text-white/70">
                  Showing 48 of {stateWorkImages.length} images. Use state pages to see district-wise galleries.
                </div>
              )}
            </div>
          )}

          {activeTab === 'events' && (
            <div>
              {events.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {events.map((event) => (
                    <div
                      key={event.id}
                      className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 card-hover group"
                    >
                      {event.image_url && (
                        <div className="relative h-64 overflow-hidden">
                          <img
                            src={event.image_url}
                            alt={event.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                          {event.category && (
                            <span className="absolute top-4 right-4 bg-gradient-to-r from-black to-[#5b0d1b] text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                              {event.category}
                            </span>
                          )}
                        </div>
                      )}
                      <div className="p-6">
                        <h3 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-[#5b0d1b] transition">
                          {event.title}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                        <div className="space-y-2 text-sm text-gray-500">
                          {event.location && (
                            <div className="flex items-center gap-2">
                              <span>📍</span>
                              <span>{event.location}</span>
                            </div>
                          )}
                          {event.event_date && (
                            <div className="flex items-center gap-2">
                              <span>📅</span>
                              <span>{new Date(event.event_date).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-white/70 text-lg">No events available at the moment.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

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

