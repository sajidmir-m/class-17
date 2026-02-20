import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import PublicLayout from '../../components/PublicLayout'

export default function StateWorkPage() {
  const { slug } = useParams()
  const [works, setWorks] = useState([])
  const [clientsById, setClientsById] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedImage, setSelectedImage] = useState(null)

  useEffect(() => {
    if (!slug) return
    fetchStateWorks(slug)
  }, [slug])

  const fetchStateWorks = async (currentSlug) => {
    try {
      setLoading(true)
      setError('')

      const { data, error: stateError } = await supabase
        .from('state_works')
        .select('*')
        .eq('slug', currentSlug)

      if (stateError) throw stateError

      const stateWorks = data || []
      setWorks(stateWorks)

      const brandIds = Array.from(
        new Set(
          (stateWorks || [])
            .map((item) => item.brand_client_id)
            .filter(Boolean)
        )
      )

      if (brandIds.length > 0) {
        const { data: clientsData, error: clientsError } = await supabase
          .from('clients')
          .select('id, name, logo_url')
          .in('id', brandIds)

        if (clientsError) {
          console.error('Error fetching clients for state work:', clientsError)
        } else if (clientsData) {
          const map = {}
          clientsData.forEach((c) => {
            map[c.id] = c
          })
          setClientsById(map)
        }
      } else {
        setClientsById({})
      }
    } catch (e) {
      console.error('Error loading state work page:', e)
      // Show more helpful error message
      if (e.message && e.message.includes('relation') && e.message.includes('does not exist')) {
        setError('The state_works table does not exist. Please run the database migration to create it.')
      } else if (e.message && e.message.includes('permission denied')) {
        setError('Permission denied. Please check your database RLS policies.')
      } else {
        setError(`Unable to load this state right now: ${e.message || 'Unknown error'}. Please check the browser console for details.`)
      }
    } finally {
      setLoading(false)
    }
  }

  const primaryWork = works[0]
  const stateName = primaryWork?.state || (slug ? slug.replace(/-/g, ' ') : 'State')

  return (
    <PublicLayout>
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-white/70 mb-3">
                State Work
              </p>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
                Brand Activations in {stateName}
              </h1>
              <p className="text-blue-100 max-w-2xl text-sm md:text-base">
                Detailed view of on-ground activities, campaigns, and brand experiences that Class 17 Events
                has executed in this region.
              </p>
            </div>
            <div className="flex flex-col items-start md:items-end gap-3">
              <Link
                to="/"
                className="inline-flex items-center text-sm font-medium text-white/90 hover:text-white underline-offset-2 hover:underline"
              >
                ← Back to Home
              </Link>
              <Link
                to="/contact"
                className="btn-modern bg-white text-blue-600 hover:bg-gray-100 shadow-lg text-sm"
              >
                Plan a Campaign in {stateName}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {loading && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">Loading state work...</p>
            </div>
          )}

          {!loading && error && (
            <div className="max-w-3xl mx-auto bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl text-sm">
              {error}
            </div>
          )}

          {!loading && !error && works.length === 0 && (
            <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-sm p-8 text-center space-y-3">
              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                State work coming soon
              </h2>
              <p className="text-gray-600 text-sm md:text-base">
                We have not added detailed work for <span className="font-semibold">{stateName}</span> yet.
                Your admin panel lets you create state-wise work with images, activities, and brand mapping —
                once added, it will appear here automatically.
              </p>
              <p className="text-gray-500 text-xs">
                Tip: Use the admin &quot;State Works&quot; section to create an entry for this state.
              </p>
            </div>
          )}

          {!loading && !error && works.length > 0 && (
            <>
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Our Work in {stateName}</h2>
                <p className="text-gray-600 text-sm md:text-base mb-6">
                  All state work is shown below as multiple cards inside this section.
                </p>
                <div className="space-y-6">
                  {works.map((work, idx) => {
                    const gallery = Array.isArray(work.images) ? work.images.slice(0, 5) : []
                    return (
                      <article key={work.id} className="rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="p-5 md:p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
                          <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 mb-1">
                            Work {idx + 1}
                          </p>
                          <h3 className="text-xl font-bold text-gray-900">
                            {work.title || `Campaign in ${stateName}`}
                          </h3>
                          {work.brand_client_id && (
                            <p className="text-sm text-gray-600 mt-1">
                              Brand:{' '}
                              <span className="font-semibold text-gray-800">
                                {clientsById[work.brand_client_id]?.name || 'Not specified'}
                              </span>
                            </p>
                          )}
                          {work.description && (
                            <p className="text-gray-700 mt-3 text-sm md:text-base">{work.description}</p>
                          )}
                        </div>

                        <div className="p-5 md:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-3">Activities</h4>
                            {Array.isArray(work.activities) && work.activities.length > 0 ? (
                              <ul className="space-y-2">
                                {work.activities.map((activity) => (
                                  <li key={activity} className="text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                                    {activity}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-sm text-gray-500">No activities added yet.</p>
                            )}
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-lg font-semibold text-gray-900">Gallery</h4>
                              <span className="text-xs text-gray-500">
                                Showing {gallery.length} of {(work.images || []).length}
                              </span>
                            </div>
                            {gallery.length > 0 ? (
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {gallery.map((img, index) => (
                                  <button
                                    key={`${img}-${index}`}
                                    type="button"
                                    onClick={() => setSelectedImage(img)}
                                    className="rounded-lg overflow-hidden border border-gray-200"
                                  >
                                    <img
                                      src={img}
                                      alt={`Work image ${index + 1} in ${stateName}`}
                                      className="w-full h-24 sm:h-28 object-cover hover:scale-105 transition-transform"
                                    />
                                  </button>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500">No images added yet.</p>
                            )}
                          </div>
                        </div>
                      </article>
                    )
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Image Modal/Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 text-3xl font-bold w-10 h-10 flex items-center justify-center bg-black/50 rounded-full hover:bg-black/70 transition"
          >
            ×
          </button>
          <img
            src={selectedImage}
            alt="Full size view"
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </PublicLayout>
  )
}


