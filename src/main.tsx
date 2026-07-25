import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'

// ── Root Element Safety Check ──────────────────────────────────────────────
const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error(
    '[SmartFintool] Root element #root not found in index.html. ' +
    'Make sure <div id="root"></div> exists in your HTML file.'
  )
}

const tree = (
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)

/**
 * Hydrate when the page was prerendered, mount normally otherwise.
 *
 * scripts/prerender.mjs bakes real HTML into every route at build time and
 * marks it with data-prerendered. Calling createRoot on that markup would throw
 * it away and re-render from scratch, wasting the LCP head start. hydrateRoot
 * reuses it instead.
 */
if (rootElement.dataset.prerendered === 'true') {
  ReactDOM.hydrateRoot(rootElement, tree)
} else {
  ReactDOM.createRoot(rootElement).render(tree)
}
