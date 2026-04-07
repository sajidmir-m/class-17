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
  const [showAllStatesHighlights, setShowAllStatesHighlights] = useState(false)
  const [selectedGalleryImage, setSelectedGalleryImage] = useState(null)
  const [galleryActivityFilter, setGalleryActivityFilter] = useState('')
  const [galleryStateFilter, setGalleryStateFilter] = useState('')

  const activityFilterOptions = [
    { key: '', label: 'All Activities' },
    { key: 'cricket', label: 'Cricket' },
    { key: 'social', label: 'Social' },
    { key: 'school', label: 'School' },
    { key: 'education', label: 'Education' },
    { key: 'business', label: 'Business' },
    { key: 'healthcare', label: 'Healthcare' },
    { key: 'brand', label: 'Brand / Other' },
  ]

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

  const clientPublicImages = {
    'Epson India Pvt Ltd': '/epson.png',
    HP: '/hp.png',
    Doms: '/domc.png',
    Kellox: '/kelloggs.jpg',
    'Bhartiya Exla Life Insurance': '/bharti.jpg',
    DNA: '/DNA.png',
    'Star Sports Pro Kabaddi Junior': '/star sports kabadi.jpg',
    'Z Network': '/z network.jpg',
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
        supabase.from('state_works').select('*').order('created_at', { ascending: false }),
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
      <section className="relative overflow-hidden text-white min-h-screen">
        <div className="absolute inset-0 bg-black">
          <div className="absolute inset-0 flex items-center justify-center">
            <video
              src="/video/logo.mp4"
              className="w-full h-full opacity-95 object-cover"
              autoPlay
              loop
              muted
              playsInline
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-black/40 to-[#5b0d1b]/70" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(91,13,27,0.45),transparent_55%),radial-gradient(circle_at_80%_40%,rgba(0,0,0,0.6),transparent_60%)]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-between min-h-screen py-10 md:py-16">
          {/* Top center title */}
          <div className="flex justify-center">
            <p className="text-sm md:text-base uppercase tracking-[0.35em] text-white/80 text-center">
              Class 17 Events
            </p>
          </div>

          {/* Bottom content: left text, right buttons */}
          <div className="mt-10 md:mt-0 flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-4 md:pb-8">
            <p className="text-base md:text-xl text-white/85 font-light max-w-3xl md:max-w-xl text-left">
              Strategy-led activations, district-level execution, and on-ground experiences that move people — and brands.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-start md:justify-end">
              <Link
                to="/contact"
                className="btn-modern bg-white text-[#5b0d1b] hover:bg-gray-100 shadow-xl"
              >
                Get Started
              </Link>
              <Link
                to="/portfolio"
                className="btn-modern bg-white/10 backdrop-blur-sm text-white border-2 border-white/20 hover:bg-white/15"
              >
                View Portfolio
              </Link>
            </div>
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
              const logoSrc = clientObj?.logo_url || clientPublicImages[name]
              const imageClass =
                name === 'Epson India Pvt Ltd'
                  ? 'w-full h-full object-contain object-center p-4 group-hover:scale-105 transition-transform duration-500'
                  : 'w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500'

              return (
                <article
                  key={name}
                  className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 card-hover group"
                >
                  <div className="relative h-40 w-full bg-gradient-to-r from-gray-50 via-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
                    {logoSrc ? (
                      <img
                        src={logoSrc}
                        alt={name}
                        className={imageClass}
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

      {/* Cricket Activities Section (replaces Upcoming Events) */}
      <section className="py-20 bg-gradient-to-br from-black via-[#2b0208] to-[#5b0d1b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title text-white">Cricket Activities</h2>
            <p className="section-subtitle text-gray-200">
              Live cricket screenings, ground activations, and fan engagement moments captured across locations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
            
              '/cricket activities/kolkata/cricket 1.png',
              '/cricket activities/kolkata/cricket 3.png',
              '/cricket activities/jammu/cricket 1.png',
              '/cricket activities/jammu/cricket 2.png',
            ].map((src, idx) => {
              const lower = src.toLowerCase()
              const isJammu = lower.includes('jammu')
              const isKolkata = lower.includes('kolkata')
              const location = isJammu ? 'Jammu' : isKolkata ? 'Kolkata' : 'Multi-city activation'
              return (
                <div
                  key={`${src}-${idx}`}
                  className="bg-gradient-to-br from-black/80 via-[#33040c] to-[#5b0d1b] rounded-2xl shadow-2xl overflow-hidden border border-white/10 card-hover group transform hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={src}
                      alt="Cricket activity"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = '/placeholder-image.svg'
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-white/90">
                      <span className="px-3 py-1 rounded-full bg-black/80 font-semibold shadow-md">
                        Cricket activity
                      </span>
                      <span className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-full backdrop-blur-sm">
                        <span>📍</span>
                        <span>{location}</span>
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
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
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(showAllStatesHighlights ? stateWorks : stateWorks.slice(0, 6)).map((work) => (
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
                      {(work.title || 'On-ground activations').replace(/^\s*epson\s+/i, '')}
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

              {stateWorks.length > 6 && (
                <div className="mt-10 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setShowAllStatesHighlights((prev) => !prev)}
                    className="btn-modern bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg text-sm"
                  >
                    {showAllStatesHighlights ? 'Show Top States Only' : 'View All States'}
                  </button>
                </div>
              )}
            </>
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
          <div className="text-center mb-10">
            <h2 className="section-title">All Activities</h2>
            <p className="section-subtitle">
              Click an activity type to see all related images with the state tag.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {activityFilterOptions.map((opt) => {
              const isActive = galleryActivityFilter === opt.key
              return (
                <button
                  key={opt.key || 'all'}
                  type="button"
                  onClick={() => setGalleryActivityFilter(opt.key)}
                  className={
                    isActive
                      ? 'text-xs font-semibold text-white bg-gradient-to-r from-black to-[#5b0d1b] border border-transparent rounded-full px-3 py-1'
                      : 'text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-full px-3 py-1 hover:border-gray-400'
                  }
                >
                  {opt.label}
                </button>
              )
            })}
          </div>

          {(() => {
            const getImageActivityLabelFromPath = (img) => {
              if (!img || typeof img !== 'string') return 'Brand activation'
              const s = img.toLowerCase()

              if (s.includes('cricket')) return 'Cricket activity'
              if (s.includes('social activity')) return 'Social activity'
              if (s.includes('school activity')) return 'School activity'
              if (s.includes('epson for business')) return 'Business activation'
              if (s.includes('epson for education')) return 'Education activation'
              if (s.includes('epson for healthcare')) return 'Healthcare activation'
              if (s.includes('epson for printer challenge')) return 'Printer challenge activation'

              return 'Brand activation'
            }

            const getActivityKeyFromPath = (img) => {
              if (!img || typeof img !== 'string') return 'brand'
              const s = img.toLowerCase()
              if (s.includes('cricket')) return 'cricket'
              if (s.includes('social activity')) return 'social'
              if (s.includes('school activity')) return 'school'
              if (s.includes('epson for education')) return 'education'
              if (s.includes('epson for business')) return 'business'
              if (s.includes('epson for healthcare')) return 'healthcare'
              return 'brand'
            }

            const imagesFromStateWorks = (stateWorks || []).flatMap((w) =>
              (Array.isArray(w.images) ? w.images : [])
                .filter(Boolean)
                .map((img) => ({
                  img,
                  state: w.state || '',
                  slug: w.slug || '',
                }))
            )

            const staticCricket = [
              { img: '/cricket activities/kolkata/cricket 1.png', state: 'West Bengal', slug: 'kolkata' },
              { img: '/cricket activities/kolkata/cricket 3.png', state: 'West Bengal', slug: 'kolkata' },
              { img: '/cricket activities/jammu/cricket 1.png', state: 'Jammu & Kashmir', slug: 'jammu' },
              { img: '/cricket activities/jammu/cricket 2.png', state: 'Jammu & Kashmir', slug: 'jammu' },
            ]

            const allImageItems = [...staticCricket, ...imagesFromStateWorks]

            const stateOptions = Array.from(
              new Set(allImageItems.map((i) => (i.state || '').trim()).filter(Boolean))
            ).sort((a, b) => a.localeCompare(b))

            const filteredImages = allImageItems.filter(({ img, state }) => {
              if (galleryStateFilter && (state || '').trim() !== galleryStateFilter) return false
              if (!galleryActivityFilter) return true
              const key = getActivityKeyFromPath(img)
              if (galleryActivityFilter === 'brand') return key === 'brand'
              return key === galleryActivityFilter
            })

            const topImages = filteredImages

            if (topImages.length === 0) {
              return (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((slot) => (
                    <div
                      key={slot}
                      className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl border border-dashed border-gray-300 flex items-center justify-center text-gray-500 text-sm text-center px-4"
                    >
                      Gallery image slot {slot} – add state works with images to auto-fill this gallery.
                    </div>
                  ))}
                </div>
              )
            }

            return (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
                  <div className="w-full sm:w-auto">
                    <label className="block text-xs font-semibold text-gray-600 mb-1">State</label>
                    <select
                      value={galleryStateFilter}
                      onChange={(e) => setGalleryStateFilter(e.target.value)}
                      className="w-full sm:w-64 px-4 py-2.5 rounded-2xl border border-gray-200 bg-white text-gray-800 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5b0d1b]/30"
                    >
                      <option value="">All States</option>
                      {stateOptions.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  {(galleryStateFilter || galleryActivityFilter) ? (
                    <div className="sm:pt-5">
                      <button
                        type="button"
                        onClick={() => {
                          setGalleryStateFilter('')
                          setGalleryActivityFilter('')
                        }}
                        className="w-full sm:w-auto text-xs font-semibold px-4 py-2.5 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 shadow-sm"
                      >
                        Clear filters
                      </button>
                    </div>
                  ) : null}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {topImages.map(({ img, state }, idx) => {
                    const src = img.startsWith('/') ? img : img.startsWith('http') ? img : `/${img}`
                    const label = getImageActivityLabelFromPath(img)
                    const stateLabel = state || 'Pan-India'
                    return (
                      <button
                        key={`${src}-${idx}`}
                        type="button"
                        onClick={() => setSelectedGalleryImage(src)}
                        className="group relative overflow-hidden rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300"
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                        <img
                          src={src}
                          alt={label}
                          className="w-full h-36 sm:h-40 object-cover group-hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            e.target.src = '/placeholder-image.svg'
                          }}
                        />
                        <div className="absolute bottom-2 left-2 right-2 z-20 flex items-center justify-between gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-black/70 text-white shadow-sm truncate">
                            {label}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white/15 text-white shadow-sm border border-white/20 backdrop-blur-sm truncate">
                            📍 {stateLabel}
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })()}

          <div className="mt-10 flex justify-center">
            <Link
              to="/portfolio"
              className="btn-modern bg-gradient-to-r from-black to-[#5b0d1b] text-white shadow-lg"
            >
              View Portfolio
            </Link>
          </div>
        </div>
      </section>

      {/* Gallery Lightbox */}
      {selectedGalleryImage && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setSelectedGalleryImage(null)}
        >
          <button
            onClick={() => setSelectedGalleryImage(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 text-3xl font-bold w-12 h-12 flex items-center justify-center bg-black/60 rounded-full hover:bg-black/80 transition-all duration-200 shadow-lg z-10"
            aria-label="Close image"
          >
            ×
          </button>
          <div className="relative max-w-7xl max-h-[90vh] flex items-center justify-center">
            <img
              src={selectedGalleryImage}
              alt="Full size view"
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              onError={(e) => {
                e.target.src = '/placeholder-image.svg'
              }}
            />
          </div>
        </div>
      )}

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

