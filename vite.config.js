import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// WICHTIG: Wenn dein GitHub-Repo z.B. "kochapp" heißt und du mit GitHub Pages
// unter https://<dein-username>.github.io/kochapp/ deployst, muss base
// exakt "/kochapp/" sein. Bei einer eigenen Domain kannst du base auf "/" lassen.
export default defineConfig({
  base: '/Topfkino/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Topfkino',
        short_name: 'Topfkino',
        description: 'Deine Rezeptsammlung',
        theme_color: '#141414',
        background_color: '#141414',
        display: 'standalone',
        start_url: '/Topfkino/',
        scope: '/Topfkino/',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      }
    })
  ]
})
