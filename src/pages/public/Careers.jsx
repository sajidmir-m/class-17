import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import PublicLayout from '../../components/PublicLayout'

export default function Careers() {
  const [jobs, setJobs] = useState([])
  const [showApplicationForm, setShowApplicationForm] = useState(false)
  const [selectedJob, setSelectedJob] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    interest: '',
    message: '',
    resume: null,
  })

  const internshipRole = {
    title: 'Marketing & Advertising Internship',
    description:
      'Hands-on internship focused on real on-ground marketing activities, brand activations, and campaign execution support.',
    location: 'On-ground / Field + Office coordination',
    type: 'Internship',
    salary: 'Stipend (Performance-based) + Certificate',
    isInternship: true,
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    const { data } = await supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false })

    if (data) setJobs(data)
  }

  const handleApply = (job) => {
    setSelectedJob(job)
    setShowApplicationForm(true)
  }

  const openInternshipForm = () => {
    setSelectedJob(internshipRole)
    setFormData({
      name: '',
      email: '',
      phone: '',
      city: '',
      interest: '',
      message: '',
      resume: null,
    })
    setShowApplicationForm(true)
  }

  const openWhatsApp = (text) => {
    const phone = '919149559393'
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (selectedJob?.isInternship) {
        const whatsappText = [
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

        openWhatsApp(whatsappText)
        setShowApplicationForm(false)
        setFormData({ name: '', email: '', phone: '', city: '', interest: '', message: '', resume: null })
        setSelectedJob(null)
        return
      }

      let resumeUrl = ''

      if (formData.resume) {
        const fileExt = formData.resume.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `resumes/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('resumes')
          .upload(filePath, formData.resume)

        if (uploadError) throw uploadError

        const { data: urlData } = supabase.storage
          .from('resumes')
          .getPublicUrl(filePath)

        resumeUrl = urlData.publicUrl
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
      setShowApplicationForm(false)
      setFormData({ name: '', email: '', phone: '', city: '', interest: '', message: '', resume: null })
      setSelectedJob(null)
    } catch (error) {
      console.error('Error submitting application:', error)
      alert('Error submitting application: ' + error.message)
    }
  }

  return (
    <PublicLayout>
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="section-title">Join Our Team</h1>
            <p className="section-subtitle">Explore exciting career opportunities and grow with us</p>
          </div>

          {/* Internship Highlight */}
          <div className="mb-12">
            <div className="bg-gradient-to-br from-emerald-50 via-white to-cyan-50 rounded-3xl border border-emerald-100 shadow-xl overflow-hidden">
              <div className="p-8 md:p-10">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  <div className="max-w-3xl">
                    <p className="text-sm font-semibold text-emerald-700 uppercase tracking-wider">Internship Opportunity</p>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">{internshipRole.title}</h2>
                    <p className="text-gray-700 mt-3 leading-relaxed text-base md:text-lg">
                      We provide marketing and advertisement internships with real field exposure across activities like
                      <span className="font-semibold"> cricket, social, school, brand activations</span> and more.
                    </p>

                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Stipend</p>
                        <p className="text-xl font-bold text-gray-900 mt-1">Performance-based</p>
                        <p className="text-sm text-gray-600 mt-1">Based on performance & role</p>
                      </div>
                      <div className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Certificate</p>
                        <p className="text-xl font-bold text-gray-900 mt-1">Internship Certificate</p>
                        <p className="text-sm text-gray-600 mt-1">On successful completion</p>
                      </div>
                      <div className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Work</p>
                        <p className="text-xl font-bold text-gray-900 mt-1">Real Activities</p>
                        <p className="text-sm text-gray-600 mt-1">On-ground + reporting</p>
                      </div>
                    </div>

                    <div className="mt-6 rounded-2xl border border-emerald-100 bg-white/70 p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-3">What you will do</h3>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
                        {[
                          'Support on-ground promotions and brand activations',
                          'Engage audience, explain product/offer, and capture feedback',
                          'Coordinate with team leads for setup and execution',
                          'Photo/video documentation and daily reporting',
                          'Basic social content coordination (when needed)',
                          'Learn field discipline, communication, and campaign operations',
                        ].map((t) => (
                          <li key={t} className="flex gap-2">
                            <span className="text-emerald-600 mt-0.5">✓</span>
                            <span>{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="lg:w-[360px] w-full">
                    <div className="rounded-3xl bg-gradient-to-br from-gray-900 via-gray-900 to-black text-white p-7 shadow-2xl border border-black/20">
                      <h3 className="text-xl font-bold">Apply via WhatsApp</h3>
                      <p className="text-white/80 text-sm mt-2">
                        Fill the form and it will redirect you to WhatsApp with your details.
                      </p>
                      <div className="mt-5 space-y-3 text-sm">
                        <div className="flex items-center gap-2">
                          <span>📍</span>
                          <span className="font-semibold">{internshipRole.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>💼</span>
                          <span className="font-semibold">{internshipRole.type}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>💰</span>
                          <span className="font-semibold">{internshipRole.salary}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>📲</span>
                          <span className="font-semibold">+91 9149559393</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={openInternshipForm}
                        className="mt-6 w-full btn-modern bg-[#25D366] hover:bg-[#1DB954] text-black font-extrabold shadow-lg"
                      >
                        Apply for Internship
                      </button>
                      <p className="text-xs text-white/70 mt-3">
                        Tip: Keep your resume ready to share on WhatsApp.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {jobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-8 border border-gray-100 card-hover"
                >
                  <h3 className="text-2xl font-bold mb-3 text-gray-900">{job.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{job.description}</p>
                  <div className="space-y-2 text-sm text-gray-600 mb-6">
                    {job.location && (
                      <div className="flex items-center gap-2">
                        <span>📍</span>
                        <span className="font-medium">{job.location}</span>
                      </div>
                    )}
                    {job.type && (
                      <div className="flex items-center gap-2">
                        <span>💼</span>
                        <span className="font-medium">{job.type}</span>
                      </div>
                    )}
                    {job.salary && (
                      <div className="flex items-center gap-2">
                        <span>💰</span>
                        <span className="font-medium">{job.salary}</span>
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={() => handleApply(job)}
                      className="btn-modern bg-gradient-to-r from-blue-600 to-purple-600 text-white w-full shadow-lg"
                    >
                      Apply Now
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const whatsappText = [
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
                        openWhatsApp(whatsappText)
                      }}
                      className="btn-modern bg-[#25D366] hover:bg-[#1DB954] text-black w-full shadow-lg font-extrabold"
                    >
                      Apply on WhatsApp
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No job openings available at the moment. Check back soon!</p>
            </div>
          )}

          {showApplicationForm && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto border border-gray-100">
                <h2 className="text-3xl font-bold mb-6 text-gray-900">Apply for {selectedJob?.title}</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  {selectedJob?.isInternship ? (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                      This internship application will redirect to WhatsApp after submit.
                    </div>
                  ) : null}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  {selectedJob?.isInternship ? (
                    <>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition outline-none"
                          placeholder="Your city"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Interested In</label>
                        <select
                          value={formData.interest}
                          onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition outline-none bg-white"
                        >
                          <option value="">Select an activity</option>
                          <option value="Cricket activity">Cricket activity</option>
                          <option value="Social activity">Social activity</option>
                          <option value="School activity">School activity</option>
                          <option value="Brand activation / Retail">Brand activation / Retail</option>
                          <option value="Any (open to all)">Any (open to all)</option>
                        </select>
                      </div>
                    </>
                  ) : null}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Cover Letter</label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows="4"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none resize-none"
                      placeholder="Tell us why you're interested in this position..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Resume (PDF, DOC, DOCX)</label>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setFormData({ ...formData, resume: e.target.files[0] })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none"
                      disabled={!!selectedJob?.isInternship}
                    />
                    {selectedJob?.isInternship ? (
                      <p className="text-xs text-gray-500 mt-2">
                        Resume upload is disabled for WhatsApp applications. You can attach your resume in WhatsApp.
                      </p>
                    ) : null}
                  </div>
                  <div className="flex justify-end gap-4 mt-8">
                    <button
                      type="button"
                      onClick={() => {
                        setShowApplicationForm(false)
                        setSelectedJob(null)
                      }}
                      className="px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-xl font-semibold transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className={
                        selectedJob?.isInternship
                          ? 'px-6 py-3 bg-[#25D366] hover:bg-[#1DB954] text-black rounded-xl font-extrabold shadow-lg hover:shadow-xl transition transform hover:scale-105'
                          : 'px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition transform hover:scale-105'
                      }
                    >
                      {selectedJob?.isInternship ? 'Continue on WhatsApp' : 'Submit Application'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  )
}

