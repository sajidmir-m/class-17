import { useEffect } from 'react'
import { Link } from 'react-router-dom'

export const WHATSAPP_NUMBER = '919149559393'
export const CONTACT_EMAIL = 'contact@class17.in'

export const whatsappLink = (text = '') =>
  `https://wa.me/${WHATSAPP_NUMBER}${text ? `?text=${encodeURIComponent(text)}` : ''}`

export function PageHero({ eyebrow, title, subtitle, image, children }) {
  return (
    <section className="relative overflow-hidden border-b border-white/[0.06] bg-ink-950 pb-16 pt-36 md:pb-24 md:pt-44">
      {image ? (
        <img
          src={image}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-20"
        />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-b from-ink-950/60 via-ink-950/80 to-ink-950" />
      <div className="absolute -top-40 left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-gold-500/10 blur-[120px]" />
      <div className="grain absolute inset-0 opacity-[0.04] mix-blend-overlay" />

      <div className="container-x relative">
        <div className="max-w-3xl animate-fade-up">
          {eyebrow ? <p className="eyebrow mb-6">{eyebrow}</p> : null}
          <h1 className="font-display text-4xl font-semibold leading-[1.05] text-white sm:text-5xl md:text-6xl">
            {title}
          </h1>
          {subtitle ? <p className="mt-6 text-base leading-relaxed text-zinc-400 md:text-lg">{subtitle}</p> : null}
          {children ? <div className="mt-8">{children}</div> : null}
        </div>
      </div>
    </section>
  )
}

export function SectionHeading({ eyebrow, title, subtitle, align = 'left', action }) {
  const centered = align === 'center'
  return (
    <div
      className={`mb-12 flex flex-col gap-6 md:mb-16 ${
        centered ? 'items-center text-center' : 'md:flex-row md:items-end md:justify-between'
      }`}
    >
      <div className={centered ? 'flex flex-col items-center' : ''}>
        {eyebrow ? <p className="eyebrow mb-5">{eyebrow}</p> : null}
        <h2 className="section-title">{title}</h2>
        {subtitle ? <p className={`section-subtitle mt-5 ${centered ? 'mx-auto' : ''}`}>{subtitle}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}

export function Chip({ active, onClick, children }) {
  return (
    <button type="button" onClick={onClick} className={active ? 'chip-active' : 'chip'}>
      {children}
    </button>
  )
}

export function Lightbox({ src, caption, onClose }) {
  useEffect(() => {
    if (!src) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [src, onClose])

  if (!src) return null

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-ink-950/95 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close image"
        className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-2xl text-white transition hover:border-gold-400 hover:text-gold-300"
      >
        ×
      </button>
      <figure className="flex max-h-[90vh] max-w-6xl flex-col items-center" onClick={(e) => e.stopPropagation()}>
        <img
          src={src}
          alt={caption || 'Full size view'}
          className="max-h-[82vh] max-w-full rounded-xl object-contain shadow-2xl"
          onError={(e) => {
            e.currentTarget.src = '/placeholder-image.svg'
          }}
        />
        {caption ? <figcaption className="mt-4 text-sm text-zinc-400">{caption}</figcaption> : null}
      </figure>
    </div>
  )
}

export function CtaBand({
  title = 'Have a campaign in mind?',
  subtitle = 'Tell us the brand, the audience and the cities. We will come back with a plan, timelines and costs.',
}) {
  return (
    <section className="bg-ink-950 py-20 md:py-28">
      <div className="container-x">
        <div className="relative overflow-hidden rounded-3xl border border-gold-400/25 bg-gradient-to-br from-ink-850 via-ink-900 to-ink-950 px-6 py-14 text-center md:px-16 md:py-20">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold-500/15 blur-[100px]" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-gold-500/10 blur-[100px]" />
          <div className="relative">
            <p className="eyebrow mb-6 justify-center">Let&apos;s work together</p>
            <h2 className="mx-auto max-w-3xl font-display text-3xl font-semibold leading-tight text-white md:text-5xl">
              {title}
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-zinc-400">{subtitle}</p>
            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Link to="/contact" className="btn-gold">
                Start a conversation
              </Link>
              <a
                href={whatsappLink('Hello Class 17 Events, I would like to discuss a campaign.')}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const iconPaths = {
  school: 'M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.42A12.08 12.08 0 0118.8 17.5L12 21l-6.8-3.5a12.08 12.08 0 01.64-6.92L12 14z',
  handshake: 'M7 11l3-3 3 2 4-4 4 4M3 13l4-2 5 5a2 2 0 002.8 0L21 10M3 13v6h4',
  factory: 'M3 21V10l6 4V10l6 4V6l6 4v11H3zM7 17h2m4 0h2',
  sparkle: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3zM19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15z',
  cart: 'M3 4h2l2.4 11.2a2 2 0 002 1.6h7.7a2 2 0 002-1.6L21 8H6M10 21a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z',
  megaphone: 'M3 11v2a2 2 0 002 2h2l5 4V5L7 9H5a2 2 0 00-2 2zm13-3a5 5 0 010 8M19 5a9 9 0 010 14',
  map: 'M9 20l-6-3V4l6 3m0 13l6-3m-6 3V7m6 10l6 3V7l-6-3m0 13V4',
  chart: 'M4 20V10m6 10V4m6 16v-7m4 7H2',
  mail: 'M4 6h16v12H4V6zm0 0l8 7 8-7',
  phone: 'M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z',
  pin: 'M12 21s-7-6.2-7-11a7 7 0 1114 0c0 4.8-7 11-7 11zm0-8a3 3 0 100-6 3 3 0 000 6z',
  arrow: 'M5 12h14m-6-6l6 6-6 6',
  check: 'M5 13l4 4L19 7',
}

export function Icon({ name, className = 'h-5 w-5' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d={iconPaths[name]} />
    </svg>
  )
}
