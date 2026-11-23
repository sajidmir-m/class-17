import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const SLIDE_MS = 6500

const slides = [
  { src: '/cricket activities/jammu/cricket 2.png', activity: 'Cricket', place: 'Jammu & Kashmir', position: 'center 30%' },
  { src: '/cricket activities/kolkata/cricket 1.png', activity: 'Sports', place: 'Kolkata, West Bengal', position: 'center 40%' },
  { src: '/Social activity/social activity in kolkata/social activity kol 2.png', activity: 'Social', place: 'Kolkata, West Bengal', position: 'center 35%' },
  { src: '/Photos/EPSON FOR EDUCATION/Indore- Feb 2026/WhatsApp Image 2026-02-23 at 06.40.11.jpeg', activity: 'Education', place: 'Indore, Madhya Pradesh', position: 'center' },
  { src: '/school activity/kolkata/school.png', activity: 'School', place: 'Kolkata, West Bengal', position: 'center' },
]

const stats = [
  { value: '500+', label: 'Activations delivered' },
  { value: '10+', label: 'Years on ground' },
  { value: 'Pan-India', label: 'Metro to district reach' },
]

export default function HeroShowcase() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    const id = setTimeout(() => setActive((i) => (i + 1) % slides.length), SLIDE_MS)
    return () => clearTimeout(id)
  }, [active, paused])

  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden)
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  const current = slides[active]

  return (
    <section className="on-dark relative isolate h-[100svh] min-h-[640px] overflow-hidden bg-ink-950 text-white">
      {slides.map((slide, i) => {
        const isActive = i === active
        return (
          <div
            key={slide.src}
            className={`absolute inset-0 transition-opacity duration-[1600ms] ease-in-out ${
              isActive ? 'opacity-100' : 'opacity-0'
            }`}
            aria-hidden={!isActive}
          >
            <img
              key={isActive ? `${slide.src}-${active}` : slide.src}
              src={slide.src}
              alt=""
              loading={i === 0 ? 'eager' : 'lazy'}
              decoding="async"
              style={{ objectPosition: slide.position }}
              className={`h-full w-full object-cover ${
                isActive ? (i % 2 === 0 ? 'motion-safe:animate-kenburns-in' : 'motion-safe:animate-kenburns-out') : ''
              }`}
            />
          </div>
        )
      })}

      <div className="absolute inset-0 bg-gradient-to-r from-ink-950/95 via-ink-950/70 to-ink-950/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/30 to-ink-950/60" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_15%_60%,rgba(201,160,63,0.18),transparent_55%)]" />
      <div className="grain pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay" />

      <div className="container-x relative flex h-full flex-col justify-end pb-10 pt-28 md:pb-14">
        <div className="max-w-3xl">
          <p className="eyebrow mb-7 animate-fade-up">
            Marketing &amp; Advertising<span className="hidden sm:inline"> · Pan-India</span>
          </p>
          <h1 className="font-display text-[2.6rem] font-semibold leading-[1.02] sm:text-6xl md:text-7xl lg:text-[5.5rem]">
            <span className="block animate-fade-up [animation-delay:120ms]">Ideas that speak</span>
            <span className="block animate-fade-up [animation-delay:240ms]">
              <em className="text-gradient pr-2 font-medium italic">louder</em> than words.
            </span>
          </h1>
          <p className="mt-7 max-w-xl animate-fade-up text-base leading-relaxed text-zinc-300 [animation-delay:360ms] md:text-lg">
            Brand activations, school programs, cricket and sports engagement, and on-ground events, planned with
            strategy and executed across India.
          </p>
          <div className="mt-9 flex animate-fade-up flex-col gap-4 [animation-delay:480ms] sm:flex-row">
            <Link to="/contact" className="btn-gold">
              Plan a campaign
            </Link>
            <Link to="/portfolio" className="btn-outline">
              See our work
            </Link>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-8 border-t border-white/10 pt-6 md:mt-16 md:flex-row md:items-end md:justify-between">
          <dl className="grid grid-cols-3 gap-4 md:gap-12">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="whitespace-nowrap font-display text-xl text-white sm:text-2xl md:text-3xl">{s.value}</dt>
                <dd className="mt-1 text-[10px] uppercase tracking-[0.12em] text-zinc-400 sm:text-[11px] md:text-xs">{s.label}</dd>
              </div>
            ))}
          </dl>

          <div className="w-full md:w-72">
            <div className="mb-3 flex items-baseline justify-between text-xs">
              <span className="font-semibold uppercase tracking-[0.2em] text-gold-300">{current.activity}</span>
              <span className="text-zinc-400">{current.place}</span>
            </div>
            <div className="flex gap-1.5">
              {slides.map((slide, i) => (
                <button
                  key={slide.src}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`Show ${slide.activity} in ${slide.place}`}
                  className="group h-6 flex-1 py-2.5"
                >
                  <span className="block h-[3px] overflow-hidden rounded-full bg-white/20">
                    <span
                      key={i === active ? `bar-${active}` : `bar-${i}`}
                      className={`block h-full origin-left bg-gold-400 ${
                        i < active ? 'scale-x-100' : i === active ? 'animate-progress' : 'scale-x-0'
                      }`}
                      style={
                        i === active
                          ? { animationDuration: `${SLIDE_MS}ms`, animationPlayState: paused ? 'paused' : 'running' }
                          : undefined
                      }
                    />
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
