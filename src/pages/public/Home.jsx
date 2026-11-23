import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import PublicLayout from '../../components/PublicLayout'
import HeroShowcase from '../../components/HeroShowcase'
import { Chip, CtaBand, Icon, Lightbox, SectionHeading } from '../../components/ui'
import { buildClientCards, featuredClients } from '../../data/clients'
import { mapLocations, slugifyState } from '../../data/states'
import { activityFilters, getActivityKey, getActivityLabel, staticCricketImages, toSrc } from '../../data/activities'

const IndiaPresenceMap = lazy(() => import('../../components/IndiaPresenceMap'))

const GALLERY_PAGE = 16

const pillars = [
  {
    title: 'Pan-India execution',
    desc: 'Campaign rollouts across metros and tier-2 and tier-3 cities, with trained promoters and tight operations.',
  },
  {
    title: 'School & campus strength',
    desc: 'Structured school activities, student engagement and sampling programs run with compliance and safety.',
  },
  {
    title: 'Product storytelling',
    desc: 'Face-to-face demos and industrial showcases that explain features clearly and drive real conversion.',
  },
]

export default function Home() {
  const navigate = useNavigate()
  const [news, setNews] = useState([])
  const [clients, setClients] = useState([])
  const [stateWorks, setStateWorks] = useState([])
  const [showAllStates, setShowAllStates] = useState(false)
  const [lightbox, setLightbox] = useState(null)
  const [activityFilter, setActivityFilter] = useState('')
  const [stateFilter, setStateFilter] = useState('')
  const [galleryCount, setGalleryCount] = useState(GALLERY_PAGE)
  const [selectedState, setSelectedState] = useState('Jammu & Kashmir')

  useEffect(() => {
    const load = async () => {
      try {
        const [newsRes, clientsRes, stateWorksRes] = await Promise.all([
          supabase.from('news').select('*').order('created_at', { ascending: false }).limit(3),
          supabase.from('clients').select('*').order('created_at', { ascending: false }).limit(6),
          supabase.from('state_works').select('*').order('created_at', { ascending: false }),
        ])
        if (newsRes.data) setNews(newsRes.data)
        if (clientsRes.data) setClients(clientsRes.data)
        if (stateWorksRes.data) setStateWorks(stateWorksRes.data)
      } catch (error) {
        console.error('Error fetching home data:', error)
      }
    }
    load()
  }, [])

  useEffect(() => {
    setGalleryCount(GALLERY_PAGE)
  }, [activityFilter, stateFilter])

  const clientCards = useMemo(() => buildClientCards(clients).slice(0, 6), [clients])

  const allImages = useMemo(() => {
    const fromWorks = stateWorks.flatMap((w) =>
      (Array.isArray(w.images) ? w.images : []).filter(Boolean).map((img) => ({ img, state: w.state || '' }))
    )
    return [...staticCricketImages, ...fromWorks]
  }, [stateWorks])

  const stateOptions = useMemo(
    () => Array.from(new Set(allImages.map((i) => i.state.trim()).filter(Boolean))).sort((a, b) => a.localeCompare(b)),
    [allImages]
  )

  const filteredImages = useMemo(
    () =>
      allImages.filter(({ img, state }) => {
        if (stateFilter && state.trim() !== stateFilter) return false
        if (!activityFilter) return true
        return getActivityKey(img) === activityFilter
      }),
    [allImages, activityFilter, stateFilter]
  )

  const visibleStateWorks = showAllStates ? stateWorks : stateWorks.slice(0, 6)

  return (
    <PublicLayout>
      <HeroShowcase />

      {/* Trusted by */}
      <section className="border-y border-zinc-200 bg-white py-8">
        <div className="container-x flex flex-col items-center gap-6 md:flex-row">
          <p className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.3em] text-zinc-500">Trusted by</p>
          <div className="relative w-full overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
            <div className="flex w-max animate-marquee gap-12 motion-reduce:animate-none">
              {[...featuredClients, ...featuredClients].map((name, i) => (
                <span key={`${name}-${i}`} className="flex items-center gap-12 whitespace-nowrap font-display text-lg text-zinc-600">
                  {name}
                  <span className="h-1 w-1 rounded-full bg-gold-500" />
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="bg-white py-16 md:py-24">
        <div className="container-x grid grid-cols-1 gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow mb-6">Who we are</p>
            <h2 className="section-title">
              We turn brand briefs into <em className="text-gradient font-medium italic">moments</em> people remember.
            </h2>
            <p className="mt-6 leading-relaxed text-zinc-600">
              Class 17 plans and runs on-ground marketing for leading brands, from a single school session to
              multi-state rollouts. Strategy, people and reporting under one roof.
            </p>
            <Link to="/about" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-gold-700 hover:text-gold-600">
              More about us <Icon name="arrow" className="h-4 w-4" />
            </Link>
          </div>
          <div className="lg:col-span-7 lg:pl-8">
            <ol className="divide-y divide-zinc-200 border-y border-zinc-200">
              {pillars.map((p, i) => (
                <li key={p.title} className="group grid grid-cols-[auto_1fr] gap-6 py-8 md:gap-10">
                  <span className="font-display text-3xl text-gold-500/70 transition group-hover:text-gold-700">
                    0{i + 1}
                  </span>
                  <div>
                    <h3 className="text-2xl text-ink-950">{p.title}</h3>
                    <p className="mt-2 leading-relaxed text-zinc-600">{p.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Clients */}
      <section className="bg-paper-50 py-16 md:py-24">
        <div className="container-x">
          <SectionHeading
            eyebrow="Our clients"
            title="Brands that trust us on the ground"
            subtitle="Leading names we activate across schools, retail, sports and industrial sectors."
            action={
              <Link to="/clients" className="btn-outline">
                View all clients
              </Link>
            }
          />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {clientCards.map((c) => (
              <article key={c.name} className="card-interactive group overflow-hidden">
                <div className="flex h-44 items-center justify-center overflow-hidden bg-zinc-100">
                  {c.logo ? (
                    <img
                      loading="lazy"
                      decoding="async"
                      src={c.logo}
                      alt={c.name}
                      className="h-full w-full object-contain p-6 transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <span className="px-4 text-center font-display text-xl text-ink-900">{c.name}</span>
                  )}
                </div>
                <div className="p-7">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-600">
                    {c.details.sectors.join(' · ')}
                  </p>
                  <h3 className="mt-3 text-xl text-ink-950">{c.name}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-600 line-clamp-3">{c.details.highlight}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Cricket feature */}
      <section className="bg-white py-16 md:py-24">
        <div className="container-x">
          <SectionHeading
            eyebrow="Featured"
            title="Cricket & sports activations"
            subtitle="Live screenings, ground activations and fan engagement, from Kolkata to Jammu."
          />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:grid-rows-2">
            {staticCricketImages.map(({ img, state }, idx) => (
              <button
                key={img}
                type="button"
                onClick={() => setLightbox({ src: img, caption: `Cricket · ${state}` })}
                className={`group relative overflow-hidden rounded-2xl border border-zinc-200 ${
                  idx === 0 ? 'col-span-2 row-span-2 aspect-square md:aspect-auto' : idx === 3 ? 'col-span-2 aspect-[2/1]' : 'aspect-square'
                }`}
              >
                <img
                  loading="lazy"
                  decoding="async"
                  src={img}
                  alt={`Cricket activity in ${state}`}
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent to-transparent" />
                <span className="absolute bottom-4 left-4 flex items-center gap-2 text-xs font-medium text-white">
                  <Icon name="pin" className="h-3.5 w-3.5 text-gold-600" />
                  {state}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="bg-paper-50 py-16 md:py-24">
        <div className="container-x">
          <SectionHeading
            eyebrow="Pan-India presence"
            title="Explore our work, state by state"
            subtitle="Tap any state on the map to see the activities, photos and brands we have delivered there."
            align="center"
          />
          <Suspense fallback={<div className="h-[520px] animate-pulse rounded-2xl bg-paper-100 md:h-[640px]" />}>
            <IndiaPresenceMap
              locations={mapLocations}
              activeName={selectedState}
              onSelect={(name) => {
                setSelectedState(name)
                navigate(`/states/${slugifyState(name)}`)
              }}
            />
          </Suspense>
        </div>
      </section>

      {/* State highlights */}
      <section className="bg-white py-16 md:py-24">
        <div className="container-x">
          <SectionHeading
            eyebrow="State highlights"
            title="Campaigns across India"
            subtitle="A snapshot of on-ground work in each state. Open a card for activities, galleries and brand details."
            action={
              <Link to="/contact" className="btn-outline">
                Plan your state campaign
              </Link>
            }
          />

          {stateWorks.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {visibleStateWorks.map((work) => (
                  <Link key={work.id} to={`/states/${work.slug}`} className="card-interactive group flex flex-col overflow-hidden">
                    <div className="relative h-52 overflow-hidden bg-paper-100">
                      {Array.isArray(work.images) && work.images.length > 0 ? (
                        <img
                          loading="lazy"
                          decoding="async"
                          src={toSrc(work.images[0])}
                          alt={work.title || work.state}
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                        />
                      ) : null}
                      <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/10 to-transparent" />
                      <span className="absolute bottom-4 left-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-300">
                        {work.state}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="text-xl text-ink-950">
                        {(work.title || 'On-ground activations').replace(/^\s*epson\s+/i, '')}
                      </h3>
                      {work.description ? (
                        <p className="mt-3 text-sm leading-relaxed text-zinc-600 line-clamp-3">{work.description}</p>
                      ) : null}
                      <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold text-gold-700">
                        View state work <Icon name="arrow" className="h-4 w-4 transition group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
              {stateWorks.length > 6 ? (
                <div className="mt-12 flex justify-center">
                  <button type="button" onClick={() => setShowAllStates((v) => !v)} className="btn-outline">
                    {showAllStates ? 'Show fewer states' : `View all ${stateWorks.length} states`}
                  </button>
                </div>
              ) : null}
            </>
          ) : (
            <div className="card p-10 text-center text-sm text-zinc-600">
              State campaigns appear here automatically once they are added in the admin State Works section.
            </div>
          )}
        </div>
      </section>

      {/* Activities gallery */}
      <section className="bg-paper-50 py-16 md:py-24">
        <div className="container-x">
          <SectionHeading
            eyebrow="All activities"
            title="Moments from the field"
            subtitle="Filter by activity type and state. Every photo is tagged with where it happened."
          />

          <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {activityFilters.map((opt) => (
                <Chip key={opt.key || 'all'} active={activityFilter === opt.key} onClick={() => setActivityFilter(opt.key)}>
                  {opt.label}
                </Chip>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <select
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
                aria-label="Filter by state"
                className="input-dark w-full py-2.5 lg:w-60"
              >
                <option value="">All states</option>
                {stateOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              {(stateFilter || activityFilter) && (
                <button
                  type="button"
                  onClick={() => {
                    setStateFilter('')
                    setActivityFilter('')
                  }}
                  className="whitespace-nowrap text-xs font-semibold text-gold-700 hover:text-gold-600"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {filteredImages.length > 0 ? (
            <>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
                {filteredImages.slice(0, galleryCount).map(({ img, state }, idx) => {
                  const src = toSrc(img)
                  const label = getActivityLabel(img)
                  const place = state || 'Pan-India'
                  return (
                    <button
                      key={`${src}-${idx}`}
                      type="button"
                      onClick={() => setLightbox({ src, caption: `${label} · ${place}` })}
                      className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-zinc-200 bg-paper-100"
                    >
                      <img
                        loading="lazy"
                        decoding="async"
                        src={src}
                        alt={`${label} in ${place}`}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder-image.svg'
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-transparent to-transparent" />
                      <div className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-2 text-left">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-gold-300">{label}</span>
                        <span className="flex items-center gap-1 truncate text-[11px] text-zinc-200">
                          <Icon name="pin" className="h-3 w-3 shrink-0" />
                          <span className="truncate">{place}</span>
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
              {filteredImages.length > galleryCount ? (
                <div className="mt-12 flex justify-center">
                  <button type="button" onClick={() => setGalleryCount((n) => n + GALLERY_PAGE)} className="btn-outline">
                    Load more ({filteredImages.length - galleryCount} remaining)
                  </button>
                </div>
              ) : null}
            </>
          ) : (
            <div className="card p-10 text-center text-sm text-zinc-600">No photos match this filter yet.</div>
          )}
        </div>
      </section>

      {/* News */}
      {news.length > 0 ? (
        <section className="bg-white py-16 md:py-24">
          <div className="container-x">
            <SectionHeading eyebrow="Latest news" title="Updates & announcements" />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {news.map((item) => (
                <article key={item.id} className="card-interactive overflow-hidden">
                  {item.image_url ? (
                    <div className="h-52 overflow-hidden">
                      <img loading="lazy" decoding="async" src={item.image_url} alt={item.title} className="h-full w-full object-cover" />
                    </div>
                  ) : null}
                  <div className="p-6">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">
                      {item.created_at ? new Date(item.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                    </p>
                    <h3 className="mt-3 text-xl text-ink-950">{item.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-zinc-600 line-clamp-3">{item.content}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <CtaBand />

      <Lightbox src={lightbox?.src} caption={lightbox?.caption} onClose={() => setLightbox(null)} />
    </PublicLayout>
  )
}
