import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'ZCobans - Soluções em Cobrança e Recuperação de Créditos',
    template: '%s | ZCobans',
  },
  description:
    'Gestão completa para sua empresa de cobranças. Eficiência, transparência e resultados comprovados na recuperação de créditos.',
  keywords: [
    'cobrança',
    'recuperação de créditos',
    'gestão de cobranças',
    'recuperação financeira',
    'zcobans',
  ],
  authors: [{ name: 'ZCobans' }],
  creator: 'ZCobans',
  publisher: 'ZCobans',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://zcobans.com.br'
  ),
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'ZCobans',
    title: 'ZCobans - Soluções em Cobrança e Recuperação de Créditos',
    description:
      'Gestão completa para sua empresa de cobranças. Eficiência, transparência e resultados comprovados.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1e40af',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full dark`}
    >
      <body className="min-h-full flex flex-col antialiased bg-[#0a0f1a] text-slate-200">{children}</body>
    </html>
  )
}
