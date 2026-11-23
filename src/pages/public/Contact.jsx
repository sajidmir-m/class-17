import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import PublicLayout from '../../components/PublicLayout'
import { CONTACT_EMAIL, Icon, PageHero, whatsappLink } from '../../components/ui'

const emptyForm = { name: '', email: '', phone: '', message: '' }

export default function Contact() {
  const [formData, setFormData] = useState(emptyForm)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const update = (field) => (e) => setFormData({ ...formData, [field]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.from('messages').insert([formData])
      if (error) throw error

      setSuccess(true)
      setFormData(emptyForm)
      setTimeout(() => setSuccess(false), 5000)
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Error sending message: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const channels = [
    {
      icon: 'mail',
      label: 'Email',
      value: CONTACT_EMAIL,
      href: `mailto:${CONTACT_EMAIL}`,
    },
    {
      icon: 'phone',
      label: 'WhatsApp',
      value: '+91 91495 59393',
      href: whatsappLink('Hello Class 17 Events, I would like to get in touch.'),
      external: true,
    },
    {
      icon: 'map',
      label: 'Coverage',
      value: 'Pan-India: metros, tier-2 and district towns',
    },
  ]

  return (
    <PublicLayout>
      <PageHero
        eyebrow="Contact"
        title={
          <>
            Let&apos;s build your next <em className="text-gradient font-medium italic">campaign</em>.
          </>
        }
        subtitle="Send us a message and we will respond as soon as possible. For anything urgent, WhatsApp is the fastest way to reach us."
      />

      <section className="bg-white pb-24 md:pb-32">
        <div className="container-x grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-5">
            {channels.map((c) => {
              const body = (
                <>
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gold-400/40 text-gold-600">
                    <Icon name={c.icon} className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-xs uppercase tracking-[0.2em] text-zinc-500">{c.label}</span>
                    <span className="mt-1 block text-lg text-ink-950">{c.value}</span>
                  </span>
                </>
              )
              return c.href ? (
                <a
                  key={c.label}
                  href={c.href}
                  target={c.external ? '_blank' : undefined}
                  rel={c.external ? 'noopener noreferrer' : undefined}
                  className="card-interactive flex items-center gap-5 p-6"
                >
                  {body}
                </a>
              ) : (
                <div key={c.label} className="card flex items-center gap-5 p-6">
                  {body}
                </div>
              )
            })}
          </div>

          <form onSubmit={handleSubmit} className="card space-y-6 p-7 md:p-10 lg:col-span-7">
            {success ? (
              <div className="flex items-center gap-3 rounded-xl border border-gold-400/40 bg-gold-400/10 px-5 py-4 text-sm text-gold-600">
                <Icon name="check" className="h-5 w-5" />
                Message sent. We will get back to you soon.
              </div>
            ) : null}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="name" className="label-dark">Full name</label>
                <input id="name" type="text" required value={formData.name} onChange={update('name')} className="input-dark" placeholder="Your name" />
              </div>
              <div>
                <label htmlFor="email" className="label-dark">Email</label>
                <input id="email" type="email" required value={formData.email} onChange={update('email')} className="input-dark" placeholder="you@company.com" />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="label-dark">
                Phone <span className="normal-case tracking-normal text-zinc-400">(optional)</span>
              </label>
              <input id="phone" type="tel" value={formData.phone} onChange={update('phone')} className="input-dark" placeholder="+91" />
            </div>

            <div>
              <label htmlFor="message" className="label-dark">Message</label>
              <textarea
                id="message"
                required
                rows="6"
                value={formData.message}
                onChange={update('message')}
                className="input-dark resize-none"
                placeholder="Tell us about the brand, audience, cities and timelines."
              />
            </div>

            <button type="submit" disabled={loading} className="btn-gold w-full disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? 'Sending…' : 'Send message'}
            </button>
          </form>
        </div>
      </section>
    </PublicLayout>
  )
}
