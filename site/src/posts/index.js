// posts loader using Vite's import.meta.glob to include markdown files at build time
export async function getPosts() {
  // use new import.meta.glob options: query '?raw' with import: 'default'
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
    return { slug, title: meta.title || slug, content }
  }))
  // sort by slug or any other metadata if needed
  return entries.sort((a, b) => a.slug.localeCompare(b.slug))
}
