// @ts-check
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'fs';
import { resolve, join, basename } from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';

/**
 * Vite plugin that:
 * 1. buildStart: Scans posts/*.md → validates front-matter → parses markdown →
 *    writes src/generated/posts.json
 * 2. writeBundle: Generates dist/sitemap.xml and dist/feed.xml (RSS)
 *
 * @param {object} [options]
 * @param {string} [options.postsDir] - Absolute path to the posts directory
 * @param {string} [options.generatedDir] - Absolute path to src/generated/
 * @param {string} [options.siteUrl] - Canonical site URL (no trailing slash)
 * @returns {import('vite').Plugin}
 */
export function postsPlugin(options = {}) {
  /** @type {string} */
  let root;
  /** @type {Array<import('./src/app/data/types.js').BlogPost>} */
  let posts = [];

  return {
    name: 'vite-plugin-posts',

    configResolved(config) {
      root = config.root;
    },

    buildStart() {
      const postsDir = options.postsDir ?? join(root, 'posts');
      const generatedDir = options.generatedDir ?? join(root, 'src', 'generated');
      const siteUrl = options.siteUrl ?? 'https://queen1052.github.io';

      // Ensure the generated directory exists
      mkdirSync(generatedDir, { recursive: true });

      let files;
      try {
        files = readdirSync(postsDir).filter((f) => f.endsWith('.md'));
      } catch {
        // If the posts directory doesn't exist, write an empty array and continue
        writeFileSync(join(generatedDir, 'posts.json'), JSON.stringify([]), 'utf-8');
        console.warn('[vite-plugin-posts] posts/ directory not found — no posts generated');
        return;
      }

      /** @type {Array<import('./src/app/data/types.js').BlogPost>} */
      const parsedPosts = [];

      for (const file of files) {
        const filePath = join(postsDir, file);

        // Filename must match YYYY-MM-DD-slug.md
        const nameMatch = basename(file, '.md').match(/^(\d{4}-\d{2}-\d{2})-(.+)$/);
        if (!nameMatch) {
          console.warn(`[vite-plugin-posts] Skipping "${file}" — filename must be YYYY-MM-DD-slug.md`);
          continue;
        }
        const [, , slug] = nameMatch;

        const raw = readFileSync(filePath, 'utf-8');
        let data;
        let content;
        try {
          const parsed = matter(raw);
          data = parsed.data;
          content = parsed.content;
        } catch (err) {
          console.warn(`[vite-plugin-posts] Skipping "${file}" — front-matter parse error: ${err}`);
          continue;
        }

        // Validate required front-matter fields
        const requiredFields = ['title', 'date', 'category'];
        const missing = requiredFields.filter((f) => !data[f]);
        if (missing.length > 0) {
          console.warn(
            `[vite-plugin-posts] Skipping "${file}" — missing required fields: ${missing.join(', ')}`
          );
          continue;
        }

        // Convert markdown to HTML
        marked.setOptions({ gfm: true });
        const rawHtml = /** @type {string} */ (marked.parse(content));

        // Sanitize — allow common HTML tags produced by Markdown
        const contentHtml = sanitizeHtml(rawHtml, {
          allowedTags: sanitizeHtml.defaults.allowedTags.concat([
            'img', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
          ]),
          allowedAttributes: {
            ...sanitizeHtml.defaults.allowedAttributes,
            img: ['src', 'alt', 'title', 'width', 'height'],
            a: ['href', 'name', 'target', 'rel'],
            code: ['class'],
            pre: ['class'],
          },
        });

        parsedPosts.push({
          id: slug,
          slug,
          title: String(data.title),
          date: String(data.date),
          category: String(data.category),
          tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
          excerpt: data.excerpt ? String(data.excerpt) : '',
          author: data.author ? String(data.author) : '작성자',
          readTime: data.readTime ? String(data.readTime) : '5분',
          image: data.image ? String(data.image) : null,
          contentHtml,
        });
      }

      // Sort by date descending (newest first)
      parsedPosts.sort((a, b) => b.date.localeCompare(a.date));

      posts = parsedPosts;

      const outputPath = join(generatedDir, 'posts.json');
      writeFileSync(outputPath, JSON.stringify(posts, null, 2), 'utf-8');
      console.log(`[vite-plugin-posts] Generated ${posts.length} posts → ${outputPath}`);

      // Expose siteUrl for writeBundle
      this._siteUrl = siteUrl;
    },

    writeBundle(outputOptions) {
      const outDir = outputOptions.dir ?? join(root, 'dist');
      const siteUrl = this._siteUrl ?? 'https://queen1052.github.io';

      generateSitemap(posts, outDir, siteUrl);
      generateFeed(posts, outDir, siteUrl);
    },
  };
}

/**
 * @param {Array} posts
 * @param {string} outDir
 * @param {string} siteUrl
 */
function generateSitemap(posts, outDir, siteUrl) {
  const urls = [
    `  <url><loc>${siteUrl}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>`,
    ...posts.map(
      (p) =>
        `  <url><loc>${siteUrl}/post/${p.slug}</loc><lastmod>${p.date}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>`
    ),
  ].join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  writeFileSync(join(outDir, 'sitemap.xml'), xml, 'utf-8');
  console.log(`[vite-plugin-posts] sitemap.xml written`);
}

/**
 * @param {Array} posts
 * @param {string} outDir
 * @param {string} siteUrl
 */
function generateFeed(posts, outDir, siteUrl) {
  const escapeXml = (str) =>
    String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');

  const items = posts
    .slice(0, 20)
    .map(
      (p) => `  <item>
    <title>${escapeXml(p.title)}</title>
    <link>${siteUrl}/post/${p.slug}</link>
    <guid isPermaLink="true">${siteUrl}/post/${p.slug}</guid>
    <pubDate>${new Date(p.date).toUTCString()}</pubDate>
    <description>${escapeXml(p.excerpt)}</description>
    <category>${escapeXml(p.category)}</category>
  </item>`
    )
    .join('\n');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>queen1052 블로그</title>
    <link>${siteUrl}</link>
    <description>개발 이야기와 기술 트렌드</description>
    <language>ko</language>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  writeFileSync(join(outDir, 'feed.xml'), rss, 'utf-8');
  console.log(`[vite-plugin-posts] feed.xml written`);
}
