import { Link } from 'react-router-dom'
import PublicLayout from '../../components/PublicLayout'
import { CtaBand, Icon, PageHero } from '../../components/ui'

const stats = [
  { value: '500+', label: 'Events organised' },
  { value: '10+', label: 'Years of experience' },
  { value: '100%', label: 'Client satisfaction' },
]

const values = [
  { title: 'Plan before we play', desc: 'Every activation starts with clear objectives, approvals, locations and manpower planning.' },
  { title: 'People on the ground', desc: 'Trained promoters and team leads who represent your brand with discipline and warmth.' },
  { title: 'Proof, every day', desc: 'Daily reporting with photos, videos and counts, so you always know what was delivered.' },
]

export default function About() {
  return (
    <PublicLayout>
      <PageHero
        eyebrow="About us"
        title={
          <>
            Crafting experiences that turn ideas into <em className="text-gradient font-medium italic">results</em>.
          </>
        }
        subtitle="Class 17 Events is a marketing and advertising company that brings brands face to face with the people who matter to them."
        image="/Social activity/social activity in kolkata/social activity kol 2.png"
      />

      <section className="bg-white py-16 md:py-24">
        <div className="container-x grid grid-cols-1 gap-16 lg:grid-cols-2">
          <div>
            <p className="eyebrow mb-6">Our story</p>
            <h2 className="section-title">Ideas that speak louder than words.</h2>
          </div>
          <div className="space-y-6 text-lg leading-relaxed text-zinc-600">
            <p>
              We are an event management and marketing company dedicated to creating experiences that leave a lasting
              impact. Our team brings your vision to life, combining creativity with careful attention to detail.
            </p>
            <p>
              Over the years we have organised hundreds of activations, from school programs and retail demos to
              cricket engagements and corporate events, across metros and district towns alike.
            </p>
          </div>
        </div>

        <div className="container-x mt-20">
          <dl className="grid grid-cols-1 divide-y divide-zinc-200 border-y border-zinc-200 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {stats.map((s) => (
              <div key={s.label} className="py-10 text-center">
                <dt className="font-display text-5xl text-gradient md:text-6xl">{s.value}</dt>
                <dd className="mt-3 text-xs uppercase tracking-[0.25em] text-zinc-500">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Founder */}
      <section className="relative overflow-hidden bg-paper-50 py-16 md:py-24">
        <div className="absolute right-0 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-gold-500/10 blur-[140px]" />
        <div className="container-x relative grid grid-cols-1 items-center gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="relative mx-auto w-full max-w-md">
              <div className="absolute -bottom-5 -right-5 h-full w-full rounded-2xl border border-gold-400/50" />
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-paper-100 shadow-2xl">
                <img
                  src="/ashiq.jpeg"
                  alt="MD Ashique Sidique, Founder & Chairman"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder-image.svg'
                  }}
                />
              </div>
            </div>
          </div>
          <div className="lg:col-span-7">
            <p className="eyebrow mb-6">Founder &amp; Chairman</p>
            <h2 className="font-display text-4xl font-semibold text-ink-950 md:text-6xl">MD Ashique Sidique</h2>
            <blockquote className="mt-8 border-l-2 border-gold-400 pl-6 font-display text-xl italic leading-relaxed text-zinc-700 md:text-2xl">
              Best-in-class leadership behind strategy-led activations and on-ground execution across India, with
              disciplined operations, trained teams and measurable reporting.
            </blockquote>
            <Link to="/founder" className="btn-gold mt-10">
              View founder profile <Icon name="arrow" className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="container-x">
          <p className="eyebrow mb-6">How we work</p>
          <h2 className="section-title max-w-2xl">Three promises on every project.</h2>
          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
            {values.map((v, i) => (
              <div key={v.title} className="card p-8">
                <span className="font-display text-4xl text-gold-500/60">0{i + 1}</span>
                <h3 className="mt-6 text-2xl text-ink-950">{v.title}</h3>
                <p className="mt-3 leading-relaxed text-zinc-600">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </PublicLayout>
  )
}
