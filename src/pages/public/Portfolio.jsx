import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import PublicLayout from '../../components/PublicLayout'

export default function Portfolio() {
  const [events, setEvents] = useState([])

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    const { data } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false })

    if (data) setEvents(data)
  }

  return (
    <PublicLayout>
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="section-title">Our Portfolio</h1>
            <p className="section-subtitle">Showcasing our finest events and memorable experiences</p>
          </div>
          {events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 card-hover group"
                >
                  {event.image_url && (
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={event.image_url}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      {event.category && (
                        <span className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                          {event.category}
                        </span>
                      )}
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                    <div className="space-y-2 text-sm text-gray-500">
                      {event.location && (
                        <div className="flex items-center gap-2">
                          <span>📍</span>
                          <span>{event.location}</span>
                        </div>
                      )}
                      {event.event_date && (
                        <div className="flex items-center gap-2">
                          <span>📅</span>
                          <span>{new Date(event.event_date).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No portfolio items available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  )
}

