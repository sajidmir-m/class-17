import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import PublicLayout from '../../components/PublicLayout'
import { CtaBand, Icon, Lightbox, PageHero, SectionHeading } from '../../components/ui'
import { buildClientCards } from '../../data/clients'
import { getActivityLabel, toSrc } from '../../data/activities'

export default function Clients() {
  const [clients, setClients] = useState([])
  const [stateWorks, setStateWorks] = useState([])
  const [lightbox, setLightbox] = useState(null)

  useEffect(() => {
    const load = async () => {
      const [clientsRes, worksRes] = await Promise.all([
        supabase.from('clients').select('*').order('created_at', { ascending: false }),
        supabase.from('state_works').select('state, images').order('created_at', { ascending: false }),
      ])
      if (clientsRes.data) setClients(clientsRes.data)
      if (worksRes.data) setStateWorks(worksRes.data)
    }
    load()
  }, [])

  const cards = useMemo(() => buildClientCards(clients), [clients])

  const gallery = useMemo(
    () =>
      stateWorks
        .flatMap((w) => (Array.isArray(w.images) ? w.images.slice(0, 2).map((img) => ({ img, state: w.state })) : []))
        .slice(0, 8),
    [stateWorks]
  )

  return (
    <PublicLayout>
      <PageHero
        eyebrow="Clients"
        title={
          <>
            Trusted by brands that <em className="text-gradient font-medium italic">lead</em>.
          </>
        }
        subtitle="From technology and education to sports, media and insurance, we bring leading brands closer to their audiences."
        image="/cricket activities/kolkata/cricket 1.png"
      />

      <section className="bg-ink-950 py-24 md:py-32">
        <div className="container-x grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((c) => (
            <article key={c.name} className="card-interactive group flex flex-col overflow-hidden">
              <div className="flex h-48 items-center justify-center overflow-hidden bg-zinc-100">
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
              <div className="flex flex-1 flex-col p-7">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-400">{c.details.sectors.join(' · ')}</p>
                <h3 className="mt-3 text-2xl text-white">{c.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">{c.details.highlight}</p>
                {c.website ? (
                  <a
                    href={c.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold text-gold-300 hover:text-gold-200"
                  >
                    Visit website <Icon name="arrow" className="h-4 w-4" />
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </section>

      {gallery.length > 0 ? (
        <section className="bg-ink-900 py-24 md:py-32">
          <div className="container-x">
            <SectionHeading
              eyebrow="In the field"
              title="Client activations"
              subtitle="A glimpse of brand promotions, school activities, sports events and demonstrations we have run."
            />
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
              {gallery.map(({ img, state }, idx) => {
                const src = toSrc(img)
                const caption = `${getActivityLabel(img)} · ${state || 'Pan-India'}`
                return (
                  <button
                    key={`${src}-${idx}`}
                    type="button"
                    onClick={() => setLightbox({ src, caption })}
                    className="group relative aspect-square overflow-hidden rounded-xl border border-white/[0.08]"
                  >
                    <img
                      loading="lazy"
                      decoding="async"
                      src={src}
                      alt={caption}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent to-transparent" />
                    <span className="absolute bottom-3 left-3 text-[11px] text-zinc-200">{caption}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </section>
      ) : null}

      <CtaBand title="Want your brand on this list?" />
      <Lightbox src={lightbox?.src} caption={lightbox?.caption} onClose={() => setLightbox(null)} />
    </PublicLayout>
  )
}
