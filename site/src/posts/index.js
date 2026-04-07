import { excerptFromMarkdown, readingTimeFromMarkdown, firstImageFromMarkdown } from '@/utils/postUtils'

// posts loader using Vite's import.meta.glob to include markdown files at build time
export async function getPosts() {
  const modules = import.meta.glob('../../content/posts/*.md', { query: '?raw', import: 'default' })
  const entries = await Promise.all(Object.entries(modules).map(async ([filePath, resolver]) => {
    const raw = await resolver()
    // parse frontmatter
    const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
    let meta = {}
    let content = raw
    if (fmMatch) {
      const fm = fmMatch[1]
      content = fmMatch[2]
      fm.split('\n').forEach(line => {
        const [k, ...rest] = line.split(':')
        if (!k) return
        meta[k.trim()] = rest.join(':').trim()
      })
    }
    const filename = filePath.split('/').pop()
    const slug = filename.replace(/^[0-9-]+/, '').replace(/\.md$/, '')
    const excerpt = excerptFromMarkdown(content, 180)
    const readTime = readingTimeFromMarkdown(content)
    const image = firstImageFromMarkdown(content) || '/assets/img/profile.png'
    const tags = meta.tags ? String(meta.tags).replace(/\[|\]|\s/g, '').split(',').filter(Boolean) : []

    return { slug, title: meta.title || slug, content, meta, excerpt, readTime, image, tags }
  }))

  // sort by date if present in meta, else by date of filename
  entries.sort((a, b) => {
    const da = a.meta && a.meta.date ? new Date(a.meta.date) : null
    const db = b.meta && b.meta.date ? new Date(b.meta.date) : null
    if (da && db) return db - da
    if (da) return -1
    if (db) return 1
    return b.slug.localeCompare(a.slug)
  })
  return entries
}
