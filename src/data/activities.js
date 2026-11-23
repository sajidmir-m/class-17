export const activityFilters = [
  { key: '', label: 'All' },
  { key: 'cricket', label: 'Cricket' },
  { key: 'social', label: 'Social' },
  { key: 'school', label: 'School' },
  { key: 'education', label: 'Education' },
  { key: 'business', label: 'Business' },
  { key: 'healthcare', label: 'Healthcare' },
  { key: 'brand', label: 'Brand / Other' },
]

export function getActivityKey(img) {
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

export function getActivityLabel(img) {
  if (!img || typeof img !== 'string') return 'Brand activation'
  const s = img.toLowerCase()
  if (s.includes('cricket')) return 'Cricket'
  if (s.includes('social activity')) return 'Social'
  if (s.includes('school activity')) return 'School'
  if (s.includes('epson for business')) return 'Business'
  if (s.includes('epson for education')) return 'Education'
  if (s.includes('epson for healthcare')) return 'Healthcare'
  if (s.includes('epson for printer challenge')) return 'Printer challenge'
  return 'Brand activation'
}

export const toSrc = (img) => (img.startsWith('/') || img.startsWith('http') ? img : `/${img}`)

export const staticCricketImages = [
  { img: '/cricket activities/kolkata/cricket 1.png', state: 'West Bengal' },
  { img: '/cricket activities/kolkata/cricket 3.png', state: 'West Bengal' },
  { img: '/cricket activities/jammu/cricket 1.png', state: 'Jammu & Kashmir' },
  { img: '/cricket activities/jammu/cricket 2.png', state: 'Jammu & Kashmir' },
]
