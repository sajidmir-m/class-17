import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import PublicLayout from '../../components/PublicLayout'

export default function Clients() {
  const [clients, setClients] = useState([])

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

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    const { data } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false })

    if (data) setClients(data)
  }

  return (
    <PublicLayout>
      <div className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="section-title">Our Clients</h1>
            <p className="section-subtitle">Trusted by leading brands and organizations worldwide</p>
          </div>

          {/* Featured Clients Flipper */}
          <div className="mb-12">
            <div className="overflow-x-auto whitespace-nowrap py-3">
              <div className="inline-flex gap-4">
                {featuredClients.map((client) => (
                  <div
                    key={client}
                    className="px-6 py-3 rounded-full bg-white shadow-md border border-gray-100 text-sm md:text-base font-medium text-gray-700 hover:text-blue-600 hover:border-blue-200 transition-all cursor-default"
                  >
                    {client}
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Client Brand Story Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(clients.length > 0 ? clients.map((c) => c.name) : featuredClients).map((name, index) => {
              const details = clientDetails[name] || {
                sectors: ['Brand Activation'],
                highlight:
                  'On-ground promotions and experiential campaigns to showcase new products and offerings.',
              }

              // If we have Supabase data, try to match the full client object for logo/website
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
                    <p className="text-gray-600 text-sm leading-relaxed">{details.highlight}</p>
                    {clientObj?.website_url && (
                      <a
                        href={clientObj.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-purple-600 transition-colors mt-1"
                      >
                        Visit Website
                        <span className="ml-1">→</span>
                      </a>
                    )}
                  </div>
                </article>
              )
            })}
          </div>

          {/* Gallery Placeholder */}
          <section className="mt-16">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Client Activations Gallery</h2>
                <p className="text-gray-600 text-sm md:text-base">
                  A visual showcase of brand promotions, school activities, sports events, and industrial
                  demonstrations. (We’ll plug in your images here.)
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((slot) => (
                <div
                  key={slot}
                  className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl border border-dashed border-gray-300 flex items-center justify-center text-gray-500 text-sm text-center px-4"
                >
                  Gallery image slot {slot} – to be replaced with your actual activation photos.
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </PublicLayout>
  )
}

