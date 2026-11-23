import PublicLayout from '../../components/PublicLayout'
import { CtaBand, Icon, PageHero, SectionHeading } from '../../components/ui'

const services = [
  {
    title: 'School activities & campus programs',
    description:
      'End-to-end school activation campaigns, interactive sessions and engagement activities designed for students and educators.',
    icon: 'school',
  },
  {
    title: 'Face-to-face product demonstrations',
    description:
      'High-impact, on-ground demos that put your products directly in consumers’ hands for real-time feedback and experience.',
    icon: 'handshake',
  },
  {
    title: 'Industrial product showcases',
    description: 'Specialised presentations and demonstrations for industrial audiences, decision makers and trade partners.',
    icon: 'factory',
  },
  {
    title: 'Experiential event planning',
    description: 'Concept, design and execution of events that create immersive brand stories and memorable experiences.',
    icon: 'sparkle',
  },
  {
    title: 'Retail & channel activations',
    description: 'In-store promotions, dealer meets and channel programs that drive visibility and conversions.',
    icon: 'cart',
  },
  {
    title: 'Brand & marketing strategy',
    description: 'Integrated campaigns combining on-ground, digital and content to amplify your brand message.',
    icon: 'megaphone',
  },
]

const process = [
  { title: 'Brief', desc: 'We understand your product, audience, cities and the outcome you need.' },
  { title: 'Plan', desc: 'Locations, approvals, manpower, materials and timelines, signed off before day one.' },
  { title: 'Execute', desc: 'Trained teams deliver on the ground with supervisors tracking quality every day.' },
  { title: 'Report', desc: 'Daily photo and video updates, footfall counts and a closing report with learnings.' },
]

export default function Services() {
  return (
    <PublicLayout>
      <PageHero
        eyebrow="Services"
        title={
          <>
            Everything a brand needs <em className="text-gradient font-medium italic">on the ground</em>.
          </>
        }
        subtitle="On-ground experiences, school activities, face-to-face demos and industrial activations tailored to your brand."
        image="/Photos/EPSON FOR BUSINESS/Pune- Jan 2025/Picture1.jpg"
      />

      <section className="bg-white py-16 md:py-24">
        <div className="container-x">
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-200 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => (
              <div key={service.title} className="group relative bg-white p-8 transition duration-300 hover:bg-paper-50 md:p-10">
                <div className="flex items-start justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border border-gold-400/40 text-gold-600 transition group-hover:bg-gold-400 group-hover:text-ink-950">
                    <Icon name={service.icon} className="h-5 w-5" />
                  </span>
                  <span className="font-display text-sm text-zinc-400">0{i + 1}</span>
                </div>
                <h3 className="mt-8 text-2xl text-ink-950">{service.title}</h3>
                <p className="mt-3 leading-relaxed text-zinc-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-paper-50 py-16 md:py-24">
        <div className="container-x">
          <SectionHeading
            eyebrow="Our process"
            title="How a campaign runs"
            subtitle="A simple, accountable process from first call to final report."
          />
          <ol className="grid grid-cols-1 gap-10 md:grid-cols-4 md:gap-6">
            {process.map((step, i) => (
              <li key={step.title} className="relative">
                <div className="flex items-center gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold-400 font-display text-lg text-ink-950">
                    {i + 1}
                  </span>
                  {i < process.length - 1 ? <span className="hidden h-px flex-1 bg-gradient-to-r from-gold-400/60 to-transparent md:block" /> : null}
                </div>
                <h3 className="mt-6 text-2xl text-ink-950">{step.title}</h3>
                <p className="mt-2 leading-relaxed text-zinc-600">{step.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CtaBand />
    </PublicLayout>
  )
}
