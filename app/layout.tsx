import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Navbar } from '@/components/layout/Navbar'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ArcAgentRegistry | Onchain AI Agent Registry',
  description: 'Trustless AI Agent Registry on Arc Testnet (ERC-8004)',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col font-sans antialiased`}>
        <Providers>
          <div className="relative flex flex-col min-h-screen cyber-grid bg-background animate-in fade-in transition-all">
            <Navbar />
            <main className="flex-1 container mx-auto px-4 py-8">
              {children}
            </main>
            <footer className="w-full py-12 px-4 border-t border-border bg-card/40 backdrop-blur-sm">
              <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                <div className="flex flex-col gap-2">
                  <span className="font-bold text-lg tracking-tight">
                    Arc<span className="text-primary tracking-widest uppercase">Agent</span> Registry
                  </span>
                  <p className="text-sm text-muted-foreground">
                    Empowering the decentralized AI ecosystem on Arc Network.
                  </p>
                </div>
                <div className="flex flex-col md:items-center gap-2">
                  <h3 className="font-semibold text-sm uppercase text-primary">Resources</h3>
                  <div className="flex flex-col md:items-center gap-1 text-sm text-muted-foreground">
                    <a href="https://docs.arc.network" target="_blank" className="hover:text-foreground">Documentation</a>
                    <a href="https://eips.ethereum.org/EIPS/eip-8004" target="_blank" className="hover:text-foreground">ERC-8004 Spec</a>
                  </div>
                </div>
                <div className="flex flex-col md:items-end gap-2 text-sm text-muted-foreground">
                    <span>© 2024 ArcAgent Registry. All rights reserved.</span>
                    <span>Built for Arc Network</span>
                </div>
              </div>
            </footer>
          </div>
          <Toaster position="bottom-right" richColors />
        </Providers>
      </body>
    </html>
  )
}
