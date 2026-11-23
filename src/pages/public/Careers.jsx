import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import PublicLayout from '../../components/PublicLayout'
import { Icon, PageHero, SectionHeading, whatsappLink } from '../../components/ui'

const emptyForm = { name: '', email: '', phone: '', city: '', interest: '', message: '', resume: null }

const internshipRole = {
  title: 'Marketing & Advertising Internship',
  location: 'On-ground / field + office coordination',
  type: 'Internship',
  salary: 'Stipend (performance-based) + certificate',
  isInternship: true,
}

const internshipPerks = [
  { label: 'Stipend', value: 'Performance-based', note: 'Based on performance and role' },
  { label: 'Certificate', value: 'Internship certificate', note: 'On successful completion' },
  { label: 'Work', value: 'Real activities', note: 'On-ground execution and reporting' },
]

const internshipTasks = [
  'Support on-ground promotions and brand activations',
  'Engage audiences, explain products and offers, capture feedback',
  'Coordinate with team leads for setup and execution',
  'Photo and video documentation with daily reporting',
  'Basic social content coordination when needed',
  'Learn field discipline, communication and campaign operations',
]

const openWhatsApp = (text) => window.open(whatsappLink(text), '_blank', 'noopener,noreferrer')

export default function Careers() {
  const [jobs, setJobs] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [selectedJob, setSelectedJob] = useState(null)
  const [formData, setFormData] = useState(emptyForm)

  useEffect(() => {
    supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => data && setJobs(data))
  }, [])

  const update = (field) => (e) => setFormData({ ...formData, [field]: e.target.value })

  const openForm = (job) => {
    setSelectedJob(job)
    setFormData(emptyForm)
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setSelectedJob(null)
  }

  const applyOnWhatsApp = (job) =>
    openWhatsApp(
      [
        'Hello Class 17 Events, I want to apply for this job.',
        '',
        `Job Title: ${job.title || '-'}`,
        `Location: ${job.location || '-'}`,
        `Type: ${job.type || '-'}`,
        '',
        'My Details:',
        'Name: ',
        'Phone: ',
        'Email: ',
        'City: ',
        '',
        'Message: ',
      ].join('\n')
    )

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (selectedJob?.isInternship) {
        openWhatsApp(
          [
            'Hello Class 17 Events, I want to apply for the Marketing & Advertising Internship.',
            '',
            `Name: ${formData.name || '-'}`,
            `Phone: ${formData.phone || '-'}`,
            `Email: ${formData.email || '-'}`,
            `City: ${formData.city || '-'}`,
            `Interested in: ${formData.interest || '-'}`,
            '',
            `Message: ${formData.message || '-'}`,
            '',
            'Note: I can share my resume on WhatsApp if needed.',
          ].join('\n')
        )
        closeForm()
        return
      }

      let resumeUrl = ''
      if (formData.resume) {
        const fileExt = formData.resume.name.split('.').pop()
        const filePath = `resumes/${Math.random()}.${fileExt}`
        const { error: uploadError } = await supabase.storage.from('resumes').upload(filePath, formData.resume)
        if (uploadError) throw uploadError
        resumeUrl = filePath
      }

      const { error } = await supabase.from('applications').insert([
        {
          job_id: selectedJob.id,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          resume_url: resumeUrl,
        },
      ])
      if (error) throw error

      alert('Application submitted successfully!')
      closeForm()
    } catch (error) {
      console.error('Error submitting application:', error)
      alert('Error submitting application: ' + error.message)
    }
  }

  const isInternship = Boolean(selectedJob?.isInternship)

  return (
    <PublicLayout>
      <PageHero
        eyebrow="Careers"
        title={
          <>
            Do work you can <em className="text-gradient font-medium italic">see</em>.
          </>
        }
        subtitle="Join a team that runs real campaigns for real brands, in schools, markets, stadiums and streets across India."
        image="/school activity/kolkata/school.png"
      />

      {/* Internship */}
      <section className="bg-white pb-16 md:pb-24">
        <div className="container-x">
          <div className="relative overflow-hidden rounded-3xl border border-gold-400/40 bg-gradient-to-br from-gold-100/60 via-white to-paper-50 shadow-[0_30px_80px_-40px_rgba(16,16,20,0.25)]">
            <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-gold-300/30 blur-[120px]" />
            <div className="relative grid grid-cols-1 gap-12 p-7 md:p-12 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <p className="eyebrow mb-6">Internship opportunity</p>
                <h2 className="font-display text-3xl font-semibold text-ink-950 md:text-5xl">{internshipRole.title}</h2>
                <p className="mt-5 text-lg leading-relaxed text-zinc-600">
                  Real field exposure across cricket, social, school and brand activations, with mentors who run these
                  campaigns every week.
                </p>

                <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {internshipPerks.map((p) => (
                    <div key={p.label} className="rounded-2xl border border-zinc-200 bg-white/80 p-5">
                      <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">{p.label}</p>
                      <p className="mt-2 font-display text-xl text-gold-600">{p.value}</p>
                      <p className="mt-1 text-xs text-zinc-500">{p.note}</p>
                    </div>
                  ))}
                </div>

                <h3 className="mt-12 text-2xl text-ink-950">What you will do</h3>
                <ul className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                  {internshipTasks.map((t) => (
                    <li key={t} className="flex gap-3 text-sm leading-relaxed text-zinc-600">
                      <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>

              <aside className="lg:col-span-5">
                <div className="rounded-2xl border border-zinc-200 bg-white p-7 lg:sticky lg:top-28">
                  <h3 className="text-2xl text-ink-950">Apply via WhatsApp</h3>
                  <p className="mt-3 text-sm text-zinc-600">
                    Fill a short form and we open WhatsApp with your details ready to send.
                  </p>
                  <dl className="mt-7 space-y-4 text-sm">
                    {[
                      ['pin', internshipRole.location],
                      ['chart', internshipRole.type],
                      ['sparkle', internshipRole.salary],
                      ['phone', '+91 91495 59393'],
                    ].map(([icon, text]) => (
                      <div key={text} className="flex items-center gap-3 text-zinc-600">
                        <Icon name={icon} className="h-4 w-4 text-gold-600" />
                        {text}
                      </div>
                    ))}
                  </dl>
                  <button type="button" onClick={() => openForm(internshipRole)} className="btn-gold mt-8 w-full">
                    Apply for internship
                  </button>
                  <p className="mt-4 text-center text-xs text-zinc-500">Keep your resume ready to share on WhatsApp.</p>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </section>

      {/* Open roles */}
      <section className="bg-paper-50 py-16 md:py-24">
        <div className="container-x">
          <SectionHeading eyebrow="Open roles" title="Current openings" />
          {jobs.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {jobs.map((job) => (
                <article key={job.id} className="card flex flex-col p-8">
                  <h3 className="text-2xl text-ink-950">{job.title}</h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {[job.location, job.type, job.salary].filter(Boolean).map((tag) => (
                      <span key={tag} className="rounded-full border border-zinc-200 px-3 py-1 text-xs text-zinc-600">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="mt-5 leading-relaxed text-zinc-600">{job.description}</p>
                  <div className="mt-auto grid grid-cols-1 gap-3 pt-8 sm:grid-cols-2">
                    <button type="button" onClick={() => openForm(job)} className="btn-gold">
                      Apply now
                    </button>
                    <button type="button" onClick={() => applyOnWhatsApp(job)} className="btn-outline">
                      Apply on WhatsApp
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="card p-10 text-center text-zinc-600">
              No full-time openings right now. The internship above is open, and new roles are posted here first.
            </div>
          )}
        </div>
      </section>

      {showForm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-ink-950/90 p-4 backdrop-blur-md" onClick={closeForm}>
          <div
            className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-zinc-200 bg-white p-7 shadow-2xl md:p-9"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow mb-3">Apply</p>
                <h2 className="text-2xl text-ink-950 md:text-3xl">{selectedJob?.title}</h2>
              </div>
              <button
                type="button"
                onClick={closeForm}
                aria-label="Close"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-300 text-xl text-ink-950 hover:border-gold-400"
              >
                ×
              </button>
            </div>

            {isInternship ? (
              <p className="mt-5 rounded-xl border border-gold-400/30 bg-gold-400/10 px-4 py-3 text-sm text-gold-700">
                After you submit, WhatsApp opens with your details ready to send.
              </p>
            ) : null}

            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
              <div>
                <label className="label-dark">Full name</label>
                <input type="text" required value={formData.name} onChange={update('name')} className="input-dark" placeholder="Your name" />
              </div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="label-dark">Email</label>
                  <input type="email" required value={formData.email} onChange={update('email')} className="input-dark" placeholder="you@email.com" />
                </div>
                <div>
                  <label className="label-dark">Phone</label>
                  <input type="tel" value={formData.phone} onChange={update('phone')} className="input-dark" placeholder="+91" />
                </div>
              </div>

              {isInternship ? (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className="label-dark">City</label>
                    <input type="text" value={formData.city} onChange={update('city')} className="input-dark" placeholder="Your city" />
                  </div>
                  <div>
                    <label className="label-dark">Interested in</label>
                    <select value={formData.interest} onChange={update('interest')} className="input-dark">
                      <option value="">Select an activity</option>
                      <option value="Cricket activity">Cricket activity</option>
                      <option value="Social activity">Social activity</option>
                      <option value="School activity">School activity</option>
                      <option value="Brand activation / Retail">Brand activation / Retail</option>
                      <option value="Any (open to all)">Any (open to all)</option>
                    </select>
                  </div>
                </div>
              ) : null}

              <div>
                <label className="label-dark">{isInternship ? 'Message' : 'Cover letter'}</label>
                <textarea
                  rows="4"
                  value={formData.message}
                  onChange={update('message')}
                  className="input-dark resize-none"
                  placeholder={isInternship ? 'Tell us a little about yourself' : 'Why are you interested in this role?'}
                />
              </div>

              {!isInternship ? (
                <div>
                  <label className="label-dark">Resume (PDF, DOC, DOCX)</label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setFormData({ ...formData, resume: e.target.files[0] })}
                    className="input-dark file:mr-4 file:rounded-full file:border-0 file:bg-gold-400 file:px-4 file:py-1.5 file:text-xs file:font-semibold file:text-ink-950"
                  />
                </div>
              ) : null}

              <div className="flex flex-col-reverse gap-3 pt-3 sm:flex-row sm:justify-end">
                <button type="button" onClick={closeForm} className="btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn-gold">
                  {isInternship ? 'Continue on WhatsApp' : 'Submit application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PublicLayout>
  )
}
