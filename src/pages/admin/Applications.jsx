import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import AdminLayout from '../../components/AdminLayout'

export default function Applications() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          jobs (
            title
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setApplications(data || [])
    } catch (error) {
      console.error('Error fetching applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const downloadResume = (url) => {
    if (url) {
      window.open(url, '_blank')
    }
  }

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold text-white mb-8">Applications</h1>

        {loading && applications.length === 0 ? (
          <div className="text-white">Loading...</div>
        ) : (
          <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Job</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Resume</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {applications.map((application) => (
                  <tr key={application.id} className="hover:bg-gray-700">
                    <td className="px-6 py-4 text-white">{application.name}</td>
                    <td className="px-6 py-4 text-gray-300">{application.email}</td>
                    <td className="px-6 py-4 text-gray-300">{application.phone || 'N/A'}</td>
                    <td className="px-6 py-4 text-gray-300">
                      {application.jobs?.title || 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      {application.resume_url ? (
                        <button
                          onClick={() => downloadResume(application.resume_url)}
                          className="text-blue-400 hover:text-blue-300 underline"
                        >
                          Download
                        </button>
                      ) : (
                        <span className="text-gray-500">No resume</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {new Date(application.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

