import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/Providers';
import { Navbar } from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'PetroGas Protocol',
  description: 'Earn refunds on your Ethereum gas fees, indexed to global oil prices. The gas digital cotiza como gas real.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <footer className="border-t-4 border-brown-900 bg-brown-900 text-cream-100 py-8 mt-12">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <h3 className="font-bold text-lg mb-3 uppercase">PetroGas Protocol</h3>
                    <p className="text-sm text-cream-300 leading-relaxed">
                      Digital gas is priced like real gas. Refunds indexed to the price of oil.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-3 uppercase">Links</h3>
                    <ul className="space-y-2 text-sm">
                      <li><a href="/docs" className="text-cream-300 hover:text-rust-500 transition-colors">Documentation</a></li>
                      <li><a href="/whitepaper" className="text-cream-300 hover:text-rust-500 transition-colors">Whitepaper</a></li>
                      <li><a href="https://github.com" className="text-cream-300 hover:text-rust-500 transition-colors">GitHub</a></li>
                      <li><a href="https://twitter.com" className="text-cream-300 hover:text-rust-500 transition-colors">Twitter</a></li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-3 uppercase">Contract</h3>
                    <p className="text-xs text-cream-300 font-mono break-all">
                      TBA
                    </p>
                    <div className="mt-4">
                      <span className="badge-pixel bg-forest-500 text-cream-50">
                        Audited ✓
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t-2 border-cream-700 text-center text-xs text-cream-400">
                  © 2026 PetroGas Protocol. All rights reserved.
                </div>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
