import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import PublicLayout from '../../components/PublicLayout'
import { Chip, CtaBand, Icon, Lightbox, PageHero } from '../../components/ui'
import { toSrc } from '../../data/activities'

const CAMPAIGN_TYPES = [
  { key: 'business', label: 'Business' },
  { key: 'education', label: 'Education' },
  { key: 'healthcare', label: 'Healthcare' },
  { key: 'printer-challenge', label: 'Printer Challenge' },
  { key: 'cricket', label: 'Cricket' },
  { key: 'social', label: 'Social' },
  { key: 'school', label: 'School' },
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

  const s = img.toLowerCase()
  if (s.includes('cricket')) return 'cricket'
  if (s.includes('social activity')) return 'social'
  if (s.includes('school activity')) return 'school'

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
  const [lightbox, setLightbox] = useState(null)
  const [visibleCount, setVisibleCount] = useState(24)

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

  const allImages = useMemo(
    () =>
      (stateWorks || [])
        .flatMap((w) => (Array.isArray(w.images) ? w.images.map((img) => ({ img, state: w.state, title: w.title })) : []))
        .filter((x) => x && x.img),
    [stateWorks]
  )

  const stateWorkImages = useMemo(
    () => (selectedType ? allImages.filter((x) => extractTypeFromImagePath(x.img) === selectedType) : allImages),
    [allImages, selectedType]
  )

  const visibleTypes = useMemo(() => {
    const present = new Set(allImages.map((x) => extractTypeFromImagePath(x.img)).filter(Boolean))
    return CAMPAIGN_TYPES.filter((t) => present.has(t.key))
  }, [allImages])

  useEffect(() => {
    setVisibleCount(24)
  }, [selectedType])

  return (
    <PublicLayout>
      <PageHero
        eyebrow="Our work"
        title={
          <>
            A portfolio built <em className="text-gradient font-medium italic">district</em> by district.
          </>
        }
        subtitle="A curated view of state activations, face-to-face engagement and high-impact brand experiences."
        image="/Photos/EPSON FOR HEALTHCARE/Delhi- July 2024/Picture1.jpg"
      >
        <div className="inline-flex rounded-full border border-zinc-200 bg-white/90 p-1">
          {[
            ['state-works', 'State activations'],
            ['events', 'Events'],
          ].map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                activeTab === key ? 'bg-gold-400 text-ink-950' : 'text-zinc-600 hover:text-ink-950'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </PageHero>

      <section className="bg-white py-16 md:py-24">
        <div className="container-x">
          {activeTab === 'state-works' && (
            <>
              {visibleTypes.length > 0 ? (
                <div className="mb-10 flex flex-wrap gap-2">
                  <Chip active={!selectedType} onClick={() => setSelectedType('')}>
                    All types
                  </Chip>
                  {visibleTypes.map((t) => (
                    <Chip key={t.key} active={selectedType === t.key} onClick={() => setSelectedType(t.key)}>
                      {t.label}
                    </Chip>
                  ))}
                </div>
              ) : null}

              {stateWorkImages.length > 0 ? (
                <div className="columns-2 gap-3 sm:columns-3 md:gap-4 lg:columns-4">
                  {stateWorkImages.slice(0, visibleCount).map((x, idx) => {
                    const src = toSrc(x.img)
                    const typeLabel = CAMPAIGN_TYPES.find((t) => t.key === extractTypeFromImagePath(x.img))?.label || 'Brand activation'
                    const caption = `${typeLabel} · ${x.state || 'State work'}`
                    return (
                      <button
                        key={`${src}-${idx}`}
                        type="button"
                        onClick={() => setLightbox({ src, caption })}
                        className="group relative mb-3 block w-full overflow-hidden rounded-xl border border-zinc-200 bg-paper-100 md:mb-4"
                      >
                        <img
                          loading="lazy"
                          decoding="async"
                          src={src}
                          alt={x.title || caption}
                          className="w-full transition duration-500 group-hover:scale-105"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder-image.svg'
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
                        <div className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-2 text-left opacity-0 transition group-hover:opacity-100">
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-gold-300">{typeLabel}</span>
                          <span className="truncate text-[11px] text-zinc-200">{x.state}</span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              ) : (
                <div className="card p-10 text-center text-zinc-600">
                  No portfolio images yet. Add images under State Works in the admin panel.
                </div>
              )}

              {stateWorkImages.length > visibleCount ? (
                <div className="mt-12 flex justify-center">
                  <button type="button" onClick={() => setVisibleCount((n) => n + 24)} className="btn-outline">
                    Load more ({stateWorkImages.length - visibleCount} remaining)
                  </button>
                </div>
              ) : null}
            </>
          )}

          {activeTab === 'events' &&
            (events.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {events.map((event) => (
                  <article key={event.id} className="card-interactive group overflow-hidden">
                    {event.image_url ? (
                      <div className="relative h-60 overflow-hidden">
                        <img
                          loading="lazy"
                          decoding="async"
                          src={event.image_url}
                          alt={event.title}
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                        />
                        {event.category ? (
                          <span className="absolute right-4 top-4 rounded-full bg-gold-400 px-3 py-1 text-[11px] font-semibold text-ink-950">
                            {event.category}
                          </span>
                        ) : null}
                      </div>
                    ) : null}
                    <div className="p-6">
                      <h3 className="text-2xl text-ink-950">{event.title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-zinc-600 line-clamp-2">{event.description}</p>
                      <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-zinc-500">
                        {event.location ? (
                          <span className="flex items-center gap-1.5">
                            <Icon name="pin" className="h-3.5 w-3.5 text-gold-600" />
                            {event.location}
                          </span>
                        ) : null}
                        {event.event_date ? (
                          <span>{new Date(event.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        ) : null}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="card p-10 text-center text-zinc-600">No events published yet.</div>
            ))}
        </div>
      </section>

      <CtaBand />
      <Lightbox src={lightbox?.src} caption={lightbox?.caption} onClose={() => setLightbox(null)} />
    </PublicLayout>
  )
}

