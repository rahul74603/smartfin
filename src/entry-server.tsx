/**
 * Server entry used only by scripts/prerender.mjs at build time.
 * It is never shipped to the browser.
 */
import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import App from './App';
import { seoByRoute } from './seo/config';
import { blogPosts } from './data/blogData';

export function render(url: string): string {
  return renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>
  );
}

/**
 * Expose the SEO tables to the prerenderer so route copy lives in exactly one
 * place (src/seo/config.ts) rather than being duplicated in a build script.
 */
export function getSeoTables() {
  return {
    routeSeo: seoByRoute,
    blogSeo: blogPosts.map((p) => ({
      id: p.id,
      title: p.title,
      seoTitle: p.seoTitle,
      description: p.description,
      category: p.category,
      readTime: p.readTime,
      publishDate: p.publishDate,
      author: p.author,
      authorTitle: p.authorTitle,
      seoKeywords: p.seoKeywords,
      faqs: p.faqs,
    })),
  };
}
