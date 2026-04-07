import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()

const siteUrlRaw =
  process.env.VITE_SITE_URL ||
  process.env.SITE_URL ||
  process.env.URL ||
  'http://localhost:5173'

const siteUrl = siteUrlRaw.replace(/\/+$/, '')

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

