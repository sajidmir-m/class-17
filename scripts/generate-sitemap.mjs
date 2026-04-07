import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()

const trimTrailingSlashes = (s) => String(s || '').replace(/\/+$/, '')

const ensureProtocol = (hostOrUrl) => {
  const s = String(hostOrUrl || '').trim()
  if (!s) return ''
  if (s.startsWith('http://') || s.startsWith('https://')) return s
  return `https://${s}`
}

// Prefer explicit base URL (recommended)
// - VITE_SITE_URL: your public site origin (e.g. https://class17events.com)
// Fallback to common hosting env vars
const siteUrlRaw =
  process.env.VITE_SITE_URL ||
  process.env.SITE_URL ||
  process.env.URL ||
  (process.env.VERCEL_URL ? ensureProtocol(process.env.VERCEL_URL) : '') ||
  (process.env.DEPLOY_PRIME_URL ? process.env.DEPLOY_PRIME_URL : '') ||
  (process.env.DEPLOY_URL ? process.env.DEPLOY_URL : '') ||
  'http://localhost:5173'

const siteUrl = trimTrailingSlashes(siteUrlRaw)

// If someone forgets to set a real domain before deploying,
// fail the build in CI/production so we never ship localhost URLs in sitemap.xml.
const isLocalhost = /^(http:\/\/localhost|http:\/\/127\.0\.0\.1|https:\/\/localhost|https:\/\/127\.0\.0\.1)/i.test(siteUrl)
const isCiLike = Boolean(process.env.CI || process.env.VERCEL || process.env.NETLIFY)
if (isLocalhost && isCiLike) {
  throw new Error(
    [
      'Sitemap base URL is localhost, which is invalid for production.',
      'Set VITE_SITE_URL to your live domain (example: https://your-domain.com) and rebuild.',
      `Current base: ${siteUrl}`,
    ].join(' ')
  )
}

const routes = ['/', '/about', '/founder', '/services', '/portfolio', '/clients', '/careers', '/contact']

const lastmod = new Date().toISOString()

const urlEntries = routes
  .map((route) => {
    const loc = `${siteUrl}${route === '/' ? '' : route}`
    const priority =
      route === '/'
        ? '1.0'
        : route === '/contact' || route === '/portfolio'
          ? '0.8'
          : '0.7'
    const changefreq = route === '/' ? 'weekly' : 'monthly'

    return [
      '  <url>',
      `    <loc>${loc}</loc>`,
      `    <lastmod>${lastmod}</lastmod>`,
      `    <changefreq>${changefreq}</changefreq>`,
      `    <priority>${priority}</priority>`,
      '  </url>',
    ].join('\n')
  })
  .join('\n')

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  `${urlEntries}\n` +
  `</urlset>\n`

const outPath = path.join(root, 'public', 'sitemap.xml')
fs.mkdirSync(path.dirname(outPath), { recursive: true })
fs.writeFileSync(outPath, xml, 'utf8')

console.log(`Generated sitemap at ${outPath}`)
console.log(`Base URL: ${siteUrl}`)

