export const featuredClients = [
  'Epson India Pvt Ltd',
  'HP',
  'Doms',
  'Kellox',
  'Bhartiya Exla Life Insurance',
  'DNA',
  'Star Sports Pro Kabaddi Junior',
  'Z Network',
]

export const clientDetails = {
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
    highlight: 'In-store activations and sampling programs that highlight new product launches and offers.',
  },
  'Bhartiya Exla Life Insurance': {
    sectors: ['Insurance', 'Finance'],
    highlight:
      'Face-to-face awareness campaigns explaining protection plans and benefits in communities and corporates.',
  },
  DNA: {
    sectors: ['Media', 'Events'],
    highlight: 'Brand presence at live events and on-ground promotions to drive reach and audience engagement.',
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

export const defaultClientDetails = {
  sectors: ['Brand Activation'],
  highlight: 'On-ground promotions and experiential campaigns to showcase new products and offerings.',
}

export const clientPublicImages = {
  'Epson India Pvt Ltd': '/epson.png',
  HP: '/hp.png',
  Doms: '/domc.png',
  Kellox: '/kelloggs.jpg',
  'Bhartiya Exla Life Insurance': '/bharti.jpg',
  DNA: '/DNA.png',
  'Star Sports Pro Kabaddi Junior': '/star sports kabadi.jpg',
  'Z Network': '/z network.jpg',
}

// Builds the list shown on Home and Clients: Supabase rows when present, otherwise the featured list.
export function buildClientCards(dbClients) {
  const names = dbClients.length > 0 ? dbClients.map((c) => c.name) : featuredClients
  return names.map((name, index) => {
    const row = dbClients.length > 0 ? dbClients.find((c) => c.name === name) || dbClients[index] : null
    return {
      name,
      details: clientDetails[name] || defaultClientDetails,
      logo: row?.logo_url || clientPublicImages[name] || '',
      website: row?.website_url || '',
    }
  })
}
