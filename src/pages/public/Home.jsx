import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import PublicLayout from '../../components/PublicLayout'
import IndiaPresenceMap from '../../components/IndiaPresenceMap'

export default function Home() {
  const [events, setEvents] = useState([])
  const [news, setNews] = useState([])
  const [clients, setClients] = useState([])
  const [stateWorks, setStateWorks] = useState([])

  const featuredClients = [
    'Epson India Pvt Ltd',
    'HP',
    'Doms',
    'Kellox',
    'Bhartiya Exla Life Insurance',
    'DNA',
    'Star Sports Pro Kabaddi Junior',
    'Z Network',
  ]

  const clientDetails = {
    'Epson India Pvt Ltd': {
      sectors: ['Education', 'Corporate', 'Retail'],
      highlight:
        'On-ground demos of the latest printing and projection solutions in schools, offices, and retail environments.',
    },
    HP: {
      sectors: ['Technology', 'Education', 'SMBs'],
      highlight:
        'Product experience zones for laptops, printers, and accessories with hands-on engagement across India.',
    },
    Doms: {
      sectors: ['Schools', 'Students', 'Stationery'],
      highlight:
        'Interactive school activities and art corners showcasing new stationery lines to students and parents.',
    },
    Kellox: {
      sectors: ['Consumer', 'Retail'],
      highlight:
        'In-store activations and sampling programs that highlight new product launches and offers.',
    },
    'Bhartiya Exla Life Insurance': {
      sectors: ['Insurance', 'Finance'],
      highlight:
        'Face-to-face awareness campaigns explaining protection plans and benefits in communities and corporates.',
    },
    DNA: {
      sectors: ['Media', 'Events'],
      highlight:
        'Brand presence at live events and on-ground promotions to drive reach and audience engagement.',
    },
    'Star Sports Pro Kabaddi Junior': {
      sectors: ['Sports', 'Youth', 'Schools'],
      highlight:
        'Grassroots sports activations, school outreach programs, and fan engagement for junior kabaddi talent.',
    },
    'Z Network': {
      sectors: ['Broadcast', 'Entertainment'],
      highlight:
        'High-impact experiential campaigns and city-level events to promote new shows and channel properties.',
    },
  }

  const indiaStatesAndUTs = [
    'Andaman & Nicobar Islands',
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chandigarh',
    'Chhattisgarh',
    'Dadra & Nagar Haveli and Daman & Diu',
    'Delhi',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jammu & Kashmir',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Ladakh',
    'Lakshadweep',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Puducherry',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal',
  ]

  const stateCoordinates = {
    'Andaman & Nicobar Islands': [11.7401, 92.6586],
    'Andhra Pradesh': [16.5062, 80.648],
    'Arunachal Pradesh': [27.1024, 93.692],
    Assam: [26.1445, 91.7362],
    Bihar: [25.5941, 85.1376],
    Chandigarh: [30.7333, 76.7794],
    Chhattisgarh: [21.2787, 81.8661],
    'Dadra & Nagar Haveli and Daman & Diu': [20.3974, 72.8328],
    Delhi: [28.6139, 77.209],
    Goa: [15.2993, 74.124],
    Gujarat: [23.0225, 72.5714],
    Haryana: [29.0588, 76.0856],
    'Himachal Pradesh': [31.1048, 77.1734],
    'Jammu & Kashmir': [34.0837, 74.7973],
    Jharkhand: [23.6102, 85.2799],
    Karnataka: [12.9716, 77.5946],
    Kerala: [8.5241, 76.9366],
    Ladakh: [34.1526, 77.577],
    Lakshadweep: [10.5667, 72.6417],
    'Madhya Pradesh': [23.2599, 77.4126],
    Maharashtra: [19.076, 72.8777],
    Manipur: [24.817, 93.9368],
    Meghalaya: [25.467, 91.3662],
    Mizoram: [23.7271, 92.7176],
    Nagaland: [25.6751, 94.1086],
    Odisha: [20.2961, 85.8245],
    Puducherry: [11.9416, 79.8083],
    Punjab: [30.7333, 76.7794],
    Rajasthan: [26.9124, 75.7873],
    Sikkim: [27.3389, 88.6065],
    'Tamil Nadu': [13.0827, 80.2707],
    Telangana: [17.385, 78.4867],
    Tripura: [23.8315, 91.2868],
    'Uttar Pradesh': [26.8467, 80.9462],
    Uttarakhand: [30.3165, 78.0322],
    'West Bengal': [22.5726, 88.3639],
  }

  const mapLocations = indiaStatesAndUTs.map((name) => ({
    name,
    latlng: stateCoordinates[name] || [22.5, 78.9],
  }))

  const activitiesByState = {
    'Jammu & Kashmir': [
      'School activation programs showcasing leading brands and products',
      'Face-to-face product demonstrations in key markets and campuses',
      'On-ground events and engagement activities across major towns',
      'Industrial product awareness sessions with decision makers',
    ],
    Delhi: [
      'Corporate & institutional brand activations',
      'Face-to-face product demos in high-footfall zones',
      'Retail and channel partner outreach programs',
      'Event launches, PR support, and audience engagement',
    ],
    Maharashtra: [
      'Large-scale experiential events and product launches',
      'Retail activations and mall campaigns',
      'Campus programs and school activities',
      'Industrial product showcases and dealer meets',
    ],
    Gujarat: [
      'Trade and industrial outreach campaigns',
      'Dealer meets and channel activations',
      'On-ground demos for consumer products',
      'Local engagement events and brand experiences',
    ],
    Karnataka: [
      'Tech-forward experiential activations and demos',
      'School and college engagement programs',
      'Retail visibility and promoter-led campaigns',
      'Industrial product briefings and partner sessions',
    ],
    'Tamil Nadu': [
      'Retail and community activations',
      'Face-to-face product education and trials',
      'Campus programs and school activities',
      'Localized festivals and engagement events',
    ],
    'West Bengal': [
      'Community engagement and event activations',
      'Retail and market outreach programs',
      'School/campus programs for brand sampling',
      'Product demonstrations with feedback capture',
    ],
  }

  const defaultActivities = [
    'Regional brand activations and product launches',
    'School and college engagement programs',
    'Retail and channel partner outreach initiatives',
    'Customized campaigns designed for local audiences',
  ]

  const [selectedState, setSelectedState] = useState('Jammu & Kashmir')
  const navigate = useNavigate()

  const slugifyState = (str) =>
    str
      .toLowerCase()
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [eventsRes, newsRes, clientsRes, stateWorksRes] = await Promise.all([
        supabase.from('events').select('*').order('created_at', { ascending: false }).limit(6),
        supabase.from('news').select('*').order('created_at', { ascending: false }).limit(3),
        supabase.from('clients').select('*').order('created_at', { ascending: false }).limit(6),
        supabase.from('state_works').select('*').order('created_at', { ascending: false }).limit(6),
      ])

      if (eventsRes.data) setEvents(eventsRes.data)
      if (newsRes.data) setNews(newsRes.data)
      if (clientsRes.data) setClients(clientsRes.data)
      if (stateWorksRes.data) setStateWorks(stateWorksRes.data)
    } catch (error) {
      console.error('Error fetching data:', error)
      // App will still render even if data fetch fails
    }
  }

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white py-24 md:py-32">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            Class 17 Events
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-blue-100 font-light max-w-2xl mx-auto">
            Ideas That Speak Louder Than Words
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="btn-modern bg-white text-blue-600 hover:bg-gray-100 shadow-xl"
            >
              Get Started
            </Link>
            <Link
              to="/portfolio"
              className="btn-modern bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/20"
            >
              View Portfolio
            </Link>
          </div>
        </div>
      </section>

      {/* Clients Section (same style as Clients page, summarized) */}
      <section className="py-16 bg-gradient-to-r from-gray-50 via-white to-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Our Clients</h2>
              <p className="text-gray-600 mt-1 text-sm md:text-base">
                Leading brands we activate across schools, retail, sports, and industrial sectors.
              </p>
            </div>
            <Link
              to="/clients"
              className="btn-modern bg-white text-blue-600 border border-blue-200 hover:bg-blue-50 text-sm md:text-base"
            >
              View All Clients
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(clients.length > 0 ? clients.map((c) => c.name) : featuredClients).map((name, index) => {
              const details = clientDetails[name] || {
                sectors: ['Brand Activation'],
                highlight:
                  'On-ground promotions and experiential campaigns to showcase new products and offerings.',
              }

              const clientObj =
                clients.length > 0 ? clients.find((c) => c.name === name) || clients[index] : null

              return (
                <article
                  key={name}
                  className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 card-hover group"
                >
                  <div className="relative h-40 w-full bg-gradient-to-r from-gray-50 via-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
                    {clientObj?.logo_url ? (
                      <img
                        src={clientObj.logo_url}
                        alt={name}
                        className="w-full h-full object-contain px-6 py-4 group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <span className="text-gray-500 font-semibold text-lg px-4 text-center">{name}</span>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-white/80">
                      <span className="font-semibold uppercase tracking-wide">
                        {details.sectors.join(' • ')}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 space-y-3">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition">
                      {name}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{details.highlight}</p>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="section-title">Why Class 17 Events</h2>
            <p className="section-subtitle">
              We combine strategy, on-ground execution, and measurable results — across India.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Pan-India Execution',
                desc: 'Campaign rollouts across metros and tier cities with trained promoters and strong operations.',
                icon: '🇮🇳',
              },
              {
                title: 'School & Campus Strength',
                desc: 'Structured school activities, student engagement, and sampling programs with compliance and safety.',
                icon: '🏫',
              },
              {
                title: 'Product Storytelling',
                desc: 'Face-to-face demos and industrial showcases that explain features clearly and drive conversion.',
                icon: '🎯',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-8 border border-gray-100 card-hover"
              >
                <div className="text-5xl mb-5">{item.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title">Upcoming Events</h2>
            <p className="section-subtitle">Discover our latest events and experiences</p>
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
                        <span className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
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
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      {event.location && (
                        <div className="flex items-center gap-1">
                          <span>📍</span>
                          <span>{event.location}</span>
                        </div>
                      )}
                      {event.event_date && (
                        <div className="flex items-center gap-1">
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
              <p className="text-gray-500 text-lg">No events available at the moment. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* India Map & Activities Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Pan-India Presence</h2>
            <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto">
              Click on any state name on the map to explore our on-ground activities, brand experiences, and detailed work in that region.
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8 relative overflow-hidden">
            <IndiaPresenceMap
              locations={mapLocations}
              activeName={selectedState}
              onSelect={(name) => {
                setSelectedState(name)
                const slug = slugifyState(name)
                navigate(`/states/${slug}`)
              }}
            />
            <p className="mt-4 text-center text-sm text-gray-600">
              💡 <strong>Tip:</strong> Click any state name on the map to view detailed activities, images, and brand work for that state.
            </p>
          </div>
        </div>
      </section>

      {/* State-wise Work Highlights */}
      <section className="py-20 bg-gradient-to-r from-white via-blue-50 to-purple-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
            <div>
              <h2 className="section-title text-left md:text-left">State-wise Work Highlights</h2>
              <p className="section-subtitle max-w-2xl text-left md:text-left">
                Explore a snapshot of our on-ground campaigns across different states. Each card links to a
                detailed view with activities, images, and brand information.
              </p>
            </div>
            <div className="flex gap-3 justify-start md:justify-end">
              <Link
                to="/contact"
                className="btn-modern bg-white text-blue-600 border border-blue-200 hover:bg-blue-50 text-sm"
              >
                Plan Your State Campaign
              </Link>
            </div>
          </div>

          {stateWorks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {stateWorks.map((work) => (
                <Link
                  key={work.id}
                  to={`/states/${work.slug}`}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 card-hover group flex flex-col"
                >
                  {Array.isArray(work.images) && work.images.length > 0 ? (
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={work.images[0]}
                        alt={work.title || work.state}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-white/90">
                        <span className="font-semibold uppercase tracking-wide">
                          {work.state}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="h-44 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-500 text-sm font-medium">
                      State: {work.state}
                    </div>
                  )}
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {work.title || 'On-ground activations'}
                    </h3>
                    {work.description && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                        {work.description}
                      </p>
                    )}
                    <p className="mt-auto text-xs text-gray-500">
                      Click to view activities, images and brand details for {work.state}.
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-8 text-center text-gray-500 text-sm">
              Once you add entries in the admin <span className="font-semibold">State Works</span> section,
              highlighted state campaigns will appear here automatically.
            </div>
          )}
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="section-title">Activation Gallery</h2>
            <p className="section-subtitle">
              Photos from school activities, retail activations, sports engagements, and industrial demos.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((slot) => (
              <div
                key={slot}
                className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl border border-dashed border-gray-300 flex items-center justify-center text-gray-500 text-sm text-center px-4"
              >
                Gallery image slot {slot} – you will provide images to replace these.
              </div>
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <Link
              to="/portfolio"
              className="btn-modern bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
            >
              View Portfolio
            </Link>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title">Latest News</h2>
            <p className="section-subtitle">Stay updated with our latest updates and announcements</p>
          </div>
          {news.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {news.map((newsItem) => (
                <article
                  key={newsItem.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 card-hover"
                >
                  {newsItem.image_url && (
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={newsItem.image_url}
                        alt={newsItem.title}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-3 text-gray-900">{newsItem.title}</h3>
                    <p className="text-gray-600 line-clamp-3">{newsItem.content?.substring(0, 150)}...</p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No news available at the moment.</p>
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  )
}

