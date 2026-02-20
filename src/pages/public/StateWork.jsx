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
  const [selectedWorkId, setSelectedWorkId] = useState(null)
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
  const selectedWork = works.find((w) => w.id === selectedWorkId) || null

  useEffect(() => {
    // Default to first card selected when data loads.
    if (works.length > 0 && !selectedWorkId) {
      setSelectedWorkId(works[0].id)
    }
  }, [works, selectedWorkId])

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
                  Select any work card to view detailed activities and 4-5 gallery images.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {works.map((work) => {
                    const coverImage = Array.isArray(work.images) && work.images.length > 0 ? work.images[0] : null
                    const isActive = selectedWork?.id === work.id
                    return (
                      <button
                        key={work.id}
                        type="button"
                        onClick={() => setSelectedWorkId(work.id)}
                        className={`text-left rounded-2xl overflow-hidden border transition-all ${
                          isActive
                            ? 'border-blue-500 shadow-lg ring-2 ring-blue-200'
                            : 'border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300'
                        }`}
                      >
                        <div className="h-40 bg-gray-100">
                          {coverImage ? (
                            <img src={coverImage} alt={work.title || work.state} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-sm text-gray-500">
                              No image
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <p className="text-sm text-blue-600 font-semibold mb-1">{work.state}</p>
                          <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
                            {work.title || 'Untitled work'}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {(work.activities || []).length} activities • {(work.images || []).length} images
                          </p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {selectedWork && (
                <>
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                      {selectedWork.title || `Campaign in ${stateName}`}
                    </h2>
                    {selectedWork.description && (
                      <p className="text-gray-700 leading-relaxed">{selectedWork.description}</p>
                    )}
                    {selectedWork.brand_client_id && (
                      <p className="mt-3 text-sm text-gray-600">
                        Brand:{' '}
                        <span className="font-semibold text-gray-900">
                          {clientsById[selectedWork.brand_client_id]?.name || 'Not specified'}
                        </span>
                      </p>
                    )}
                  </div>

                  {Array.isArray(selectedWork.activities) && selectedWork.activities.length > 0 && (
                    <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8">
                      <h3 className="text-2xl font-bold text-gray-900 mb-5">Activities We Have Done</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedWork.activities.map((activity) => (
                          <div key={activity} className="bg-white rounded-xl p-4 border border-gray-200">
                            <p className="text-gray-800 font-medium">{activity}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {Array.isArray(selectedWork.images) && selectedWork.images.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold text-gray-900">Our Work Gallery</h3>
                        <span className="text-sm text-gray-500">
                          Showing {Math.min(5, selectedWork.images.length)} of {selectedWork.images.length}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                        {selectedWork.images.slice(0, 5).map((img, index) => (
                          <button
                            key={`${img}-${index}`}
                            type="button"
                            onClick={() => setSelectedImage(img)}
                            className="relative group rounded-xl overflow-hidden border border-gray-200"
                          >
                            <img
                              src={img}
                              alt={`Work image ${index + 1} in ${stateName}`}
                              className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
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


