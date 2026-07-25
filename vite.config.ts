import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  /**
   * IMPORTANT (SEO): must be '/' and NOT './'.
   *
   * With a relative base, a deep route like /blog/sip-vs-lumpsum resolves its
   * script tag to /blog/assets/index-xxx.js which 404s. Googlebot then renders
   * a blank page and the URL is dropped from the index. Absolute base fixes it.
   */
  base: '/',

  plugins: [
    // Dev-only inspector. Shipping it in production adds junk data-* attributes
    // to every DOM node and inflates the HTML Googlebot has to parse.
    ...(command === 'serve' ? [inspectAttr()] : []),
    react(),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  build: {
    target: 'es2020',
    cssCodeSplit: true,
    sourcemap: false,
    chunkSizeWarningLimit: 900,
    // Drop console/debugger in production for a smaller, faster bundle.
    minify: 'esbuild',
    rollupOptions: {
      output: {
        /**
         * Manual chunking keeps the initial payload small.
         * Core Web Vitals (LCP/INP) are a Google ranking signal, and a single
         * 1.7 MB bundle was pushing LCP well past the 2.5s "good" threshold.
         */
        manualChunks(id) {
          if (!id.includes('node_modules')) return

          if (id.includes('react-dom') || id.includes('/react/') || id.includes('scheduler')) {
            return 'react-vendor'
          }
          if (id.includes('react-router')) return 'router'
          if (id.includes('chart.js') || id.includes('react-chartjs-2')) return 'charts'
          if (id.includes('recharts') || id.includes('d3-')) return 'recharts'
          /**
           * The PDF stack (jspdf, html2canvas, canvg, dompurify …) must fall
           * through WITHOUT being assigned a name.
           *
           * Returning a name puts it in the static graph and Vite emits a
           * modulepreload for ~550 kB on every page. But letting it reach the
           * `return 'vendor'` catch-all at the bottom is just as bad, because
           * vendor IS preloaded. Returning undefined here leaves it in the
           * async chunk that the import() in lib/pdf.ts creates, so it is
           * fetched only when someone clicks "Download as PDF".
           */
          if (
            id.includes('jspdf') || id.includes('html2canvas') ||
            id.includes('dompurify') || id.includes('canvg') ||
            id.includes('rgbcolor') || id.includes('stackblur') ||
            id.includes('fflate') || id.includes('/raf/')
          ) {
            return undefined
          }
          if (id.includes('firebase') || id.includes('@firebase')) return 'firebase'
          if (id.includes('@radix-ui')) return 'radix'
          if (id.includes('lucide-react')) return 'icons'
          return 'vendor'
        },
      },
    },
  },

  esbuild: {
    drop: command === 'build' ? ['console', 'debugger'] : [],
  },
}))
