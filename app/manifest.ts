import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Ekstraktor tekstu z wideo',
    short_name: 'WideoTekst',
    description: 'Aplikacja do wyciągania tekstu z klatek wideo za pomocą OCR',
    start_url: '/',
    display_override: ["fullscreen", "minimal-ui"],
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0070f3',
    icons: [
      {
        src: '/images/video_192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable', // Pozwala systemowi dopasować kształt ikony
      },
      {
        src: '/images/video_192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/images/video_512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
