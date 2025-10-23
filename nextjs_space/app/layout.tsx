import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  title: "FinOps Dashboard - Cloud Cost Optimization",
  description: "Professional cloud cost optimization and analysis platform for AWS, Azure, and GCP. Identify savings opportunities, monitor spending trends, and optimize your multi-cloud infrastructure.",
  keywords: ["finops", "cloud costs", "cost optimization", "aws", "azure", "gcp", "savings", "cloud analytics"],
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg"
  },
  openGraph: {
    title: "FinOps Dashboard - Cloud Cost Optimization",
    description: "Professional cloud cost optimization platform for AWS, Azure, and GCP",
    url: "/",
    siteName: "FinOps Dashboard",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "FinOps Dashboard - Cloud Cost Optimization Platform"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "FinOps Dashboard - Cloud Cost Optimization",
    description: "Professional cloud cost optimization platform for AWS, Azure, and GCP",
    images: ["/og-image.png"]
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}