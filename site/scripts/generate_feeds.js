const fs = require('fs')
const path = require('path')

const postsDir = path.join(__dirname, '../content/posts')
const publicDir = path.join(__dirname, '..', 'public')
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true })

function parseFrontmatter(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!m) return { meta: {}, content: raw }
  const metaRaw = m[1]
  const content = m[2]
  const meta = {}
  metaRaw.split('\n').forEach(line => {
    const [k, ...rest] = line.split(':')
    if (!k) return
    meta[k.trim()] = rest.join(':').trim()
  })
  return { meta, content }
}

const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'))
const siteUrl = 'https://queen1052.github.io'

const posts = files.map(f => {
  const raw = fs.readFileSync(path.join(postsDir, f), 'utf8')
  const { meta, content } = parseFrontmatter(raw)
  const slug = f.replace(/^[0-9-]+/, '').replace(/\.md$/, '')
  return {
    slug,
    title: meta.title || slug,
    date: meta.date || fs.statSync(path.join(postsDir, f)).mtime.toISOString(),
    excerpt: (content || '').slice(0, 200)
  }
}).sort((a,b) => new Date(b.date) - new Date(a.date))

// Sitemap
const sitemapItems = posts.map(p => `  <url>\n    <loc>${siteUrl}/posts/${p.slug}</loc>\n    <lastmod>${new Date(p.date).toISOString()}</lastmod>\n  </url>`).join('\n')
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${siteUrl}</loc>\n  </url>\n${sitemapItems}\n</urlset>`
fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap, 'utf8')
console.log('sitemap.xml written')

// RSS (simple)
const feedItems = posts.map(p => `  <item>\n    <title><![CDATA[${p.title}]]></title>\n    <link>${siteUrl}/posts/${p.slug}</link>\n    <pubDate>${new Date(p.date).toUTCString()}</pubDate>\n    <description><![CDATA[${p.excerpt}]]></description>\n  </item>`).join('\n')
const rss = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n<channel>\n  <title>Queen1052</title>\n  <link>${siteUrl}</link>\n  <description>Notes on code & markets</description>\n${feedItems}\n</channel>\n</rss>`
fs.writeFileSync(path.join(publicDir, 'feed.xml'), rss, 'utf8')
console.log('feed.xml written')
