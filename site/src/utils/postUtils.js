export function stripMarkdown(md) {
  return md
    .replace(/```[\s\S]*?```/g, '') // remove code blocks
    .replace(/<[^>]+>/g, '') // remove HTML tags
    .replace(/(!\[.*?\]\(.*?\))|\[([^\]]+)\]\(([^)]+)\)/g, '$2') // images and links -> alt text
    .replace(/[#>*_~`-]{1,}/g, '')
    .replace(/\n{2,}/g, '\n')
    .trim()
}

export function excerptFromMarkdown(md, max = 160) {
  const text = stripMarkdown(md).replace(/\n/g, ' ').trim()
  if (text.length <= max) return text
  return text.slice(0, max).trim() + '...'
}

export function readingTimeFromMarkdown(md, wpm = 200) {
  const text = stripMarkdown(md)
  const words = text.split(/\s+/).filter(Boolean).length
  const minutes = Math.max(1, Math.round(words / wpm))
  return `${minutes} min read`
}

export function firstImageFromMarkdown(md) {
  const m = md.match(/!\[[^\]]*\]\(([^)]+)\)/)
  if (m) return m[1]
  return null
}
