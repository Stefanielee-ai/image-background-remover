import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Free Image Background Remover — Remove BG Online',
  description:
    'Remove image background online for free. Upload JPG, PNG or WebP and get a transparent PNG in seconds. No sign-up required.',
  keywords: 'image background remover, remove background, transparent png, remove bg online',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">{children}</body>
    </html>
  )
}
