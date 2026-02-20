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
    message: '',
    resume: null,
  })

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

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
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
      setFormData({ name: '', email: '', phone: '', message: '', resume: null })
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
                  <button
                    onClick={() => handleApply(job)}
                    className="btn-modern bg-gradient-to-r from-blue-600 to-purple-600 text-white w-full shadow-lg"
                  >
                    Apply Now
                  </button>
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
                    />
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
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition transform hover:scale-105"
                    >
                      Submit Application
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

